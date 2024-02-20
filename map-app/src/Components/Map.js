import { Stage, Layer, Circle, Rect, Group} from "react-konva" 
import mapStyles from "../StyleSheets/Map.module.css"

import React, {useEffect, useState, useRef} from 'react';
import EditorBar from "./EditorBar";

function Canvas(props){
    const [appDimensions, setAppDimensions] = useState({ width: window.innerWidth, height: window.innerHeight});
    const [scale, setScale] = useState(250000);

    const verticalRangeScale = 10;
    const [verticalRange, setVerticalRange] = useState(50*verticalRangeScale);
    

    const mouseDown = useRef(false);    
    const mouseMoved = useRef(false);

    const [mouseData, setMouseData] = useState({xStart: 0, yStart: 0, xEnd: 0, yEnd: 0});
    const [currentCoordinates, setCurrentCoordinates] = useState({latitude: 0, longitude: 0, altitude: 0, direction: 0});
    const [editing, setEditing] = useState(false);

    const stage = useRef();
    const slider = useRef();
    const zoomMultiplier = 10;
    const keysPressed = useRef([]);
    const mode = useRef("move");
    const selectedPoints = useRef(new Map());
    
    useEffect(
        ()=>{
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);

            return (
                ()=>{
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
                }
            );
        }
        
    , []);
    


    useEffect(
        
        () => {
            function handleResize(){
                setAppDimensions(props.resizeHandler());
            }
            window.addEventListener('resize', handleResize);
            
            setCurrentCoordinates(props.currentCoordinates);

            return (
                ()=>{
                    window.removeEventListener('resize', handleResize);
                }
            );
        }
      , [props]); //FIX LATER -
    
        

      function zoom(e){
        console.log(scale);
        if(e.deltaY > 0){ //Zoom out, reduce scale factor
            setScale(prev => {return Math.max(1, prev-(e.deltaY*zoomMultiplier))});
        }else if(e.deltaY < 0){ //Zoom in, increase scale factor
            setScale(prev => {return Math.min(250000, prev-(e.deltaY*zoomMultiplier))});
        }
    }
    function handleKeyDown(e){
        if(keysPressed.current.indexOf(e.key) === -1){
            keysPressed.current.push(e.key);
        }
    }
    function handleKeyUp(e){
        const index = keysPressed.current.indexOf(e.key);
        if (index !== -1) { 
            keysPressed.current.splice(index, 1);
        }
    }

    function selectMode(){
        if(keysPressed.current.indexOf("Shift") !== -1){
            mode.current = 'select';
        }else{
            mode.current = 'move';
        }
    }
    function handleMouseDown(e){
        selectMode();

        mouseDown.current = true;
        const pos = stage.current.getPointerPosition();
        setMouseData({xStart: pos.x, yStart: pos.y, xEnd: pos.x, yEnd: pos.y});
        mouseMoved.current = false;

    }
    function dragScreen(e){
        if(mouseDown.current){
            e.evt.preventDefault();
            const pos = stage.current.getPointerPosition();

            setMouseData((prev)=>{return{xStart: prev["xStart"], yStart: prev["yStart"], xEnd: pos.x, yEnd: pos.y}});
        }
        mouseMoved.current = true;
    }
    function handleMouseUp(e){
        mouseDown.current=false;
        if(mode.current === "move"){
            setCurrentCoordinates({latitude: currentCoordinates["latitude"] + (mouseData["xStart"] - mouseData["xEnd"])/scale, longitude: currentCoordinates["longitude"] + (mouseData["yStart"] - mouseData["yEnd"])/scale, altitude: currentCoordinates["altitude"]})
        }else if(mode.current === "select"){

        }
        setMouseData({xStart: 0, yStart: 0, xEnd: 0, yEnd: 0});        
    }

    

    function handleClickOnPoint(point){
        if(!mouseMoved.current){
            selectedPoints.current.set(point.name, point);
            setEditing(true);
            
        }
    } 
    function handleOffClick(e){
        if(e.target.attrs["id"] === undefined || !e.target.attrs["id"].includes("point")){
            selectedPoints.current.clear();
            setEditing(false);
        }
    }

    //onTouchMove={dragScreen} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} 

    return (
        <div className={mapStyles.map}
        onWheel={zoom}
        onPointerOut={handleMouseUp}
        >
                <input onInput={()=>{setVerticalRange(slider.current.value*verticalRangeScale)}} ref={slider} className={mapStyles.slider} type="range" min="0" max="100" id="myRange"/>
                <Stage ref={stage}
                width={appDimensions["width"]}
                height={appDimensions["height"]}
                className={mapStyles.canvas}

                onPointerMove={dragScreen} onPointerDown={handleMouseDown} onPointerUp={handleMouseUp}  
                onClick={handleOffClick}
                >
                <Layer>
                    
                    {props.points.map(
                        (point, i) => {
                            if(Math.abs(currentCoordinates["altitude"] - point.altitude) > verticalRange/2){
                                return null ;
                            }
                            

                            let cameraX = currentCoordinates["latitude"];
                            let cameryY = currentCoordinates["longitude"];
                            if(mode.current === "move"){
                                cameraX += (mouseData["xStart"] - mouseData["xEnd"])/scale;
                                cameryY += (mouseData["yStart"] - mouseData["yEnd"])/scale;
                            }
                            let xPos = appDimensions["width"]/2 + (point.latitude-cameraX)*scale;
                            let yPos = appDimensions["height"]/2 + (point.longitude-cameryY)*scale;

                            return (
                            <Group key={i}>
                                {selectedPoints.current.has(point.name) ? <Circle x={xPos} y={yPos} radius={9} fill="#FED34C"></Circle> : <Circle x={xPos} y={yPos} radius={9} fill="black"></Circle>}
                                
                                    
                                <Circle id={"point" + i} onClick={()=>{handleClickOnPoint(point)}} x={xPos} y={yPos} radius={6} fill="white"></Circle>
                                
                            </Group>
                            );
                        }
                    )}
                    {mode.current === "select" && <Rect
                        x={Math.min(mouseData["xStart"], mouseData["xEnd"])}
                        y={Math.min(mouseData["yStart"], mouseData["yEnd"])}
                        width={Math.abs(mouseData["xStart"] - mouseData["xEnd"])}
                        height={Math.abs(mouseData["yStart"] - mouseData["yEnd"])}
                        fill="blue"
                        opacity={0.1}
                    ></Rect>}
                </Layer>
                
            </Stage>
            {editing && <EditorBar selected={selectedPoints.current}></EditorBar>}

        </div>
    );
}

/*
<div className={mapStyles.zoom}>
    <button className={mapStyles.button}>➕</button>
    <button className={mapStyles.button}>➖</button>
</div>


<div className={mapStyles.mouseData}>
                <div>{mouseData["xStart"]}</div>
                <div>{mouseData["yStart"]}</div>
                <div>{mouseData["xEnd"]}</div>
                <div>{mouseData["yEnd"]}</div>
            </div>
*/

export default Canvas;
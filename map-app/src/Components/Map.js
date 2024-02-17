import { Stage, Layer, Circle, Line , Rect, Group} from "react-konva" 
import mapStyles from "../StyleSheets/Map.module.css"

import React, {useEffect, useState, useRef} from 'react';

function Canvas(props){
    const [appDimensions, setAppDimensions] = useState({ width: window.innerWidth, height: window.innerHeight});
    const [scale, setScale] = useState(250000);
    const mouseDown = useRef(false);
    const [mouseData, setMouseData] = useState({xStart: 0, yStart: 0, xEnd: 0, yEnd: 0});
    const [currentCoordinates, setCurrentCoordinates] = useState();
    const stage = useRef();
    const zoomMultiplier = 10;
    const keysPressed = useRef([]);
    const mode = useRef("move");
    
    useEffect(
        
        () => {
            function handleResize(){
                setAppDimensions(props.resizeHandler());
            }
            window.addEventListener('resize', handleResize);
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
            


            setCurrentCoordinates(props.currentCoordinates);


        }
      , [props]);
    

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
    }
    function dragScreen(e){
        if(mouseDown.current){
            e.evt.preventDefault();
            const pos = stage.current.getPointerPosition();

            setMouseData((prev)=>{return{xStart: prev["xStart"], yStart: prev["yStart"], xEnd: pos.x, yEnd: pos.y}});
        }
    }
    function handleMouseUp(e){
        
        mouseDown.current=false;
        if(mode.current === "move"){
            setCurrentCoordinates({latitude: currentCoordinates["latitude"] + (mouseData["xStart"] - mouseData["xEnd"])/scale, longitude: currentCoordinates["longitude"] + (mouseData["yStart"] - mouseData["yEnd"])/scale})
        }
        setMouseData({xStart: 0, yStart: 0, xEnd: 0, yEnd: 0});
        
    }

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
    //mode.current==="select" ? ()=>{}: 
    return (
        <div className={mapStyles.map}
        onWheel={zoom}
        onMouseOut={handleMouseUp}
        

        >
                <Stage ref={stage}
                width={appDimensions["width"]}
                height={appDimensions["height"]}
                className={mapStyles.canvas}

                onMouseMove={dragScreen} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}  
                onTouchMove={dragScreen} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} 
                >
                <Layer>
                    
                    {props.points.map(
                        (point, i) => {
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
                                <Circle x={xPos} y={yPos} radius={9} fill="black"></Circle>
                                <Circle x={xPos} y={yPos} radius={6} fill="white" onClick={()=>{console.log("HELLO")}}></Circle>
                                
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
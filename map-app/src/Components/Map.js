import { Stage, Layer, Circle, Line , Group} from "react-konva" 
import mapStyles from "../StyleSheets/Map.module.css"

import React, {useEffect, useState, useRef} from 'react';

function Canvas(props){
    const [appDimensions, setAppDimensions] = useState({ width: window.innerWidth, height: window.innerHeight});
    const [scale, setScale] = useState(250000);
    const mouseDown = useRef(false);
    const [mouseData, setMouseData] = useState({xStart: 0, yStart: 0, xEnd: 0, yEnd: 0});
    const [currentCoordinates, setCurrentCoordinates] = useState();
    const stage = useRef();
    //0.
    //upload function (assigns unique names and updates relations) --clears file from form + 
    //Update position constantly, only add Points that aren't too close +

    //1.
    //Display all points +

    //2.
    //Zoom in and zoom out button / move camera 
    //Change elevation 

    //3.
    //Select, delete and label points
    //Add points at click location 

    //Extra
    //Import images, resize, and scale
    //Display images as well
    //Remove link from DOM    

    //Albert
    //Write a function that accepts a Point and places it in a bin
    //Write a function that takes a Point and checks if it's too close to other points
    //Write a function that computes neighbours
    //Pathfinding algorithmn
    
    //Backend
    //Remember search history
    //Request points for certain sections
    //STORE LOCALLY: schedules

    //App
    //Camera object
    //Search bar to look for Points (classify bathrooms, buildings)
    //Choose location by clicking on it
    //Add begin journey button
        //Draw path line
        //Orient based on direction faced
        //Instruction bar that updates at checkpoints
        //Recalculating if off track
                //Change floor being viewed


        //Refactor code
        //Faster name update algo?
    useEffect(
        
        () => {
            function handleResize(){
                setAppDimensions(props.resizeHandler());
            }
            window.addEventListener('resize', handleResize);
            setCurrentCoordinates(props.currentCoordinates);
        }
      , [props]);
    
    function handleMouseDown(e){
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
        setCurrentCoordinates({latitude: currentCoordinates["latitude"] + (mouseData["xStart"] - mouseData["xEnd"])/scale, longitude: currentCoordinates["longitude"] + (mouseData["yStart"] - mouseData["yEnd"])/scale})
        setMouseData({xStart: 0, yStart: 0, xEnd: 0, yEnd: 0});
        
    }
      
    return (
        <div className={mapStyles.map}
        >
            
            <Stage ref={stage}
                width={appDimensions["width"]}
                height={appDimensions["height"]}
                className={mapStyles.canvas}

                 onMouseMove={dragScreen} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}  onMouseOut={handleMouseUp}
        onTouchMove={dragScreen} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} 
                >
                <Layer>

                    {props.points.map(
                        (point, i) => {
                            let cameraX = currentCoordinates["latitude"] + (mouseData["xStart"] - mouseData["xEnd"])/scale;
                            let cameryY = currentCoordinates["longitude"] + (mouseData["yStart"] - mouseData["yEnd"])/scale;
                            let xPos = appDimensions["width"]/2 + (point.latitude-cameraX)*scale;
                            let yPos = appDimensions["height"]/2 + (point.longitude-cameryY)*scale;

                            return (
                            <Group key={i}>
                                <Circle x={xPos} y={yPos} radius={9} fill="black"></Circle>
                                <Circle x={xPos} y={yPos} radius={6} fill="white"></Circle>
                            </Group>
                            );
                        }
                    )}
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
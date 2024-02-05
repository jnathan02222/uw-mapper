import { Stage, Layer } from "react-konva" 
import mapStyles from "../StyleSheets/Map.module.css"
import React, {useEffect, useState} from 'react';

function Canvas(props){
    const [appDimensions, setAppDimensions] = useState({ width: window.innerWidth, height: window.innerHeight});
    //0.
    //Remove link from DOM
    //upload function (assigns unique names and updates relations)
    //built in distance check 
    //Update position constantly, only add Nodes that aren't too close
    
    //1.
    //Display all nodes
    //Orient based on direction faced

    //2.
    //Zoom in and zoom out button
    //Change floor being viewed

    //3.
    //Select, delete and label nodes
    //Add nodes at click location
    //Search bar to look for Nodes

    //Extra
    //Import images, resize, and scale
    //Display images as well

    //Albert
    //Write a function that takes a Node and checks if it's too close to other nodes
        //If not, the closest Nodes are marked as neighbours
    //Write a function that accepts a Node and places it in a bin
    //Store Nodes in a hashmap by name
    //Pathfinding algorithmn
    
    //Backend
    //Remember search history
    

    useEffect(
        
        () => {
            function handleResize(){
                setAppDimensions(props.resizeHandler());
            }
            window.addEventListener('resize', handleResize);
        }
      , [props]);
    

      
    return (
        <div>
            <Stage
                width={appDimensions["width"]}
                height={appDimensions["height"]}
                className={mapStyles.canvas}
                >
                <Layer>

                </Layer>
            </Stage>
        </div>
    );
}

export default Canvas;
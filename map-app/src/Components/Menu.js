import menuStyles from "../StyleSheets/Menu.module.css"
import React, {useState} from 'react';

function Menu(props){
    //On download, get nodes and size and rotation of images
    //Make sure you can upload images on their own
    const [isTracking, setIsTracking] = useState(false);

    //Potential bug: clicking to fast results in unupdated state?
    function toggleTracking(){
        if(isTracking){
            (props.eventHandlers["stopTrackingHandler"])();
        }else{
            (props.eventHandlers["startTrackingHandler"])();
        }
        setIsTracking(!isTracking);

    }
    
    return (
        <div className={menuStyles.container}>
            <button className={menuStyles.button} onClick={toggleTracking}>{isTracking ? "Stop Tracking" : "Start Tracking"}</button>
            <button className={menuStyles.button} onClick={props.eventHandlers["addMarkerHandler"]}>📌</button>
            <button className={menuStyles.button} onClick={props.eventHandlers["clearNodesHandler"]}>🗑️</button>
            <div className={menuStyles.button} onClick={props.eventHandlers["handleUpload"]}>Upload</div> 
            <button className={menuStyles.button} onClick={props.eventHandlers["handleDownload"]}>Download</button>
        </div>
    );
}
export default Menu;
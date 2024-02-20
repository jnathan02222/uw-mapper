import menuStyles from "../StyleSheets/Menu.module.css"
import React, {useState, useEffect, useRef} from 'react';

function Menu(props){
    //On download, get nodes and size and rotation of images
    //Make sure you can upload images on their own
    const [isTracking, setIsTracking] = useState(false);
    const fileUploadRef = useRef();

    //Potential bug: clicking to fast results in unupdated state?
    function toggleTracking(){
        if(isTracking){
            (props.eventHandlers["stopTrackingHandler"])();
        }else{
            (props.eventHandlers["startTrackingHandler"])();
        }
        setIsTracking(prev => !prev);

    }

    useEffect(
        () => {
            let fileRef = fileUploadRef.current;
            function onChange(){
                props.eventHandlers["uploadHandler"](fileUploadRef.current);
            }
            (fileRef).addEventListener('change', onChange);
            return ()=>{(fileRef).removeEventListener('change', onChange)};
        }
    ,[props.eventHandlers]);
    
    return (
            <div className={menuStyles.container}>
                <div className={menuStyles.bottomRow}>
                    <label className={menuStyles.button} onClick={toggleTracking}>{isTracking ? "Stop Tracking" : "Start Tracking"}</label>
                    <label className={menuStyles.button} onClick={props.eventHandlers["addMarkerHandler"]}>📌</label>
                    <label className={menuStyles.button} onClick={props.eventHandlers["clearPointsHandler"]}>🗑️</label>
                    <form className={menuStyles.form} ref={fileUploadRef}>
                        <label  className={menuStyles.fileLabel} htmlFor="myFile">Upload</label>
                        <input className={menuStyles.fileInput} type="file" id="myFile" name="filename"/>
                    </form>
                    <label className={menuStyles.button} onClick={props.eventHandlers["downloadHandler"]}>Download</label>
                    
                </div>
                
            </div>
    );
}
export default Menu;
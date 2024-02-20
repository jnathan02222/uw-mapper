import mapStyles from "../StyleSheets/Map.module.css"
import React, {useEffect, useState} from 'react';
function EditorBar(props){
    const [selected, setSelected] = useState([]);
    useEffect(
        ()=>{
            let arr = [];
            (props.selected).forEach(
                (value)=>{
                    arr.push(value);
                }
            );
            setSelected(arr);
        }
    ,[props]);
    return(
        <div className={mapStyles.editorBar}>
            <div>{selected.length === 1 ? "Coordinates: " + selected[0].latitude + ", " + selected[0].longitude: ""}</div>
            <div>{selected.length === 1 ? "Tags: " +  selected[0].tag : ""}</div>
            <form className={mapStyles.form}>
                <input className={mapStyles.changeTags} type="text" placeholder="Enter a tag..."></input>
            </form>
            <div className={mapStyles.tagEditor}>
                
                <div className={mapStyles.button}>ADD</div>
                <div className={mapStyles.button}>REMOVE</div>
            </div>
            <div className={mapStyles.button}>DELETE POINT</div>

        </div>
    );
}

export default EditorBar;
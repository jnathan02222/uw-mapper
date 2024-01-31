import appStyles from "../StyleSheets/App.module.css"
import Menu from "./Menu.js"
import Canvas from "./Map.js"
import React, {useEffect, useRef, useState} from "react";
import Node from "./Node.js"

  //Save nodes and image location in cookies?


function App() {
  const trackingFunction = useRef(null);
  const [nodes, setNodes] = useState([]);
  const nodeId = useRef(0);
  const form = useRef();


  useEffect(
    () => {
      return () => {if(trackingFunction.current != null){clearInterval(trackingFunction.current)}};
    }
  , []);

  function startTracking(){
    function successHandler(position){
      let newNode = new Node(position.coords.latitude, position.coords.longitude, position.coords.altitude, nodeId.current);
      nodeId.current += 1;
      setNodes(prev => [...prev, newNode]);
    }
    trackingFunction.current = setInterval(()=>{getLocation(successHandler)}, 1000);
  }

  function stopTracking(){
    clearInterval(trackingFunction.current);
  }

  function getLocation(successHandler){
    

    function error(){
      console.log("Failed to retrieve location");
    }
    if(!navigator.geolocation){
      console.log("Geolocation not supported by browser.")
    }else{
      navigator.geolocation.getCurrentPosition(successHandler, error, {enableHighAccuracy: true});
    }
  }

  function addMarker(){
    const name = prompt("Name this node:");
    if(name == null){
      return;
    }
    function successHandler(position){
      let newNode = new Node(position.coords.latitude, position.coords.longitude, position.coords.altitude, name);
      setNodes(prev => [...prev, newNode]);
    }
    getLocation(successHandler);

  }
  function clearNodes(){
    if(window.confirm("Delete nodes? This action is irreversible.")){
      setNodes([]);
    }
  }

  function upload(){
    //https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    
    //To do:
    //Remove link from DOM
    //upload function (assigns unique names and updates relations)
    //built in distance check 
  }

  function download(){
    let content = "data:text/csv;charset=utf-8,";
    for(var i = 0; i < nodes.length; i++){
      content += nodes[i].toString() + "\n";
    }
    let encoded = encodeURI(content);
    let link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", form.current["name"].value + ".csv");
    document.body.appendChild(link);
    link.click();

    //setTimeout(() => {link.remove()}, 1000); 
  }

  return (
    <div className={appStyles.app}>
        <form ref={form}>
          <input className={appStyles.titleBox} type="text" name="name" placeholder="Untitled Map"></input>
        </form>
        <Canvas nodes={nodes}></Canvas>
        <Menu eventHandlers={{startTrackingHandler: startTracking, stopTrackingHandler: stopTracking, addMarkerHandler: addMarker, clearNodesHandler: clearNodes, uploadHandler: upload, downloadHandler: download}} ></Menu>
    </div>
  );
}
/*
{
nodes.map(
  (node) => {
      return <div>{node.latitude}</div>
    }
  )
}
*/
export default App;

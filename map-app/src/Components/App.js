import appStyles from "../StyleSheets/App.module.css"
import Menu from "./Menu.js"
import Canvas from "./Map.js"
import React, {useEffect, useRef, useState} from "react";
import Node from "./Node.js"

  //Save nodes and image location in cookies?


function App() {
  const trackingFunction = useRef(null);
  const [nodes, setNodes] = useState([]);

  useEffect(
    () => {
      return () => {if(trackingFunction.current != null){clearInterval(trackingFunction.current)}};
    }
  , []);

  function startTracking(){
    function successHandler(position){
      let newNode = new Node(position.coords.latitude, position.coords.longitude, position.coords.altitude);

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

  }

  function download(){
    
  }

  return (
    <div className={appStyles.app}>
        <Menu eventHandlers={{startTrackingHandler: startTracking, stopTrackingHandler: stopTracking, addMarkerHandler: addMarker, clearNodesHandler: clearNodes, uploadHandler: upload, downloadHandler: download}} ></Menu>
        <Canvas nodes={nodes}></Canvas>
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

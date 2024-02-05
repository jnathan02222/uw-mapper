import appStyles from "../StyleSheets/App.module.css"
import Menu from "./Menu.js"
import Canvas from "./Map.js"
import React, {useEffect, useRef, useState} from "react";
import Node from "./Node.js"

  //Save nodes and image location in cookies?


function App() {
  const trackingFunction = useRef(null);
  const [nodes, setNodes] = useState([]);
  const form = useRef();
  const app = useRef();
  const nodeMap = useRef(new Map());


  function updateCanvas(){
    const appWidth = parseInt(( window.getComputedStyle(app.current).getPropertyValue("width") ).replace("px", ""));
    const appHeight = parseInt(( window.getComputedStyle(app.current).getPropertyValue("height") ).replace("px", ""));

    return { width: appWidth, height: appHeight}; 
  }

  useEffect(
    () => {
      return () => {if(trackingFunction.current != null){clearInterval(trackingFunction.current)}};
    }
  , []);

  

  function startTracking(){
    function successHandler(position){
      let name = generateBase64();
      while(nodeMap.current.has(name)){
        name = generateBase64();
      }
      let newNode = new Node(position.coords.latitude, position.coords.longitude, position.coords.altitude, name);
      setNodes(prev => [...prev, newNode]);
      nodeMap.current.set(name, newNode);
      
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
    let name = prompt("Name this node:");
    
    while(true){
      if(name == null || !nodeMap.current.has(name)){ //Break if cancel or name is unique
        break;
      }
      name = prompt("That name has been taken, try again.");
    }
    if(name == null){
      return;
    }

    function successHandler(position){
      let newNode = new Node(position.coords.latitude, position.coords.longitude, position.coords.altitude, name);
      setNodes(prev => [...prev, newNode]);
      nodeMap.current.set(name, newNode);
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
    
    
  }

  function generateBase64(){
    var string = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    for (var i = 0; i < 64; i++) {
      string += possible.charAt(Math.floor(Math.random() * 64));
    }
    return string;
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
    <div className={appStyles.app} ref={app}>
        <div className={appStyles.container}>
          <form className={appStyles.form} ref={form}>
            <input className={appStyles.titleBox} type="text" name="name" placeholder="Untitled Map"></input>
            <input className={appStyles.search} type="text" placeholder="Starting location"></input>
            <input className={appStyles.search} type="text" placeholder="Destination"></input>
          </form>
          <Canvas resizeHandler={updateCanvas} nodes={nodes}></Canvas>
          <Menu eventHandlers={{startTrackingHandler: startTracking, stopTrackingHandler: stopTracking, addMarkerHandler: addMarker, clearNodesHandler: clearNodes, uploadHandler: upload, downloadHandler: download}} ></Menu>
        </div>
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

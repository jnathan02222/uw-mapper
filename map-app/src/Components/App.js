import appStyles from "../StyleSheets/App.module.css"
import Menu from "./Menu.js"
import Canvas from "./Map.js"
import React, {useEffect, useRef, useState} from "react";
import Point from "./Point.js"

  //Save points and image location in cookies?


function App() {
  const trackingFunction = useRef(null);
  const [points, setPoints] = useState([]);
  const [currentCoordinates, setCurrentCoordinates] = useState({latitude: 0, longitude: 0, altitude: 0, direction: 0});

  const form = useRef();
  const app = useRef();
  const pointMap = useRef(new Map());

  function updateCanvas(){
    const appWidth = parseInt(( window.getComputedStyle(app.current).getPropertyValue("width") ).replace("px", ""));
    const appHeight = parseInt(( window.getComputedStyle(app.current).getPropertyValue("height") ).replace("px", ""));

    return { width: appWidth, height: appHeight}; 
  }

  useEffect(
    () => {
      function successHandler(position){
        updatePosition(position);
      }
      getLocation(successHandler);
      //getCookies();
      return () => {if(trackingFunction.current != null){clearInterval(trackingFunction.current)}};
    }
  , []);

  




  function startTracking(){
    function successHandler(position){
      let name = generateBase64(64);
      while(pointMap.current.has(name)){
        name = generateBase64(64);
      }
      let newPoint = new Point(position.coords.latitude, position.coords.longitude, position.coords.altitude, name);
      if(!tooClose(newPoint)){
        setPoints(prev => [...prev, newPoint]);
        pointMap.current.set(name, newPoint);
      }
      updatePosition(position);
    }
    trackingFunction.current = setInterval(()=>{getLocation(successHandler)}, 100);
    
  }

  function updatePosition(position){
    let altitude = position.coords.altitude;
    if(altitude === null){
      altitude = 0;
    }
    setCurrentCoordinates({latitude: position.coords.latitude, longitude: position.coords.longitude, altitude: altitude});

  }

  function tooClose(point){
    return false;
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
    let tag = prompt("Name this point:");
    
    if(tag == null){
      return;
    }

    function successHandler(position){
      let name = generateBase64(64);
      while(pointMap.current.has(name)){
        name = generateBase64(64);
      }
      let newPoint = new Point(position.coords.latitude, position.coords.longitude, position.coords.altitude, name);
      newPoint.addTag(tag);
      setPoints(prev => [...prev, newPoint]);
      pointMap.current.set(name, newPoint);
    }
    getLocation(successHandler);

  }
  function clearPoints(){
    if(window.confirm("Delete points? This action is irreversible.")){
      pointMap.current.clear();
      setPoints([]);
    }
  }

  function loadPoints(text, recomputeNeighbours){
      let lines = text.split("\n");

      let newPoints = [];
      let newNameMap = new Map();

      lines.forEach(
        (line) => {
          
            
          let info = line.split(",");
          if(!Point.isValid(info)){
            return;
          }

          let name = info[0];
          while(pointMap.current.has(name)){
            name = generateBase64(64);
          }
          if(name !== info[0]){
            newNameMap.set(info[0], name);
          }
          let newPoint = new Point(info[1], info[2], info[3], name);
      
          newPoint.setNeighbours(info[4].split[" "]);
          
          newPoints.push(newPoint);

          pointMap.current.set(name, newPoint);
        }
      );
      //Perform a second pass to update names
      //Pretty inefficient, fix later?
      if(recomputeNeighbours){
        newPoints.forEach(
          (point) => {
            for(let i = 0; i < point.neighbours.length; i++){
              let name = newNameMap.has(point.neighbours[i]);
              if(newNameMap.has(name)){
                point.neighbours[i] = newNameMap.get(name);
              }
            }
          }
        );
      }
      //Finally, compute new neighbours for combined list

      setPoints(prev => prev.concat(newPoints));
  }


  /*
  useEffect(
    ()=>{
      setCookies(pointsToCsv(), 365);
    }
  ,[points]);

  
  function getCookies(){
    let decodedCookie = decodeURIComponent(document.cookie).replace("points=", "").replaceAll("!", ",").replaceAll("@", " ").replaceAll("#", "\n");
    console.log(document.cookie);
    loadPoints(decodedCookie, false);
  }
  function setCookies(pointsAsCsv, exdays){
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires="+d.toUTCString();

    let points = pointsAsCsv.replaceAll(",", "!").replaceAll(" ", "@").replaceAll("\n", "#");
    document.cookie = "points=\"" + points + "\";" + expires + ";path=/";
    console.log(document.cookie);
  }*/

  
  function upload(fileInputRef){
    let file = (fileInputRef["filename"].files)[0];
    let fileReader = new FileReader();

    function onReaderLoad(){
      loadPoints(fileReader.result, true);
    }

    fileReader.onloadend  = onReaderLoad; //When finished reading parse result into points
    fileReader.readAsText(file); //Read

    //clears file from form
    fileInputRef.reset();
  }

  function generateBase64(length){
    var string = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    for (var i = 0; i < length; i++) {
      string += possible.charAt(Math.floor(Math.random() * 64));
    }
    return string;
  }
  
  function pointsToCsv(){
    let result = "";
    for(var i = 0; i < points.length; i++){
      result += points[i].toString() + "\n";
    }
    return result;
  }

  function download(){
    let content = "data:text/csv;charset=utf-8," + pointsToCsv();
    let encoded = encodeURI(content);
    let link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", form.current["name"].value + ".csv");
    document.body.appendChild(link);
    link.click();

    //setTimeout(() => {link.remove()}, 1000); 
  }



  return (
    <div>
    <div className={appStyles.app} ref={app}>
        <div className={appStyles.container}>
          <form className={appStyles.form} ref={form}>
            <input className={appStyles.titleBox} type="text" name="name" placeholder="Untitled Map"></input>
            <input className={appStyles.search} type="text" placeholder="Search..."></input>
          </form>
          <div>{!navigator.geolocation && "Your browser does not support Geolocation."}</div>
          <Canvas resizeHandler={updateCanvas} points={points} currentCoordinates={currentCoordinates}></Canvas>
          <Menu eventHandlers={{startTrackingHandler: startTracking, stopTrackingHandler: stopTracking, addMarkerHandler: addMarker, clearPointsHandler: clearPoints, uploadHandler: upload, downloadHandler: download}} ></Menu>
        </div>
    </div>
    
  </div>
  );
}
/*
<div>
        {
          points.map(
            (point) => {
                return <div>{point.toString()}</div>
              }
            )
        }
    </div>
    </div>

<input className={appStyles.search} type="text" placeholder="Starting location"></input>
<input className={appStyles.search} type="text" placeholder="Destination"></input>
            
{
points.map(
  (point) => {
      return <div>{point.latitude}</div>
    }
  )
}
*/
export default App;

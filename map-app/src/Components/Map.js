import { Stage, Layer } from "react-konva" 
class Bin{
    constructor(latitude, longitude, altitude, nodes, position){
        
    }
}
class Posn{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
const binSize = 100000;
var binArray = [[]];

function stringToPoint(strKey){
    var y_time = false;
    var x= 0;
    var y = 0;
    for(var i = 0; i < strKey.length; i++){
        if(strKey.charAt(i) != " " && y_time === false){
            x += strKey.charAt(i);
        }
        else if(strKey.charAt(i) === " "){
            y_time = true;
        }
        else if(y_time && strKey.charAt(i) != " "){
            y += strKey.charAt(i);
        }
    }
    return new Posn(parseInt(x), parseInt(y));
}

function pointToString(point){
    return `${point.x} ${point.y}`;
}

function Canvas(props){
    function nodeToBin(node){

    }
    //Display all nodes (and connections?)
    //Orient based on direction faced
    //Zoom in and zoom out button
    //Import images, resize, and scale
    //Display images as well
    //Change floor being viewed
    //Select, delete and label nodes
    //Add nodes

    // take a node, put it in a 'bin' (object)

    return (
        <div>
            <Stage>
                <Layer>

                </Layer>
            </Stage>
        </div>
    );
}


export default Canvas;
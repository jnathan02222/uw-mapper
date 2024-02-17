class Point {
    constructor(latitude, longitude, altitude, name=""){
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.name = name;
        this.neighbours = [];
        this.tag = "";
    }

    toString(){
        let string = this.name + "," + this.latitude + "," + this.longitude + "," + this.altitude + ",";
        for(let i = 0; i < this.neighbours.length; i++){
            string += this.neighbours[i].name + " ";
        }
        string += "," + this.tag;
        return string;
    }

    setNeighbours(newNeighbours){
        if(newNeighbours === undefined){
            return;
        }
        this.neighbours = newNeighbours;
    }

    addTag(newTag){
        this.tag += newTag + " ";
    }

    static isValid(info){
        if(info.length !== 6){
            return false;
        }
        return !isNaN(info[1]) && !isNaN(info[2]); //ignore altitude for now !isNaN(info[3])
    }
}
// have a hashmap that contains bins
// have bins go recursively?
// start with one layer of bins for now

// this will be an integer
var binSize;
function binMap(listOfPoints){
    var maxLat = -1234567890;
    var minLat = 1234567890;
    var maxLong = -1234567890;
    var minLong = 1234567890;
    for(var i = 0; i < listOfPoints.len(); i++){
        if(listOfPoints[i].latitude > maxLat){
            maxLat = listOfPoints[i].latitude
        }
        else if(listOfPoints[i].latitude < minLat){
            minLat = listOfPoints[i].latitude
        }
        else if(listOfPoint[i].longitude > maxLong){

        }
        else if(listOfPoint[i].longitude > maxLong){

        }
    }
}

export default Point;
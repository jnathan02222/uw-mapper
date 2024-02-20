class Point {
    constructor(latitude, longitude, altitude, name=""){
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        if(this.altitude === null){
            this.altitude = 0;
        }
        if(this.latitude === null){
            this.latitude = 0;
        }
        if(this.longitude === null){
            this.longitude = 0;
        }
        this.name = name;
        this.neighbours = [];
        this.tag = "";
        this.bin = [];
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
var binSize = 1; //just a placeholder value. binSize will mean soemthing I haven't decided what yet

function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}

// maps all of the points into a hashmap!
function binMap(listOfPoints){
    var maxLat = -12345678901234567890;
    var minLat = 12345678901234567890;
    var maxLong = -12345678901234567890;
    var minLong = 12345678901234567890;
// find borders of our points and stuff
    for(var i = 0; i < listOfPoints.len(); i++){
        if(listOfPoints[i].latitude > maxLat){
            maxLat = listOfPoints[i].latitude; 
        }
        else if(listOfPoints[i].latitude < minLat){
            minLat = listOfPoints[i].latitude;
        }
        else if(listOfPoint[i].longitude > maxLong){
            maxLong = listOfPoints[i].longitude;
        }
        else if(listOfPoint[i].longitude > maxLong){
            minLong = listOfPoints[i].longitude;
        }
    }
// map length being the length of the map idk don't question me please it's disrespectful
    var mapLength = min((maxLong - minLong), (maxLat - minLat));
// now we will sort this stuff into bins and what not.
    let hashMap = new Map();
    for(var i = 0; i < listOfPoints.len(); i++){
        var x = floor(binSize*(listOfPoints[i].latitude - minLat)/mapLength); // what would pos coordinates be for the bin
        var y = floor(binSize*(listOfPoints[i].latitude - minLong)/mapLength);; // 
        if(hashMap.has([x,y])){
            let nodesInBin = hashMap.get([x,y]);
            nodesInBin.push(listOfPoints[i]);
            hashMap.set([x,y], nodesInBin);
        }
        else{
            hashMap.set([x,y], [listOfPoints[i]]);
        }
        listOfPoints[i].bin = [x,y];
    }
    return hashMap;
}
// we have a point and some hashmaps
// requires the search radius be an odd number!

function neighbourHood(point, hashMap, radius){
    searchRadius = 3
    for(let i = point.bin[0] - floor(searchRadius/2); i <  point.bin[0] + floor(searchRadius/2); i++){
        for(let z = point.bin[1] - floor(searchRadius/2); z <  point.bin[1] + floor(searchRadius/2); z++){
            let currentBlock = hashMap.get([i,z]);
            for(y = 0; y < currentBlock.length(); y++){
                secondPoint = hashMap[y];
                let distance = measure(point.latitude, point.longitude, secondPoint.latitude, secondPoint.longitude);
                if(distance < radius){
                    point.neighbours.push(secondPoint);
                }
            }
        }
    }
}
function aStandsforAlbert(){
    
}

export default Point;
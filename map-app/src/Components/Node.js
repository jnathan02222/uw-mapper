class Node {
    constructor(latitude, longitude, altitude, name=""){
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.name = name;
        this.neighbours = [];
        
    }

    toString(){
        let string = this.name + "," + this.latitude + "," + this.longitude + "," + this.altitude + ",";
        for(let i = 0; i < this.neighbours.length; i++){
            string += this.neighbours[i].name + ",";
        }
        return string;
    }
}


export default Node;
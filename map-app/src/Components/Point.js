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


export default Point;
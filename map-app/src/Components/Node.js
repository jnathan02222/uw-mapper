class Node {
    constructor(latitude, longitude, altitude, name=""){
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.name = name;
        this.neighbours = [ ];
    }
}

export default Node;
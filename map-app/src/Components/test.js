var y = 3;
class Posn{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
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
peepee = new Posn(123, 3572);
console.log(pointToString(peepee));
console.log(typeof pointToString(peepee));
butt = stringToPoint("123512 832");
console.log(butt.x);
console.log(butt.y);
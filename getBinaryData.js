
var c=document.createElement('canvas');
var ctx=c.getContext("2d");
ctx.fillStyle="green";
ctx.fillRect(10,10,50,50);

var imgData=ctx.getImageData(10,10,50,50);
console.log(c.toDataURL("image/png"))


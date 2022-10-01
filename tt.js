var my=[];
for(var i=1023;i<=65535;i++){
my[i]=i;
//console.log(my[i])
}
var rand = Math.floor(Math.random()*my.length);
var rValue = my[rand];
console.log(rValue)
//----This is the lamp with correct location------//
//----DaRenBuilding.3rdFloor.301Room.ceiling------//

const server = require('fastify')();
let mdns = require('multicast-dns')()
var txt = require('dns-txt')()//txt封包解碼用

var Qlobber = require('qlobber').Qlobber;
var matcher =new Qlobber();


var InstanceNum = getRandomInt(10000);//隨機產生數字
var my=[];
for(var i=1024;i<=60000;i++){
my[i]=i;
//console.log(my[i])
}
var rand = Math.floor(Math.random()*my.length);
var rValue = my[rand];
//var randport=(Math.floor(Math.random() * 65535  + 1) + 1024);
//console.log(randport)
var port = 5900;
var Instance = 'light'+InstanceNum;
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

let count=0; //切換電燈on\off用

let lamp = {
    status: 'off',
    toggle: function(){
         if(count%2===0)this.status='on';
         else{this.status='off';}
         count++;
    },
    //location:'DaRenBuilding.3rdFloor.301Room.ceiling'
  };


mdns.on('query', function(query){
    //---------PTR---------//
      // _light._udp.local //
      //console.log("on query")
      if(query.questions[0].name === '_light._udp.local' && query.questions[0].type === 'PTR'){
        console.log("got a PTR query")
        //console.log(query.additionals[0].data);
        //console.log((txt.decode(txt.encode(query.additionals[0]))).data);// 獲取 'DaYanBuilding/3rdFloor/#'
       

      // Qlobber匹配處
          
          mdns.respond({
              answers: [{
              name:'_light._udp.local',
              ttl: 10,
              type: 'PTR',
              data:Instance+'._light._udp.local'
              }]
                  });
                  
          };
      //---------SRV---------//  
      if(query.questions[0].name === (Instance+'._light._udp.local') && query.questions[0].type === 'SRV'){
        console.log(Instance+':got a SRV query');
        mdns.respond({
        answers: [{
          name:Instance+'._light._udp.local',
          ttl: 10,
          type: 'SRV',
          data: {
            port: port,
            target:Instance+'.local'
          }
        }]
      });
    };

    //---------A---------//
  if(query.questions[0].name === Instance+'.local' && query.questions[0].type === 'A'){
    console.log(Instance+':got a A query');
    mdns.respond({
      answers: [{
        name:Instance+'.local',
        ttl: 10,
        type: 'A',
        data: '127.0.0.1'
      }]
    });
  };

   

});

server.post('/hogRider', function (req, res) {
    lamp.toggle()
    console.log(lamp.status)
});

server.listen(InstanceNum, "127.0.0.1");
//mdns.listen(4000, "127.0.0.1");
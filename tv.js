//----This is the tv with correct location------//

const server = require('fastify')();
let mdns = require('multicast-dns')()
var txt = require('dns-txt')()//txt封包解碼用

var Qlobber = require('qlobber').Qlobber;
var matcher =new Qlobber();


var InstanceNum = getRandomInt(10000);//隨機產生數字
var port = 5000;
var Instance = 'tv'+InstanceNum;
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

let count=0; //切換電燈on\off用

let tv = {
    status: 'off',
    toggle: function(){
         if(count%2===0)this.status='on';
         else{this.status='off';}
         count++;
    },
    location:'DaYanBuilding.2rdFloor.202Room'
  };


mdns.on('query', function(query){
    //---------PTR---------//
      // _tv._udp.local //
      //console.log("on query")
      if(query.questions[0].name === '_tv._udp.local' && query.questions[0].type === 'PTR'){
        console.log("got a PTR query")
        //console.log(query.additionals[0].data);
        //console.log((txt.decode(txt.encode(query.additionals[0]))).data);// 獲取 'DaYanBuilding/2rdFloor/#'
        let sqe=(txt.decode(txt.encode(query.additionals[0]))).data;//sqe='DaYanBuilding/2rdFloor/#'
        let sre=tv.location
        console.log("搜尋地點:"+sqe);
        
        console.log("電視實際地點:"+sre);
        matcher.add(sqe);
        if(matcher.test(tv.location)===true){
          //console.log(Instance+':got a PTR query');
          mdns.respond({
              answers: [{
              name:'_tv._udp.local',
              ttl: 10,
              type: 'PTR',
              data:Instance+'._tv._udp.local'
              }],
              additionals:
                  [ { name: '_tv._udp.local',
                      type: 'TXT',
                      class: 'IN',
                      ttl: 120,
                      flush: true,
                      data: sre }
                  ]
                  });
             }
        else{
              console.log("qlobber match: False!")
          }           
          };
      //---------SRV---------//  
      if(query.questions[0].name === (Instance+'._tv._udp.local') && query.questions[0].type === 'SRV'){
        console.log(Instance+':got a SRV query');
        mdns.respond({
        answers: [{
          name:Instance+'._tv._udp.local',
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
    tv.toggle()
    console.log(tv.status)
});

server.listen(5000, "127.0.0.1");
//mdns.listen(4000, "127.0.0.1");
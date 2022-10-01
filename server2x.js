//-----This is the lamp with correct location------//
//----給燈泡四個隨機的地點屬性(兩個會回傳true、兩個會回傳false)，對比全部會回傳的(第一個實驗overhead實驗)目前有三個sqe

const server = require('fastify')();
let mdns = require('multicast-dns')()
var txt = require('dns-txt')()//txt封包解碼用
mdns.setMaxListeners(Infinity);
var Qlobber = require('qlobber').Qlobber;
var matcher =new Qlobber();


var InstanceNum = getRandomInt(10000);//隨機產生數字

var Instance = 'light'+InstanceNum;
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

//---使此燈泡有一半機率在正確的地點、一半機率在錯誤的地點---//
//目的:當沒有位置資訊時全部會回傳、有位置資訊時只有一半會回傳=>量測速度
var true_1 = 'DaRenBuilding.3rdFloor.301Room.ceiling';
var true_2 = 'DaRenBuilding.3rdFloor.303Room.ceiling';
var false_1 = 'DaRenBuilding.2rdFloor.202Room.ceiling';
var false_2 = 'DaRenBuilding.1rdFloor.101Room.ceiling';

var Arr = [true_1, true_2,false_1, false_2];
var RandomPlace = Arr[Math.floor(Math.random() * Arr.length)]



var port = 5800;
let count=0; //切換電燈on\off用

let lamp = {
    status: 'off',
    toggle: function(){
         if(count%2===0)this.status='on';
         else{this.status='off';}
         count++;
    },
    location:'DaRenBuilding.2rdFloor.201Room.ceiling'
    //查詢命令:DaRenBuilding.3rdFloor.#
  };

  
mdns.on('query', function(query){
    //---------PTR---------//
      // _light._udp.local //
      //console.log("on query")
      if(query.questions[0].name === '_light._udp.local' && query.questions[0].type === 'PTR'){
        console.log("got a PTR query")
        
        //console.log(query.additionals[0].data);
        //console.log((txt.decode(txt.encode(query.additionals[0]))).data);// 獲取 'DaYanBuilding/3rdFloor/#'
        let sqe=(txt.decode(txt.encode(query.additionals[0]))).data;//sqe='DaYanBuilding/3rdFloor/#'
       // let sqe2=(txt.decode(txt.encode(query.additionals[1]))).data;
       // let sqe3=(txt.decode(txt.encode(query.additionals[2]))).data;
       // let sqe4=(txt.decode(txt.encode(query.additionals[3]))).data;
        //let sqe5=(txt.decode(txt.encode(query.additionals[4]))).data;
        
        let sre=lamp.location
        console.log("搜尋地點1:"+sqe);
        //console.log("搜尋地點2:"+sqe2);
        //console.log("搜尋地點3:"+sqe3);
        //console.log("燈泡實際地點:"+sre);
        
        

        matcher.add(sqe);
        //matcher.add(sqe2);
        //matcher.add(sqe3);
        //matcher.add(sqe4);
        //matcher.add(sqe5);

        

        
        //matcher.add(sqe5);

        if(matcher.test(lamp.location)){ // Qlobber匹配處
          
          mdns.respond({
              answers: [{
              name:'_light._udp.local',
              ttl: 10,
              type: 'PTR',
              data:Instance+'._light._udp.local'
              }],
              additionals:
                  [ { name: '_light._udp.local',
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

/*server.post('/hogRider', function (req, res) {
    lamp.toggle()
    console.log(lamp.status)
});*/

//server.listen(5800 , "127.0.0.1");
//mdns.listen(4000, "127.0.0.1");
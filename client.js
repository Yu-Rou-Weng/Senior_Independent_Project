const client = require('node-fetch');

let mdns = require('multicast-dns')() //引入multicast-dns的模組
var txt = require('dns-txt')()
var Qlobber = require('qlobber').Qlobber;
var matcher =new Qlobber();
let count=[];
let s  = [];
mdns.setMaxListeners(Infinity);
//require('events').EventEmitter.defaultMaxListeners = Infinity;
let end=0;
//----搜尋命令Expression----//
let SQE='DaRenBuilding.3rdFloor.#'; //回傳大仁樓三樓所有物品
let SQE2='#.3rdFloor.301Room.*';     //回傳每棟樓(目前有:DanRen、Research)三樓的所有物品
let SQE3='DaYongBuilding.*.*.wall';
let SQE4='#.3rdFloor.*.wall';
let SQE5='ResearchBuilding.3rdFloor.#';

let t1 = new Date().getTime();
let t2 = t1;
//----尋找燈服務----//
mdns.query({
  questions: [{  
      name: '_light._udp.local',
      type: 'PTR'
  }
  ],
  additionals:
   [ { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE }/*,

     { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE2 },

       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 },
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE4 },
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE5 }/*,
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 },
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 },
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 }
       ,
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 }
       ,
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 }
       ,
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 }
       ,
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 }
       ,
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 }
       ,
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 }
       ,
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 }
       ,
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 }
       ,
       
       { name: '_light._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE3 }*/
      ]
});

//----尋找電視服務----//
/*mdns.query({
  questions: [{  
      name: '_tv._udp.local',
      type: 'PTR'
  }
  ],
  additionals:
   [ { name: '_tv._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE }
      ]
});

//----尋找溫度感測器服務----//
mdns.query({
  questions: [{  
      name: '_ TemperSensor._udp.local',
      type: 'PTR'
  }
  ],
  additionals:
   [ { name: '_TemperSensor._udp.local',
       type: 'TXT',
       class: 'IN',
       ttl: 120,
       flush: true,
       data: SQE }
      ]
});*/

mdns.on('response', function(response) {
  //console.log("on response")
  let target = "";
  let port = 0;
  //console.log('got a PTR response packet:');
   if(response.answers[0].name==='_light._udp.local'&& response.answers[0].type==='PTR'){
      let locat=(txt.decode(txt.encode(response.additionals[0]))).data
      console.log("燈泡實體位置:"+(txt.decode(txt.encode(response.additionals[0]))).data)

      matcher.add(SQE,'符合SQE1');
      //matcher.add(SQE2,'符合SQE2');
      //matcher.add(SQE3,'符合SQE3');
      //matcher.add(SQE4,'符合SQE4');
      //matcher.add(SQE5,'符合SQE5');
     // console.log(matcher.match(locat));

      let instance=response.answers[0].data; 
      mdns.query({
        questions: [{
        name: instance,
        type: 'SRV'
        }]
      });
    
  mdns.on('response', function (response) {
         
      if (response.answers[0].name ===  instance && response.answers[0].type === 'SRV') {
          //console.log('got a SRV response packet:')
          port = response.answers[0].data.port;
          target = response.answers[0].data.target;
          //console.log(port)
          //console.log(target)
          mdns.query({
                 questions: [{
                     name: target,
                     type: 'A'
                 }]
             });

             //---------A---------//
            mdns.on('response', function (response) {
              if (response.answers[0].name === target && response.answers[0].type === 'A') {
                  let address = response.answers[0].data;
                  console.log("port:"+port);
                  console.log("address:"+address)
                  
                  //t2 = Date.now();
                  //count[i] = t2-t1;
            
                  //console.log(count[i]);
                  t2 = Date.now();
                  let interval = t2 - t1;
                  s.push(interval);
                  console.log(s);
                  let sum=0
                  for(var i=0;i<s.length;i++){
                    sum+=s[i]
                  }
                  console.log("平均: "+sum/(s.length))
                  //addr=address;
            /*for(var i=0 ; i < 2 ; i++){//發兩次post=>切換兩次燈
                  (async () => {
                    const resp = await client('http://'+address+':'+port+'/TEST', {
                    method: 'POST',
                    headers: {
                       'Content-Type': 'application/json'
                     }
                   });
  
               })();
            }*/
    }
              














          });

      }
  });
  }


  if(response.answers[0].name==='_tv._udp.local'&& response.answers[0].type==='PTR'){
    console.log((txt.decode(txt.encode(response.additionals[0]))).data)
    let instance=response.answers[0].data; 
    mdns.query({
      questions: [{
      name: instance,
      type: 'SRV'
      }]
    });
  
        mdns.on('response', function (response) {
            console.log('got a SRV response packet:')
            if (response.answers[0].name ===  instance && response.answers[0].type === 'SRV') {
              console.log('got a SRV response packet:')
              port = response.answers[0].data.port;
              target = response.answers[0].data.target;
              //console.log(port)
              //console.log(target)
              mdns.query({
                  questions: [{
                      name: target,
                      type: 'A'
                    }]
                });

           //---------A---------//
            mdns.on('response', function (response) {
                if (response.answers[0].name === target && response.answers[0].type === 'A') {
                  let address = response.answers[0].data;
                  console.log(port);
                  //console.log(address)
                 //addr=address;
              for(var i=0 ; i < 2 ; i++){//發兩次post=>切換兩次燈
                (async () => {
                  const resp = await client('http://'+address+':'+port+'/hogRider', {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json'
                   },
                  body: JSON.stringify({
                        name: "mary",
                        age: 20,
                        attack: 50,
                        defense: 120
                   })
                 });

                  const data = await resp.json();
                  console.log(data);
             })();
          }
  }
            














        });

    }
});
}



})



const client = require('node-fetch');
let mdns = require('multicast-dns')() //引入multicast-dns的模組
var txt = require('dns-txt')()
//var Qlobber = require('qlobber').Qlobber;
//var matcher =new Qlobber();
require('events').EventEmitter.defaultMaxListeners = Infinity;
let ins=[];
//----搜尋命令Expression----//
//let SQE='DaRenBuilding.3rdFloor.#'; //回傳大仁樓三樓所有物品
//let SQE2='#.3rdFloor.301Room.*';     //回傳每棟樓(目前有:DanRen、Research)三樓的所有物品
//let SQE3='DaYongBuilding.*.*.wall';
let t1 = new Date().getTime();
let t2 = t1;
//----尋找燈服務----//
mdns.query({
  questions: [{  
      name: '_light._udp.local',
      type: 'PTR'
  }
  ]
});

//----尋找電視服務----//
/*mdns.query({
  questions: [{  
      name: '_tv._udp.local',
      type: 'PTR'
  }
  ]
});

//----尋找溫度感測器服務----//
mdns.query({
  questions: [{  
      name: '_ TemperSensor._udp.local',
      type: 'PTR'
  }
  ]
});*/

mdns.on('response', function(response) {
  //console.log("on response")
  let target = "";
  let port = 0;
  //console.log('got a PTR response packet:');
   if(response.answers[0].name==='_light._udp.local'&& response.answers[0].type==='PTR'){
     

      let instance=response.answers[0].data; 
      mdns.query({
        questions: [{
        name: instance,
        type: 'SRV'
        }]
      });
    
  mdns.on('response', function (response) {
        // console.log('got a SRV response packet:')
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
                  t2 = Date.now();
                  let interval = t2 - t1;
                  ins.push(interval);
                  console.log(ins);
                  let sum=0
                  for(var i=0;i<ins.length;i++){
                    sum+=ins[i]
                  }
                  console.log("平均: "+sum/(ins.length))
                  //addr=address;
           /* for(var i=0 ; i < 2 ; i++){//發兩次post=>切換兩次燈
                  (async () => {
                    const resp = await client('http://'+address+':'+port+'/hogRider', {
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




  /*if(response.answers[0].name==='_tv._udp.local'&& response.answers[0].type==='PTR'){
    
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
}*/



})

//(async () => {
   // const resp = await client('http://localhost:3000/hogRider', {
   //     method: 'POST',
   //     headers: {
   //         'Content-Type': 'application/json'
   //     },
   //     body: JSON.stringify({
   //         name: "mary",
   //         age: 20,
   //         attack: 50,
   //         defense: 120
   //     })
  //  });

  //  const data = await resp.json();
  //  console.log(data);
//})();
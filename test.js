//const { execFile } = require('child_process');
require('events').EventEmitter.defaultMaxListeners =100;
//require('events').EventEmitter.defaultMaxListeners = 200;
//const { EventEmitter } = require('events');
//const emitter = new EventEmitter()
//emitter.setMaxListeners(100)
/*for(var i=0;i<100;i++){
execFile('node', ['s.js'], (error, stdout, stderr) => {
    if (error) {
        console.error(`error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});
}*/

var exec = require('child_process');

for(var i=0;i<13;i++){
    //console.log(i+1);
    var child = exec.exec('node server2.js');
    child.stdout.pipe(process.stdout)
    //setTimeout(1)
}
for(var i=0;i<37;i++){
    //console.log(i+1);
    var child = exec.exec('node server2x.js');
    child.stdout.pipe(process.stdout)
}


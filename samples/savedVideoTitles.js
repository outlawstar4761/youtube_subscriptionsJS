//const google = require('../src/googleModule');
const youtube = require('../src/youTubeDlModule');
const config = require('../config/config');
const fs = require('fs');

(async ()=>{
  let cmd = 'find ' + config.outputDir + " -name '*.info.json'";
  try{
    let paths = await youtube.secretShell(cmd);
    paths.split("\n").map((p)=>{
      // console.log(p);
      try{
        let data = JSON.parse(fs.readFileSync(p));
        console.log(data.fulltitle);
      }catch(err){
        console.error(err);
      }
    });
  }catch(err){
    console.error(err);
  }

})();

//const google = require('../src/googleModule');
const util = require('util')
const youtube = require('../src/youTubeDlModule');
const config = require('../config/config');
const fs = require('fs');

(async ()=>{
  let titles = [];
  let cmd = 'find ' + config.outputDir + " -name '*.info.json'";
  try{
    let paths = await youtube.secretShell(cmd);
    paths.split("\n").map((p)=>{
      // console.log(p);
      try{
        let data = JSON.parse(fs.readFileSync(p));
        titles.push(data.fulltitle);
      }catch(err){
        console.error(err);
      }
    });
    console.log(util.inspect(titles.sort(), { maxArrayLength: null }))
  }catch(err){
    console.error(err);
  }

})();

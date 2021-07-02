//const google = require('../src/googleModule');
const util = require('util')
const youtube = require('../src/youTubeDlModule');
const config = require('../config/config');
const fs = require('fs');

(async ()=>{
  let videos = [];
  let cmd = 'find ' + config.outputDir + " -name '*.info.json'";
  try{
    let paths = await youtube.secretShell(cmd);
    paths.split("\n").map((p)=>{
      // console.log(p);
      try{
        let data = JSON.parse(fs.readFileSync(p));
        videos.push({
          title:data.fulltitle,
          upload_date:data.upload_date,
          duration: data.duration,
          view_count:data.view_count,
          like_count:data.like_count,
          dislike_count:data.dislike_count,
          average_rating:data.average_rating,
          filename:data._filename
        });
      }catch(err){
        console.error(err);
      }
    });
    console.table(videos.sort((a,b)=>{ a.upload_date > b.upload_date ? 1:0}));
  }catch(err){
    console.error(err);
  }

})();

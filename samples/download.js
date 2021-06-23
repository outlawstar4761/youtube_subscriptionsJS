const google = require('./src/googleModule');
const youtube = require('./src/youTubeDlModule');
const config = require('./config/config');

(async ()=>{

  try{
    let output = await youtube.download(config.outputDir,"7E-cwdnsiow");
    console.log(output);
  }catch(err){
    console.log(err);
  }

})();

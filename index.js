const google = require('./src/googleModule');
const youtube = require('./src/youTubeDlModule');
const config = require('./config/config');
const fs = require('fs');

(async ()=>{

  let secret = google.getSecret();
  google.authorize(secret,async (auth)=>{
    let subs = await google.getSubscriptions(auth,null,[]);
    let channels = subs.map((sub)=>{
      return {
        id:sub.snippet.resourceId.channelId,
        name:youtube.cleanPath(sub.snippet.title).replaceAll(' ','.')
      }
    });
    for(let i = 0; i < channels.length;i++){
      let activity = await google.getChannelActivity(auth,channels[i].id);
      for(let j = 0; j < activity.items.length;j++){
        if(activity.items[j].contentDetails['upload']){
          let id = activity.items[j].contentDetails.upload.videoId;
          let path = config.outputDir + channels[i].name + '/';
          if(!fs.existsSync(path)){
            try{
              await youtube.download(path,id);
              console.log(path + id);
            }catch(err){
              console.error(err);
              continue;
            }
          }
        }
      }
    }
  });

})();

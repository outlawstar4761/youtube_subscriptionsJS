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
    channels.forEach(async (channel)=>{
      let activity = await google.getChannelActivity(auth,channel.id);
      activity.items.forEach((item)=>{
        if(item.contentDetails['upload']){
          let id = item.contentDetails.upload.videoId;
          let path = config.outputDir + channel.name + '/';
          if(!fs.existsSync(path)){
            console.log(path + id);
            try{
              await youtube.download(path,id);
            }catch(err){
              console.error(err);
            }
          }
        }
      });
    });
  });

})();

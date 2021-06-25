const google = require('../src/googleModule');
const youtube = require('../src/youTubeDlModule');
const config = require('../config/config');
const fs = require('fs');

let channelId = 'UCnQC_G5Xsjhp9fEJKuIcrSw';



(async ()=>{

  let secret = google.getSecret();
  google.authorize(secret,async (auth)=>{
    let channel = await google.getChannel(auth,channelId);
    let playlistId = channel.items[0].contentDetails.relatedPlaylists.uploads;
    let channelName = youtube.cleanPath(channel.items[0].snippet.title).replaceAll(' ','.')
    let backlog = await google.getPlayListItems(auth,playlistId,null,[]);
    for(let i = 0; i < backlog.length; i++){
      let path = config.outputDir + channelName + '/' + backlog[i].contentDetails.videoId + '/';
      if(!fs.existsSync(path)){
        try{
          await youtube.download(path,id);
          console.log(path + id);
        }catch(err){
          console.error(err);
        }
      }
    }
  });

})();

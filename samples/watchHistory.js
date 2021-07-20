const google = require('../src/googleModule');
const youtube = require('../src/youTubeDlModule');
const config = require('../config/config');
const fs = require('fs');

/*This requires some trickery because YouTube API
no longers exposes WatchLater || WatchHistory playlists
**SOLUTION** Create a new playlist called "capture".
Add anything you want saved to this playlist.
*/

(async ()=>{

  let secret = google.getSecret();
  let captureId = null;
  google.authorize(secret,async (auth)=>{
    let res = await google.getMyPlayLists(auth).catch(console.error);
    let backlog = await google.getPlayListItems(auth,res.items[0].id,null,[]).catch(console.error);
    for(let i = 0; i < backlog.length; i++){
      let channelName = youtube.cleanPath(backlog[i].snippet.videoOwnerTitle).replaceAll(' ','.')
      let id = backlog[i].contentDetails.videoId;
      let path = config.outputDir + channelName + '/' + id + '/';
      if(!fs.existsSync(path)){
        try{
          await youtube.download(path,id);
          console.log(path + id);
        }catch(err){
          console.error(err);
        }
      }
    }
    console.log(backlog);
  });

})();

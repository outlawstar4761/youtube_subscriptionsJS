const google = require('../src/googleModule');
const youtube = require('../src/youTubeDlModule');
const config = require('../config/config');
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
    console.table(channels);
  });

})();

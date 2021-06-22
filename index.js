const google = require('./src/googleModule');

(async ()=>{
  let secret = google.getSecret();
  google.authorize(secret,async (auth)=>{
    let subs = await google.getSubscriptions(auth,null,[]);
    let channelIds = subs.map((sub)=>{return sub.snippet.resourceId.channelId});
    channelIds.forEach(async (id)=>{
      let activity = await google.getChannelActivity(auth,id);
      console.log(activity.items[0].contentDetails);
    });
  });
})();

// channel.pageInfo.resultsPage

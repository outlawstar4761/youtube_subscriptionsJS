const google = require('./src/googleModule');

(async ()=>{
  let secret = google.getSecret();
  google.authorize(secret,async (auth)=>{
    //do sum ish
  });
})();

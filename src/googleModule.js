var googleModule = (function(){
    const fs = require('fs');
    const readline = require('readline');
    const {google} = require('googleapis');
    const mime = require('mime-types');
    const path = require('path');
    const SCOPES = [
        'https://www.googleapis.com/auth/youtube.readonly',
    ];
    const AUTHVER = 'v3';
    const TOKEN_PATH = __dirname + '/../config/token.json';
    const CRED_PATH = __dirname + '/../config/credentials.json';

    function authorize(credentials,callback){
        const {client_secret,client_id,redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id,client_secret,redirect_uris[0]);
        fs.readFile(TOKEN_PATH,(err,token)=>{
            if(err) return getAccessToken(oAuth2Client,callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }
    function getAccessToken(oAuth2Client,callback){
        const authUrl = oAuth2Client.generateAuthUrl({access_type:'offline',scope:SCOPES});
        console.log('Authorize this app by visiting this url: ',authUrl);
        const rl = readline.createInterface({input:process.stdin,output:process.stdout});
        rl.question('Enter the code from that page here: ',(code)=>{
            rl.close();
            oAuth2Client.getToken(code,(err,token)=>{
                if(err) return callback(err);
                oAuth2Client.setCredentials(token);
                fs.writeFile(TOKEN_PATH,JSON.stringify(token),(err)=>{
                    if(err) console.error(err);
                    console.log('Token stored to',TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }
    function _getSubscriptions(auth,pageToken){
      return new Promise((resolve,reject)=>{
        const tube = google.youtube(AUTHVER);
        tube.subscriptions.list({auth:auth,part:'snippet,contentDetails',mine:true,pageToken:pageToken},(err,response)=>{
          if(err) reject(err);
          resolve(response.data);
        });
      });
    }
    return {
        CRED_PATH:CRED_PATH,
        authorize:function(credentials,callback){
            authorize(credentials,callback);
        },
        getSecret:function(){
          return JSON.parse(fs.readFileSync(this.CRED_PATH));
        },
        getSubscriptions: async function(auth,pageToken,channels){
          let data = await _getSubscriptions(auth,pageToken);
          channels = channels.concat(data.items);
          if(!data.nextPageToken){
            return channels;
          }
          return await this.getSubscriptions(auth,data.nextPageToken,channels);
        },
        getChannel:function(auth,channelId){
          return new Promise((resolve,reject)=>{
            const tube = google.youtube(AUTHVER);
            tube.channels.list({auth:auth,part:"snippet,contentDetails,statistics",id:channelId},(err,response)=>{
              if (err) reject(err);
              resolve(response.data);
            });
          });
        },
        getChannelActivity:function(auth,channelId){
          return new Promise((resolve,reject)=>{
            const tube = google.youtube(AUTHVER);
            tube.activities.list({auth:auth,part:"snippet,contentDetails",channelId:channelId},(err,response)=>{
              if (err) reject(err);
              resolve(response.data);
            });
          });
        },
        getVideo:function(auth,videoId){
          return new Promise((resolve,reject)=>{
            const tube = google.youtube(AUTHVER);
            tube.videos.list({auth:auth,part:['snippet'],id:videoId},(err,response)=>{
              if (err) reject(err);
              resolve(response.data);
            });
          });
        }
    }
}());

module.exports = googleModule;

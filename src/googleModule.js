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
    return {
        CRED_PATH:CRED_PATH,
        authorize:function(credentials,callback){
            authorize(credentials,callback);
        },
        getSecret:function(){
          return JSON.parse(fs.readFileSync(this.CRED_PATH));
        },
        getFileList:function(auth,options){
            return new Promise((resolve,reject)=>{
                var fileList = [];
                const drive = google.drive({version:AUTHVER,auth});
                drive.files.list(options,(err,res)=>{
                    if(err){
                      reject(err);
                      return;
                    }
                    const files = res.data.files;
                    files.forEach((file)=>{fileList.push(file);});
                    resolve(fileList);
                });
            });
        },
        deleteFile:async function(auth,fileId){
            const drive = google.drive({version:AUTHVER,auth});
            const res = await drive.files.delete({fileId:fileId}).catch((err)=>{throw err; return});
            return res;
        },
        uploadFile:async function(auth,filePath,fileMetaData){
            const drive = google.drive({version:AUTHVER,auth});
            var ext = path.extname(filePath);
            var media = {mimeType:mime.lookup(ext),body:fs.createReadStream(filePath)}
            const res = await drive.files.create({resource:fileMetaData,media:media});
        },
        downloadFile:function(auth,fileId,outPath){
            return new Promise((resolve,reject)=>{
              let dest = fs.createWriteStream(outPath);
              const drive = google.drive({version:AUTHVER,auth});
              drive.files.get({fileId:fileId,alt:'media'},{responseType:'stream'},(err,res)=>{
                res.data.on('end',()=>{}).on('err',(err)=>{
                  reject(err);
                }).pipe(dest).on('finish',()=>{
                  resolve();
                });
              });
            });
        }
    }
}());

module.exports = googleModule;

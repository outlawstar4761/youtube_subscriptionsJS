var youtubeModule = (function(){
  const {exec} = require('child_process');
  const YOUTUBEBASE = 'https://www.youtube.com/watch?v=';
  const CMDBASE = 'youtube-dl --write-description --write-info-json --write-annotations --write-sub --write-thumbnail';

  function _execShellCmd(cmd){
    return new Promise((resolv,reject)=>{
      exec(cmd,(err,stdout,stderr)=>{
        if(err) reject(err);
        if(stderr) reject(stderr);
        resolve(stdout);
      });
    });
  }
  function _buildYoutubeUri(videoId){
    return YOUTUBEBASE + videoId;
  }
  function _buildCmd(outpath,uri){
    return CMDBASE + ' -o ' + outpath + ' ' + uri;
  }
  return {
    downloadFromList:async function(path){
      //verify path
      //build command
      //await execution
    },
    download:async function(videoId){
      let cmd = _buildCmd("./out/",_buildYoutubeUri(videoId));
      let stdout = '';
      try{
        stdout = await _execShellCmd(cmd);
      }catch(err){
        throw err;
        return;
      }
      return stdout;
    }
  }
}());

module.exports = youtubeModule;

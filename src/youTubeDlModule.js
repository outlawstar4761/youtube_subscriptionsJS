/*
// TODO:
parse stderr and ignore WARNING
Right now you're throwing an error almost every time
*/

var youtubeModule = (function(){
  const {exec} = require('child_process');
  const YOUTUBEBASE = 'https://www.youtube.com/watch?v=';
  const CMDBASE = 'youtube-dl --write-description --write-info-json --write-annotations --write-sub --write-thumbnail';
  const NONASCIIPATT = /[^\x00-\x7F]/g;
  const BADFILEPATT = /[\:"*?<>|]/g;
  const PUNCTPATT = /['!~`*^%$#@+,]/g;
  const TRIDOT = /[\.]{3}/g;

  function _execShellCmd(cmd){
    return new Promise((resolve,reject)=>{
      exec(cmd,(err,stdout,stderr)=>{
        if(err) reject(err);
        if(stderr && !stderr.match('WARNING')) reject(stderr);
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
  function _buildCleanPath(absolutePath){
    return absolutePath.replaceAll(NONASCIIPATT,'').replaceAll(BADFILEPATT,'').replaceAll(PUNCTPATT,'').replaceAll(TRIDOT,'');
  }
  return {
    secretShell:function(cmd){
      return _execShellCmd(cmd);
    },
    cleanPath:function(absolutePath){
      return _buildCleanPath(absolutePath);
    },
    downloadFromList:async function(path){
      //verify path
      //build command
      //await execution
    },
    download:async function(destPath,videoId){
      let cmd = _buildCmd(destPath + videoId,_buildYoutubeUri(videoId));
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

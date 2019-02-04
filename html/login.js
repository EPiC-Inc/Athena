sendPost = function() {
  //console.log('sent');
  $.post('/post', {value:'123'}, function(data, status){
    //console.log(data+' : status is '+status);
  });
}

function getUrlVars(str){ /* Stole from Ryan b/c i'm lazy, credit to him */
  var vars = [], hash;
  var hashes = str.slice(str.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++){
    hash = hashes[i].split('=');
    if(vars.indexOf(hash[0])>-1){
      vars[hash[0]]+=","+hash[1];
    }
    else{
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
  }
  return vars;
}

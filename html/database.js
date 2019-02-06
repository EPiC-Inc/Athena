sendPost = function(whereToSend, data) {
  //console.log('sent');
  $.post(whereToSend, data, function(data, status){
    document.getElementById('databaseOutput').innerHTML='';
    console.log(data);
    if (data.forEach) {data.forEach((row) => {
      document.getElementById('databaseOutput').innerHTML += JSON.stringify(row);
    });} else {
      document.getElementById('databaseOutput').innerHTML = data.split('\n')[0];
    }
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

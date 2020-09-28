const request = require('request');
  
const callExternalApiUsingRequest = (callback) => { 
    if (process.env.NODE_ENV !== 'production') {
        require('dotenv').config();
      }
      setTimeout(() => { clearInterval(requestLoop); }, 120000);//two min
      callback('started')
}

const requestLoop = setInterval(function() {
    request({
        url:process.env.OnRequest,
        method: 'GET',
        timeout: 10000,
        followRedirect: true 
    }, function(error, res, req) {
        console.log(new Date(Date.now()));
        console.log(res.statusMessage);
        if(!error && res.statusMessage === 'OK') {
            request({
                url: process.env.OnSuccess,
                method: 'GET',
                followRedirect: true
            },function(err, res, req) {
                //execute action
                console.log(res.statusCode);
                console.log('call another API');
            });
            
        clearInterval(requestLoop); 
        }        
    });
}, 60000);

module.exports.callApi = callExternalApiUsingRequest;
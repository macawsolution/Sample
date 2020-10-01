const request = require('request');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var requestLoop;
function callRequestLoop(interval) { 
    requestLoop = setInterval(function () {
        request({
            url: process.env.OnRequest,
            method: 'GET',
            timeout: 100000,
            followRedirect: true
        }, function (error, res, req) { 
            if (!error && res.statusMessage === 'OK') {
                request({
                    url: process.env.OnSuccess,
                    headers : {
                        "content-type": "application/json",
                    },
                    method: 'POST',
                    followRedirect: true,
                    body: JSON.parse(res.body), 
                    json: true
                }, function (err, res, req) {
                    //execute action  
                    console.log('call another API');
                });

                clearInterval(requestLoop);
            }
            console.log(res); 
            console.log(error);
            
        });
    }, interval);
}
function callExternalApiUsingRequest(callback, req) {
    console.log('started');
    let interval = req.headers.interval || process.env.INTERVAL || 60000; 
    let runTime = req.headers.runtime || process.env.RUN_TIME || 120000;
    callRequestLoop(interval);
    setTimeout(() => { clearInterval(requestLoop); console.log('-----END ------') }, runTime);
    callback(req);
}

module.exports.callApi = callExternalApiUsingRequest;
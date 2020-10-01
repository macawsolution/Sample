 const request = require('request');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var requestLoop;
function callRequestLoop(interval,firstReq, secondReq) { 
    // console.log(firstReq);
    // console.log(secondReq);
    // console.log(JSON.parse(JSON.stringify(firstReq)));
    // console.log(JSON.parse(JSON.stringify(secondReq))); 
 
    requestLoop = setInterval(function () {
        request( 
        JSON.parse(firstReq)
        , function (error, res, req) { 
            if (!error && res.statusMessage === 'OK') {
                secondReq.body=res.body
                request(
              
               JSON.parse(secondReq)
                , function (err, res, req) {
                    //execute action  
                    console.log(req);
                    console.log('call another API');
                });

                clearInterval(requestLoop);
            }
            console.log(error);
            
        });
    }, interval);
}
function callExternalApiUsingRequestDynamic(callback, req) {
    let interval = req.headers.interval || process.env.INTERVAL || 60000; 
    let runTime = req.headers.runtime || process.env.RUN_TIME || 120000; 
    const firstApiObject = req.headers.firstapiobject || process.env.FIRST_API_OBJECT //you can define in env also (or) pass in the headers
    || '{"url": "http://dummy.restapiexample.com/api/v1/employees" ,"method": "GET","timeout": 10000,"followRedirect": true}';
   const onSuccessApiReqObject = req.headers.onSuccessApiReqObject || process.env.onSuccessApiReqObject || //you can define in env also (or) pass in the headers
   '{"url": "http://dummy.restapiexample.com/api/v1/create","headers" : {"content-type": "application/json"},"method": "POST","followRedirect": true, "json": true }'; // ##res.body## you have use this to re
    callRequestLoop(interval,firstApiObject,onSuccessApiReqObject);
    setTimeout(() => { clearInterval(requestLoop); console.log('---- END -----'); }, runTime);
    callback(req);
}

module.exports.callDynamicApi = callExternalApiUsingRequestDynamic;
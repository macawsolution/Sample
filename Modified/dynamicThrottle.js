/*************************
 * 
 * 
 * 
 * 
 * DONT USE THIS. JUST TRY TO IMPLEMNT MORE DYNAMIC LOGIC
 * 
 * 
 * 
 * 
 */

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
    const options =  JSON.parse(JSON.stringify(firstReq));
    console.log(options);
    requestLoop = setInterval(function () {
        request(
        //     {
        //     url: process.env.OnRequest,
        //     method: 'GET',
        //     timeout: 10000,
        //     followRedirect: true
        // }
        options
        , function (error, res, req) { 
            if (!error && res.statusMessage === 'OK') {
                request(
                //     {
                //     url: process.env.OnSuccess,
                //     headers : {
                //         "content-type": "application/json",
                //     },
                //     method: 'POST',
                //     followRedirect: true,
                //     body: JSON.parse(res.body), 
                //     json: true
                // }
                JSON.parse(secondReq.replace('##res.body##',res.body))
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
    let firstApiObject = req.headers.firstApiObject || process.env.FIRST_API_OBJECT || "{'url': 'http://dummy.restapiexample.com/api/v1/employees' ,'method': 'GET','timeout': 10000,'followRedirect': true}";
    let onSuccessApiReqObject = req.headers.onSuccessApiReqObject || process.env.onSuccessApiReqObject ||
    "{'url': 'http://dummy.restapiexample.com/api/v1/create','headers' : {'content-type': 'application/json',},'method': 'POST','followRedirect': true,body: '##res.body##', 'json': true }" // ##res.body## you have use this to re
    callRequestLoop(interval,firstApiObject,onSuccessApiReqObject);
    setTimeout(() => { clearInterval(requestLoop); }, runTime);
    callback(req);
}

module.exports.callDynamicApi = callExternalApiUsingRequestDynamic;
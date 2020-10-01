const express = require('express');
const apiCallFromRequest = require('./throttle');
const apiCallFromDynamicRequest = require('./dynamicThrottle');
const app = express();
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

let stringify = require('json-stringify-safe');
app.get('/', (req, res) => {
    apiCallFromRequest.callApi(function(response){       
        res.send(stringify(response.headers));//included for testing
    },req);
});
 
/******
 * You can pass interval,runtime,firstapiobject,onsuccessapireqobject 
 * object like : {"url": "http://dummy.restapiexample.com/api/v1/create","headers" : {"content-type": "application/json"},"method": "POST","followRedirect": true, "json": true }
 */
app.get('/dynamic', (req, res) => {
    apiCallFromDynamicRequest.callDynamicApi(function(response){       
        res.send(stringify(response.headers));//included for testing
    },req);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`));
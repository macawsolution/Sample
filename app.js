const apiCallFromRequest = require('./Request') 
const http = require('http')

http.createServer((req, res) => {
        if(req.url === "/request"){
            apiCallFromRequest.callApi(function(response){
                res.write(response);
                res.end();
            });
        }
        res.end();
}).listen(3000);

console.log("service running on 3000 port....");
//currency converter using API that convert currency
//http://www.apilayer.net/api/live?access_key=d05896401bbe851fc1c97e19ad747331 API for currency value according to USD

var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var request = require("request");

let convert=function(convertFrom,amount,convertTo){
    return new Promise(function(resolve,reject){
        var options = { 
            method: 'GET',
            url: 'http://www.apilayer.net/api/live',
            qs: { access_key: 'd05896401bbe851fc1c97e19ad747331' },
            headers: 
                    { 
                           'cache-control': 'no-cache' 
                    } 
        };
        request(options, function (error, response, body) {
            if (error) 
                console.log(error);
            data=JSON.parse(body);
            let USD_value=amount/data["quotes"]["USD"+convertFrom];   //find convertFrom to USD value
            //console.log("USD value "+USD_value);
            convetToValue=USD_value*data["quotes"]["USD"+convertTo];  // convert USD to convertTo
            resolve(convetToValue);
        });
    });
}

app.use(bodyParser.urlencoded({ extended: false }));   
app.post('/convert', function (req, res) {
    convert(req.body.cf,req.body.amt,req.body.ct).then(function(resultFromShowDetails){
        console.log("Convert "+req.body.cf+" "+req.body.amt+" To "+req.body.ct);
        console.log("Final Amount : "+resultFromShowDetails);
        res.write("Convert "+req.body.cf+" "+req.body.amt+" To "+req.body.ct);
        res.write("\nFinal Amount : "+resultFromShowDetails);
        res.end();
    }).catch(function(err){
        console.log(err);
        res.writeHead(200, { 'content-type': 'text/<html>' });
        res.write(err);
        res.end();      
    });
})
app.listen(3000,function(){})
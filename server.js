var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const uuidV1 = require('uuid/v1');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.set('port', (process.env.PORT || 5000)); 
app.get('/', function (req, res) {
	res.header("Content-Type", "text/html");
	console.log('*****************************');
	fs.readFile( __dirname + "/index.html", 'utf8', function (err, data) {
	console.log('*****************************')
	console.log(req.url);
    res.end( data );
   });
});
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.post('/', function(req, res) {
  var identity = uuidV1();
  var clientId = req.body.clientId;
  var clientSecret ="0H54O1x1S//QbqzoNJ5j/GOJSNL8J2egnZO2atgKE7o=";

  var isAnonymous = req.body.isAnonymous || false;
  var aud = req.body.aud || "https://idproxy.kore.com/authorize";

  var options = {
    "iat": new Date().getTime(),
    "exp": new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getTime(),
    "aud": aud,
    "iss": clientId,
    "sub": identity,
    "isAnonymous": isAnonymous
  };
        var token = jwt.sign(options, clientSecret);
  res.send({"jwt":token,"status":"success"});
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

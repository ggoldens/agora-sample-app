var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('index');
});

app.post('/get-dynamic-key', function (req, res, next) {

  var DynamicKey4 = require('./libs/DynamicKey4');
  require('dotenv').load();

  //Put your vendor key here
  var vendor_key = "75193db79e61472e9c6a2453ed3e01bd"; 
  //Put your sign key here
  var sign_key = "3ed9877e2c0f4dc19a22d5d1e86df107";
  var unixTs = Math.round(new Date().getTime() / 1000);
  var randomInt = Math.round(Math.random()*100000000);
  var channel_name = req.body.channel_name;
  var uid = req.body.uid;
  //Timestamp at which the user cannot use the Agora service any more. Set the value to 0 if no limitation to the time of termination. 
  var expiredTs = 0;

  //Generates Key for Recording Server to join channel
  var recording_key = DynamicKey4.generateRecordingKey(vendor_key, sign_key, channel_name, unixTs, randomInt, uid, 0);

  // Generates Key for user to join Channel
  var media_channel_key = DynamicKey4.generateMediaChannelKey(vendor_key, sign_key, channel_name, unixTs, randomInt, uid, 0);

  res.json({'recording_key': recording_key,
            'media_channel_key': media_channel_key});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
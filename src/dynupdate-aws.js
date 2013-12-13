var AWS = require('aws-sdk');
var dynupdate = require('dynupdate');


/* 
 SERVICE MATCH NO-IP WITH AWS
*/

function DynUpdateAws() {

  this.options = {};
  this.init();
  this.ec2 = new AWS.EC2(this.options);
  this.dynupdate = dynupdate;  

  this.daemon(this.options, function(err, status){    
    if (err)
      console.log(err);
    else
      console.log('ok' + status);
  });
}

DynUpdateAws.prototype.init = function() {
  
  var args = process.argv.splice(2);  

  if (args.length < 6) {
    process.argv = process.argv.concat(args);
    return;
  }

  args.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  });

  // AWS
  this.options.accessKeyId = args[0];
  this.options.secretAccessKey = args[1];
  this.options.region = args[2];
  this.options.instanceId = args[3];

  // NO-IP
  this.options.auth = args[4];
  this.options.hostname = args[5];

  process.argv = process.argv.concat(args);

  return this;
};

DynUpdateAws.prototype.daemon = function(options, next) {
  
  if (!options.accessKeyId || !options.secretAccessKey)
    return;  

  var this_ = this;
  var timeoutId = setInterval(function () {
    console.log('----- getting aws info ');
    this_.ec2.describeInstances({}, function(err, data) {
      if (err) {
        console.log(err);
        clearInterval(timeoutId);
        return next(err);
      }      
      // instanceId : i-53613f18
      var reservations = data.Reservations;
      reservations.forEach(function (val, index, array) {
        var reservation = val;
        reservation.Instances.forEach(function (val, index, array) {        
          var instanceId = val.InstanceId;
          console.log('current instance id ' + instanceId);
          if (instanceId === options.instanceId && val.PublicIpAddress) {
            console.log('ip is ' + val.PublicIpAddress);
            console.log('----- sending update to no-ip for domain "' + options.hostname + '"');
            options.myip = val.PublicIpAddress;
            dynupdate.dynupdate(options, function(err, status) {
              if (err) console.log(err);
              else {
                console.log('----- job is done');
                console.log('status ' + status);
                clearInterval(timeoutId);
              }
            });            
          }            
        });      
      });
    });
  }, 5000);

  return this;
};

/**
* Export default singleton.
*/
var dynupdateAws = new DynUpdateAws();
module.exports = dynupdateAws;
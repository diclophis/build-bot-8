var noble = require('noble');
var sphero = require("sphero");

noble.on('stateChange', function(state) {
  console.log(state);
  if ("poweredOn" === state) {
    noble.startScanning([], true); // any service UUID, allow duplicates 
  }
});

var tried = false;

noble.on('discover', function(peripheral) {
  if (peripheral.advertisement.localName && peripheral.advertisement.localName.startsWith('BB-')) {
    if (!tried) {
      tried = true;

      console.log("trying", peripheral.advertisement.localName);
      //console.log(peripheral.advertisement.manufacturerData.toString());

      //bb8 = sphero("B8:78:2E:1B:BD:08"); // change BLE address accordingly 
      bb8 = sphero(peripheral.uuid); // change BLE address accordingly 

      bb8.on("error", function(err, data) {
      // Do something with the err or just ignore.
        console.log(err, data);
      });
   
      bb8.connect(function() {
        console.log("connected");
        var direction = 90;
        var directionIntended = false;
        console.log("::START CALIBRATION::");
        bb8.startCalibration();
        setTimeout(function() {
          console.log("::FINISH CALIBRATION::");
          bb8.finishCalibration();
          // roll BB-8 in a random direction, changing direction every second 
          var randomDir = function() {
            if (true || Math.random() > 0.5) {
              bb8.color({ red: (Math.random() * 255), green: 128, blue: 128 });
            } else {
              bb8.color({ red: 128, green: (Math.random() * 255), blue: 128 });
            }
            console.log("random location");
            //var direction = Math.floor(Math.random() * 360);
            var cmdTimeout = 33.0;
            if (directionIntended) {
              //direction += parseInt(360.0 * (cmdTimeout / 1000.0));
            } else {
              //direction -= parseInt(360.0 * (cmdTimeout / 1000.0));
            }
            //if (Math.random() > 0.5) {
            //  directionIntended = !directionIntended;
            //}
              //direction += 100 * directionIntended;
            //}
            direction += 25; //( * directionIntended);
            console.log(direction);
            direction = Math.abs(direction) % 360;
            bb8.roll(75, direction, function(rollState) { console.log("rolling", rollState); setTimeout(randomDir, cmdTimeout); });
          };
          randomDir();
        }, 2000);
      });
    }
  }
});

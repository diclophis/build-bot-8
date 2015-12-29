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

        console.log("::START CALIBRATION::");
        bb8.startCalibration();
        setTimeout(function() {
          console.log("::FINISH CALIBRATION::");
          bb8.finishCalibration();
          // roll BB-8 in a random direction, changing direction every second 
          setInterval(function() {
            bb8.color({ red: 255, green: 0, blue: 255 });
            console.log("random location");
            var direction = Math.floor(Math.random() * 360);
            bb8.roll(2000, direction);
          }, 5000);
        }, 5000);
      });
    }
  }
});



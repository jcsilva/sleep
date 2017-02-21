var noble = require('noble');

var foundDevices = [],
    foundRssi = [],
    serviceUuid = "ffe0",
    charUuid = "ffe1",
    desiredName = "SSV1_00000";

// Start Scanning
noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

// If a peripheral was discovered...
noble.on('discover', function(peripheral) {
    console.log('Found device with local name: ' + peripheral.advertisement.localName);
    console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
    console.log();

    if (peripheral.advertisement.name === desiredName /* "SSV1_00000" */ ) {
        // we don't need to scan anymore.
        noble.stopScanning();

        foundDevices.push(peripheral.address);
        foundRssi.push(peripheral.rssi);

        console.log(JSON.stringify(foundDevices));

        // ... try to connect to the discovered peripheral
        connect(peripheral);
      }
});

// Connecting to peripheral
function connect(peripheral){
  peripheral.connect(function(error) {
    console.log('connected to peripheral: ' + peripheral.uuid);
  });
}



// Auxiliary functions
function sendCheckDataCommand() {
    currentWrite = "Check for data";
    // Write getAccel command
    var hexArray = ["0xAA", "0xAA", "0x03", "0x94", "0x20", "0x00", ""];

    peripheral.discoverServices([serviceUuid], function(error, services) {
          var immediateAlertService = services[0];
          console.log('discovered Sleep service');

          immediateAlertService.discoverCharacteristics([charUuid], function(error, characteristics) {
            var alertLevelCharacteristic = characteristics[0];
            console.log('discovered Sleep characteristic');

            // true if for write without response
            alertLevelCharacteristic.write(new Buffer(hexArray), true, function(error) {
              console.log('set alert level to mid (1)');
            });
          });
        });

    //var writeArray = hexToUint8(hexArray);
    //var writeString = bluetoothle.bytesToEncodedString(writeArray);
    // alert("writing get accel command");
    //bluetoothle.write(writeSuccess, writeFail, {
    //    "address": address,
    //    "value": writeString,
    //    "service": serviceUuid,
    //    "characteristic": charUuid,
    //    "type": "noResponse"
    //});
    // Set flag in subscribeSuccess (data.status === "subscribedResult")
}


/*
function sendGetHeaderCommand() {
    //alert('before requesting data header');
    currentWrite = "Get header";
    // Write getAccel command
    var hexArray = ["AA", "AA", "03", "93", "20", "00", ""];
    var writeArray = hexToUint8(hexArray);
    var writeString = bluetoothle.bytesToEncodedString(writeArray);
    // alert("writing get accel command");
    bluetoothle.write(writeSuccess, writeFail, {
        "address": address,
        "value": writeString,
        "service": serviceUuid,
        "characteristic": charUuid,
        "type": "noResponse"
    });
    // Set flag in subscribeSuccess (data.status === "subscribedResult")
}

function sendEraseDataCommand() {
    currentWrite = "erase data";
    // Write getAccel command
    var hexArray = ["AA", "AA", "03", "96", "20", "00", ""];
    var writeArray = hexToUint8(hexArray);
    var writeString = bluetoothle.bytesToEncodedString(writeArray);
    // alert("writing get accel command");
    bluetoothle.write(writeSuccess, writeFail, {
        "address": address,
        "value": writeString,
        "service": serviceUuid,
        "characteristic": charUuid,
        "type": "noResponse"
    });
    // Set flag in subscribeSuccess (data.status === "subscribedResult")
}


function getAccel() {
    currentWrite = "Get Accel";
    // Write getAccel command
    var hexArray = ["AA", "AA", "03", "58", "20", "00", ""];
    var writeArray = hexToUint8(hexArray);
    var writeString = bluetoothle.bytesToEncodedString(writeArray);
    // alert("writing get accel command");
    bluetoothle.write(writeSuccess, writeFail, {
        "address": address,
        "value": writeString,
        "service": serviceUuid,
        "characteristic": charUuid,
        "type": "noResponse"
    });
    // Set flag in subscribeSuccess (data.status === "subscribedResult")
}

function sendConfirmationCommand() {
    currentWrite = "confirm connection";
    // Write BLE confirm command
    console.log('in sendConfirmationCommand, charUuid: ' + charUuid + ', serviceUuid: ' + serviceUuid);
    var hexArray = ["AA", "AA", "03", "9A", "10", "01", ""];
    var writeArray = hexToUint8(hexArray);
    var writeString = bluetoothle.bytesToEncodedString(writeArray);
    //alert('before writing confirm');
    bluetoothle.write(writeSuccess, writeFail, {
        "address": address,
        "value": writeString,
        "service": serviceUuid,
        "characteristic": charUuid,
        "type": "noResponse"
    });
}*/

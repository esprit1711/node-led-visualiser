var io = require('socket.io').listen(5000);
var LightStrips = require('./LPD8806').LightStrips;

var numberOfLEDs = 64;
var lights = new LightStrips('/dev/spidev0.0', numberOfLEDs);

var xbeeSerialPort = '/dev/serial/by-id/usb-FTDI_FT232R_USB_UART_A800csie-if00-port0';

var serialport = require('serialport');
var serialPort = new serialport.SerialPort(xbeeSerialPort,
{//Listening on the serial port for data coming from Arduino over USB
	baudRate: 57600,
	parser: serialport.parsers.readline('\n')
});

var off = function(){
   lights.off();
};

var half = numberOfLEDs/2;

var lightsOn = function(percentage, rgb){
	var start = 0; 
	var end = ~~((numberOfLEDs/2) * (percentage / 100));


	lights.fill(0, 0, 0, start, half - end);
	lights.fill(rgb[0], rgb[1], rgb[2], half - end, half);  

	lights.fill(rgb[0], rgb[1], rgb[2], start*2, end*2);
	lights.fill(0, 0, 0, end*2, numberOfLEDs);


	lights.sync();
};

var showAmplitude = function(){
	var rgb = [2550,0,0];
	if(data.rgb){
		rgb = data.rgb;
	}
	try{
			serialPort.write(new Buffer([0x04, rgb[0], rgb[1], rgb[2],0x10]));
	}catch(e){
		console.log(e);
	}

	lightsOn(data.percentage, rgb);
};

io.sockets.on('connection', function (socket) {
	socket.on('data', function (data) {
		showAmplitude(data);
  });
});
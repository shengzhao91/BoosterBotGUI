var util = require("util");
var events = require("events");
var firmata = require('firmata');

var BQ27510_I2C_Address = 0x55,
	BQ27510_Control     = 0x00,
	BQ27510_Temperature = 0x06,
	BQ27510_Voltage     = 0x08,
	BQ27510_Flags       = 0x0a,
	BQ27510_NominalAvailableCapacity = 0x0c,
	BQ27510_FullAvailableCapacity    = 0x0e,
	BQ27510_RemainingCapacity        = 0x10,
	BQ27510_FullChargeCapacity       = 0x12,
	BQ27510_AverageCurrent           = 0x14,
	BQ27510_TimeToEmpty              = 0x16;

var FuelTankServer = function(board){
    events.EventEmitter.call(this);

    this._temperature_oCx10;
		this._voltage_mV;
		this._flags;
		this._nominalAvailableCapacity_mAh;
		this._fullAvailableCapacity_mAh;
		this._remainingCapacity_mAh;
		this._fullChargeCapacity_mAh;
		this._averageCurrent_mA;
		this._timeToEmpty_mn;

	console.log('Initialize Fuel Tank');
	board.sendI2CConfig(0);

	this._read16 = function(reg,callback){
		board.sendI2CWriteRequest(BQ27510_I2C_Address, [reg]);
		board.sendI2CReadRequest(BQ27510_I2C_Address, 2, callback);
	}

	this.ui2i = function(ui16){
		if (ui16 > 0x7FFF){
			ui16 = 0xFFFF - ui16;
			return (-ui16);
		} else {
			return ui16;
		}
	}
};

util.inherits(FuelTankServer, events.EventEmitter);

FuelTankServer.prototype.get = function(){
	var self = this;
	self._read16(BQ27510_Temperature,function(msg){
		// console.log('i2c read return' + msg);
		self._temperature_oCx10 = ((msg[1]<<8) + (msg[0]) - 2730)/10;
		console.log('Temperature: ' + self._temperature_oCx10);
	});

	setTimeout(function(){
		self._read16(BQ27510_Voltage,function(msg){
			self._voltage_mV = (msg[1]<<8) + (msg[0]);;
			console.log('Voltage: ' + self._voltage_mV);
		});	
	},50);
	
	setTimeout(function(){
		self._read16(BQ27510_Flags,function(msg){
			self._flags = (msg[1]<<8) + (msg[0]);
			console.log('Flag: ' + self._flags);
		});
	},100);

	setTimeout(function(){
		self._read16(BQ27510_NominalAvailableCapacity,function(msg){
			self._nominalAvailableCapacity_mAh = (msg[1]<<8) + (msg[0]);
			console.log('NominalAvailableCapacity: ' + self._nominalAvailableCapacity_mAh);
		});
	},150);

	setTimeout(function(){
		self._read16(BQ27510_FullAvailableCapacity,function(msg){
			self._fullAvailableCapacity_mAh = (msg[1]<<8) + (msg[0]);
			console.log('FullAvailableCapacity ' + self._fullAvailableCapacity_mAh);
		});
	},200);

	setTimeout(function(){
		self._read16(BQ27510_RemainingCapacity,function(msg){
			self._remainingCapacity_mAh = (msg[1]<<8) + (msg[0]);
			console.log('RemainingCapacity ' + self._remainingCapacity_mAh);
		});
	},250);

	setTimeout(function(){
		self._read16(BQ27510_FullChargeCapacity,function(msg){
			self._fullChargeCapacity_mAh = (msg[1]<<8) + (msg[0]);
			console.log('FullChargeCapacity ' + self._fullChargeCapacity_mAh);
		});
	},300);

	setTimeout(function(){
		self._read16(BQ27510_AverageCurrent,function(msg){
			self._averageCurrent_mA = self.ui2i((msg[1]<<8) + (msg[0]));
			console.log('AverageCurrent ' + self._averageCurrent_mA);
		});
	},350);

	setTimeout(function(){
		self._read16(BQ27510_TimeToEmpty,function(msg){
			self._timeToEmpty_mn = (msg[1]<<8) + (msg[0]);
			console.log('TimeToEmpty ' + self._timeToEmpty_mn);
		});
	},400);
}


module.exports = FuelTankServer;
// Fuel Tank Library
//
// Author: Sheng Zhao
// Date: Jul-22-2014
// Email: shengzhao91@gmail.com
// Description: Derived from FuelTankLibrary.cpp in Energia authored by Rei Vilo
//              

$(document).ready(function() {
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
	
	function sleep(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
				break;
			}
		}
	}

	window.FuelTank = function(launchpad) {
	    console.log('Fuel Tank Object Created');

		this._temperature_oCx10;
		this._voltage_mV;
		this._flags;
		this._nominalAvailableCapacity_mAh;
		this._fullAvailableCapacity_mAh;
		this._remainingCapacity_mAh;
		this._fullChargeCapacity_mAh;
		this._averageCurrent_mA;
		this._timeToEmpty_mn;

		launchpad.i2cInit(BQ27510_I2C_Address);
	    
	    this._read16 = function(reg,callback){
	    	// sleep(100);	    	
			launchpad.i2cWrite(BQ27510_I2C_Address,[reg]);
			sleep(5);
			launchpad.i2cRead(BQ27510_I2C_Address, 2, callback);
		}

		this.ui2i = function(ui16){
			if (ui16 > 0x7FFF){
				ui16 = 0xFFFF - ui16;
				return (-ui16);
			} else {
				return ui16;
			}
		}
	}

	FuelTank.prototype.temperature_oCx10 = function(){
		return this._temperature_oCx10;
	}

	FuelTank.prototype.voltage_mV = function(){
		return this._voltage_mV;
	}

	FuelTank.prototype.flags = function(){
		return this._flags;
	}

	FuelTank.prototype.nominalAvailableCapacity_mAh = function(){
		return this._nominalAvailableCapacity_mAh;
	}

	FuelTank.prototype.fullAvailableCapacity_mAh = function(){
		return this._fullAvailableCapacity_mAh;
	}

	FuelTank.prototype.remainingCapacity_mAh = function(){
		return this._remainingCapacity_mAh;
	}

	FuelTank.prototype.fullChargeCapacity_mAh = function(){
		return this._fullChargeCapacity_mAh;
	}

	FuelTank.prototype.averageCurrent_mA = function(){
		return this._averageCurrent_mA;
	}

	FuelTank.prototype.timeToEmpty_mn = function(){
		return this._timeToEmpty_mn;
	}

	FuelTank.prototype.get = function(){
		var self = this;
		this._read16(BQ27510_Temperature,function(msg){
			self._temperature_oCx10 = ((msg[1]<<8) + (msg[0]) - 2730)/10;
		});
		setTimeout(function(){
			self._read16(BQ27510_Voltage,function(msg){
				self._voltage_mV = (msg[1]<<8) + (msg[0]);;
			})
		},50);
		setTimeout(function(){
			self._read16(BQ27510_Flags,function(msg){
				self._flags = (msg[1]<<8) + (msg[0]);
			});
		},100);
		setTimeout(function(){
			self._read16(BQ27510_NominalAvailableCapacity,function(msg){
				self._nominalAvailableCapacity_mAh = (msg[1]<<8) + (msg[0]);
			})
		},150);
		setTimeout(function(){
			self._read16(BQ27510_FullAvailableCapacity,function(msg){
				self._fullAvailableCapacity_mAh = (msg[1]<<8) + (msg[0]);
			})
		},200);
		setTimeout(function(){
			self._read16(BQ27510_RemainingCapacity,function(msg){
				self._remainingCapacity_mAh = (msg[1]<<8) + (msg[0]);
			})
		},250);
		setTimeout(function(){
			self._read16(BQ27510_FullChargeCapacity,function(msg){
				self._fullChargeCapacity_mAh = (msg[1]<<8) + (msg[0]);
			})
		},300);
		setTimeout(function(){
			self._read16(BQ27510_AverageCurrent,function(msg){
				self._averageCurrent_mA = self.ui2i((msg[1]<<8) + (msg[0]));
			})
		},350);
		setTimeout(function(){
			self._read16(BQ27510_TimeToEmpty,function(msg){
				self._timeToEmpty_mn = (msg[1]<<8) + (msg[0]);
			})
		},400);
	}
});
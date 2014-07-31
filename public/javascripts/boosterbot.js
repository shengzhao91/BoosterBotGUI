$(document).ready(function() { 
	console.log('Firmata BoosterBot');

	var socket = io();
	window.launchpad = new LaunchPad(socket);

	launchpad.getPortList(function(msg){
		$.each(msg, function(index, serialInfo) {
			$('#portListSelect').append(
				$('<option></option>').val(index).html(serialInfo.comName)
			);
		});
	});

	$connectBtn = $('#connectBtn');
	$disconnectBtn = $('#disconnectBtn');
	$appContent = $('#appContent');

	$connectBtn.click(function(){
		$connectBtn.attr("disabled", "disabled");     // disable connect button after clicked

		var selectedPort = $('#portListSelect :selected').text();
		console.log('Connect Port - ' + selectedPort);
		launchpad.connect(selectedPort, function(board){
			myboard = board;			// debug purpose
			initializeBoosterBot(board);			//initialize #pinDiv structure on client

			$connectBtn.hide().removeAttr("disabled"); //once connected, hide the connect button
			$disconnectBtn.show();				   //show disconnect button

			$appContent.show();
		});
	});

	$disconnectBtn.click(function(){
		$disconnectBtn.attr("disabled", "disabled");     // disable disconnect button after clicked
		launchpad.disconnect(function(){
			$disconnectBtn.hide().removeAttr("disabled"); //once disconnected, hide the disconnect button
			$connectBtn.show();				   //show connect button
		});

		//$appContent.hide();
		$startDrivingBtn.show();
		$stopDrivingBtn.hide();
	});


	$startDrivingBtn = $('#startDrivingBtn');
	$stopDrivingBtn = $('#stopDrivingBtn');
	$gaugeContainer = $('#gaugeContainer');

	$startDrivingBtn.click(function(){
		$startDrivingBtn.hide();
		$stopDrivingBtn.show();
		$gaugeContainer.show();

		touchInterval = setInterval(function(){
            coord = touchDrive(beta,gamma);
            $( "body" ).trigger('motorReady',coord);
        },250);
	});
	$stopDrivingBtn.click(function(){
		$startDrivingBtn.show();
		$stopDrivingBtn.hide();
		$gaugeContainer.hide();
		clearInterval(touchInterval);
		$( "body" ).trigger('motorReady',{left:0,right:0});
	})

	launchpad.analogRead(function(data){
		//console.log('analogReadRes: pin' + data.pin + ' - ' + data.value);
		$('#pin'+data.pin+' .pin-analog').html(data.value);
		// 	if (data.analogPin <= 4){
		// 	myBarChart.datasets[0].bars[data.analogPin].value = data.value;
		// 	console.log(data.analogPin);
		// 	myBarChart.update();
		// }
	});

	launchpad.digitalRead(function(data){
		//console.log('digitalReadRes: pin' + data.pin + ' - ' + data.value);
		$('#pin'+data.pin+' .pin-input').html(data.value?'HIGH':'LOW');
	});

	var leftForwardPin = 38;   
	var leftBackwardPin = 37;
	var rightForwardPin = 39;
	var rightBackwardPin = 40;

	var initializeBoosterBot = function(board){
		console.log('Connected to LaunchPad!');

		launchpad.setPinMode(leftForwardPin,  board.MODES.PWM); //Left Forward
		launchpad.setPinMode(leftBackwardPin, board.MODES.PWM); //Left Backward
		launchpad.setPinMode(rightForwardPin, board.MODES.PWM); //Right Forward
		launchpad.setPinMode(rightBackwardPin,board.MODES.PWM); //Right Backward

		$('body').on('motorReady',function(event, motor){

			console.log('L:' + motor.left + ', R:' + motor.right);

			if (motor.left < 0) {
				launchpad.analogWrite(leftForwardPin, -motor.left);
				launchpad.analogWrite(leftBackwardPin, 0);
			} else {
				launchpad.analogWrite(leftForwardPin, 0);
				launchpad.analogWrite(leftBackwardPin, motor.left);
			}

			if (motor.right < 0) {
				launchpad.analogWrite(rightForwardPin, -motor.right);
				launchpad.analogWrite(rightBackwardPin, 0);
			} else {
				launchpad.analogWrite(rightForwardPin, 0);
				launchpad.analogWrite(rightBackwardPin, motor.right);
			}
		});
	}

    // Touch for mobile devices
    function handleOrientation(event){
        var alpha = event.alpha;
         beta = event.beta;
         gamma = event.gamma;

        $('#alpha').html(Math.round(alpha));
        $('#beta').html(Math.round(beta));
        $('#gamma').html(Math.round(gamma));

        coord = touchDrive(beta,gamma);
        $('#leftWheel').html(coord.left);
        $('#rightWheel').html(coord.right);
    }
    window.addEventListener("deviceorientation",handleOrientation,true);

    function touchDrive(Beta,Gamma){
        window.power = 0;
        window.balance = 0;


        if (Math.abs(Beta)<=90) {
            power = (270+3*Gamma);
            balance = Beta;
        } else {
            if (Gamma > 70) {
                power = 0;
            } else {
                power = -50;
            }
        }

        power = 0;

        if (power > 255) {power=255}
        
        left = power + (2*balance);
        right = power - (2*balance);
        $('#power').html(Math.round(power));
        $('#balance').html(Math.round(balance*2));
        
        if (left>255) {left = 255;}
        if (right>255) {right = 255;}
        if (left<-255) {left = -255;}
        if (right<-255) {right = -255;}

        return {left:Math.round(left),right:Math.round(right)};
    }

    	window.initializeAnalogBarGraph = function(){
  //   	temp = $('canvas');
		// var width = $('canvas').parent().width();
		// $('canvas').attr('width',width)
		// console.log('clicked :' + width); 
		window.barChartData = {
		    labels: ["A0", "A1", "A2", "A3", "A4"],
		    datasets: [
		        {
		            label: "Analog Data",
		            fillColor: "rgba(220,220,220,0.5)",
		            strokeColor: "rgba(220,220,220,0.8)",
		            highlightFill: "rgba(220,220,220,0.75)",
		            highlightStroke: "rgba(220,220,220,1)",
		            data: [0,0,0,0,0]
		        }
		    ]
		};

		var ctx = $("#myChart").get(0).getContext("2d");
		window.myBarChart = new Chart(ctx).Bar(barChartData, {
			responsive : true,
			scaleBeginAtZero : true,
			scaleOverride: true, 
			scaleStartValue: 0, 
			scaleStepWidth: 800, 
			scaleSteps: 5,
			animationSteps: 5
		});
	}
});

	// $('#estopButton').click(function(){
	// 	launchpad.analogWrite(leftForwardPin,   0);
	// 	launchpad.analogWrite(leftBackwardPin,  0);
	// 	launchpad.analogWrite(rightForwardPin,  0);
	// 	launchpad.analogWrite(rightBackwardPin, 0);
	// });

	// var initializeFuelTank = function(launchpad){
	// 	ft = new FuelTank(launchpad);
	// 	setInterval(function(){
	// 		ft.get();
	// 		setTimeout(function(){
	// 			$('#FT_temperature').val(ft.temperature_oCx10());
	// 			$('#FT_voltage').val(ft.voltage_mV());
	// 			$('#FT_current').val(ft.averageCurrent_mA());
	// 			$('#FT_timeleft').val(ft.timeToEmpty_mn());
	// 			var percent = Math.round(ft.nominalAvailableCapacity_mAh()/ft.fullAvailableCapacity_mAh()*1000)/10;
	// 			if (percent>0 & percent<20){
	// 				$('#FT_Battery.progress-bar').removeClass().addClass('progress-bar progress-bar-danger')
	// 				.css('width', percent+'%').attr('aria-valuenow', percent).text(percent+'%');
	// 			} else if (percent<50){
	// 				$('#FT_Battery.progress-bar').removeClass().addClass('progress-bar progress-bar-warning')
	// 				.css('width', percent+'%').attr('aria-valuenow', percent).text(percent+'%');
	// 			} else if (percent<=100){
	// 				$('#FT_Battery.progress-bar').removeClass().addClass('progress-bar progress-bar-success')
	// 				.css('width', percent+'%').attr('aria-valuenow', percent).text(percent+'%');
	// 			} else {
	// 				$('#FT_Battery.progress-bar').removeClass().addClass('progress-bar')
	// 				.css('width', '0%').attr('aria-valuenow', 0).text(percent+'%');
	// 			}
	// 		}, 500);
	// 	},5000);
	// }

	// var initializeAnalogBarGraph = function(){
	// 	var width = $('canvas').parent().width();
	// 	$('canvas').attr('width',width)
	// 	console.log('clicked :' + width); 
	// 	window.barChartData = {
	// 	    labels: ["A0", "A1", "A2", "A3", "A4"],
	// 	    datasets: [
	// 	        {
	// 	            label: "Analog Data",
	// 	            fillColor: "rgba(220,220,220,0.5)",
	// 	            strokeColor: "rgba(220,220,220,0.8)",
	// 	            highlightFill: "rgba(220,220,220,0.75)",
	// 	            highlightStroke: "rgba(220,220,220,1)",
	// 	            data: [0,0,0,0,0]
	// 	        }
	// 	    ]
	// 	};

	// 	var ctx = $("#myChart").get(0).getContext("2d");
	// 	window.myBarChart = new Chart(ctx).Bar(barChartData, {
	// 		responsive : true,
	// 		scaleBeginAtZero : true,
	// 		scaleOverride: true, 
	// 		scaleStartValue: 0, 
	// 		scaleStepWidth: 400, 
	// 		scaleSteps: 11,
	// 		animationSteps: 5
	// 	});
	// }

	// if (data.analogPin <= 4)
	// myBarChart.datasets[0].bars[data.analogPin].value = data.value;
	// console.log(data.analogPin);
	// myBarChart.update();

			//initializeFuelTank(launchpad);
			//initializeAnalogBarGraph();

			// clearInterval(joystickInterval);
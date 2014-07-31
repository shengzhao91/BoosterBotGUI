$(document).ready(function() { 

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

    // $( "#analogJoystick" ).on('touchstart', function() {
    //     touchInterval = setInterval(function(){
    //         coord = touchDrive(beta,gamma);
    //         $( "#analogJoystick" ).trigger('motorReady',coord);
    //     },200);
    // });

    // $( "#analogJoystick" ).on('touchend touchcancel', function() {
    //     clearInterval(touchInterval);
    //     $('#leftWheel').html(0);
    //     $('#rightWheel').html(0);
    //     $( "#analogJoystick" ).trigger('motorReady',{left:0,right:0});
    // });


});

        // // holding to go forward
        // if (Math.abs(Beta)<=90) {
        //     left  = 1.5*Beta + (260+3*Gamma);
        //     right = -1.5*Beta + (260+3*Gamma);
        // }
        // else {
        //     if (Gamma > 70){
        //         left = 0;
        //         right = 0;
        //     } else if (Gamma > 0) {
        //         left = -50;
        //         right = -50;
        //     }
        // }



    // var mouseX = 0;
    // var mouseY = 0;
    // var joystickInterval;

    // var tankdrive = function (x, y) {
    //     // first Compute the angle in deg

    //     // First hypotenuse
    //     var z = Math.sqrt(x*x + y*y);
    //     // angle in radians
    //     rad = Math.acos(Math.abs(x)/z);
    //     // and in degrees
    //     angle = rad*180/Math.PI;

    //     // Now angle indicates the measure of turn
    //     // Along a straight line, with an angle o, the turn co-efficient is same
    //     // this applies for angles between 0-90, with angle 0 the co-eff is -1
    //     // with angle 45, the co-efficient is 0 and with angle 90, it is 1
    //     var tcoeff = -1 + (angle/90)*2;
    //     var turn = tcoeff * Math.abs(Math.abs(y) - Math.abs(x));
    //     turn = Math.round(turn*100)/100;

    //     // And max of y or x is the movement
    //     var move = Math.max(Math.abs(y),Math.abs(x));

    //     // First and third quadrant
    //     if( (x >= 0 && y >= 0) || (x < 0 &&  y < 0) ) {
    //         left = move;
    //         right = turn;
    //     } else {
    //         right = move;
    //         left = turn;
    //     }

    //     // Reverse polarity
    //     if(y < 0) {
    //         left = 0 - left;
    //         right = 0 - right;
    //     }
    //     return {left:Math.round(left), right:Math.round(right)};
    // }

    // $( "#analogJoystick" ).on('mousemove', function( event ) {
    //   var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
    //   var clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
    //   //console.log(pageCoords,clientCoords)
    //   mouseX = event.pageX;
    //   mouseY = event.pageY;
    // });

    // $( "#analogJoystick" ).on('mousedown', function() {
    //     joystickInterval = setInterval(function(){
    //         var thisDiv = $( "#analogJoystick" );
    //         var dx = (mouseX-thisDiv.offset().left)-255;
    //         var dy = -((mouseY-thisDiv.offset().top)-255);
    //         coord = tankdrive(dx,dy);
    //         console.log(coord.left, coord.right);
    //         $( "#analogJoystick" ).trigger('motorReady',coord);
    //     },200);
    // });

    // $( "#analogJoystick" ).on('mouseup', function() {
    //     clearInterval(joystickInterval);
    //     $( "#analogJoystick" ).trigger('motorReady',{left:0,right:0});
    // });


// var clamp = function(num, min, max) {
//     return num < min ? min : (num > max ? max : num);
// };

// joystick = new VirtualJoystick({
//     mouseSupport    : true,
//     stationaryBase  : true,
//     baseX       : 400,
//     baseY       : 400,
//     limitStickTravel: true,
//     stickRadius: 255
// });

// joystick.addEventListener('touchStart', function(){
//     console.log('down')
// })
// joystick.addEventListener('touchEnd', function(){
//     console.log('up')
// })

// var motorOut = {};

// setInterval(function(){
//     var outputEl    = document.getElementById('result');
//     var dx = clamp( joystick.deltaX(), -255, 255 );
//     var dy = clamp( joystick.deltaY(), -255, 255 );
    
    
//     if (joystick._pressed )
//     {
//         motorOut = tankdrive(dx,-dy);
//         //console.log('L:' + motorOut.left + ', R:' + motorOut.right);
//         $('#analogJoystick').trigger('motorOutReady',motorOut);
//     } else {
//         $('#analogJoystick').trigger('motorOutReady',{left:0,right:0});
//     }
        
// }, 1/30 * 5000);


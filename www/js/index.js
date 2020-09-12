/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var isDeviceReady = false; //Check variable to ensure Device ready condition
var watchID; //output variable that stores magnetic heading value
var x = 0, //variable to hold magnetic heading
    y = 0, //variable to hold the corresponding scaled pixel value 
    z = 0; //Variable to control blink rate

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("backbutton", onBackKeyDown, false);
        window.plugins.flashlight.switchOff(); //to swtich off the flasjlight during initialization
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        isDeviceReady = true; //checks if device is ready and sets the variable to true.
        document.getElementById("moreDetails").addEventListener("click", moreDetails, false);
        document.getElementById("workingDetails").addEventListener("click", workingDetails, false);
        var options = { //used in the following funciton to set the frequency at which the sensor value is read.
            frequency: 100 //Frequency of sensor reading
        };
        watchID = navigator.compass.watchHeading(app.successWatchCallback, app.errorWatchCallback, options); //Navigator function call
    },


    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    //Success call back of the watchHeading funciton call
    successWatchCallback: function(heading) {
        x = Math.round(heading.magneticHeading);
        //  x=265;	
        //var setpix = document.querySelector("circle");
        if (x >= 0 && x <= 180) { //to stay in the range 0 to 180
            y = Math.round((x / 180) * 250); // conversion of heading to pixels
            z = Math.round((x / 180) * 10); // to obtain corresponding blink rate
            app.blink(11 - z); // function call to blink at rate
            document.getElementById('circle').style.top = y + 'px'; //CSS property altering to set the style property top to y px.
            document.getElementById('circle').style.backgroundColor = 'blue'; // aletrs css property for sake of visual differentiation
        }
        // else if(x>180 && x<=359){
        // 	y=250;
        // 	window.plugins.flashlight.switchOff();
        // 	// setpix.setAttribute('style','top:'+y+'px','border:solid green');
        // 	document.getElementById('circle').style.top=y+'px';
        // 	document.getElementById('circle').style.backgroundColor='black';
        // }
        else { //outside the range 0-180
            y = 0;
            window.plugins.flashlight.switchOff(); //Switch off the flashlight
            document.getElementById('circle').style.top = y + 'px'; //CSS property alters
            document.getElementById('circle').style.backgroundColor = 'red'; //CSS property alters
        }
        var headingInfo = '';
        headingInfo += '<p>Heading:' + x + '</p>';
        headingInfo += '<p>pixel var:' + y + '</p>'
        headingInfo += '<p>blink rate:' + z + '</p>'

        document.getElementById('headingInformation').innerHTML = headingInfo; //Sending info back to HTML element in index.html
    },

    //Error callback of the watchHeading function call
    errorWatchCallback: function() {
        alert('compass error -' + error.code); //Error callback
    },

    //Blink rate function
    blink: function(rate) {
        // var index=0;
        window.plugins.flashlight.available(function(isAvailable) {
            if (isAvailable) {
                window.plugins.flashlight.switchOn();
                setTimeout(function() {
                    window.plugins.flashlight.switchOff();

                }, rate * 100);
            } else {
                alert('error-flashlight not available');
            }
        });

        // window.plugins.flashlight.switchOff();
        // window.setInterval(function(){
        // 	functions[index++]();
        // 	if(index==functions.length)
        // 		index=0;
        // } ,rate*1000); 
        // // window.setInterval(window.plugins.flashlight.switchOn(),rate*100)

    }

};

//Initialise var app
app.initialize();

//Checks for back key pressing
function onBackKeyDown(e) {
    e.preventDefault();
    alert('Back Button is Pressed!'); //Alert pops on screen
    navigator.compass.clearWatch(watchID); //Clears the values of magentic heading obtained
    window.plugins.flashlight.switchOff(); //ensures that flashlight is switched off
    navigator.app.exitApp(); //Navigator code to exit app

}

//Function that displays an alert for more details on app
function moreDetails() {
    alert("Done by: \nAmrith Venkat Kesavamoorthi\nMMC-00804869 \n\nMade using Cordova \n\nPlugins used: \n*Flashlight \n*Device Orientation  ");
}

//Function that displays an alert for working details of app
function workingDetails() {
    alert("->Changes in magentic heading in range 0-180(N-S through E) will be met with response in a CSS circle moving in corresponding pixel position attribute changed using JavaScript.\n\n->Between 180-360(S-N through W) there will be no changes in the circle element.\n\n->This is accompanied by blinking of flashlight in varying rates ");
}
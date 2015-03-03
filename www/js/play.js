var map, panorama, gpsTracker;
var dirService;
var playerMarker = null;
var zombies = [];
var timeSpent = 0;
var totalMoves = 0;
var playerBuffer = 180;
var timeInt;
var FPS = 5;
var fpsInt = 1000/FPS;
var zombieMoveDist = 0.00001;
var zombieDistributionRange = 3800;
var zombieAwareRadius = 500;
var zombieAsleepRadius = 700;
var zombieVisibleRadius = 150;
var zombiesInVisibleRadius = false;
var dieRadius = 5;
var aniFinish;
var aniAmt = 10;
var povAniInt;
var playerData;
var isPaused = false;
var healthPrice = 5;
var powerPrice = 5;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('Device ready!');
    },
};

function ReportFacility(pos, type) {
    $.ajax({
        url: 'http://robotex.altervista.org/facility-zero/report.php',
        data: { username: localStorage['username'], type: type, lat: pos.lat(), lng: pos.lng() },
        jsonp: 'callback',
        dataType: 'jsonp',
    }).done(function( data ) {
        alert('Messaggio del server: ' + data['message']);
    });
}

/**
 * The ReportControl adds a control to the map that recenters the map on Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
function ReportControl(controlDiv, map) {
  // Set CSS for the control wrapper
  var controlWrapper = document.createElement('div');
  controlWrapper.style.backgroundColor = 'white';
  controlWrapper.style.borderStyle = 'solid';
  controlWrapper.style.borderColor = 'gray';
  controlWrapper.style.borderWidth = '1px';
  controlWrapper.style.cursor = 'pointer';
  controlWrapper.style.textAlign = 'center';
  controlWrapper.style.width = '64px'; 
  controlWrapper.style.height = '64px';
  controlDiv.appendChild(controlWrapper);
  
  var reportControlButton = document.createElement('div');
  reportControlButton.style.width = '64px'; 
  reportControlButton.style.height = '64px';
  /* Change this to be the .png image you want to use */
  reportControlButton.style.backgroundImage = 'url("img/button/Report.png")';
  reportControlButton.style.backgroundSize = '64px 64px';
  reportControlButton.style.backgroundRepeat = 'no-repeat';
  controlWrapper.appendChild(reportControlButton);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(reportControlButton, 'click', function() {
      var type = prompt("Che tipo di barriera è?", "Passaggio pedonale");
      
      if (type != null) {
        ReportFacility(playerMarker.getPosition(), type);
      }
  });

}



function initialize() {

    var mapOptions = {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        draggable: false,
        disableDoubleClickZoom: true,
        streetView : panorama,
    };
    
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
    
      // Create the DIV to hold the control and
      // call the CenterControl() constructor passing
      // in this DIV.
      var reportControlDiv = document.createElement('div');
      var reportControl = new ReportControl(reportControlDiv, map);
      
  reportControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT].push(reportControlDiv);



    // Try HTML5 geolocation
    if(navigator.geolocation) {
        gpsTracker = navigator.geolocation.watchPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

            if (playerMarker === null)
            {
                var playerIcon = new google.maps.MarkerImage(
                    localStorage['sex'] == 'f' ? 'img/marker/player_female.png' : 'img/marker/player.png',
                    null, /* size is determined at runtime */
                    null, /* origin is 0,0 */
                    null, /* anchor is bottom center of the scaled image */
                    new google.maps.Size(62, 68)
                );  
                
                // Place player's marker
                playerMarker = new google.maps.Marker({
                  position: pos,
                  map: map,
                  icon: playerIcon,
                });
                
                map.bindTo('center', playerMarker, 'position');

                map.setCenter(pos);
            }
            playerMarker.setPosition(pos);
        }, function() {
            alert("Nessuna posizione rilevata.");
        }, {
            enableHighAccuracy: true, 
            maximumAge        : 30000, 
            timeout           : 27000
        });
    } else {
        // Browser doesn't support Geolocation
        alert('Il tuo browser non supporta la geolocalizzazione!');
    }
}

///////////
$( initialize );
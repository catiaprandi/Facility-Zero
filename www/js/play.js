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

    // Try HTML5 geolocation
    if(navigator.geolocation) {
        gpsTracker = navigator.geolocation.watchPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

            if (playerMarker === null)
            {
                playerData = JSON.parse(localStorage['data']);
                
                var playerIcon = new google.maps.MarkerImage(
                    playerData['sex'] == 'f' ? 'img/marker/player_female.png' : 'img/marker/player.png',
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
                
                playerMarker.circle = new google.maps.Circle({
                    map: map,
                    center: playerMarker.getPosition(),
                    radius: zombieVisibleRadius,
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

function toggle_visibility(id) {
   var e = document.getElementById(id);
   isPaused = !isPaused;
   if(e.style.display == 'block')
      e.style.display = 'none';
   else
      e.style.display = 'block';
}



///////////
$( initialize );
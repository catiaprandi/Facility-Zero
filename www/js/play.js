var map, gpsTracker;
var playerMarker = null;
var statsControlButton;

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
        url: 'http://137.204.74.226/mPass_gamification/report2.php',
        data: { username: localStorage['username'], type: type, lat: pos.lat(), lng: pos.lng() },
        jsonp: 'callback',
        dataType: 'jsonp',
    }).done(function( data ) {
        alert('Messaggio del server: ' + data['message']);
        LoadStats(true);
    });
}

function LoadStats(showAlert) {
    if (showAlert === undefined) {
        showAlert = false;
    }
    $.ajax({
        url: 'http://137.204.74.226/mPass_gamification/stats.php',
        data: { username: localStorage['username'] },
        jsonp: 'callback',
        dataType: 'jsonp',
    }).done(function( data ) {
        localStorage['reports_count'] = data['reports_count'];
        localStorage['passed_users_count'] = data['passed_users_count'];
        localStorage['best_reports_count'] = data['best_reports_count'];
        localStorage['ranking'] = data['ranking'];
        
        if (localStorage['sex'] == 'm') {
            if(data['reports_count'] < 5)
                statsControlButton.style.backgroundImage = 'url("img/button/badge/male_default.png")';
            else if(data['reports_count'] >= 5 && data['reports_count'] < 6)
                statsControlButton.style.backgroundImage = 'url("img/button/badge/male_5report.png")';
            else if(data['reports_count'] >= 6 && data['reports_count'] < 8)
                statsControlButton.style.backgroundImage = 'url("img/button/badge/male_6report.png")';
            else if(data['reports_count'] >= 8 && data['reports_count'] < 10)
                statsControlButton.style.backgroundImage = 'url("img/button/badge/male_8report.png")';
            else if(data['reports_count'] >= 10)
                statsControlButton.style.backgroundImage = 'url("img/button/badge/male_10report.png")';
        } else {
            if(data['reports_count'] < 5)
                statsControlButton.style.backgroundImage = 'url("img/button/badge/female_default.png")';
            else if(data['reports_count'] >= 5 && data['reports_count'] < 6)
                statsControlButton.style.backgroundImage = 'url("img/button/badge/female_5report.png")';
            else if(data['reports_count'] >= 6 && data['reports_count'] < 8)
                statsControlButton.style.backgroundImage = 'url("img/button/badge/female_6report.png")';
            else if(data['reports_count'] >= 8 && data['reports_count'] < 10)
                statsControlButton.style.backgroundImage = 'url("img/button/badge/female_8report.png")';
            else if(data['reports_count'] >= 10)
                statsControlButton.style.backgroundImage = 'url("img/button/badge/female_10report.png")';
        }
        if (showAlert) {
            if(data['reports_count'] < 5)
                alert('Ti mancano ancora ' + (5 - data['reports_count']) + ' report per superare l\'attività. Già ' + data['passed_users_count'] + ' utenti hanno superato l\'attività');
            else if (data['reports_count'] == 5)
                alert('Attività superata! Continua a fare report per ottenere badges! Il primo in classifica ne ha fatti ' + data['best_reports_count']);
            else
                alert('La tua posizione in classifica è: ' + data['ranking'] + ' Continua a fare report per ottenere badges! Il primo in classifica ne ha fatti ' + data['best_reports_count'] );
        }
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
  controlWrapper.style.backgroundColor = 'yellow';
  controlWrapper.style.borderStyle = 'solid';
  controlWrapper.style.borderColor = 'gray';
  controlWrapper.style.borderWidth = '1px';
  controlWrapper.style.cursor = 'pointer';
  controlWrapper.style.textAlign = 'center';
  controlWrapper.style.width = '128px'; 
  controlWrapper.style.height = '256px';
  controlDiv.appendChild(controlWrapper);
  
  var reportControlButton = document.createElement('div');
  reportControlButton.style.width = '128px'; 
  reportControlButton.style.height = '128px';
  /* Change this to be the .png image you want to use */
  reportControlButton.style.backgroundImage = 'url("img/button/Report.png")';
  reportControlButton.style.backgroundSize = '128px 128px';
  reportControlButton.style.backgroundRepeat = 'no-repeat';
  controlWrapper.appendChild(reportControlButton);
  
  statsControlButton = document.createElement('div');
  statsControlButton.style.width = '128px'; 
  statsControlButton.style.height = '128px';
  /* Change this to be the .png image you want to use */
  statsControlButton.style.backgroundImage = 'url("img/button/heart_0.png")';
  statsControlButton.style.backgroundSize = '128px 128px';
  statsControlButton.style.backgroundRepeat = 'no-repeat';
  controlWrapper.appendChild(statsControlButton);

  // Setup the click event listeners
  google.maps.event.addDomListener(reportControlButton, 'click', function() {
      var type = prompt("Che tipo di barriera è?", "Passaggio pedonale");
      
      if (type != null) {
        ReportFacility(playerMarker.getPosition(), type);
      }
  });
  
  google.maps.event.addDomListener(statsControlButton, 'click', function() {
      LoadStats(false);
      alert('Reports inviati: ' + localStorage['reports_count'] +'\nUtenti che hanno passato l\'attività: ' + localStorage['passed_users_count'] + '\nMaggior numero di report da un utente: ' + localStorage['best_reports_count'] + '\nPosizione in classifica globale: ' + localStorage['ranking']);
  });
}



function initialize() {


    var mapOptions = {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        //draggable: false,
        //disableDoubleClickZoom: true,
    };
    
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
    
      // Create the DIV to hold the control and
      // call the CenterControl() constructor passing
      // in this DIV.
      var reportControlDiv = document.createElement('div');
      var reportControl = new ReportControl(reportControlDiv, map);
      
  reportControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT].push(reportControlDiv);


    LoadStats();


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
                
                //map.bindTo('center', playerMarker, 'position');

                map.setCenter(pos);
            }
            playerMarker.setPosition(pos);
        }, function(error) {
            if (error.code == error.PERMISSION_DENIED)
                alert("Non hai abilitato i permessi!");
            else
                alert("Nessuna posizione rilevata.\n" + "[" + error.code + "] " + error.message);
        }, {
            enableHighAccuracy: false, 
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
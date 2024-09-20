//API key: AIzaSyBgehOoxV6Et08ZbH84JomRn8jKdkhxm44
var count_markers = 0;
var pointers_marked = new Array();
var Users = {
  all: [],
  get: function (id, exist) {
    var user = Users.all.filter(function (u) { return u.id == id; })[0];
    return user ? user : (!exist) ? Users.add(id) : false;
  },
  add: function (id) {
    if (!id) return console.warn('No id provided for user');

    var user = {
      position: {},
      timer: {
        gpsID: null,
        timerID: null,
        ready: {
          get: function () {
            return user.timer.timerID === null;
          }
        },
        start: function (id) {
          if (user.timer.gpsID != null) return user.timer;
          user.timer.gpsID = id;
          user.timer.timerID = setTimeout(function () {
            user.timer.stop();
          }, 20000);
        },
        stop: function (id) {
          if (user.timer.timerID == null) return user.timer;
          clearTimeout(user.timer.timerID);
          navigator.geolocation.clearWatch(user.timer.gpsID);
          console.log('timers cleared for user:', user);
          //alert('Positionen för Läge ' + user.id + ' har fastställts med en felmarginal på ca ' + Math.round(user.position.accuracy) + ' meter.');
          if (!user.marker) user.marker = createMarker(user.position, 'pos' + user.id, user.id);
          user.marker.setPosition(user.position);
          $('#pos' + user.id + '_lat').val(user.results.lat_swe);
          $('#pos' + user.id + '_lon').val(user.results.lng_swe);
          $('#pos' + user.id + '_lat_label').html('Sweref (+/- ' + user.position.accuracy + 'm)');
          user.timer.gpsID = null;
          user.timer.timerID = null;
        }
      },
      id: id
    };

    Users.all.push(user);
    return user;
  },
  remove: function (id) {
    var user = Users.get(id, true);
    if (!user) return true;
    Users.splice(Users.indexOf(user), 1);
    user = null;
  }
};

function createMarker (pos, id, num) {
  marker = new google.maps.Marker({ position: pos, id: id });
  currentUser.marker = marker;
  $('#map_canvas').gmap('addMarker', marker).click(function (event) {
    $('#map_canvas').gmap('openInfoWindow', { 'content': '<h4>Läge: ' + num + '</h4><p>Latitud/Longitud: ' + this.getPosition() + '</p>' }, this);
    $('#map_canvas').gmap('get', 'map').panTo(this.getPosition());
  });
  return marker;
}

$(document).ready(function () {
  //console.log(navigator.geolocation);
//Let's make the required fields pretty
  $('label .required').parent().next().css('background-color', '#fde1e1');
  $('label .required').parent().next().blur(function () {
    if ($(this).val() != '') {
      $(this).css('background-color', '#ffffff');
    }
  });

  //Please note - this is my first attempt at this
  //It is kept simple and can possibly be extended in the future with drag and drop, individual icons, adding interface to map
  //See http://jquery-ui-map.googlecode.com/svn/trunk/demos/jquery-google-maps-geocoding.html for instance - next time.
  //There might also come a time - quite soon I guess - when the client wants to take a screenshot of the google map
  //This might be helpful if that is the case - http://html2canvas.hertzen.com/
  //Problem with this is that it will depend entirely on the resolution in the maps window and being able to fit points together that might not otherwise be helpful.
  //I say - stick to posting the lat and lng which can be entered through any GPS device - much more useful.
  //$('#control').hide();
  // let's start with some variables
  var myLat = '56.996514';
  var myLong = '15.28499';
  var myGLatLong = myLat + ',' + myLong;
  //OK cool, now let's pick an element and initialise the gmap plugin. Takes options for center, zoom level, what to show, and running a callback function
  $('#map_canvas').gmap(
    {
      'center': myGLatLong,
      'zoom': 8,
      'disableDefaultUI': true,
      'panControl': true,
      'zoomControl': true,
      'panControlOptions': {
        'position': google.maps.ControlPosition.RIGHT_TOP
      },
      'zoomControlOptions': {
        'position': google.maps.ControlPosition.LEFT_TOP

      },
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeIds: ['roadmap', 'satellite', 'hybrid']
      }
    }
  )
    .bind('init', function (event, map) {
      //Lets add search control later
      /*$('#map_canvas').gmap('addControl', 'control', google.maps.ControlPosition.BOTTOM_CENTER);
      $('#control').show();
      $('#search_map').on('click',function(){
        var searchloc = $('#search_loc').val();
        //Lets search
        $('#map_canvas').gmap('search', { 'address': searchloc }, function(results, status) {
               if ( status === 'OK' ) {
                    $('#map_canvas').gmap('get', 'map').panTo(results[0].geometry.location);
               }
           });
      });*/

      function handleLocationError (browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }

      // Bind the map to a click event
      $(map).click(function (event) {
        count_markers++;
        // var firstMatch = $('form input.textfield[id$="_lat"]').filter('input[value=""]:first');
        var firstMatch = $('form input.textfield[id$="_lat"]').filter(function () {return this.value == '';}).first();

        //Check if there are any empty input boxes before adding a marker - otherwise return notice
        if (firstMatch.val() == undefined) {
          alert('Du kan bara ha 5 markörer på kartan');
        } else {
          var posID = firstMatch.attr('id').substr(0, 4);
          var posNum = firstMatch.attr('id').substr(3, 1);

          // add marker to the map

          $('#map_canvas').gmap('addMarker', { id: posID, 'position': event.latLng }).click(function () {

            $('#map_canvas').gmap('openInfoWindow', { 'content': '<h4>Läge: ' + posNum + '</h4><p>Latitud/Longitud: ' + this.getPosition() + '</p>' }, this);

          });
          //   $('#map_canvas').gmap('addBounds', event.latLng);
          //Then center on it
          if (count_markers == 1) {
            $('#map_canvas').gmap('addBounds', event.latLng);
            $('#map_canvas').gmap('get', 'map').setOptions({ 'zoom': 12 });
          } else {
            $('#map_canvas').gmap('addBounds', event.latLng);
          }

          $('#map_canvas').gmap('get', 'map').panTo(event.latLng);

          //   console.log(event.latLng.lng());

          //console.log('https://api.loceo.se/v1/geodetic/rt90?callback=?&lat=' + event.latLng.lat() + '&lng=' + event.latLng.lng());

          swedish_params('sweref_99_tm');
          var cords = geodetic_to_grid(event.latLng.lat(), event.latLng.lng());
          //var lat_swe = Math.round(cords[0]);
          var lat_swe = cords[0];
          //var lng_swe = Math.round(cords[1]);
          var lng_swe = cords[1];

          swedish_params('rt90_2.5_gon_v');
          var cords = geodetic_to_grid(event.latLng.lat(), event.latLng.lng());
          //var lat_rt = Math.round(cords[0]);
          var lat_rt = cords[0];
          //var lng_rt = Math.round(cords[1]);
          var lng_rt = cords[1];
          pointers_marked[posID] = true;

          $('#' + posID + '_lat').val(lat_swe);
          $('#' + posID + '_lon').val(lng_swe);
          $('#' + posID + '_lon_type').val('Sweref');
          $('#' + posID + '_lat_type').val('Sweref');
          $('#' + posID + '_lat_label').html('Sweref');
          $('#' + posID + '_lon_label').html('Sweref');
          // $('#'+posID+'_lat_rt').val(lat_rt);
          // $('#'+posID+'_lon_rt').val(lng_rt);
          $('#' + posID + '_add').hide();
          $('#' + posID + '_remove').show().css('display', 'inline-block');

        }
      });
    });

  $('.getMyPos').on('click', function () {
    // Try HTML5 geolocation.
    currentUser = Users.get($(this).data('id'));
    if (!currentUser.timer.ready) return;
    let button = this;
    let spinner = this.querySelector('.spinner-border');
    console.log(spinner);

    if (navigator.geolocation) {
      // Trigger spinner
      if (spinner) {
        spinner.classList.remove('d-none');
        button.setAttribute('disabled', true);
      }

      var chosen_marker = $(this).data('id');
      chosen_marker = 'pos' + chosen_marker + '_lat';
      // var firstMatch = $('form input.textfield[id$="_lat"]').filter('input[value=""]:first');
      // var firstMatch = $('form input.textfield[id$="_lat"]').filter(function(){return this.value == ''}).first();

      var firstMatch = $('form input.textfield[id$="' + chosen_marker + '"]').filter(function () {return this.value == '';}).first();
      //id$ = '4';

      //firstMatch = $('form input.textfield[id$="_lat"]');
      //firstMatch = $('form input[name="' + chosen_marker + '"]');
      //console.log (firstMatch);
      //Check if there are any empty input boxes before adding a marker - otherwise return notice
      if (firstMatch.val() == undefined) {
        alert('Du har redan angett denna position');
      } else {
        var posID = firstMatch.attr('id').substr(0, 4);
        var posNum = firstMatch.attr('id').substr(3, 1);

        // add marker to the map
        var posId = navigator.geolocation.watchPosition(function (position) {
          console.log(position);

          var info = '';
          for (p in position.coords) {
            info += p + ' = ' + position.coords[p] + '\n';
          }

          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };

          if (currentUser.position.accuracy && currentUser.position.accuracy < pos.accuracy) return;
          //alert(info);
          currentUser.position = pos;

          position = new google.maps.LatLng(pos.lat, pos.lng);
          if (!currentUser.marker) {
            count_markers++;
            currentUser.marker = createMarker(position, posID, posNum);
          } else {
            $('#map_canvas').gmap('get', 'markers > ' + posID + '').setPosition(position);
          }
          //infoWindow.setPosition(pos);
          //infoWindow.setContent('Location found.');
          //infoWindow.open(map);
          //$('#map_canvas').gmap.setCenter(pos);

          //Then center on it
          if (count_markers == 1) {
            $('#map_canvas').gmap('addBounds', position);
            $('#map_canvas').gmap('get', 'map').setOptions({ 'zoom': 12 });
          } else {
            $('#map_canvas').gmap('addBounds', position);
          }

          $('#map_canvas').gmap('get', 'map').panTo(position);

          swedish_params('sweref_99_tm');
          var cords = geodetic_to_grid(position.lat(), position.lng());
          //var lat_swe = Math.round(cords[0]);
          var lat_swe = cords[0];
          //var lng_swe = Math.round(cords[1]);
          var lng_swe = cords[1];
          //console.log('cords', cords, 'lat_swe', lat_swe, 'lng_swe', lng_swe);

          swedish_params('rt90_2.5_gon_v');
          var cords = geodetic_to_grid(position.lat(), position.lng());
          console.log('cords', cords);
          //var lat_rt = Math.round(cords[0]);
          var lat_rt = cords[0];
          //var lng_rt = Math.round(cords[1]);
          var lng_rt = cords[1];
          pointers_marked[posID] = true;
          //console.log('cords', cords, 'lat_rt', lat_rt, 'lng_rt', lng_rt);
          currentUser.results = {};
          currentUser.results.lat_swe = lat_swe;
          currentUser.results.lng_swe = lng_swe;
          $('#' + posID + '_lat').val(lat_swe);
          $('#' + posID + '_lon').val(lng_swe);
          $('#' + posID + '_lon_type').val('Sweref');
          $('#' + posID + '_lat_type').val('Sweref');
          $('#' + posID + '_lat_label').html('Sweref (kalibrerar) &nbsp;&nbsp;&nbsp;<i class="fa fa-spinner spinner" aria-hidden="true"></i>');
          $('#' + posID + '_lon_label').html('Sweref');
          // $('#'+posID+'_lat_rt').val(lat_rt);
          // $('#'+posID+'_lon_rt').val(lng_rt);
          $('#' + posID + '_add').hide();
          $('#' + posID + '_remove').show().css('display', 'inline-block');

          $('#' + posID + '_lat').val(lat_swe);
          $('#' + posID + '_lon').val(lng_swe);

          // Remove spinner
          if (spinner) {
            spinner.classList.add('d-none');
            button.removeAttribute('disabled');
          }
        }, function () {
          alert('Det verkar som att du nekat till att vi får använda din position på denna sida tidigare. Du måste acceptera att vi använder vi din position för att kunna använda denna funktion');
          //handleLocationError(true, infoWindow, map.getCenter());
        }, { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 });

        currentUser.timer.start(posId);
      }

    } else {
      // Browser doesn't support Geolocation
      alert('Din webbläsare stödjer inte att vi använder din position.');
      //handleLocationError(false, infoWindow, map.getCenter());
    }

    /*
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
    }
    */

  });

  $('.coord').on('keyup change', function () {
    var posID = $(this).attr('id').substr(0, 4);
    var posNum = $(this).attr('id').substr(3, 1);
    var posType = $(this).attr('id').substr(5, 7);
    var x_swe = $('#' + posID + '_lat').val();
    var y_swe = $('#' + posID + '_lon').val();

    if (x_swe != '' && y_swe != '') {
      if ((x_swe >= 6110000 && x_swe <= 7680000) && (y_swe >= 260000 && y_swe <= 920000)) {     //Sweref params
        swedish_params('sweref_99_tm');
        var cords = grid_to_geodetic(x_swe, y_swe);
        var lat = cords[0];
        var lng = cords[1];

        if (pointers_marked[posID] == true) {
          removeMarker(posID);
        }
        pointers_marked[posID] = true;
        $('#' + posID + '_lon_type').val('Sweref');
        $('#' + posID + '_lat_type').val('Sweref');
        $('#' + posID + '_lat_label').html('Sweref');
        $('#' + posID + '_lon_label').html('Sweref');
      } else if ((x_swe >= 6110000 && x_swe <= 7680000) && (y_swe >= 1200000 && y_swe <= 1900000)) {    // RT 90 Params
        swedish_params('rt90_2.5_gon_v');
        var cords = grid_to_geodetic(x_swe, y_swe);
        var lat = cords[0];
        var lng = cords[1];

        if (pointers_marked[posID] == true) {
          removeMarker(posID);
        }
        pointers_marked[posID] = true;
        $('#' + posID + '_lon_type').val('RT90');
        $('#' + posID + '_lat_type').val('RT90');
        $('#' + posID + '_lat_label').html('RT90');
        $('#' + posID + '_lon_label').html('RT90');
      } else {
        if (pointers_marked[posID] == true)
          removeMarker(posID);
        return false;
      }

      count_markers++;
      $('#map_canvas').gmap('addMarker', {
        'id': posID,
        'position': new google.maps.LatLng(lat, lng)
      }).click(function (event) {
        $('#map_canvas').gmap('openInfoWindow', { 'content': '<h4>Läge: ' + posNum + '</h4><p>Latitud/Longitud: ' + this.getPosition() + '</p>' }, this);
        $('#map_canvas').gmap('get', 'map').panTo(this.getPosition());
      });

      var origin = new google.maps.LatLng(lat, lng);
      // Set auto zoom to map
      if (count_markers == 1) {
        $('#map_canvas').gmap('addBounds', origin);
        $('#map_canvas').gmap('get', 'map').setOptions({ 'zoom': 12 });
      } else {
        $('#map_canvas').gmap('addBounds', origin);
      }

      // set map center
      $('#map_canvas').gmap('get', 'map').setOptions({ 'center': origin });

      $('#' + posID + '_add').hide();
      $('#' + posID + '_remove').show();
    }
  });

  //For fun - allow the user to input latitude and longitude in the inputs
  //A link on the end allows you to add the marker to the map

  //   $('.add_marker').on('click',function(e) {
  //     e.preventDefault();
  //     count_markers++;
  //     var posID = $(this).attr('id').substr(0,4);
  //     var posNum = $(this).attr('id').substr(3,1);
  //     var x_swe = $('#'+posID+'_lat').val();
  //     var y_swe = $('#'+posID+'_lon').val();

  //     if ((x_swe >=6110000 && x_swe <=7680000) && (y_swe >= 260000 && y_swe <= 920000)) {     //Sweref params
  //       swedish_params('sweref_99_tm');
  //       var cords = grid_to_geodetic(x_swe, y_swe);
  //       var lat = cords[0];
  //       var lng = cords[1];

  //       $('#'+posID+'_lon_type').val('Sweref');
  //       $('#'+posID+'_lat_type').val('Sweref');
  //       $('#'+posID+'_lat_label').html('Sweref');
  //       $('#'+posID+'_lon_label').html('Sweref');
  //     } else if ((x_swe >=6110000 && x_swe <=7680000) && (y_swe >= 1200000 && y_swe <= 1900000)) {    // RT 90 Params
  //       swedish_params('rt90_2.5_gon_v');
  //       var cords = grid_to_geodetic(x_swe, y_swe);
  //       var lat = cords[0];
  //       var lng = cords[1];

  //       $('#'+posID+'_lon_type').val('RT90');
  //       $('#'+posID+'_lat_type').val('RT90');
  //       $('#'+posID+'_lat_label').html('RT90');
  //       $('#'+posID+'_lon_label').html('RT90');
  //     } else {
  //       // removeMarker(posID);
  //       return false;
  //     }

  //     $('#map_canvas').gmap('addMarker', { 'id': posID, 'position': new google.maps.LatLng(lat, lng) }).click(function(event) {
  //       $('#map_canvas').gmap('openInfoWindow', { 'content': '<h4>Läge: '+posNum+'</h4><p>Latitud/Longitud: '+this.getPosition()+'</p>' }, this);
  //       $('#map_canvas').gmap('get', 'map').panTo(this.getPosition());
  //     });

  //     var origin = new google.maps.LatLng(lat, lng);
  //     // Set auto zoom to map
  //     if (count_markers == 1){
  //     $('#map_canvas').gmap('addBounds', origin);
  //     $('#map_canvas').gmap('get','map').setOptions({'zoom':12});
  //   }
  //   else {
  //     $('#map_canvas').gmap('addBounds', origin);
  //   }

  //     // set map center
  //     $('#map_canvas').gmap('get','map').setOptions({'center':origin});

  //     $('#'+posID+'_add').hide();
  //     $('#'+posID+'_remove').show();
  //   });

  //Let's not forget - if people empty the box the marker should be removed too
  $('form input.textfield[id$="_lat_swe"],form input.textfield[id$="_lon_swe"],form input.textfield[id$="_lat_rt"],form input.textfield[id$="_lon_rt"]').keyup(function () {
    if (this.value == 'undefined' || this.value == '') {
      var posID = $(this).attr('id').substr(0, 4);
      $('#map_canvas').gmap('get', 'markers > ' + posID + '').setMap(null);
      $('#' + posID + '_add').show();
      $('#' + posID + '_remove').hide();
    }

  });

  //Another link allows you to remove the marker
  $('.remove_marker').on('click', function (e) {
    e.preventDefault();
    var posID = $(this).attr('id').substr(0, 4);
    $('#' + posID + '_lat, #' + posID + '_lon').val('');
    removeMarker(posID);
    return false;
  });
  //Speaking of links - when you click this link - remove all markers and empty the input boxes for positions ONLY
  $('.reset_markers').on('click', function (e) {
    e.preventDefault();
    count_markers = 0;
    for (var i = 1; pointers_marked['pos' + i]; i++)
      pointers_marked['pos' + i] = false;
    $('#map_canvas').gmap('clear', 'markers');
    $('#map_canvas').gmap('set', 'bounds', null);
    $('#positions input.textfield').val('');
    $('.label_map').html('');
    $('a[id$="_add"]').show();
    $('a[id$="_remove"]').hide();
  });
  //when you click the reset button on the end of the form - reset all inputs and remove markers as well
  $('#reset_form').on('click', function () {
    count_markers = 0;
    $('#map_canvas').gmap('clear', 'markers');
    $('#map_canvas').gmap('set', 'bounds', null);
    $('#positions input.textfield').val('');
    $('a[id$="_add"]').show();
    $('a[id$="_remove"]').hide();
  });

});

function removeMarker (posID) {
  count_markers--;
  pointers_marked[posID] = false;
  if (count_markers == 0)
    $('#map_canvas').gmap('set', 'bounds', null);

  $('#map_canvas').gmap('get', 'markers > ' + posID + '').setMap(null);
  $('#' + posID + '_remove').hide();
  $('#' + posID + '_lat_label, #' + posID + '_lon_label').html('');
  $('#' + posID + '_lon_type, #' + posID + '_lat_type').val('');
  var currentUser = Users.get(posID.slice(-1));
  currentUser.marker = null;
}

//56.96807845983778
//16.40696875976562

//1. 6318232
//2. 1493921

// Init

/**
 * Loceo Javascript Library
 * Copyright 2012 All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be found at http://loceo.se
 */

(function ($) {
  var mets = {
    init: function (opt) {

    },
    city: function (opt, callback) {
      return this.each(function () {
        $(this).keyup(function () {
          var len = $(this).val().length;
          if (len > 4 && len < 10) {
            var args = { q: $(this).val() };
            if (opt.key) {
              args.key = opt.key;
            }
            var jqxhr = $.getJSON('https://loceo.se/api/city?callback=?', args,
              function (data) {
                if (typeof callback == 'function') {
                  callback.call(this, data);
                }
              });
            if (jqxhr.error) {
              jqxhr.error(function () {

              });
            }
          }
        });
      });
    },
    wgs84: function (opt) {
      if (opt.x != null && opt.y != null && opt.targetLat != null && opt.targetLng != null) {
        return this.each(function () {
          $(opt.target).val('');
          var args = { 'x': $(opt.x).val(), 'y': $(opt.y).val() };
          if (opt.key) {
            args.key = opt.key;
          }
          var jqxhr = $.getJSON('https://loceo.se/api/wgs84?callback=?', args, function (data) {
            $(opt.targetLat).val(data[0]);
            $(opt.targetLng).val(data[1]);
          });
          if (jqxhr.error) {
            jqxhr.error(function () {
              $(opt.targetLat).val('Whups!');
              $(opt.targetLng).val('Whups!');
            });
          }
        });
      }
    },
    autocomplete: function (opt, callback) {
      return this.each(function () {
        var synclock = false;
        $(this).keyup(function () {
          var len = $(this).val().length;
          if (len > 3) {
            var thsi = $(this);
            var args = { 'q': $(this).val() };
            if (opt.key != null) {
              args.key = opt.key;
            }
            if (opt.lang != null) {
              args.lang = opt.lang;
            }
            if (!synclock) {
              synclock = true;
              var jqxhr = $.getJSON('https://loceo.se/api/geocode?callback=?', args, function (data) {
                if ($('#loceo-autocomplete')) {
                  $('#loceo-autocomplete').remove();
                }
                var s = $('<div id="loceo-autocomplete" class="loceo-autocomplete-box" />');
                var l = $('<ul class="loceo-autocomplete-list" />');
                if (data.features != null) {
                  var len = data.features.length;
                  for (var i = 0; i < len; i++) {
                    $('<li class="loceo-autocomplete-item" />', {
                      text: data.features[i].properties.description,
                      'data-lat': data.features[i].geometry.coordinates[0],
                      'data-lng': data.features[i].geometry.coordinates[1],
                      'data-name': data.features[i].properties.description
                    }).appendTo(l);
                  }
                  if (len == 0)
                    $('<li class="loceo-autocomplete-text" />', { text: 'Can\'t help you :(' }).appendTo(l);
                  $('<li class="loceo-autocomplete-branding" />', { text: 'Empowered by Loceo' }).appendTo(l);
                }
                l.appendTo(s);
                s.appendTo('body');
                offset = thsi.offset();
                s.offset({ top: (parseInt(offset.top) + 2 + parseInt(thsi.outerHeight())), left: offset.left });
                $('.loceo-autocomplete-item').click(function (e) {
                  thsi.val($(this).text());
                  $('#loceo-autocomplete').remove();
                  if (typeof callback == 'function') {
                    callback.call(this, {
                      lat: $(this).data('lat'),
                      lng: $(this).data('lng'),
                      name: $(this).data('name')
                    });
                  }
                });
                s.css({ width: thsi.outerWidth() });
                $('#loceo-autocomplete').mouseleave(function () {
                  callback.call(this, {
                    lat: $('.loceo-autocomplete-item:first').data('lat'),
                    lng: $('.loceo-autocomplete-item:first').data('lng'),
                    name: $('.loceo-autocomplete-item:first').data('name')
                  });
                  $(this).remove();
                });
                synclock = false;
              });
              if (jqxhr.error) {
                jqxhr.error(function () {

                });
              }
            }
          }
        });
      });
    }
  };
  $.fn.loceo = function (m) {
    if (mets[m]) {
      return mets[m].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof m === 'object' || !m) {
      return mets.init.apply(this, arguments);
    } else {
      $.error('Method ' + m + ' does not exist on jQuery.loceo');
    }
  };
})(jQuery);
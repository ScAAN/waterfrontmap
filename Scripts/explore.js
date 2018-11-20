// ---------------------------
// |  ** EXPLORE  ** |
// ---------------------------

/* code for the exploration tab,
* 1) query point coordinates
* 2) geo tagged search
* 3) display information based on (1) and (2)
*/

var global_last_point = [0, 0];

function query_point(e){
  // on click query point, display info, and draw markers

  // pointer
  map.getCanvas().style.cursor = 'pointer';

  // query rendered features based on click
  var queried = map.queryRenderedFeatures(e.point)

  // show point information
  show_explore_info(queried)

  // get point longitude and lattitude
  var coords = e.lngLat;
  var current_point = [coords.lng, coords.lat];
  queried[0].geometry.coordinates = current_point;
  queried[0].geometry.type = "Point";

  // display coordinates in geocoder
  updategeocoder(coords);

  // set 'single-point' marker to be at point coordinates
  map.getSource('single-point').setData(queried[0].geometry);
  // for debugging: display clicked coordinate
  //console.log(queried[0].geometry)

  if (current_point[0]==global_last_point[0] && current_point[1]==global_last_point[1]){
    // clear explore box
    var blankgeojson = {
      "type": "FeatureCollection",
      "features": []
    };
    map.getSource('single-point').setData(blankgeojson);
    $('map-overlay-info').innerHTML = '';
    current_point = [0, 0];
  }
  global_last_point = current_point;
}

function show_explore_info(queried){
  // show info from points queried by marker

  // empty innerHTML so we can add to it!
  $('map-overlay-info').innerHTML = '';

  // unnest query object
  var arrObj = queried.map(a => a.properties);
  var data = arrObj.reduce(function(result, currentObject) {
    for(var key in currentObject) {
      if (currentObject.hasOwnProperty(key)) {
        result[key] = currentObject[key];
      }
    }
    return result;
  }, {});

  // go through layer names and list queried valies
  //for (var layerName in toggleableLegendIds) {
  // explore information is sorted by property length for readability (see longtext)
  for (i=0;i<exploreIdOrder.length;i++) {
    var layerName = exploreIdOrder[i];
    var dataKey = dataNames[layerName];
    var divtext = '';
    if ((typeof data[dataKey] != 'undefined') && ((data[dataKey]>0 && isNaN(data[dataKey])==0) || layerName.includes("Zoning"))){
      if (layerName.includes("Zoning")) {
          var codelink = '<a href="https://www.google.com/search?q=nyc+zoning+code+' +  (data['ZONEDIST']) + '"> Code: ' +  (data['ZONEDIST'])  + ' </a>';
          divtext =  '' + layerName + ':<b> ' + (data[dataKey]) + ' (' + codelink + ')</b> ';
      } else if (layerName.includes("Percent")) {
        divtext =  '' + layerName + ':<b> ' +  Math.round(data[dataKey]) + '%'+'</b>';
      } else if (layerName.includes("Income")) {
        divtext =  '' + layerName + ':<b> ' + '$' + Math.round(data[dataKey])+'</b>';
      } else {
        divtext =  '' + layerName + ':<b> ' + Math.round(data[dataKey])+'</b>';
      }
    } else {
      if (layerName.includes("Bulk")||layerName.includes("FEMA Sea Level Rise")) {
        // do nothing
      } else {
        divtext =  '' + layerName + ':<b> ' + '---'+'</b>';
      }
    }
    document.getElementById('map-overlay-info').innerHTML = document.getElementById('map-overlay-info').innerHTML + '<div>' + divtext + '</div>';
  }
  divtext = '<small>"</small>--<small>": no data or not enough data</small>'
  document.getElementById('map-overlay-info').innerHTML = document.getElementById('map-overlay-info').innerHTML + '<div>' + divtext + '</div>';
}


function updategeocoder(coords){
  $('geocoder_input').value=coords.lat + " , " + coords.lng;
}

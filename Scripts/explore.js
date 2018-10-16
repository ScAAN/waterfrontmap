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
  // on click query point, display info, and draw marker

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

  // set 'single-point' marker to be at point coordinates
  map.getSource('single-point').setData(queried[0].geometry);
  console.log(queried[0].geometry)

  if (current_point[0]==global_last_point[0] && current_point[1]==global_last_point[1]){
    // clear explore box
    var blankgeojson = {
      "type": "FeatureCollection",
      "features": []
    };
    map.getSource('single-point').setData(blankgeojson);
    document.getElementById('map-overlay-info').innerHTML = '';
    current_point = [0, 0];
  }
  global_last_point = current_point;
}

function show_explore_info(queried){
  // show info from points queried by marker

  // empty innerHTML so we can add to it!
  document.getElementById('map-overlay-info').innerHTML = '';

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
  for (var layerName in toggleableLegendIds) {
    var dataKey = dataNames[layerName];
    var divtext = '';
    if ((typeof data[dataKey] != 'undefined') && ((data[dataKey]>0 && isNaN(data[dataKey])==0) || layerName.includes("Zoning"))){
      if (layerName.includes("Zoning")) {
        divtext =  '' + layerName + ':<b> ' + (data[dataKey]) +'</b>';
      } else if (layerName.includes("Percent")) {
        divtext =  '' + layerName + ':<b> ' +  Math.round(data[dataKey]) + '%'+'</b>';
      } else if (layerName.includes("Income")) {
        divtext =  '' + layerName + ':<b> ' + '$' + Math.round(data[dataKey])+'</b>';
      } else {
        divtext =  '' + layerName + ':<b> ' + Math.round(data[dataKey])+'</b>';
      }
    } else {
      if (layerName.includes("Bulk")) {
        // do nothing
      } else {
        divtext =  '' + layerName + ':<b> ' + '---'+'</b>';
      }
    }
    document.getElementById('map-overlay-info').innerHTML = document.getElementById('map-overlay-info').innerHTML + '<div>' + divtext + '</div>'
  }
  divtext = '<small>"</small>--<small>": no data or not enough data</small>'
  document.getElementById('map-overlay-info').innerHTML = document.getElementById('map-overlay-info').innerHTML + '<div>' + divtext + '</div>'
}


  // ---------------------------
  // |  ** G E O C O D E R  ** |
  // ---------------------------

  // geocoder code! adds a geocoder and marker
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    // declare geocoder zoom level
    zoom: 11,

    // force geocoder results to be in bounds of NYC-ish
    bbox: [-74.274300, 40.487423, -73.693891, 40.858796],

    // apply a client side filter to further limit results to those strictly within NYC
    filter: function (item) {
      // returns true if item contains New York region
      return item.context.map(function (i) {
        // id is in the form {index}.{id} per https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
        // this example attempts to find the `region` named `New York`
        return (i.id.split('.').shift() === 'region' && i.text === 'New York');
      }).reduce(function (acc, cur) {
        return acc || cur;
      });
    }
  });

  // put geocoder into div ('geocoder')
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map))

  // Listen for the `geocoder.input` event that is triggered when a user
  // makes a selection and add a symbol that matches the result.
  geocoder.on('result', function(e) {
    // project geocoder result to "point"
    var point = map.project([e.result.center[0], e.result.center[1]]);
    // query rendered features at point
    var queried = map.queryRenderedFeatures(point);
    // show the point box
    show_explore_info(queried)
    // draw the marker
    map.getSource('single-point').setData(e.result.geometry);
  });

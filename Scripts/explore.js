// ---------------------------
// |  ** EXPLORE  ** |
// ---------------------------

/* code for the exploration tab,
* 1) query point coordinates
* 2) geo tagged search
* 3) display information based on (1) and (2)
*/

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
  queried[0].geometry.coordinates = [coords.lng, coords.lat];
  queried[0].geometry.type = "Point";

  // set 'single-point' marker to be at point coordinates
  map.getSource('single-point').setData(queried[0].geometry);
}

function show_explore_info(queried){
  // show info from points queried by marker

  // empty innerHTML so we can add to it!
  overlay.innerHTML = '';
  var shownData = [];

  // loop over returned rendered features ("queried")
  for (var j = 0; j < queried.length; j++){
    var data = queried[j].properties

    for (var i = 0; i < Object.keys(dataNames).length; i++) {
      var dataKey = Object.keys(dataNames)[i];
      // if we haven't already found this data and it's not undefined
      var dataDisplay = document.createElement('div');
      if (shownData.indexOf(dataKey) == -1 && typeof(data[dataKey]) != 'undefined') {
        if (dataNames[dataKey].includes('Percent')){
          if (data[dataKey] > 0) {
            dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>' + Math.round(data[dataKey]) + ' %';
          } else {
            dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>'  + '<small>not enough data</small>';
          }
          shownData.push(dataKey)
        } else if (dataNames[dataKey].includes('income')){
          if (data[dataKey] > 0) {
            dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>' + '$ ' + Math.round(data[dataKey]);
          } else {
            dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>'  + '<small>not enough data</small>';
          }
          shownData.push(dataKey)
        } else {
          dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>' + data[dataKey];
          shownData.push(dataKey)
        }
        overlay.appendChild(dataDisplay);
      } else {
        if (shownData.indexOf(dataKey) == -1 && dataNames[dataKey].includes('Hurricane') && typeof(data[Object.keys(dataNames)[0]]) != 'undefined'){
          if (data[dataKey] > 0) {
            dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>' + Math.round(data[dataKey]);
          } else {
            dataDisplay.innerHTML = '<b>' + dataNames[dataKey] + '</b>'  + 'none';
          }
          shownData.push(dataKey)
          overlay.appendChild(dataDisplay);
        }
      }
    }}
    overlay.style.display = 'block';
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

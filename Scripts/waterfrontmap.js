mapboxgl.accessToken = 'pk.eyJ1IjoiYmlsbGJyb2QiLCJhIjoiY2o5N21wOWV5MDFlYjJ5bGd4aW9jZWwxNiJ9.LpT502DJ1ruuPRLp3AW_ow';
var map = new mapboxgl.Map({
  container: 'map',
  style: './Assets/light.json',
  center: [-73.9978, 40.7209],
  zoom: 10,
  legendControl: {
    position: 'bottomright'
  },
  minZoom: 10,
  maxZoom: 13
});

var overlay = document.getElementById('map-overlay-info');

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-left');
map.on('load', function () {
  // add a source layer and default styling for a single point.
  map.addSource('single-point', {
    "type": "geojson",
    "data": {
      "type": "FeatureCollection",
      "features": []
    }
  });

  // display marker for geocoder, this is a symbol (marker-15)
  map.addLayer({
    "id": "point",
    "source": "single-point",
    "type": "symbol",
    "layout": {
      "icon-image": "marker-15",
      "icon-allow-overlap": true,
      "icon-size":1.5,
    }
  });


  map.moveLayer("water", "road-trunk")

  map.addSource('vector_data', {
    type: 'vector',
    url: 'mapbox://billbrod.7693fb16'
  })

  // from
  // https://github.com/mapbox/mapbox-gl-js/issues/5040#issuecomment-321688603;
  // apparently duplicating the source to have a separate
  // source for the hover effect improves performance. not
  // sure why that works, but whatever
  map.addSource('vector_data-hover', {
    type: 'vector',
    url: 'mapbox://billbrod.7693fb16'
  })

  // remove poi and road labels
  map.removeLayer("road-label-sm");
  map.removeLayer("road-label-med");
  map.removeLayer("road-label-large");


  // Add a background pattern
  map.addLayer({
  	"id": "BKG",
  	"type": "background",
  	"paint":{
  	"background-pattern": "diag-16"
  	}
  },'water')

  map.addLayer({
    "id": "Zoning",
    "type": "fill",
    "source": 'vector_data',
    "source-layer": 'nyzd',
    "layout": {"visibility":'visible'},
    "paint": {
      "fill-opacity": 0,
      "fill-color": {
        'property': 'human_readable_zone',
        'type': 'categorical',
        "stops": [
          ['Residential', '#EDAD08'],
          ['New York City Parks', '#0F8554'],
          ['Manufacturing', '#94346E'],
          ['Commercial', '#CC503E'],
          ['Mixed manufacturing and residential', '#E17C05'],
          ['Battery Park City', '#666666']
        ]
      }
    }
  }, 'water');

  map.addLayer({
    "id": "Hurricane Storm Surge Zones",
    "type": "fill",
    "source": "vector_data",
    "source-layer": 'storm_surge_min',
    "layout": {"visibility":'visible'},
    "paint": {
      "fill-opacity": 0,
      "fill-color": {
        'property': 'CATEGORY',
        'type': 'categorical',
        "stops": [
          [1, '#d7301f'],
          [2, '#fc8d59'],
          [3, '#fdcc8a'],
          [4, '#fef0d9']
        ]
      }
    }
  }, 'water');

  map.addLayer({
    "id": "Percent People of Color",
    "type": "fill",
    "source": 'vector_data',
    "source-layer": "reduced_census",
    "layout": {"visibility":'visible'},
    "paint": {
      "fill-opacity": 1,
      "fill-color": {
        'property': 'Perc_POC_P003009',
        'type': 'interval',
        'stops': [
          [-10, 'rgba(0, 0, 0, 0)'],
          [0, '#feebe2'],
          [21, '#fbb4b9'],
          [41, '#f768a1'],
          [66, '#c51b8a'],
          [91, '#7a0177']
        ]
      }
    }
  }, 'water');

  map.addLayer({
    "id": "Median Household Income",
    "type": "fill",
    "source": 'vector_data',
    "source-layer": "reduced_census",
    "layout": {"visibility":'visible'},
    "paint": {
      "fill-opacity": 0,
      "fill-color": {
        'property': 'Median Household Income',
        'type': 'interval',
        'stops': [
          [-10, 'rgba(0, 0, 0, 0)'],
          [0, '#006837'],
          [18001, '#31a354'],
          [39301, '#78c679'],
          [52301, '#addd8e'],
          [67601, '#d9f0a3'],
          [115301, '#ffffcc']
        ]
      }
    }
  }, 'water');

  map.addLayer({
    "id": "Percent of Families Below Poverty Line",
    "type": "fill",
    "source": 'vector_data',
    "source-layer": "reduced_census",
    "layout": {"visibility":'visible'},
    "paint": {
      "fill-opacity": 0,
      "fill-color": {
        'property': '% of Families Below Poverty Level',
        'type': 'interval',
        'stops': [
          [-10, 'rgba(0, 0, 0, 0)'],
          [0, '#fee5d9'],
          [21, '#fcae91'],
          [36, '#fb6a4a'],
          [51, '#de2d26'],
          [66, '#a50f15']
        ]
      }
    }
  }, 'water');

  map.addLayer({
    "id": "Bulk Storage Sites",
    "type": "symbol",
    "source": "vector_data",
    "source-layer": 'TRI_converted',
    "layout": {
      "icon-image": "toxic-15",
      "icon-allow-overlap": true,
      "visibility": 'none',
      "icon-size":.7,
    },
    "paint":{"icon-opacity":.9}
  });

  map.addLayer({
    "id": "MOSF",
    "type": "symbol",
    "source": "vector_data",
    "source-layer": 'MOSF_converted',
    "layout": {
      "icon-image": "oil-15",
      "icon-allow-overlap": true,
      "visibility": 'none',
      "icon-size":.7,
    },
    "paint":{"icon-opacity":.9}
  });

  map.addLayer({
    "id": "CBS",
    "type": "symbol",
    "source": "vector_data",
    "source-layer": 'CBS_converted',
    "layout": {
      "icon-image": "trash-bag-15",
      "icon-allow-overlap": true,
      "visibility": 'none',
      "icon-size":.7,
    },
    "paint":{"icon-opacity":.9}
  });

  map.addLayer({
    "id": "SUPERFUND2",
    "type": "symbol",
    "source": "vector_data",
    "source-layer": 'SUPERFUND2_converted',
    "layout": {
      "icon-image": "pollution-15",
      "icon-allow-overlap": true,
      "visibility": 'none',
      "icon-size":.7,
    },
    "paint":{"icon-opacity":.9}
  });


  map.addLayer({
    "id": "SMIA",
    "type": "line",
    "source": "vector_data",
    "source-layer": 'smia',
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "#000000",
      "line-width": 3
    }
  },'Bulk Storage Sites');

  map.addLayer({
    "id": "SMIA-buffer",
    "type": "line",
    "source": "vector_data",
    "source-layer": 'SMIA_halfmilebuffer_full',
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "#000000",
      "line-width": 2,
      "line-dasharray": [1, 3]
    }
  },'Bulk Storage Sites');

  map.addLayer({
    "id": "SMIAfill",
    "type": "fill",
    "source": "vector_data",
    "source-layer": 'SMIA_halfmilebuffer_full',
    "paint": {
      "fill-color": "#000000",
      "fill-opacity": 0
    }
  },'Bulk Storage Sites');

  map.addLayer({
    "id": "SMIAhover",
    "type": "fill",
    "source": "vector_data-hover",
    "source-layer": 'SMIA_halfmilebuffer_full',
    "paint": {
      "fill-color": "#000000",
      "fill-opacity": .25,
    },
    "filter": ["==", "SMIA_Name", ""]
  },'Bulk Storage Sites');

  map.addLayer({
      "id": "Hurricane Evacuation Zones",
      "type": "fill",
      "source": "vector_data",
      "source-layer": 'Hurricane-Evacuation-Zones',
      "layout": {'visibility': 'visible'},
      "paint": {
	  "fill-opacity": 0,
	  "fill-color": {
              'property': 'hurricane',
              'type': 'categorical',
              "stops": [
		  ['X', 'rgba(0, 0, 0, 0)'],
		  ['1', '#ed3724'],
		  ['2', '#f48120'],
		  ['3', '#ffde17'],
		  ['4', '#bed630'],
		  ['5', '#72be44'],
		  ['6', '#00a78d']
              ]
	  }
      }
  }, 'water');


  map.addSource('uninsured', {
      type: 'geojson',
      data: './Data/uninsured_converted.geojson'
  })

  map.addLayer({
    "id": "Percent Uninsured",
    "type": "fill",
    "source": 'uninsured',
    "paint": {
      "fill-opacity": 0,
      "fill-color":
      {
       'property': 'perc_uninsured',
       'type': 'interval',
       'stops': [
         [-10, 'rgba(0, 0, 0, 0)'],
         [0, '#e7f0fa'],
         [5, '#c6dbef'],
         [10, '#8dc1dd'],
         [15, '#4f9bcb'],
         [20, '#2070b4'],
         [25, '#08468b']
       ]
     }
   }
 }, 'water');

 map.addLayer({
   "id": "Percent Uninsured Unreliable",
   "type": "fill",
   "source": 'uninsured',
   "paint": {
     "fill-opacity": 0,
     "fill-pattern": "hatch-64"
  },
  "filter": ["==","unreliable",1]
}, 'water','Percent Uninsured');

});

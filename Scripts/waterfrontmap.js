mapboxgl.accessToken = 'pk.eyJ1IjoiYmlsbGJyb2QiLCJhIjoiY2o5N21wOWV5MDFlYjJ5bGd4aW9jZWwxNiJ9.LpT502DJ1ruuPRLp3AW_ow';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Assets/light.json?optimize=true',
  center: [-73.9978, 40.7209],
  zoom: 10,
  legendControl: {
    position: 'bottomright'
  },
  minZoom: 10,
  maxZoom: 13
});

// fullscreen control
// put it in a div, named "mapbox-ctrl-fs" in a container "mapbox-container-fs"
var ctrl_fullscreen = new mapboxgl.FullscreenControl();
document.getElementById('fullscreenbutton').appendChild(ctrl_fullscreen.onAdd(map))
var fs_element = document.querySelector('[aria-label="Toggle fullscreen"]');
fs_element.id="mapbox-ctrl-fs";
var fs_container = fs_element.parentNode;
fs_container.id ="mapbox-container-fs"

// navigation control
// put it in the bottom left
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-left');

// Scale Control
// https://www.mapbox.com/mapbox-gl-js/api/#scalecontrol
/* currently I am just letting mapbox position it automatically -
   to put it in a div check out the geocoder control
   If you're having trouble styling check the mapbox style sheet for scale ctrl
*/
var scale_control = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
});
//map.addControl(scale);
document.getElementById('scale-control').appendChild(scale_control.onAdd(map));

// geocoder control
// put it in "geocoder" div
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
  // project geocoder result to "point" and query features
  var point = map.project([e.result.center[0], e.result.center[1]]);
  var queried = map.queryRenderedFeatures(point);
  // show the explore box and draw marker
  show_explore_info(queried)
  map.getSource('single-point').setData(e.result.geometry);
});


// check if map style is loaded
map.on('style.load', () => {
  const waiting = () => {
    if (!map.isStyleLoaded()) {
      setTimeout(waiting, 200);
    } else {
      map_init(1);
    }
  };
  waiting();
});


/* -------------------------
         ADD LAYERS
----------------------------
 after map loads add layers and run menu_init(1) when finished
*/
map.on('load', function () {
  // add a source layer and default styling for a single point.
  map.addSource('single-point', {
    "type": "geojson",
    "data": {
      "type": "FeatureCollection",
      "features": []
    }
  });

  map.addSource('sealevel2050', {
    "type": "geojson",
    "data": "./Data/SeaLevelRise2050.geojson"
  });
  map.addSource('sealevel2020', {
    "type": "geojson",
    "data": "./Data/SeaLevelRise2020.geojson"
  });


    // display marker for geocoder, this is a symbol (marker-15)
    map.addLayer({
      "id": "point",
      "source": "single-point",
      "type": "symbol",
      "layout": {
        "icon-image": "noun_location_border_filled",
        "icon-allow-overlap": true,
        "text-allow-overlap": true,
        "icon-size":.4,
        "icon-offset":[0,-50],
      }
    });

    map.addLayer({
      "id": "water2",
      "type": "fill",
      "source": "mapbox://mapbox.mapbox-streets-v6",
      "source-layer": "water",
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "fill-color": "#d6d6d6"
      },
      "metadata": {
        "mapbox:group": "1444850923457.5469"
      },
      "interactive": true
    },'road-label-sm');

    map.addSource('vector_data', {
      type: 'vector',
      url: 'mapbox://billbrod.data'
    })

    // from
    // https://github.com/mapbox/mapbox-gl-js/issues/5040#issuecomment-321688603;
    // apparently duplicating the source to have a separate
    // source for the hover effect improves performance. not
    // sure why that works, but whatever
    map.addSource('vector_data-hover', {
	type: 'vector',
	url: 'mapbox://billbrod.data'
    })

    // remove poi and road labels
    map.removeLayer("road-label-sm");
    map.removeLayer("road-label-med");
    map.removeLayer("road-label-large");
    // restrict labels to new York
    //map.setFilter('state_label',["!=",'Perc_POC_P003009',null])


    /*
    //trying to get rid of labels outside of new york
    var maplayers = map.getStyle().layers;
    var layerIds = maplayers.map(function (layer) {
    if (layer.id.includes("label")){
    return layer.id;
  }
});

var labelIds = layerIds.filter(function (el) {
return el != null;
});

for (i=0;i<labelIds.length;i++){
//map.setFilter(labelIds[i],["==",['has', 'Perc_POC_P003009'],true])
}

*/

// Add a background pattern
/*
map.addLayer({
"id": "BKG",
"type": "background",
"paint":{
"background-pattern": "diag-64"
}
},'water')
*/

map.addLayer({
  "id": "Zoning",
  "type": "fill",
  "source": 'vector_data',
  "source-layer": 'nyzd',
  "layout": {"visibility":'visible'},
  "paint": {
    "fill-opacity": 0,
    "fill-outline-color": {
      'property': 'human_readable_zone',
      'type': 'categorical',
      "stops": [
        ['Residential', '#E17C05'],
        ['New York City Parks', '#E17C05'],
        ['Manufacturing', '#E17C05'],
        ['Commercial', '#E17C05'],
        ['Mixed manufacturing and residential', '#EDAD08'],
        ['Battery Park City', '#E17C05']
      ]
    },
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
}, 'water2');

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
}, 'water2');

map.addLayer({
  "id": "Percent People of Color",
  "type": "fill",
  "source": 'vector_data',
  "source-layer": "reduced_census",
  "layout": {"visibility":'visible'},
  "paint": {
    "fill-opacity": 0,
    "fill-outline-color":{
      'property': 'Perc_POC_P003009',
      'type': 'interval',
      'stops': [
        [0, '#fbb4b9'],
        [21, '#f768a1'],
        [41, '#c51b8a'],
        [66, '#7a0177'],
        [91, '#c51b8a']
      ]
    },
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
}, 'water2');

map.addLayer({
  "id": "Percent People of Color Hatch",
  "type": "fill",
  "source": 'vector_data',
  "source-layer": "reduced_census",
  "layout": {"visibility":'visible'},
  "paint": {
    "fill-opacity": 1,
    "fill-pattern": "diag-64"
  },
  "filter": ["==",'Perc_POC_P003009',-10]
}, 'water2','Percent People of Color');


map.addLayer({
  "id": "Median Household Income",
  "type": "fill",
  "source": 'vector_data',
  "source-layer": "reduced_census",
  "layout": {"visibility":'visible'},
  "paint": {
    "fill-opacity": 0,
    "fill-outline-color":{
      'property': 'Median Household Income',
      'type': 'interval',
      'stops': [
        [0, '#31a354'],
        [18001, '#006837'],
        [39301, '#31a354'],
        [67601, '#78c679'],
        [115301, '#c2e699']
      ]
    },
    "fill-color": {
      'property': 'Median Household Income',
      'type': 'interval',
      'stops': [
        [-10, 'rgba(0, 0, 0, 0)'],
        [0, '#006837'],
        [18001, '#31a354'],
        [39301, '#78c679'],
        [67601, '#c2e699'],
        [115301, '#ffffcc']
      ]
    }
  }
}, 'water2');

map.addLayer({
  "id": "Median Household Income Hatch",
  "type": "fill",
  "source": 'vector_data',
  "source-layer": "reduced_census",
  "layout": {"visibility":'visible'},
  "paint": {
    "fill-opacity": 0,
    "fill-pattern": "diag-64"
  },
  "filter": ["==",'Median Household Income',-10]
}, 'water2','Median Household Income');


map.addLayer({
  "id": "Percent of Families Below Poverty Line",
  "type": "fill",
  "source": 'vector_data',
  "source-layer": "reduced_census",
  "layout": {"visibility":'visible'},
  "paint": {
    "fill-opacity": 0,
    "fill-outline-color":{
      'property': '% of Families Below Poverty Level',
      'type': 'interval',
      'stops': [
        [0, '#fcae91'],
        [21, '#fb6a4a'],
        [36, '#de2d26'],
        [51, '#a50f15'],
        [66, '#de2d26']
      ]
    },
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
}, 'water2');

map.addLayer({
  "id": "Percent of Families Below Poverty Line Hatch",
  "type": "fill",
  "source": 'vector_data',
  "source-layer": "reduced_census",
  "layout": {"visibility":'visible'},
  "paint": {
    "fill-opacity": 0,
    "fill-pattern": "diag-64"
  },
  "filter": ["==",'% of Families Below Poverty Level',-10]
}, 'water2','Percent of Families Below Poverty Line');


map.addLayer({
  "id": "Bulk Storage Sites",
  "type": "symbol",
  "source": "vector_data",
  "source-layer": 'TRI_converted',
  "layout": {
    "icon-image": "mh_toxic3",
    "icon-allow-overlap": true,
    "text-allow-overlap": true,
    "visibility": 'none',
    "icon-size":.25,
  },
  "paint":{"icon-opacity":1}
},'point');

map.addLayer({
  "id": "MOSF",
  "type": "symbol",
  "source": "vector_data",
  "source-layer": 'MOSF_converted',
  "layout": {
    "icon-image": "mh_oil3",
    "icon-allow-overlap": true,
    "text-allow-overlap": true,
    "visibility": 'none',
    "icon-size":.25,
  },
  "paint":{"icon-opacity":1}
},'point');

map.addLayer({
  "id": "CBS",
  "type": "symbol",
  "source": "vector_data",
  "source-layer": 'CBS_converted',
  "layout": {
    "icon-image": "mh_chem3",
    "icon-allow-overlap": true,
    "text-allow-overlap": true,
    "visibility": 'none',
    "icon-size":.25,
  },
  "paint":{"icon-opacity":1}
},'point');

map.addLayer({
  "id": "SUPERFUND2",
  "type": "symbol",
  "source": "vector_data",
  "source-layer": 'SUPERFUND2_converted',
  "layout": {
    "icon-image": "mh_super3",
    "icon-allow-overlap": true,
    "text-allow-overlap": true,
    "visibility": 'none',
    "icon-size":.25,
  },
  "paint":{"icon-opacity":1}
},'point');

map.addLayer({
  "id": "Sea Level Rise 2050",
  "type": "fill",
  "source": "sealevel2050",
  "paint": {
    "fill-color": "#03a9f4",
    "fill-opacity": 0
  }
},'water2','Bulk Storage Sites','SUPERUND2','CBS','MOSF');

map.addLayer({
  "id": "Sea Level Rise 2020",
  "type": "fill",
  "source": "sealevel2020",
  "paint": {
    "fill-color": "#3f51b5",
    "fill-opacity": 0
  }
},'water2','Bulk Storage Sites','SUPERUND2','CBS','MOSF');


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
},'Bulk Storage Sites','SUPERUND2','CBS','MOSF');

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
},'Bulk Storage Sites','SUPERUND2','CBS','MOSF');

/*
map.addLayer({
"id": "SMIAfill-color",
"type": "fill",
"source": "vector_data",
"source-layer": 'SMIA_halfmilebuffer_full',
"paint": {
"fill-opacity": .5,
"fill-color": {
'property': 'SMIA_Name',
'type': 'categorical',
"stops": [
["Brooklyn Navy Yard", '#f44336'],
["Kill Van Kull", '#9c27b0'],
["Newtown Creek", '#ff9800'],
["Red Hook",'#8bc34a'],
["South Bronx","#03a9f4"],
["Staten Island West Shore","#ffc107"],
["Sunset Park","#3f51b5"]
]
}
}
},'SMIA','SMIA-buffer','Bulk Storage Sites','SUPERUND2','CBS','MOSF');
*/

// display marker for SMIAs
map.addLayer({
  "id": "SMIAnumbers",
  "source": "vector_data",
  "source-layer": "smia_coordinates",
  "type": "symbol",
  "layout": {
    "icon-image": "{Icon}",
    "icon-size":.35,
    "visibility":"none"
  }
});

map.addLayer({
  "id": "SMIAfill",
  "type": "fill",
  "source": "vector_data",
  "source-layer": 'SMIA_halfmilebuffer_full',
  "paint": {
    "fill-color": "#000000",
    "fill-opacity": 0
  }
},'Bulk Storage Sites','SUPERUND2','CBS','MOSF');

map.addLayer({
  "id": "SMIAhover",
  "type": "fill",
  "source": "vector_data-hover",
  "source-layer": 'SMIA_halfmilebuffer_full',
  "paint": {
    "fill-color": "#000000",
    "fill-opacity": .5,
  },
  "filter": ["==", "SMIA_Name", ""]
},'Bulk Storage Sites','SUPERUND2','CBS','MOSF','SMIAnumbers');

map.addLayer({
  "id": "Hurricane Evacuation Zones",
  "type": "fill",
  "source": "vector_data",
  "source-layer": 'HurricaneEvacuationZones',
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
}, 'water2');


map.addLayer({
  "id": "Percent Uninsured",
  "type": "fill",
   "source": "vector_data",
   "source-layer": "CDdata_converted",
  "paint": {
    "fill-opacity": 0,
    "fill-outline-color":{
      'property': 'perc_uninsured',
      'type': 'interval',
      'stops': [
        [0, '#c6dbef'],
        [5, '#8dc1dd'],
        [10, '#4f9bcb'],
        [15, '#2070b4'],
        [20, '#08468b'],
        [25, '#2070b4']
      ]
    },
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
}, 'water2');

map.addLayer({
  "id": "Percent Uninsured Unreliable",
  "type": "fill",
  "source": "vector_data",
   "source-layer": "CDdata_converted",
  "paint": {
    "fill-opacity": 0,
    "fill-pattern": "hatch-64"
  },
  "filter": ["==","unreliable",1]
}, 'water2','Percent Uninsured');

map.addLayer({
  "id": "Percent Uninsured Hatch",
  "type": "fill",
  "source": "vector_data",
   "source-layer": "CDdata_converted",
  "paint": {
    "fill-opacity": 0,
    "fill-pattern": "diag-64"
  },
  "filter": ["==","perc_uninsured",-10]
}, 'water2','Percent Uninsured');

map.addLayer({
  "id": "Heat Vulnerability Index",
  "type": "fill",
  "source": "vector_data",
   "source-layer": "CDdata_converted",
  "paint": {
    "fill-opacity": 0,
    "fill-outline-color": {
      'property': 'HVI_score',
      'type': 'interval',
      'stops': [
        [1, '#fecc5c'],
        [2, '#fd8d3c'],
        [3, '#f03b20'],
        [4, '#bd0026'],
        [5, '#f03b20']
      ]
    },
    "fill-color":
    {
      'property': 'HVI_score',
      'type': 'interval',
      'stops': [
        [-10, 'rgba(0, 0, 0, 0)'],
        [1, '#ffffb2'],
        [2, '#fecc5c'],
        [3, '#fd8d3c'],
        [4, '#f03b20'],
        [5, '#bd0026']
      ]
    }
  }
}, 'water2');

map.addLayer({
  "id": "Heat Vulnerability Index Hatch",
  "type": "fill",
  "source": "vector_data",
  "source-layer": "CDdata_converted",
  "paint": {
    "fill-opacity": 0,
    "fill-pattern": "diag-64"
  },
  "filter": ["==","HVI_score",-10]
}, 'water2','HVI');

// call map_init here so we know when all layers are loaded!
// (since map.loaded and map._loaded don't work)
map_init(1);

});

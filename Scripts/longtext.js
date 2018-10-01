/*
Text processing script!
- Requests text from general_text.geojson
- Make important variables from this
- Manually specify which layers belong in which tabs (toggleableLayerIds)
*/

// request the general text
var toggleableLegendIds = {};
var requestURL = 'https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Processing/Text/general_text.json';
var request2 = new XMLHttpRequest();
request2.open('GET', requestURL);
request2.responseType = 'json';
request2.send();

// now do some processing
var vlayer, vsmia, vlegend;
request2.onload = function() {
  var requested_text = request2.response;
  vlayer = requested_text["layer"];
  vsmia = requested_text["smia"];
  legend_text = requested_text["legend"];

  // get a dict of legend ids, but don't include the none layer
  for (const prop in vlayer) {
    toggleableLegendIds[prop] = vlayer[prop]["legend"];
  }
  delete toggleableLegendIds.None

  // initialize map
  update_legend("Percent People of Color")
}

// MANUALLY SPECIFY WHICH LAYERS BELONG IN WHICH TABS
// IF YOU LEAVE A LAYER NAME OUT IT WON'T APPEAR!
var toggleableLayerIds =
    {"Demographics": ['Percent People of Color', 'Percent of Families Below Poverty Line', 'Median Household Income', 'Percent Uninsured'],
     "City Planning": ["Zoning", 'Bulk Storage Sites'],
     "Climate": ['Hurricane Storm Surge Zones', 'Hurricane Evacuation Zones','Heat Vulnerability Index']};

// temporarily specify data names in vector data - will remove when fixed
var dataNames = {'human_readable_zone': 'Land use: ',
'Perc_POC_P003009': 'Percent people of color: ',
'% of Families Below Poverty Level': 'Percent below poverty level: ',
'CATEGORY': 'Storm surge zone: ',
'Median Household Income': 'Median household income: ',
'hurricane': 'Hurricane evacuation zone: ',
'perc_uninsured': 'Percent Uninsured'};


var toggleableLegendIds = {};

var requestURL = 'https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Processing/Text/general_text.json';
var request2 = new XMLHttpRequest();
request2.open('GET', requestURL);
request2.responseType = 'json';
request2.send();
var vlayer, vsmia;
request2.onload = function() {
  var requested_text = request2.response;
  vlayer = requested_text["layer"];
  vsmia = requested_text["smia"];
  legend_info("Percent People of Color")

  // get a dict of legend ids
  for (const prop in vlayer) {
    toggleableLegendIds[prop] = vlayer[prop]["legend"];
  }
}

var toggleableLayerIds =
    {"Demographics": ['Percent People of Color', 'Percent of Families Below Poverty Line', 'Median Household Income', 'Percent Uninsured'],
     "City Planning": ["Zoning", 'Bulk Storage Sites'],
     "Weather": ['Hurricane Storm Surge Zones', 'Hurricane Evacuation Zones']};

var dataNames = {'human_readable_zone': 'Land use: ',
'Perc_POC_P003009': 'Percent people of color: ',
'% of Families Below Poverty Level': 'Percent below poverty level: ',
'CATEGORY': 'Storm surge zone: ',
'Median Household Income': 'Median household income: ',
'hurricane': 'Hurricane evacuation zone: ',
'perc_uninsured': 'Percent Uninsured'};

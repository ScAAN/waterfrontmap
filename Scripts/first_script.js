/*
 THE FIRST SCRIPT
 things here will run before any other scripts!
 contents:
 - replacing document.getElementById with $
 - load_script(url,callback)
 - general text request
 - story text request
*/

// redefine "$" to return element ids
var $ = function(id){return document.getElementById(id)};


// map initialization
/* we have to wait for all the scripts, XML requests and map style to load
   each time anything loads we'll add to loadcount
   after the end of loadcount we'll initialize the starting layers
   and stop the loading screen
*/
var global_loadcount = 0;
var global_pageloaded = 0;
function map_init(num){
  global_loadcount = global_loadcount+num;
  if (global_loadcount >=7){
    global_pageloaded = 1;
    // make default layer visible and initialize menu
    menuinit();
    make_layer_visible("Percent People of Color");
    // hide loading screen
    $('load_gif').style.visibility='hidden';
    $('loading_message').innerHTML='<br/>click anywhere to continue';
    $('wipbox').style.cursor = 'pointer';
    $('wipoverlay').style.cursor = 'pointer';
  }
}

//https://stackoverflow.com/questions/1375714/load-external-javascript-on-function-call
function load_script(url, completeCallback) {
  if (typeof completeCallback == "undefined") {completeCallback = function () {};}
   var script = document.createElement('script');
   script.onload = completeCallback;
   script.src = url;
   document.body.appendChild(script);
}

// general text request
/* text request & text processing
-
- Requests text from general_text.geojson
- Make important variables from this
- Manually specify which layers belong in which tabs (toggleableLayerIds)
*/

// request the general text
var toggleableLegendIds = {};
var toggleableLayerIds = {};
var dataNames = {};
var exploreIdOrder = [];
var general_requestURL = 'https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Processing/Text/general_text.json';
var general_request = new XMLHttpRequest();
general_request.open('GET', general_requestURL);
general_request.responseType = 'json';
general_request.send();

// now do some processing
var vlayer, vsmia, vlegend;
general_request.onload = function() {
  var requested_text = general_request.response;
  vlayer = requested_text["layer"];
  vsmia = requested_text["smia"];
  legend_text = requested_text["legend"];

  // get a dict of legend ids, but don't include the none layer
  for (const prop in vlayer) {
    if (prop!="None") {
      toggleableLegendIds[prop] = vlayer[prop]["legend"];
      exploreIdOrder.push(prop);
      /*
      if (typeof toggleableLayerIds[vlayer[prop]["tab"]]==undefined) {
        toggleableLayerIds[vlayer[prop]["tab"]] = [];
      }
      toggleableLayerIds[vlayer[prop]["tab"]].push(prop);
      if (vlayer[prop]["dataName"] !="Null"){
        dataNames[prop] = vlayer[prop]["dataName"];
      }
      */
    }
  }
  // sort layers ids so the explore display will look neater
  exploreIdOrder.sort(function(a, b){return a.length - b.length});
  map_init(1);
}

// MANUALLY SPECIFY WHICH LAYERS BELONG IN WHICH TABS
// IF YOU LEAVE A LAYER NAME OUT IT WON'T APPEAR!
var toggleableLayerIds =
    {"Demographics": ['Percent People of Color', 'Percent of Families Below Poverty Line', 'Median Household Income', 'Percent Uninsured'],
     "City Planning": ["Zoning", 'Bulk Storage Sites'],
     "Climate": ['Hurricane Storm Surge Zones', 'Hurricane Evacuation Zones','Heat Vulnerability Index']};

// temporarily specify data names in vector data - will remove when fixed
var dataNames = {'Zoning': 'human_readable_zone',
'Percent People of Color': 'Perc_POC_P003009',
'Percent of Families Below Poverty Line': '% of Families Below Poverty Level',
'Hurricane Storm Surge Zones': 'CATEGORY',
'Median Household Income': 'Median Household Income',
'Hurricane Evacuation Zones':'hurricane',
'Percent Uninsured': 'perc_uninsured',
'Heat Vulnerability Index': 'HVI_score'};



/*
LOAD STORY Text
*/

// first load in the story text file
var story_requestURL = 'https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Processing/Text/story_text.json';
var story_request = new XMLHttpRequest();
story_request.open('GET', story_requestURL);
story_request.responseType = 'json';
story_request.send();

// after loading do some processing
var storyvars, pageSMIAIdx, global_max_page;
story_request.onload = function() {
  var requested_text = story_request.response;
  storyvars = requested_text["data"];
  pageSMIAIdx = requested_text["SMIA_first_page"];
  global_max_page = requested_text["global_max_page"]-1;
  map_init(1);
}

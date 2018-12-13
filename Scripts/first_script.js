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
  if (global_loadcount >=(8+3)){
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
var general_requestURL = 'https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Processing/Text/map_text.json';
var general_request = new XMLHttpRequest();
general_request.open('GET', general_requestURL);
general_request.responseType = 'json';
general_request.send();

// now do some processing
var toggleableLegendIds={}, toggleableLayerIds={}, dataNames={}, exploreIdOrder=[];
var vlayer, vsmia, vlegend;
var storyvars, pageSMIAIdx, global_max_page;

var reorder_flag= true;
if (reorder_flag==true){
  var global_iconname = "{IconR}";
} else {
  var global_iconname = "{Icon}";
}


general_request.onload = function() {
  var requested_text = general_request.response;
  vlayer = requested_text["layer"];
  vsmia = requested_text["smia"];
  legend_text = requested_text["legend"];

  // //uncomment when reordering is enabled (first remake vector data)
  reorder_smia(true);

  // do processing, but don't include the none layer or Null layers
  for (const prop in vlayer) {
    if (prop!="None" && vlayer[prop]["tab"]!="Removed") {
      //get a dict of legend ids
      toggleableLegendIds[prop] = vlayer[prop]["legend"];
      // get an array of ids
      exploreIdOrder.push(prop);
      // get grouped menu ids
      if (typeof toggleableLayerIds[vlayer[prop]["tab"]]=='undefined') {
        toggleableLayerIds[vlayer[prop]["tab"]] = [];
      }
      toggleableLayerIds[vlayer[prop]["tab"]].push(prop);
      // sort layers so menu display will look neater
      toggleableLayerIds[vlayer[prop]["tab"]].sort(function(a, b){return b.length - a.length});
      // data names dict
      if (vlayer[prop]["dataName"] !="Null"){
        dataNames[prop] = vlayer[prop]["dataName"];
      }
    }
  }
  // sort layers ids so the explore display will look neater
  exploreIdOrder.sort(function(a, b){return a.length - b.length});
  map_init(1);

  // story processing
  story_text = requested_text["story"];
  storyvars = story_text["data"];
  pageSMIAIdx = story_text["SMIA_first_page"];
  global_max_page = story_text["global_max_page"]-1;
  map_init(1);
}

// renumber SMIAs if necessary
function reorder_smia(reorder_true){
  if (reorder_true==true){
    for (smia_name in vsmia){
      if (smia_name !="Introduction"){
        vsmia[smia_name]["number"] = vsmia[smia_name]["new_number"];
      }
    }
  }
  // now build legend in correct order
  for (i=0;i<8;i++){
    for (smia_name in vsmia){
      if (smia_name !="Introduction"){
        if ( vsmia[smia_name]["number"]==i){
          var smia_lab = smia_name;
          if (smia_name=="Staten Island West Shore"){
            smia_lab ="Staten I. West Shore";
          }
          var bigdiv = document.createElement('div');
          bigdiv.innerHTML = '<div style="float:right;text-align:right"><div style="display:inline-block;line-height:100%">' + smia_lab + '</div><span style="vertical-align:middle;margin-bottom:10px;position:relative;bottom:0px;left:15px;margin-left:10px;"><img class="marker" style="height:20px;" src="Assets/all_sprites/number-' + i + '.svg"></img></span></div>';
          $('legendHTML_Highlight').appendChild(bigdiv);
          }
      }
    }
  }
  tempdiv = document.createElement('div');
  tempdiv.innerHTML = "<div style='text-align:right'><span style='background-color: #ffffff'></span></div>";
  $('legendHTML_Highlight').appendChild(tempdiv)
}

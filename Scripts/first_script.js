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
    //make_layer_visible("Percent People of Color");
    $('storybutton').click();

    // hide loading screen
    //$('loading_message').innerHTML='<br/>...loading complete!';
    //hidewip()

    $('load_gif').style.visibility='hidden';

    $('loading_message').innerHTML='click to continue';
    $('wipbox').style.cursor = 'pointer';
    $('wipoverlay').style.cursor = 'pointer';

    setTimeout(function() {
      $('click_gif').style.visibility="visible";
    }, 500);
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

// request the general text. Papaparse can only parse one sheet at a time, so we
// have to get each sheet separately, then combine them at the end.
//
// url for the whole spreadsheet document, broken in two where the sheet gid
// goes
var base_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQheGoTdUsQND0HODg7h1PYdjqV8QDJnUZlv-fJzeMv6kwZhLAKwXRbawlgLOyTSj1B61gpKlYME5Xk/pub?gid="
var base_url_end = "&single=true&output=csv"
// then these are the gids for the different sheets
var layer = '559568406'
var smia = '1786892701'
var legend = '1724734492'
var story = '0'
function ttinit() {
  data = {}
  // this use of Promise inspired by https://stackoverflow.com/questions/47901255/wait-for-two-or-more-files-to-load-with-papa-parse
  // makes sure that we've parsed each of the separate sheets, placing them into data,
  // before calling tabletop_callback
  Promise.all([layer, smia, legend, story].map(
    url=> new Promise(
      (resolve,reject)=>
      Papa.parse(`${base_url}${url}${base_url_end}`,
                 {
                   header: true,
                   download: true,
                   complete: function (result) {
                     resolve(result.data)
                   },
                   error:reject
                 }
                )))).then(
                  function (results) {
                    // combine the data from each sheet into the format tabletop_callback
                    // expects,
                    data['layer'] = results[0]
                    data['smia'] = results[1]
                    data['legend'] = results[2]
                    data['story'] = results[3]
                    tabletop_callback(data)
                  }
                )
         .catch(
           err=>console.warn("Something went wrong:", err)
         )
}

// now declare some global variables
var toggleableLegendIds={}, toggleableLayerIds={}, dataNames={}, exploreIdOrder=[];
var vlayer, vsmia, vlegend;
var storyvars, pageSMIAIdx, global_max_page;

// tell waterfrontmap.js the correct icons for SMIA numbers
var reorder_flag= true;
if (reorder_flag==true){
  var global_iconname = "{IconR}";
} else {
  var global_iconname = "{Icon}";
}

// process the text from tabletop into the same format as from an XML request
function tabletop_callback(data,tabletop){
  // make requesty
  var layer = squish_tabletop(data["layer"],"id");
  var smia = squish_tabletop(data["smia"],"name");
  var legend = squish_tabletop(data["legend"],"vari");
  var story = squish_story(data["story"],smia);
  var requested={};
  requested["layer"]=layer;
  requested["smia"]=smia;
  requested["legend"]=legend;
  requested["story"]=story;
  request_processing(requested)
}

// squish tabletop data to become a flatter object
function squish_tabletop(elements,name){
  var newobj={};
  for (i=0;i<elements.length;i++){
    if (name=="vari"){
      var temparray =  Object.values(elements[i]).slice();
      temparray = temparray.filter(Boolean);
      temparray.shift();
      newobj[elements[i][name]] =temparray;
    } else {
      newobj[elements[i][name]] = elements[i];
    }
  }
  return newobj
}

// squish and process the story
function squish_story(elements,smia){
  var newobj={};
  newobj["global_max_page"] = elements.length;
  newobj["data"] = [];
  newobj["SMIA_first_page"] = new Array(8);
  for (i=0;i<elements.length;i++){
    newobj["data"][i] = elements[i];
    newobj["data"][i]["pageZoom"] = smia[newobj["data"][i]["pageSMIA"]]["zoom"];
    newobj["data"][i]["pageLat"] = smia[newobj["data"][i]["pageSMIA"]]["lat"];
    newobj["data"][i]["pageLng"] = smia[newobj["data"][i]["pageSMIA"]]["lng"];

    // specify bulk layers from check boxes
    var layersstring ="";
    var site_list = ["TRI","CBS","MOSF","SUPERFUND2"];
    for (var s = 0; s < site_list.length; s++) {
      var sitename = site_list[s];
      if (newobj["data"][i][sitename].includes("1")){layersstring = commaappend(layersstring,sitename);}
    }
    if (layersstring==""){layersstring="None"}
    newobj["data"][i]["bulkLayers"] = layersstring

    if (i>0){
      if (newobj["data"][i]["pageSMIA"]!=newobj["data"][i-1]["pageSMIA"]){
        smianum = smia[newobj["data"][i]["pageSMIA"]]["number"].slice();
        if (typeof(newobj["SMIA_first_page"][smianum])=="undefined"){
            newobj["SMIA_first_page"][smianum] = i;
        }
      }
    }
  }
  return newobj
}

function commaappend(string,appendage){
  if (string!==""){appendage = ","+appendage;}
  var newstring = string+appendage;
  return newstring
}

// process the map text into useful variables
function request_processing(requested_text){
  vlayer = requested_text["layer"];
  vsmia = requested_text["smia"];
  legend_text = requested_text["legend"];
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
  storyvars = story_text["data"]; console.log(storyvars)
  pageSMIAIdx = story_text["SMIA_first_page"];
  global_max_page = story_text["global_max_page"]-1;

  // //uncomment when reordering is enabled (first remake vector data)
  reorder_smia(true);

  map_init(1);
}


// renumber SMIAs if necessary
function reorder_smia(reorder_true){
  if (reorder_true==true){
    var tempidx = pageSMIAIdx.slice(0);
    for (smia_name in vsmia){
      if (smia_name !="Introduction"){
        var old_num = vsmia[smia_name]["number"];
        var new_num = vsmia[smia_name]["new_number"];
        pageSMIAIdx[new_num] = tempidx[old_num];
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

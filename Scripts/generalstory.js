var requestURL = 'https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Processing/Text/story_text.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
var storyvars, pageSMIAIdx, global_max_page;
request.onload = function() {
  var requested_text = request.response;
  storyvars = requested_text["data"];
  pageSMIAIdx = requested_text["SMIA_first_page"];
  global_max_page = requested_text["global_max_page"];
  // initialize global page
  global_page=0;
}

// next page function
function story_next_page(){
  global_page = global_page+1;
  if (global_page>global_max_page){global_page=0}
  story_display_page(global_page)
}

// prev page function
function story_prev_page(){
  global_page = global_page-1;
  if (global_page<0){global_page=global_max_page}
  story_display_page(global_page)
}

// display page function
function story_display_page(storypage){
  //flying options
  var flyopts = {
    zoom: storyvars[storypage]["pageZoom"],
    pitch:0,
    bearing:0,
    center: [storyvars[storypage]["pageLat"],storyvars[storypage]["pageLng"]]
  }

  // now fly!
  map.flyTo(flyopts)

  // show the next button
  document.getElementById('nextbutton').style.display = "block";
  document.getElementById('backbutton').style.display = "block";

// allow users to jump to a SMIA by clicking on it
var jumptext = "";
if (storypage>0) {
    if (storyvars[storypage-1]["pageIdx"]==0) {
      map.off('mousemove',which_smia);
      map.off('click',smia_click);
    }
}
if (storyvars[storypage]["pageIdx"]==0) {
  map.on('mousemove',which_smia);
  map.on('click',smia_click);
  jumptext = "<br><br> Click on any SMIA for more information, or click next to continue to learn about SMIAs. ";
}

 // switch to layer
 changeTab("None")
 make_layer_visible(storyvars[storypage]["pageLayer"])

  // display information about SMIA
  document.getElementById('smiabox').innerHTML = '<p><strong><big>' + storyvars[storypage]["pageTitle"] + '</big></strong>' + '<small></br></br>' + storyvars[storypage]["pageText"] + '</small></p>' + jumptext;
}

function smia_click(e){
  // zoom into smia on click

  // check which SMIA the mouse is on
  var whichsmia = map.queryRenderedFeatures(e.point, {
    layers: ['SMIAfill']
  });

  // if the mouse has clicked on a SMIA then get its number and fly
  if (whichsmia.length > 0){
    // fly now!
    var smiaNum = vsmia[whichsmia[0].properties.SMIA_Name]["number"]-1;
    // current SMIA number is a global variable, update it
    global_page = pageSMIAIdx[smiaNum]+1;
    map.off('click',smia_click)
    map.off('mousemove',which_smia)
    map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
    story_display_page(global_page)
  }
}


// When the user moves their mouse over the SMIA buffer layer, we'll update the filter in
// the state-fills-hover layer to only show the matching state, thus making a hover effect.
function which_smia(e){
  var whichsmia = map.queryRenderedFeatures(e.point, {
    layers: ['SMIAfill']
  });

  // if the mouse moves over a smia
  if (whichsmia.length > 0) {
    var thissmia = whichsmia[0].properties.SMIA_Name;
    // turn filter on
    map.setFilter("SMIAhover", ["==", "SMIA_Name", thissmia]);
    // show some SMIA info
    document.getElementById('smiabox').innerHTML = '<p><strong><big>SMIA # ' + vsmia[thissmia]["number"] + ' : ' + thissmia + '</big></strong>' + '<small></br></br>' +vsmia[thissmia]["description"] + '</br></br><strong>Source:</strong> <a href="https://www1.nyc.gov/assets/planning/download/pdf/plans-studies/vision-2020-cwp/vision2020/appendix_b.pdf">VISION 2020 comprehensive waterfront plan, Appx. B</a>' + '</small></p>';
  } else {
    // turn filter off
    map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
    // show the story page
    document.getElementById('smiabox').innerHTML = '<p><strong><big>' + storyvars[storypage]["pageTitle"] + '</big></strong>' + '<small></br></br>' + storyvars[storypage]["pageText"] + '</small></p>' + jumptext;
    //      document.getElementById('smiabox').innerHTML = '<p><small> ' + vsmia["Introduction"]["description"] + '</small><br/><br/>Click next to start learning about SMIAs, or click on any SMIA for more information. </p> ';
}
}

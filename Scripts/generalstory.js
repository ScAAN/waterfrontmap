/*
STORY MODE SCRIPT!
Contains:
- story_next_page
- story_prev_page
- story_display_page
- smia_click (jump to SMIA on click)
- which_smia (display SMIA info on hover)
*/

// first load in the story text file
var requestURL = 'https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Processing/Text/story_text.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

// after loading do some processing
var storyvars, pageSMIAIdx, global_max_page;
request.onload = function() {
  var requested_text = request.response;
  storyvars = requested_text["data"];
  pageSMIAIdx = requested_text["SMIA_first_page"];
  global_max_page = requested_text["global_max_page"];
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
  //specify flying options and fly
  var flyopts = {
    zoom: storyvars[storypage]["pageZoom"],
    pitch:0,
    bearing:0,
    center: [storyvars[storypage]["pageLat"],storyvars[storypage]["pageLng"]]
  }
  map.flyTo(flyopts)

  // show the next and back buttons
  document.getElementById('nextbutton').style.display = "block";
  document.getElementById('backbutton').style.display = "block";

  // allow users to jump to a SMIA by clicking on it (if pageIdx is zero)
  var jumptext = "";
  if (storyvars[storypage]["pageIdx"]!=0) {
    map.off('mousemove',which_smia);
    map.off('click',smia_click);
  } else {
    map.on('mousemove',which_smia);
    map.on('click',smia_click);
    jumptext = "<br><br> Click on any SMIA for more information, or click next to continue to learn about SMIAs. ";
  }

  // switch to layer, turn off all tabs selected for cleanliness
  changeTab("None")
  make_layer_visible(storyvars[storypage]["pageLayer"])

  // display information about SMIA
  document.getElementById('smiabox').innerHTML = '<p><strong><big>' + storyvars[storypage]["pageTitle"] + '</big></strong>' + '<small></br></br>' + storyvars[storypage]["pageText"] + jumptext + '</small></p>';
}

function smia_click(e){
  // zoom into smia on click

  // check which SMIA the mouse is on
  var whichsmia = map.queryRenderedFeatures(e.point, {layers: ['SMIAfill']});

  // if the mouse has clicked on a SMIA then get its number and jump to it
  if (whichsmia.length > 0){
    // Get the number of the clicked SMIA
    var smiaNum = vsmia[whichsmia[0].properties.SMIA_Name]["number"]-1;

    // Remember to turn off listeners and highlight effect after you zoom
    map.off('click',smia_click)
    map.off('mousemove',which_smia)
    map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);

    // Go to the first page on which this SMIA appears
    global_page = pageSMIAIdx[smiaNum]+1;
    story_display_page(global_page)
  }
}


function which_smia(e){
  // Display SMIA info on hover
  // When the user moves their mouse over the SMIA buffer layer, we'll update the filter in
  // the state-fills-hover layer to only show the matching state, thus making a hover effect.

  // Get the number of the clicked SMIA
  var whichsmia = map.queryRenderedFeatures(e.point, {layers: ['SMIAfill']});

  // if the mouse moves over a smia show some info or don't
  if (whichsmia.length > 0) {
    // turn filter on
    var thissmia = whichsmia[0].properties.SMIA_Name;
    map.setFilter("SMIAhover", ["==", "SMIA_Name", thissmia]);
    // show some SMIA info
    document.getElementById('smiabox').innerHTML = '<p><strong><big>SMIA # ' + vsmia[thissmia]["number"] + ' : ' + thissmia + '</big></strong>' + '<small></br></br>' +vsmia[thissmia]["description"] + '</br></br><strong>Source:</strong> <a href="https://www1.nyc.gov/assets/planning/download/pdf/plans-studies/vision-2020-cwp/vision2020/appendix_b.pdf">VISION 2020 comprehensive waterfront plan, Appx. B</a>' + '</small></p>';
  } else {
    // turn filter off
    map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
    // show the story page text
    var jumptext = "<br><br> Click on any SMIA for more information, or click next to continue to learn about SMIAs. ";
    document.getElementById('smiabox').innerHTML = '<p><strong><big>' + storyvars[global_page]["pageTitle"] + '</big></strong>' + '<small></br></br>' + storyvars[global_page]["pageText"] + jumptext + '</small></p>';
  }
}

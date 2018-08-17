var requestURL = 'https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Scripts/story_text.json';
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
  if (global_page<0){global_page=maxl_global_page}
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

 // switch to layer
 changeTab("None")
 make_layer_visible(storyvars[storypage]["pageLayer"])

  // display information about SMIA
  document.getElementById('smiabox').innerHTML = '<p><strong><big>' + storyvars[storypage]["pageTitle"] + '</big></strong>' + '<small></br></br>' + storyvars[storypage]["pageText"] + '</small></p>';
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
    var smiaNum = smiaNumbers[whichsmia[0].properties.SMIA_Name]-1;
    // current SMIA number is a global variable, update it
    global_page = smiaNum;
    story_display_page(pageSMIAIdx[smiaNum])
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
    // turn filter on
    map.setFilter("SMIAhover", ["==", "SMIA_Name", whichsmia[0].properties.SMIA_Name]);
        if (global_page<1){
          // if the map isn't zoomed in, show some basic info
      document.getElementById('smiabox').innerHTML = '<p><strong><big>SMIA # ' + smiaNumbers[whichsmia[0].properties.SMIA_Name] + ' : ' + whichsmia[0].properties.SMIA_Name + '</big></strong>' + '<small></br></br>' + smiaText[whichsmia[0].properties.SMIA_Name] + '</br></br><strong>Source:</strong> <a href="https://www1.nyc.gov/assets/planning/download/pdf/plans-studies/vision-2020-cwp/vision2020/appendix_b.pdf">VISION 2020 comprehensive waterfront plan, Appx. B</a>' + '</small></p>';
    }
  } else {
    // turn filter off
    map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
      if (global_page<1){
        // if the map isn't zoomed in, show some instructions
      document.getElementById('smiabox').innerHTML = '<p><small> ' + smiaIntro + '</small><br/><br/>Click next to start learning about SMIAs, or click on any SMIA for more information. </p> ';
  }
}
}


var requestURL = 'https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Scripts/story_text.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function() {
  var storyvars = request.response;
  console.log(storyvars)
  console.log(storyvars[0]["pageZoom"])
}



function story_next_page(){
  global_page = global_page+1;
  if (global_page>global_max_page){global_page=0}
  story_display_page(global_page)
}

function story_display_page(storypage){
  //flying options
  var flyopts = {
    zoom: storyvars[storypage]["pageLng"],
    pitch:0,
    bearing:0,
    center: [pageLat[storypage],pageLng[storypage]]
  }

  // now fly!
  map.flyTo(flyopts)

 // switch to layer
 changeTab(evt, "None")
 make_layer_visible(pageLayer[storypage])

  // display information about SMIA
  document.getElementById('smiabox').innerHTML = '<p><strong><big>' + pageTitle[smiaNum] + '</big></strong>' + '<small></br></br>' + pageText[smiaNum] + '</small></p>';
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
    global_current_SMIA = smiaNum;
    story_display_page(pageIdx[smiaNum])
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
        if (global_current_SMIA<0){
          // if the map isn't zoomed in, show some basic info
      document.getElementById('smiabox').innerHTML = '<p><strong><big>SMIA # ' + smiaNumbers[whichsmia[0].properties.SMIA_Name] + ' : ' + whichsmia[0].properties.SMIA_Name + '</big></strong>' + '<small></br></br>' + smiaText[whichsmia[0].properties.SMIA_Name] + '</br></br><strong>Source:</strong> <a href="https://www1.nyc.gov/assets/planning/download/pdf/plans-studies/vision-2020-cwp/vision2020/appendix_b.pdf">VISION 2020 comprehensive waterfront plan, Appx. B</a>' + '</small></p>';
    }
  } else {
    // turn filter off
    map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
      if (global_current_SMIA<0){
        // if the map isn't zoomed in, show some instructions
      document.getElementById('smiabox').innerHTML = '<p><small> ' + smiaIntro + '</small><br/><br/>Click next to start learning about SMIAs, or click on any SMIA for more information. </p> ';
  }
}
}

/*
STORY MODE SCRIPT!
Contains:
- story_next_page
- story_prev_page
- story_display_page
- smia_click (jump to SMIA on click)
- which_smia (display SMIA info on hover)
*/

// next page function
function story_next_page(){
  global_page = global_page+1;
  if (global_page>global_max_page){global_page=0;}
  story_display_page(global_page)
}

// prev page function
function story_prev_page(){
  global_page = global_page-1;
  if (global_page<0){global_page=global_max_page;}
  story_display_page(global_page)
}

// display page function
function story_display_page(storypage){
  //specify flying options and fly
  var flyopts = {
    zoom: storyvars[storypage]["pageZoom"],
    pitch:0,
    bearing:0,
    center: [storyvars[storypage]["pageLat"],storyvars[storypage]["pageLng"]],
    speed:.5,
    curve: 1,
  }
  map.flyTo(flyopts)

  // show the next and back buttons
  $('nextbutton').style.display = "block";
  $('backbutton').style.display = "block";


  // allow users to jump to a SMIA by clicking on it (if pageIdx is zero)
  var jumptext = "";
  if (storyvars[storypage]["pageIdx"]==1) {
    smia_hover_toggle(true,false,false)
  } else if (storyvars[storypage]["pageIdx"]==2) {
    smia_hover_toggle(true,false,true)
  } else if (storyvars[storypage]["pageIdx"]==0) {
    smia_hover_toggle(true,true,false)
    jumptext = "<br><br> Click on any SMIA for more information, or click next to continue to learn about SMIAs. ";
  } else {
    smia_hover_toggle(false,false,false)
  }

  // switch to layer, turn off all tabs selected for cleanliness
  changeTab("None")
  // add bulkLayers
  // var bulks = storyvars[storypage]['bulkLayers'].split(",")
  var bulkstring = storyvars[storypage]["bulkLayers"].split(",");
  if (storyvars[storypage]["pageLayer"]=="Bulk Storage Sites"){
    bulkstring = ['Bulk Storage Sites','MOSF','CBS','SUPERFUND2'];
  }
  toggle_bulk(bulkstring)
  if (bulkstring!="None" && storyvars[storypage]["pageLayer"]!="Bulk Storage Sites"){
    bulk_legend(false)
    bulk_legend(true)
  } else {
    bulk_legend(false)
  }
  $('toggler-Bulk Storage Sites').className = '';
  make_layer_visible(storyvars[storypage]["pageLayer"])

  // display information about story page
  $('storybox').innerHTML = '<p><big><strong>' + storyvars[storypage]["pageTitle"] + '</big></strong>' + '</br></br>' + storyvars[storypage]["pageText"] + jumptext + '</p>';
}


function smia_hover_toggle(hover,click,name_only){
  // display SMIA name only if true
  if (typeof name_only == 'undefined'){
    name_only=false
  }
  
  // turn of listeners and remove info
  map.off('click',smia_click)
  map.off('mousemove',smia_displayname)
  map.off('mousemove',smia_displaytext)
  map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
  $('smiainfoboxempty').style.visibility = 'hidden';

  // toggle hover listener
  if (hover==true){
    if (name_only==true){
      map.on('mousemove',smia_displayname);
    } else {
      map.on('mousemove',smia_displaytext);
    }
  }

  // toggle click listener
  if (click==true){
    map.on('click',smia_click);
  } else {
    map.off('click',smia_click);
  }
}

function smia_displayname(event){
  which_smia(event,true)
}

function smia_displaytext(event){
  which_smia(event,false)
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
    smia_hover_toggle(false,false,false)

    // Go to the first page on which this SMIA appears
    var jumppage = pageSMIAIdx[smiaNum]+1;
    if (jumppage !=0){
      global_page = jumppage;
      story_display_page(global_page);
    }
  }
}


function which_smia(e,name_only){
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
    smia_info(thissmia,e.point,name_only)
  } else {
    $('smiainfoboxempty').style.visibility = 'hidden';
    // turn filter off
    map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
  }
}

function smia_info(thissmia,e,name_only){
  // info (name only or full)
  if (name_only==true){
    $('smiainfoboxempty').innerHTML = '<p><strong><big>SMIA # ' + vsmia[thissmia]["number"] + ' : ' + thissmia + '</big></strong>';
  } else {
    $('smiainfoboxempty').innerHTML = '<p><strong><big>SMIA ' + vsmia[thissmia]["number"] + ':  ' + thissmia + '</big></strong>' + '</br></br>' +vsmia[thissmia]["description"]  + '</p>';
  }

  // set box coordinates and make visible
  var xcord = e["x"] - 15;
  $('smiainfoboxempty').style.left = xcord+'px';
  var ycord = e["y"] - $('smiainfoboxempty').offsetHeight -30;
  $('smiainfoboxempty').style.top = ycord + 'px';
  $('smiainfoboxempty').style.visibility = 'visible';
}

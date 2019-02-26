/*
Navigation script!
This controls: info box, data box, legend, WIP box
Contents:
- changeTab(tabName)
- make_layer_visible(clickedLayer)
- legend_info(clickedLayer)
- show_legend_info()
- reset_map_view(event)
- showinfobox(evt,boxname)
*/

// hide work in progress box
function hidewip(){
  if (global_pageloaded==1){
    $('wipbox').style.display = 'none';
    $('wipoverlay').style.display = 'none';
  }
}

function showabout(){
  $('aboutoverlay').style.display="block";
  $('aboutbox').style.display="block";
}

function hideabout(){
  $('aboutoverlay').style.display="none";
  $('aboutbox').style.display="none";
}

function slider_pulse(string){
  if (string=="start"){
    setTimeout(function() {
      $('slider_flash').style.webkitTransform="scale(1)";
    }, 300);
    /*
    $('infoimgpulse').style.visibility="visible";
    setTimeout(function() {
      stop_slider();
    }, 3000);*/
} else if (string="stop"){
  /*
  button_pulse("start")
  setTimeout(function() {
    button_pulse("stop")
  }, 3000);*/
  stop_slider();
}
  /*
  if (string=="start"){
    $('slider_flash').style.webkitTransform="scale(1)";
  } else if (string="stop"){
    $('slider_flash').style.webkitTransform="scale(.1)";
    setTimeout(function() {
      $('slider_flash').style.display="none";
      button_pulse("start")
    }, 500);
  }
  */
}

function stop_slider(){
  $('slider_flash').style.webkitTransform="scale(.1)";
  setTimeout(function() {
    $('slider_flash').style.webkitTransform="scale(.01)";
    $('slider_flash').style.display="none";
  }, 500);
}

function button_pulse(string){
  if (string=="start"){
    $('infoimgpulse').style.visibility="visible";
  } else if (string="stop"){
    $('infoimgpulse').style.display="none";
  }
}

// ----------------------------------------
// |  ** MENU / LAYER SWITCHING  ** |
// ----------------------------------
// update legend information to be default
//legend_info("Percent People of Color")

function clearmenu(){
  for (var key in toggleableLegendIds) {
    var link = $('toggler-' + key)
      link.style.display='none'
  }
}


function menuinit(){
  menudiv = $('menu');
  tablinks = document.getElementsByClassName("menu-button");
  for (j = 0; j < tablinks.length; j++) {
    tablinks[j].className += " active";
    var tabName = tablinks[j].id;
    for (var i = 0; i < toggleableLayerIds[tabName].length; i++) {
      var id = toggleableLayerIds[tabName][i];
      var link = document.createElement('a');
      link.style.cssText = 'float:left; width:112px;margin-left:9px;font-size:12px;';
      link.href = '#';
      link.textContent = id;
      link.id = 'toggler-' + id
      link.className = ''
      link.onclick = function(e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();
        if (this.className == 'active') {
          // if the class was already active make it inactive
          this.className = '';
          if (clickedLayer=="Bulk Storage Sites") {
            toggle_bulk("None")
            bulk_legend(false)
            if (nonbulk_active()==false){update_legend("None")}
          } else {
            make_layer_visible('None')
            if ($("toggler-Bulk Storage Sites").className=='active'){
              update_legend('Bulk Storage Sites')
              bulk_legend(false)
            }
          }
        } else {
          // if this wasn't active make it active now
          this.className = 'active';
          if (clickedLayer=="Bulk Storage Sites") {
            toggle_bulk(['TRI','MOSF','CBS','SUPERFUND2'])
            if (nonbulk_active()==false){update_legend("Bulk Storage Sites")}
            if (nonbulk_active()==true){bulk_legend(true)}
          } else {
            if ($("toggler-Bulk Storage Sites").className=='active'){bulk_legend(true)}
            make_layer_visible(clickedLayer)
          }
        }
      };
      menudiv.appendChild(link);
    }
    tablinks[j].className.replace(' active','')
  };
  changeTab("None");
}

function changeTab(tabName) {
  var killallboxes=0;
  var clickedTab = $(tabName);

  // clear menu of previous togglers
  clearmenu();

  // check if clicked box was alread active, if so then kill all boxes
  if (clickedTab==null) {
  } else if (clickedTab.className.includes("active")) {
    killallboxes = 1;
  }

  // make all the buttons inactive and then set the clicked button to active
  tablinks = document.getElementsByClassName("menu-button");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  // don't need this anymore
  //$('MenuSpacer').style.display='None';

  if (tabName.includes("None")) {return}

  if (killallboxes !=1){
    // build a toggling menu
    //$('MenuSpacer').style.display='block';

    clickedTab.className += " active";
    for (var i = 0; i < toggleableLayerIds[tabName].length; i++) {
      var id = toggleableLayerIds[tabName][i];
      $('toggler-' + id).style.display='block';
    };
  }
}

function nonbulk_active(){
  var flag=false;
  for (var key in toggleableLegendIds){
    if ($('toggler-' + key).className=='active' && key!='Bulk Storage Sites'){
      flag=true;
    }
  }
  return flag
}

function toggle_bulk(layers) {
  $("toggler-Bulk Storage Sites").className='';
  var alllayers = ['TRI','MOSF','CBS','SUPERFUND2'];
  for (i=0;i<alllayers.length;i++){
    layername = alllayers[i];
    map.setLayoutProperty(layername, 'visibility', 'none');
    if ($(layername).className.includes("target")==false){
      $(layername).className += ' target';
    }
    $(layername).style.display="block";
  }

  if (layers!='None') {
    $("toggler-Bulk Storage Sites").className='active';
    for (i=0;i<layers.length;i++){
      layername = layers[i];
      map.setLayoutProperty(layername, 'visibility', 'visible');
      $(layername).className = $(layername).className.replace(" target", "");
      $(layername).style.display="none";
    }
  }
}

function bulk_indiv(divname){
  if ($(divname).className.includes('target')){
    $(divname).className = $(divname).className.replace(" target", "");
    $(divname).style.display="none";
    if (divname.includes("TRI")){
      map.setLayoutProperty('TRI', 'visibility', 'visible');
    } else if (divname.includes("MOSF")){
      map.setLayoutProperty('MOSF', 'visibility', 'visible');
    } else if (divname.includes("CBS")){
      map.setLayoutProperty('CBS', 'visibility', 'visible');
    } else if (divname.includes("SUPERFUND2")){
      map.setLayoutProperty('SUPERFUND2', 'visibility', 'visible');
    }
  } else {
    if ($(divname).className.includes("target")==false){
      $(divname).className += ' target';
    }
    $(divname).style.display="block";
    if (divname.includes("TRI")){
      map.setLayoutProperty('TRI', 'visibility', 'none');
    } else if (divname.includes("MOSF")){
      map.setLayoutProperty('MOSF', 'visibility', 'none');
    } else if (divname.includes("CBS")){
      map.setLayoutProperty('CBS', 'visibility', 'none');
    } else if (divname.includes("SUPERFUND2")){
      map.setLayoutProperty('SUPERFUND2', 'visibility', 'none');
    }
  }
}

function bulk_legend(value) {
  console.log($('bulklegendtext').innerHTML)
  if (value==true){
    $('bulklegendtext').innerHTML = "Click on the legend symbols to toggle bulk storage sites, locations with multiple sites are denoted by numbers.";
    $('legendHTML_bulk').style.display = 'block';
    $('bulktitle').style = "text-align:center";
    if (nonbulk_active()==true){
      if ($('legendinfo').style.display.includes("block")){
        $('legendinfo').style.right='370px';
      }
    }
  } else {
    $('bulklegendtext').innerHTML = "&nbsp";
    $('bulktitle').style = "";
    $('legendinfo').style.right='190px';
    $('legendHTML_bulk').style.display = 'none';
  }
}

function show_legend_info(){
  // show or hide legend info by clicking button
  if ($('legendinfo').style.display.includes("block")){
    $('legendinfo').style.display='none';
  } else {
    $('legendinfo').style.display='block';
    if ($("toggler-Bulk Storage Sites").className=='active' && nonbulk_active()==true){
      $('legendinfo').style.right='370px';
    } else {
      $('legendinfo').style.right='190px';
    }
  }
}



function make_layer_visible(clickedLayer) {
  var hatchop = .7;
  for (var otherLayerName in toggleableLegendIds) {

    if (otherLayerName != clickedLayer) {
      var otherToggler = $('toggler-' + otherLayerName)
      if (otherToggler != null && (otherLayerName !='Bulk Storage Sites')){
        otherToggler.className = '';
      }
      if (otherLayerName == 'Bulk Storage Sites') {
        // do nothing
      } else if (otherLayerName.includes("Sea Level Rise")) {
        map.setPaintProperty('Sea Level Rise 2020','fill-opacity',0);
        map.setPaintProperty('Sea Level Rise 2050','fill-opacity',0);
      } else if (otherLayerName.includes("Percent") || otherLayerName.includes("Median Household Income") || otherLayerName.includes("Heat Vulnerability Index")) {
        map.setPaintProperty(otherLayerName, 'fill-opacity', 0);
        map.setPaintProperty(otherLayerName + " Hatch", 'fill-opacity', 0);
        if (otherLayerName == "Percent Uninsured"){map.setPaintProperty("Percent Uninsured Unreliable", 'fill-opacity', 0)}
      } else {
        map.setPaintProperty(otherLayerName, 'fill-opacity', 0);
      }
    }
  }
  if (clickedLayer=="None"||clickedLayer=="Highlight") {
    // show fill layer to highlight SMIAs
    //if (clickedLayer == "Highlight") {
    //smia_hover_toggle(true,false)
    map.setLayoutProperty("SMIAnumbers",'visibility','visible')
    map.setPaintProperty("SMIAfill", 'fill-opacity',.25)
    //}
    update_legend("None");
    $('dataselector').innerHTML = ' Data: ';
  } else {
    // get rid of none stuff
    //smia_hover_toggle(false,false)
    map.setPaintProperty("SMIAfill", 'fill-opacity',0)
    map.setLayoutProperty("SMIAnumbers", 'visibility',"none")

    // make active
    $('toggler-' + clickedLayer).className = 'active';
    // update data tabselector
    $('dataselector').innerHTML = 'Data: <small>'+ clickedLayer + '</small>';
    if (clickedLayer == 'Bulk Storage Sites') {
      //do nothing
    } else if (clickedLayer.includes("Sea Level Rise")) {
      map.setPaintProperty('Sea Level Rise 2020','fill-opacity',1);
      map.setPaintProperty('Sea Level Rise 2050','fill-opacity',1);
    } else if (clickedLayer.includes("Percent") || clickedLayer.includes("Median Household Income") || clickedLayer.includes("Heat Vulnerability Index")) {
      map.setPaintProperty(clickedLayer, 'fill-opacity', 1);
      map.setPaintProperty(clickedLayer + " Hatch", 'fill-opacity', hatchop);
      if (clickedLayer == "Percent Uninsured"){map.setPaintProperty("Percent Uninsured Unreliable", 'fill-opacity', hatchop)}
    } else {
      map.setPaintProperty(clickedLayer, 'fill-opacity', 1);
    }
    update_legend(clickedLayer)
  }
}




function update_legend(layername){
  //update legend info to match clicked layer
  $('legendinfo').innerHTML ='<div style="margin-top:-10px;">'
  +'<p><h4>Description</h4><small>' + vlayer[layername]["text"] + '</br></br></small>'
  +'<h4>Source</h4><small>'+ vlayer[layername]["source"] +'</small></p>'
  +'</div>' +
  '<div id="legendexitbutton" class="exit-button exit-button-small" onclick="show_legend_info()"></div>';

  // get legend entry and color
  var legendentry = legend_text[toggleableLegendIds[layername] + '_entry'];
  var legendcolor = legend_text[toggleableLegendIds[layername] + '_color'];

  // legend title
  $('legend_placeholder').innerHTML = '<h4>' + layername + '</h4>';

  // bulk legend is special
  if (layername == 'Bulk Storage Sites'){
    $('legend_placeholder').innerHTML = $('legendHTML_bulk').innerHTML
  } else if (layername == "None") {
    //$('legend_placeholder').innerHTML = '';
    $('legend_placeholder').innerHTML = $('legendHTML_Highlight').innerHTML
  } else {
    // build legend from entry text and colors
    for (i=0; i<legendentry.length; i++){
      var divtext = '<div style="text-align:right;"><div style="display:inline-block;line-height:100%">' + legendentry[i] + '</div>'
      + '<span style="vertical-align:middle;background-color: ' + legendcolor[i] + ';margin-left:10px;margin-bottom:5px;"></span></div>'

      $('legend_placeholder').innerHTML = $('legend_placeholder').innerHTML + divtext
    }
    // add image to uninsured legend
    if (layername == 'Percent Uninsured'){$('legend_placeholder').innerHTML = $('legend_placeholder').innerHTML + $('legendHTML_uninsured').innerHTML}
  }
}


function reset_map_view(event){
  // set flying options and fly
  var flyopts = {
    zoom: 10,
    center: [-73.9978, 40.7209],
    bearing: 0,
    pitch:0,
    speed:.5,
    curve: 1,
  }
  map.easeTo(flyopts)

  // reset info box and SMIA highlight
  showinfobox(event,"none")
  toggle_bulk("None")
  bulk_legend(false)
  smia_hover_toggle(false,false)
  //map.setPaintProperty("SMIAfill", 'fill-opacity',0)
  //map.setLayoutProperty("SMIAnumbers",'visibility','none')
  make_layer_visible("None")
}



// ------------------------------------------
// |-------    I N F O    B O X     --------|
// ------------------------------------------
function showinfobox(evt,boxname){
  // control what's shown in the info box (STORY, EXPLORE, ABOUT)
  // sloppy way of showing and hiding infobox from https://www.w3schools.com/howto/howto_js_tabs.asp
  // declare variables
  var i, boxcontent, boxlinks, killallboxes;

  // hide everything named box-content
  boxcontent = document.getElementsByClassName("box-content");
  for (i=0; i<boxcontent.length; i++){
    boxcontent[i].style.display = "none";
  }

  // check if clicked box was alread active, if so then kill all boxes
  if (boxname.includes("none") || evt.currentTarget.className.includes("active")) {
    killallboxes = 1;
  }

  // deactivate anything named mode-button
  boxlinks= document.getElementsByClassName("mode-button");
  for (i=0; i<boxlinks.length; i++){
    boxlinks[i].className = boxlinks[i].className.replace(" active","");
  }

  // kill story button
  $('nextbutton').style.display = 'none';
  $('backbutton').style.display = 'none';
  $('story_counter').style.display = 'none';

  // clear explore box
  var blankgeojson = {
    "type": "FeatureCollection",
    "features": []
  };
  map.getSource('single-point').setData(blankgeojson);
  $('map-overlay-info').innerHTML = '';

  // turn off all listeners, SMIA layer popup
  map.off('click', query_point)
  smia_hover_toggle(false,false)

  // hide right slider
  // hide slider pulse after exploring
  if (($('slider_flash').style.webkitTransform).includes("scale(1)")){
    slider_pulse("stop")
    setTimeout(function() {
      $('sliderbox').style.right="-100px";
    }, 300);
  } else {
    $('sliderbox').style.right="-100px";
  }

  if (killallboxes!=1) {
    // show the current box and make it active!
    $(boxname).style.display = "block";
    evt.currentTarget.className += " active";

    // manage listeners
    if (evt.currentTarget.id.includes("story")) {
      // listeners are in story_display_page
      global_page = 0;
      story_display_page(global_page)
    } else if (evt.currentTarget.id.includes("explore")) {
      // turn on point querying listener
      slider_pulse("start");
      $('geocoder_input').value = '';
      map.on('click',query_point);
      smia_hover_toggle(true,false,true)
      $('sliderbox').style.right="0px";
    } else if (evt.currentTarget.id.includes("about")) {
      // show overlay
      $('aboutoverlay').style.display="block";
    }
  }
}

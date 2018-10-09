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
  document.getElementById('wipbox').style.display = 'none';
  document.getElementById('wipoverlay').style.display = 'none';
}

function hideaboutbox(){
  $('aboutbox').style.display = 'none';
  $('aboutoverlay').style.display = 'none';
  showinfobox(event,"None")
}

// redefine "$" to return element ids
var $ = function(id){return document.getElementById(id)};

// ----------------------------------------
// |  ** MENU / LAYER SWITCHING  ** |
// ----------------------------------
// update legend information to be default
//legend_info("Percent People of Color")

var global_bulkflag = false;
var global_notbulk = false;

function changeTab(tabName) {
  var killallboxes=0;
  var layers = document.getElementById('menu');
  var clickedTab = document.getElementById(tabName);
  for (var key in toggleableLegendIds) {
    var link = document.getElementById('toggler-' + key)
    if (link != null){
      layers.removeChild(link);
    }
  }

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
  $('MenuSpacer').style.display='None';

  if (tabName.includes("None")) {return}

  if (killallboxes !=1){
    // build a toggling menu
    $('MenuSpacer').style.display='block';
    clickedTab.className += " active";
    for (var i = 0; i < toggleableLayerIds[tabName].length; i++) {
      var id = toggleableLayerIds[tabName][i];
      var link = document.createElement('a');
      link.style.cssText = 'float:left; width:112px;margin-left:9px;';
      link.href = '#';
      link.textContent = id;
      link.id = 'toggler-' + id
      // manage bulk activity
      if (global_bulkflag==true && ($("toggler-Bulk Storage Sites") == null)==false){
        $("toggler-Bulk Storage Sites").className = 'active';
        if (global_notbulk==true){bulk_legend(true)}
      }
      link.onclick = function(e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();
        if (this.className == 'active') {
          // if the class was already active make it inactive
          this.className = '';

          //  manage bulk legend
          if (clickedLayer=="Bulk Storage Sites") {
            toggle_bulk("None")
            if (global_notbulk==false){update_legend("None")}
            bulk_legend(false)
          } else {
            global_notbulk=false;
            make_layer_visible('None')
            if (global_bulkflag==true){
              update_legend('Bulk Storage Sites')
              bulk_legend(false)
            } else {
              update_legend("None")
            }
            // manage bulk activity
            if (global_bulkflag==true && ($("toggler-Bulk Storage Sites") == null)==false){
              $("toggler-Bulk Storage Sites").className = 'active';
            }

          }
        } else {
          // if this wasn't active make it active now
          this.className = 'active';
          if (clickedLayer=="Bulk Storage Sites"){
            toggle_bulk(['Bulk Storage Sites','MOSF','CBS','SUPERFUND2'])
            if (global_notbulk==false){update_legend("Bulk Storage Sites")}
            if (global_notbulk==true){bulk_legend(true)}
          } else {
            global_notbulk=true;
            // manage bulk legend
            if (global_bulkflag==true){bulk_legend(true)}
            make_layer_visible(clickedLayer)
            // manage bulk activity
            if (global_bulkflag==true && ($("toggler-Bulk Storage Sites") == null)==false){
              $("toggler-Bulk Storage Sites").className = 'active';
              if (global_notbulk==true){bulk_legend(true)}
            }

          }
        }
      };

      layers.appendChild(link);

      // delete this and make toggles invisible instead of vanishing
      if (i == 0) {
        link.className = 'active';
        update_legend(id)
        make_layer_visible(id)
        global_notbulk=true;
        if (global_bulkflag==true){bulk_legend(true)}
      } else {
        link.className = '';
      }
      // manage bulk activity
      if (global_bulkflag==true && ($("toggler-Bulk Storage Sites") == null)==false){
        $("toggler-Bulk Storage Sites").className = 'active';
        if (global_notbulk==true){bulk_legend(true)}
      }

    };
  }
}

function toggle_bulk(layers) {
  map.setLayoutProperty('Bulk Storage Sites', 'visibility', 'none');
  map.setLayoutProperty('MOSF', 'visibility', 'none');
  map.setLayoutProperty('CBS', 'visibility', 'none');
  map.setLayoutProperty('SUPERFUND2', 'visibility', 'none');
  global_bulkflag = false
  if (layers!='None') {
    for (i=0; i < layers.length; i++) {
      map.setLayoutProperty(layers[i],'visibility','visible')
      global_bulkflag = true
    }
  }
}

function bulk_legend(value) {
  if (value==true && global_notbulk==true){
    $('legendHTML_bulk').style.display = 'block';
    if (document.getElementById('legendinfo').style.display.includes("block")){
      $('legendinfo').style.right='350px';
    }
  } else {
    $('legendinfo').style.right='180px';
    $('legendHTML_bulk').style.display = 'none';
  }
}


function make_layer_visible(clickedLayer) {
  for (var otherLayerName in toggleableLegendIds) {

    if (otherLayerName != clickedLayer) {
      var otherToggler = document.getElementById('toggler-' + otherLayerName)
      if (otherToggler != null){
        otherToggler.className = '';
      }
      if (otherLayerName == 'Bulk Storage Sites') {
        // do nothing
        //map.setLayoutProperty(otherLayerName, 'visibility', 'none');
        //map.setLayoutProperty('MOSF', 'visibility', 'none');
        //map.setLayoutProperty('CBS', 'visibility', 'none');
        //map.setLayoutProperty('SUPERFUND2', 'visibility', 'none');
      } else if (otherLayerName.includes("Percent") || otherLayerName.includes("Median Household Income") || otherLayerName.includes("Heat Vulnerability Index")) {
        map.setPaintProperty(otherLayerName, 'fill-opacity', 0);
        map.setPaintProperty(otherLayerName + " Hatch", 'fill-opacity', 0);
        if (otherLayerName == "Percent Uninsured"){map.setPaintProperty("Percent Uninsured Unreliable", 'fill-opacity', 0)}
      } else {
        map.setPaintProperty(otherLayerName, 'fill-opacity', 0);
      }
    }
  }
  map.setPaintProperty("SMIAfill", 'fill-opacity',0)
  map.setLayoutProperty("SMIAnumbers", 'visibility',"none")
  if (clickedLayer=="None"||clickedLayer=="Highlight") {
    // show fill layer to highlight SMIAs
    //if (clickedLayer == "Highlight") {
    map.setLayoutProperty("SMIAnumbers",'visibility','visible')
    map.setPaintProperty("SMIAfill", 'fill-opacity',.25)
    //}
    update_legend("None");
    $('dataselector').innerHTML = ' Data: ';
  } else {
    // update data tabselector
    $('dataselector').innerHTML = 'Data: <small>'+ clickedLayer + '</small>';
    if (clickedLayer == 'Bulk Storage Sites') {
      map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
      map.setLayoutProperty('MOSF', 'visibility', 'visible');
      map.setLayoutProperty('CBS', 'visibility', 'visible');
      map.setLayoutProperty('SUPERFUND2', 'visibility', 'visible');
    } else if (clickedLayer.includes("Percent") || clickedLayer.includes("Median Household Income") || clickedLayer.includes("Heat Vulnerability Index")) {
      map.setPaintProperty(clickedLayer, 'fill-opacity', 1);
      map.setPaintProperty(clickedLayer + " Hatch", 'fill-opacity', 1);
      if (clickedLayer == "Percent Uninsured"){map.setPaintProperty("Percent Uninsured Unreliable", 'fill-opacity', 1)}
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
  +'</div>';

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



function show_legend_info(){
  // show or hide legend info by clicking button
  if (document.getElementById('legendinfo').style.display.includes("block")){
    document.getElementById('legendinfo').style.display='none';
    document.getElementById('legendseam').style.display='none';
    //if (global_bulkflag==true){ $('legendHTML_bulk').style.right='180px';}
  } else {
    document.getElementById('legendinfo').style.display='block';
    document.getElementById('legendseam').style.display='block';
    if (global_bulkflag==true && global_notbulk==true){
      $('legendinfo').style.right='350px';
    } else {
      $('legendinfo').style.right='180px';
    }
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
  map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
  $('smiainfoboxempty').style.visibility = 'hidden';
  map.setPaintProperty("SMIAfill", 'fill-opacity',0)
  map.setLayoutProperty("SMIAnumbers",'visibility','none')
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
  if (evt.currentTarget.className.includes("active") || boxname.includes("none")) {
    killallboxes = 1;
  }

  // deactivate anything named mode-button
  boxlinks= document.getElementsByClassName("mode-button");
  for (i=0; i<boxlinks.length; i++){
    boxlinks[i].className = boxlinks[i].className.replace(" active","");
  }

  // kill story button
  document.getElementById('nextbutton').style.display = 'none';
  document.getElementById('backbutton').style.display = 'none';

  // clear explore box
  var blankgeojson = {
    "type": "FeatureCollection",
    "features": []
  };
  map.getSource('single-point').setData(blankgeojson);
  $('map-overlay-info').innerHTML = '';

  // turn off all listeners
  map.off('click', query_point)
  map.off('mousemove',which_smia)
  map.off('click',smia_click)
  // turn off SMIA layer popup
  map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);
  $('smiainfoboxempty').style.visibility = 'hidden';
  $('aboutoverlay').style.display="none";

  if (killallboxes!=1) {
    // show the current box and make it active!
    document.getElementById(boxname).style.display = "block";
    evt.currentTarget.className += " active";

    // manage listeners
    if (evt.currentTarget.id.includes("story")) {
      // listeners are in story_display_page
      global_page = 0;
      story_display_page(global_page)
    } else if (evt.currentTarget.id.includes("explore")) {
      // turn on point querying listener
      map.on('click',query_point);
    } else if (evt.currentTarget.id.includes("about")) {
      // show overlay
      $('aboutoverlay').style.display="block";
    }
  }
}

// ------------------------------------------
// TEMPORARY
// ------------------------------------------

function hidewip(){
    document.getElementById('wipbox').style.display = 'none';
    document.getElementById('wipoverlay').style.display = 'none';
}


// ----------------------------------------
// |  ** MENU / LAYER SWITCHING  ** |
// ----------------------------------
// update legend information to be default
//legend_info("Percent People of Color")

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

  if (tabName.includes("None")) {return}

  if (killallboxes !=1){
    // build a toggling menu
    clickedTab.className += " active";
    for (var i = 0; i < toggleableLayerIds[tabName].length; i++) {
      var id = toggleableLayerIds[tabName][i];
      var link = document.createElement('a');
      link.style.cssText = 'float:left; width:120px;';
      link.href = '#';
      link.textContent = id;
      link.id = 'toggler-' + id
      link.onclick = function(e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();
        if (this.className == 'active') {
          this.className = '';
          make_layer_visible('None')
        } else {
          this.className = 'active';
          make_layer_visible(clickedLayer)
        }
      };

      layers.appendChild(link);
      if (i == 0) {
        link.className = 'active';
        legend_info(id)
        make_layer_visible(id)
      } else {
        link.className = '';
      }
    };
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
        map.setLayoutProperty(otherLayerName, 'visibility', 'none');
        map.setLayoutProperty('MOSF', 'visibility', 'none');
        map.setLayoutProperty('CBS', 'visibility', 'none');
        map.setLayoutProperty('SUPERFUND2', 'visibility', 'none');
      } else if (otherLayerName == "Percent Uninsured") {
        map.setPaintProperty(otherLayerName, 'fill-opacity', 0);
        map.setPaintProperty("Percent Uninsured Unreliable", 'fill-opacity', 0);
        map.setPaintProperty("Percent Uninsured Hatch", 'fill-opacity', 0);
      } else if (otherLayerName.includes("Percent") || otherLayerName.includes("Median Household Income")) {
        map.setPaintProperty(otherLayerName, 'fill-opacity', 0);
        map.setPaintProperty(otherLayerName + " Hatch", 'fill-opacity', 0);
      } else {
        map.setPaintProperty(otherLayerName, 'fill-opacity', 0);
      }
      document.getElementById(toggleableLegendIds[otherLayerName]).style.display = 'none';
    }
  }
  map.setPaintProperty("SMIAfill", 'fill-opacity',0)
  if (clickedLayer=="None"||clickedLayer=="Highlight") {
    // show fill layer to highlight SMIAs
    if (clickedLayer == "Highlight") {
      map.setPaintProperty("SMIAfill", 'fill-opacity',.25)
    }
      document.getElementById("empty-legend").style.display = 'block';
      legend_info("None");
  } else {
    if (clickedLayer == 'Bulk Storage Sites') {
      map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
      map.setLayoutProperty('MOSF', 'visibility', 'visible');
      map.setLayoutProperty('CBS', 'visibility', 'visible');
      map.setLayoutProperty('SUPERFUND2', 'visibility', 'visible');
    } else if (clickedLayer == "Percent Uninsured") {
      map.setPaintProperty(clickedLayer, 'fill-opacity', 1);
      map.setPaintProperty("Percent Uninsured Unreliable", 'fill-opacity', 1);
      map.setPaintProperty("Percent Uninsured Hatch", 'fill-opacity', 1);
    } else if (clickedLayer.includes("Percent") || clickedLayer.includes("Median Household Income")) {
      map.setPaintProperty(clickedLayer, 'fill-opacity', 1);
      map.setPaintProperty(clickedLayer + " Hatch", 'fill-opacity', 1);
    } else {
      map.setPaintProperty(clickedLayer, 'fill-opacity', 1);
    }
    document.getElementById(toggleableLegendIds[clickedLayer]).style.display = 'block';
    legend_info(clickedLayer)
  }
}


function legend_info(clickedLayer){
  //update legend info to match clicked layer
  document.getElementById('legendinfo').innerHTML ='<div style="margin-top:-10px;">'
  +'<p><h4>Source</h4>'
  +'<small>'+ vlayer[clickedLayer]["source"] +'</br></br></small>'
  +'<h4>Description</h4>'
  +'<small>' + vlayer[clickedLayer]["text"] + '</small></p>'
  +'</div>';
}

function show_legend_info(){
  // show or hide legend info by clicking button
  if (document.getElementById('legendinfo').style.display.includes("block")){
    document.getElementById('legendinfo').style.display='none';
    document.getElementById('legendseam').style.display='none';
  } else {
    document.getElementById('legendinfo').style.display='block';
    document.getElementById('legendseam').style.display='block';
  }
}

// reset map view
function reset_map_view(event){
  var flyopts = {
    zoom: 10,
    center: [-73.9978, 40.7209],
    bearing: 0,
    pitch:0,
  }
  map.flyTo(flyopts)
  var global_page=0;
  showinfobox(event,"none")
}

// turn on / off explore and story listeners
// listeners 101: map.on makes it listen, map.off makes it stop
// map.on/off("event",("layer"),"Listerner function")

function manage_listeners(active_listener){

  var blankgeojson = {
    "type": "FeatureCollection",
    "features": []
  };
  // kill manage_listeners
  map.off('click', query_point)
  //map.off('mousemove',"SMIAfill",which_smia);
  map.off('mousemove',which_smia)
  map.off('click',smia_click)
  //remove marker and info
  map.getSource('single-point').setData(blankgeojson);
  overlay.innerHTML = '';
  // selectively activate listeners
  if (active_listener.includes("story")){
    //map.on('mousemove',"SMIAfill",which_smia);
    //map.on('mousemove',which_smia);
    //map.on('click',smia_click)
    global_page = 0;
    story_display_page(global_page)
  }
  if (active_listener.includes("explore")){
    map.on('click',query_point);
  }
}

  // ------------------------------------------
  // |-------    I N F O    B O X     --------|
  // ------------------------------------------

  // MH: sloppy way of showing and hiding infobox
  //https://www.w3schools.com/howto/howto_js_tabs.asp
  function showinfobox(evt,boxname){
    //variables
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

    if (killallboxes!=1) {
      // show the current box and make it active!
      document.getElementById(boxname).style.display = "block";
      evt.currentTarget.className += " active";
      if (evt.currentTarget.id.includes("story")) {
        manage_listeners("story")
      } else if (evt.currentTarget.id.includes("explore")) {
        manage_listeners("explore")
      }
    } else {manage_listeners("none")}
  }

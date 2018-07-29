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

// MH: this now happens with VISIBILITY instead of opacity (to support markers)
for (var i = 0; i < toggleableLayerIds.length; i++) {
  var id = toggleableLayerIds[i];
  var link = document.createElement('a');
  link.href = '#';
  link.textContent = id;
  if (id === 'Percent People of Color') {
    link.className = 'active';
    legend_info('Percent People of Color')
  } else {
    link.className = '';
  }
  link.id = 'toggler-' + id
  link.onclick = function(e) {
    var clickedLayer = this.textContent;
    e.preventDefault();
    e.stopPropagation();
    for (var j = 0; j < toggleableLayerIds.length; j++) {
      var otherLayerName = toggleableLayerIds[j]
      if (otherLayerName != clickedLayer) {
        document.getElementById('toggler-' + otherLayerName).className = '';
        if (otherLayerName == 'Bulk Storage Sites') {
          map.setLayoutProperty(otherLayerName, 'visibility', 'none');
          map.setLayoutProperty('MOSF', 'visibility', 'none');
          map.setLayoutProperty('CBS', 'visibility', 'none');
          map.setLayoutProperty('SUPERFUND2', 'visibility', 'none');
        } else {
          map.setPaintProperty(otherLayerName, 'fill-opacity', 0);
        }
        document.getElementById(toggleableLegendIds[otherLayerName]).style.display = 'none';
      }
    }
    this.className = 'active';
    if (clickedLayer == 'Bulk Storage Sites') {
      map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
      map.setLayoutProperty('MOSF', 'visibility', 'visible');
      map.setLayoutProperty('CBS', 'visibility', 'visible');
      map.setLayoutProperty('SUPERFUND2', 'visibility', 'visible');
    } else {
      map.setPaintProperty(clickedLayer, 'fill-opacity', 1);
    }
    document.getElementById(toggleableLegendIds[clickedLayer]).style.display = 'block';
    legend_info(clickedLayer)
  };

  var layers = document.getElementById('menu');
  layers.appendChild(link);

};

function legend_info(clickedLayer){
//update legend info to match clicked layer
document.getElementById('legendinfo').innerHTML ='<div style="margin-top:-10px;">'
  +'<p><h4>Source</h4>'
  +'<small>'+legendSource[clickedLayer]+'</br></br></small>'
  +'<h4>Description</h4>'
  +'<small>' + legendText[clickedLayer] + '</small></p>'
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
function reset_map_view(){
  var flyopts = {
    zoom: 10,
    center: [-73.9978, 40.7209]
  }
  map.flyTo(flyopts)
  var global_current_SMIA = -1;
  showinfobox(event,"none")
}

// turn on / off explore and story listeners
// listeners 101: map.on makes it listen, map.off makes it stop
// map.on/off("event",("layer"),"Listerner function")

var global_current_SMIA = -1;

function manage_listeners(active_listener){

  var blankgeojson = {
    "type": "FeatureCollection",
    "features": []
  };
  // kill manage_listeners
  map.off('click', query_point)
  //map.off('mousemove',"SMIAfill",smia_info);
  map.off('mousemove',"SMIAfill",which_smia);
  map.on('click',smia_click)
  //remove marker and info
  map.getSource('single-point').setData(blankgeojson);
  overlay.innerHTML = '';
  // selectively activate listeners
  if (active_listener.includes("story")){
    //map.on('mousemove',"SMIAfill",smia_info);
    map.on('mousemove',"SMIAfill",which_smia);
    map.on('click',smia_click)
    global_current_SMIA = -1;
    fly_to_smia()
  }
  if (active_listener.includes("explore")){
    map.on('click',query_point);
  }
  if (active_listener.includes("smiazoom")){
    map.on('mousemove',"SMIAfill",which_smia);
    map.on('click',smia_click)
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

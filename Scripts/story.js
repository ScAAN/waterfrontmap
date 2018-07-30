
  // -------------------------
  // | S T O R Y ------------
  // -------------------------

  // Two modes: zoomed in and zoomed out
  // ZOOMED OUT:

  /* Two modes: zoomed in and zoomed out
  ZOOMED OUT:
  1) hovering displays shading on SMIA
  2) hovering displays name of SMIA
  3) clicking zooms in on SMIA

  ZOOMED IN:
  1) hovering displays shading on SMIA
  2) displays text about SMIA
  */

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
      fly_to_smia()
    }
  }


  function fly_to_smia(){
    // fly to smia
    var smiaNum = global_current_SMIA;

    // loop back to first SMIA after SMIA 7
    if (global_current_SMIA>6){global_current_SMIA=-1}

    // show the next button
    document.getElementById('nextbutton').style.display = "block";

    // hide the hover layer
    map.setFilter("SMIAhover", ["==", "SMIA_Name", ""]);

    // show the intro if the smianum is negative
    if (smiaNum<0){
      document.getElementById('smiabox').innerHTML = '<p><small> ' + smiaIntro + '</small><br/><br/>Click next to start learning about SMIAs, or click on any SMIA for more information. </p> ';
      var flyopts = {
        zoom: 10,
        center: [-73.9978, 40.7209]
      }
      map.flyTo(flyopts)
      return;
    }

    //flying options
    var flyopts = {
      zoom: 12,
      center: [smiaLat[smiaNum],smiaLng[smiaNum]]
    }

    // now fly!
    map.flyTo(flyopts)

    // turn off non-story listeners
    manage_listeners("none")

    // display information about SMIA
    document.getElementById('smiabox').innerHTML = '<p><strong><big>' + smiaTitle[smiaNum] + '</big></strong>' + '<small></br></br>' + smiaDescription[smiaNum] + '</br></br><strong>Source:</strong> <a href="https://www1.nyc.gov/assets/planning/download/pdf/plans-studies/vision-2020-cwp/vision2020/appendix_b.pdf">VISION 2020 comprehensive waterfront plan, Appx. B</a>' + '</small></p>';
  }


  function fly_next(){
    // fly to the next SMIA using the next button
    // update the global SMIA number to be SMIA+1 (for next click)
    global_current_SMIA = global_current_SMIA+1;
    fly_to_smia()
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

/*
sharemap.js
functions which relate to sharing and printing the map
needs: filesaver.js (eligrey), html2canvas (Niklas von Hertzen)
how it works:
1) convert map to canvas using mapbox
2) convert controls to canvas using html2my_canvas
3) convert canvases to images and draw onto a third canvases
4) convert third canvas to image url and display
5) make available for download and sharing via social media
*/


/* capture the current map! everything from this function*/
function map_capture(){
  // camera flash animation
  capture_animation();
  // wait for the animation to finish and then print the map
  setTimeout(function() {
    print_map()
  }, 10*2+45+20);
}

//https://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object
Date.prototype.mdy = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [(mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd,
          this.getFullYear()
         ].join('-');
};

// get the map canvas and control canvas and merge them into a saveable canvases
function print_map(){
    // show print overlay, loading screen, hide download button
    // make special print header that shows date downloaded, eja and scan logos
    $('printbuttons').style.visibility="hidden";
    var print_date = new Date();
    $('print_text').innerHTML ="&copy NYC-EJA and ScAAN, downloaded from http://scaan.net/waterfrontmap/ on " + print_date.mdy();
    //$('print_date').innerHTML = '<p>Downloaded: <small>' + print_date + '</small></p>';
    $('infobarprint').style.display="block";
    $('legendinfobutton').style.visibility="hidden";

    // add back attribution
    $('drawn_attribution').style.display="block";
    $('print_container').style.display="block";
    // loadheight = screenheight*2*dispsca/2
    var loadheight = (screen.height*2)/12;
    $('myscreenshot').height = loadheight + 'px';
    $('myscreenshot').innerHTML = '<img src="Assets/images/loadloop.gif" style="margin-top:100px;" height=' + loadheight + 'px/>';
    $('screenshot_txt').innerHTML = "capturing current map view . . .</br>";


    // start attempting to render map controls
    html2canvas(document.getElementById("test_container"),{backgroundColor:null},{allowTaint:false},{useCORS:true}).then(function(canvas) {
      // get map as canvas then as image
      var mapcan  = map.getCanvas().toDataURL();
      // get control canvas as image
      var imgcan = new Image();
      // we probably need this crossOrigin Anonymous for chrome (doublecheck)
      imgcan.crossOrigin = "Anonymous";
      imgcan = canvas.toDataURL();
      // now we start to draw the images onto "my_canvas"
      var img1 = imgcan;
      var img2 = mapcan;
      var c = $('my_canvas');
      var ctx=c.getContext("2d");
      var imageObj1 = new Image();
      var imageObj2 = new Image();
      imageObj1.src = img1;
      // start drawing once the first and second images are loaded
      imageObj1.onload = function() {
         imageObj2.src = img2;
         imageObj2.onload = function() {
           /* make the canvas intentionally bigger before drawing
           (so that the resolution is higher) */
           var mysca = 2;
           var dispsca = 6;
           var wid = imageObj2.width*mysca;
           var hei = imageObj2.height*mysca;
           c.width=wid;
           c.height=hei;
           // DRAW NOW!
           ctx.drawImage(imageObj2, 0, 0, wid,hei);
           ctx.drawImage(imageObj1, 0, 0, wid,hei);
           //convert canvas to url and display
           var img = c.toDataURL();
           var htpx = hei/dispsca;
           $('screenshot_txt').innerHTML = " . . . map view captured!</br><small>      download or share below</small>";
           $('myscreenshot').innerHTML = '<img id="mapcapture" src="' + img + '" style="border: 1px solid rgba(0,0,0,1);margin:auto;" height=' + htpx + 'px/>';
           //$('share_download').innerHTML = '<a href="' + img +  '" download="wfm_mapview.png" style="color:white;">download</a>';
           // hide print infobar, drawn attribution and show print buttons
           $('infobarprint').style.display="none";
           $('drawn_attribution').style.display="none";
           $('legendinfobutton').style.visibility="visible";
           $('printbuttons').style.visibility="visible";
           // reset file name input box
           // and add one to it for every time a screen is captured
           $('download_name_input').value = '';
           var pic_num = Number($('download_name_input').placeholder.charAt(13))+1;
           $('download_name_input').placeholder = 'WJPscreenshot' + pic_num;
         }
      };
    });
}

// save the captured image as a png
function savefile(){
  if ($("download_name_input").value==''){
    var file_name = $('download_name_input').placeholder;
  } else {
    var file_name = $("download_name_input").value;
  }
  saveAs($('mapcapture').src, file_name + ".png");
}

// camera flash animation to indicate to use screen is being captured
function capture_animation(){
  $('flashdiv').style.opacity=1;
  $('flashdiv').style.width="100%";
  $('flashdiv').style.height="100%";

  setTimeout(function() {
    $('flashdiv').style.opacity=0;
    $('flashdiv').style.width="0%";
    $('flashdiv').style.height="0%";
  }, 10*2+45);/* Shutter speed (double & add 45) */
}

/* sharing links for social media
we could also share the image via social media using APIs
but the printing is already bulky
*/
function sharevia(platform){
  var generated_link = "";
  var url = window.location.href;
  var url = "http://scaan.net/waterfrontmap/";
  console.log(url)
  if (platform=="facebook"){
    generated_link = `https://www.facebook.com/sharer.php?u=${url}`
  } else if (platform=="twitter"){
    generated_link = `https://twitter.com/share?url=${url}`;
  } else if (platform=="email"){
    generated_link =`mailto:{email_address}?subject={title}&body={text}`;
  }
  window.open(generated_link)
}

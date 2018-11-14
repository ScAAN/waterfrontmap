
function map_capture(){
  capture_animation();
  setTimeout(function() {
    print_map()
  }, 10*2+45+45);
}

function print_map(){
    $('printbuttons').style.visibility="hidden";
    var print_date = new Date();
    $('print_date').innerHTML = '<p>Downloaded: <small>' + print_date + '</small></p>';
    $('infobarprint').style.display="block";
    $('print_container').style.display="block";
    var loadheight = (screen.height*2)/6;
    $('myscreenshot').height = loadheight + 'px';
    $('myscreenshot').innerHTML = '<img src="Assets/images/loadloop.gif" style="margin:auto;" height=' + loadheight + 'px/>';
    $('screenshot_txt').innerHTML = "capturing current map view...";
    html2canvas(document.getElementById("test_container"),{backgroundColor:null},{allowTaint:false},{useCORS:false}).then(function(canvas) {
      var mapcan  = map.getCanvas().toDataURL();
      var imgcan = new Image();
      imgcan.crossOrigin = "Anonymous";
      imgcan = canvas.toDataURL();
      //dispimg(mapcan,imgcan)
      var img1 = imgcan;
      var img2 = mapcan;
      var c = $('my_canvas');
      var ctx=c.getContext("2d");
      var imageObj1 = new Image();
      var imageObj2 = new Image();
      imageObj1.src = img1;
      imageObj1.onload = function() {
         imageObj2.src = img2;
         imageObj2.onload = function() {
           var mysca = 2;
           var wid = imageObj2.width*mysca;
           var hei = imageObj2.height*mysca;
           c.width=wid;
           c.height=hei;
           ctx.drawImage(imageObj2, 0, 0, wid,hei);
           ctx.drawImage(imageObj1, 0, 0, wid,hei);
           //var img = c.toDataURL("image/png");
           var img = c.toDataURL();
           var htpx = hei/6;
           $('screenshot_txt').innerHTML = "...map view captured!";
           $('myscreenshot').innerHTML = '<img id="mapcapture" src="' + img + '" style="border: 1px solid rgba(0,0,0,1);margin:auto;" height=' + htpx + 'px/>';
           //$('share_download').innerHTML = '<a href="' + img +  '" download="wfm_mapview.png" style="color:white;">download</a>';
           $('share_download').innterHTML = 'download'
           $('infobarprint').style.display="none";
           $('printbuttons').style.visibility="visible";
         }
      };
    });
}

function savefile(){
  console.log($('mapcapture').src)
  saveAs($('mapcapture').src, "map_download.png");
}

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


function print_map(){
    var print_date = new Date();
    $('print_date').innerHTML = '<p>Downloaded: <small>' + print_date + '</small></p>';
    $('infobarprint').style.display="block";
    $('print_container').style.display="block";
    var loadheight = screen.height/5;
    $('myscreenshot').innerHTML = '<img src="Assets/images/loadloop.gif" height=' + loadheight + 'px/>';
    $('screenshot_txt').innerHTML = "map rendering...";
    html2canvas(document.getElementById("test_container"),{backgroundColor:null},{allowTaint:false},{useCORS:false}).then(function(canvas) {
      tempcan = document.getElementById("myscreenshot").appendChild(canvas);
      tempcan.style.width="100%";
      tempcan.style.height="100%";
      var mapcan  = map.getCanvas().toDataURL();
      var imgcan = new Image();
      imgcan.crossOrigin = "Anonymous";
      imgcan = canvas.toDataURL();
      //dispimg(mapcan,imgcan)
      tempcan.style.display = "none";
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
           c.style.display="none"
           ctx.drawImage(imageObj2, 0, 0, wid,hei);
           ctx.drawImage(imageObj1, 0, 0, wid,hei);
           //var img = c.toDataURL("image/png");
           var img = c.toDataURL();
           console.log(img)
           var htpx = hei/5;
           $('screenshot_txt').innerHTML = "map screen captured!";
           $('myscreenshot').innerHTML = '<img id="mapcapture" src="' + img + '" style="border: 1px solid rgba(0,0,0,1);margin:auto;" height=' + htpx + 'px/>';
           //$('share_download').innerHTML = '<a href="' + img +  '" download="wfm_mapview.png" style="color:white;">download</a>';
           $('share_download').innterHTML = 'download'
           $('infobarprint').style.display="none";
         }
      };
    });
}

function savefile(){
  console.log($('mapcapture').src)
  saveAs($('mapcapture').src, "map_download.png");
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

var convertExcel=require("excel-as-json").processFile;
console.log(convertExcel)
convertExcel("story_text.xlsx","story_text_raw.json")
var requestURL = 'https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Scripts/story_text_raw.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';

var storyvars, pageSMIAIdx, global_max_page;
request.onload = function() {
  var data = request.response;
  var zoomMat = [10,12,12,12,12,12,12,12];
  var latMat = [-73.9978,-73.97256593122793,-73.93480042828487,-74.23091192935536,-74.00743616089453,-73.8939875925258,-74.01499944630518,-74.13713363755667];
  var lngMat = [40.7209,40.70337539892057, 40.73043814252142, 40.5505517824447, 40.68650785503232, 40.80730643781723, 40.658442081047724, 40.64057887695694];
  var SMIA_first_page = [0,0,0,0,0,0,0,0]
  console.log(data)
  var njson = data.length;
  console.log(njson)
  for (page=0;page<njson;page++){
    var SMIA = data[page]["pageSMIA"];
    data[page]["pageZoom"] = zoomMat[SMIA];
    data[page]["pageLng"]  = lngMat[SMIA];
    data[page]["pageLat"]  = latMat[SMIA];
    if (page>0){
      if (SMIA!=(data[page-1]["pageSMIA"])){
        SMIA_first_page[SMIA] = page;
      }
    }
  }


request.send();

  storyvars = requested_text["data"];
  pageSMIAIdx = requested_text["SMIA_first_page"];
  global_max_page = requested_text["njson"];
  console.log(storyvars)
  console.log(SMIAIdx)
  console.log(global_max_page)
  // initialize global page
  global_page=0;
}

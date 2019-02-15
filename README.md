# EJA Waterfront Justice Project Map

															

[**CURRENT MAP**](http://scaan.net/waterfrontmap/) //
[**FEEDBACK**](https://docs.google.com/forms/d/e/1FAIpQLSdLk8yvCCXT2nSOYlmBfkYXnPkRCpsYjNQWkWgdCgHwmcBTrQ/viewform) //
[**EJA MAPS**](http://www.tandfonline.com/doi/full/10.1080/13549839.2014.949644?scroll=top&needAccess=true) //
[**EJA-WJP INFORMATION**](http://www.nyc-eja.org/campaigns/waterfront-justice-project/)     
     
     
A collaboration between [NYC-EJA](http://www.nyc-eja.org/) and [ScAAN](http://scaan.net/) which maps weather, human industry, and social demographics of Significant Maritime and Industrial Areas (SMIAs).    


> As the threats of climate change increase, destructive storms like Superstorm Sandy, Hurricane Katrina, and Hurricane Harvey will expose the vulnerabilities of costal communities overburdened by industrial and chemical facilities. Of interest are NYC’s Significant Maritime and Industrial Areas (SMIAs), clusters of industry and polluting infrastructure along the waterfront. SMIAs are located in classic environmental justice communities- predominantly low-income communities of color - in the south Bronx, Brooklyn, Queens and Staten Island, which are also hurricane storm surge zones. The WJP is a research and advocacy campaign focusing on community resiliency that seeks to reduce potential toxic exposures and public health risks associated with climate change and storm surge in the City’s industrial waterfront.																							
   
   
<br/>
<img src="https://github.com/ScAAN/waterfrontmap/blob/master/Assets/images/demo.gif" width="350" height="291">

#### How to use
<details><summary> How to add data to the map </summary>
   
A very bare bones guide which assumes some familiarity with mapbox and python.   
1. Convert data to geojson  
2. Validate your geojson (i.e. [mapshaper](https://mapshaper.org/) or something similar)  
3. Take a look at your data with python and do preprocessing or select and existing property in your dataset (i.e. `Perc_POC_P003009`). You can see an example of such a script in `WFM_datahists.ipynb`.   
4. Go to `waterfrontmap.js` and add your geojson as a new source. Alternatively, ask Billy to add your geojson to the vector data. In order to [improve performance](https://www.mapbox.com/help/mapbox-gl-js-performance/), datasets are eventually combined into a single vector tileset using [tippecanoe](https://github.com/mapbox/tippecanoe) which is uploaded to billbrod's mapbox account. This tileset (`data.mbtiles`) can be viewed with [mbview](https://github.com/mapbox/mbview). If you have tippecanoe on your computer, you can use the script at `Processing/tippecanoe.sh` to combine the geojsons into a single vector tileset. Unfortunately, uploading cannot be easily automated, so the person who controls the mapbox account will have to do so.
```javascript
  map.addSource('sealevel2050', {
    "type": "geojson",
    "data": "./Data/SeaLevelRise2050.geojson"
  });
```
5. Go to `waterfrontmap.js` and add a new layer with `map.addLayer`, there are different types of layer such as [fill](https://www.mapbox.com/mapbox-gl-js/style-spec/#layers-fill) or [symbol](https://www.mapbox.com/mapbox-gl-js/style-spec/#layers-symbol) which you can use. Most layers we use will be fill. Set the source as the source as the one made in step 4.   
```javascript
map.addLayer({
  "id": "Sea Level Rise 2050",
  "type": "fill",
  "source": "sealevel2050",
  "paint": {
    "fill-color": "#03a9f4",
    "fill-opacity": 0
  }
},'water2','Bulk Storage Sites','SUPERUND2','CBS','MOSF');
```
6. Add the name and information of your layer in `layer_text.csv`. See the already filled out fields for how to fill this out.   
7. If your layer is just filled colors you can add legend information to `legend_text.csv` (each line of text goes in entry, and each corresponding color goes in color). Otherwise you'll have to make the legend yourself in HTML and add an if statement for it (see the bulk storage layer as an example). Make sure that the `legend` field in `layer_text.csv` matches the name you use in `legend_text.csv`.   
8. Run `text_conversion_small.py` to turn these csv into a json file   
9. Push to github to update the text     
10. That should be it! But it probably won't be. Common issues are in the geojson geography and data typing.



</details>


<details><summary> How to update map text </summary>   
     
Edit the map text using the instructions on [our google sheet](https://docs.google.com/spreadsheets/d/1u3npfNWjwQl6uyFmSp9pwsJrGEn_bcBkErLjIw9J-z8/edit#gid=734073463).
     


</details>

<details><summary> How to add new sprites</summary>
   
Sprites are icons and patterns used by mapbox, but mapbox only has a limited catalogue of built in sprites. To add new sprites we make a custom mapbox style (we currently use [light v8](https://github.com/jingsam/mapbox-gl-styles/blob/master/Light.json)), and point it at a [custom spritesheet](https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Assets/sprite), which is a json file containing information about each sprite.   


1. You can download creative commons-licensed icons at [Noun Project](https://thenounproject.com/) if you credit them properly. Or make your own in [Inkscape](https://inkscape.org/en/).   
2. Recolor or resize your icons in Inkscape as needed.   
3. Once you have some icons, add them to the `all_sprites` folder , they must be SVGs (normal NOT inkscape SVG)   
3. Download [`spritezero-cli`](https://github.com/mapbox/spritezero-cli) or some form of [`spritezero`](https://github.com/mapbox/spritezero)   
4. Run `spritezero sprite` and `spritezero sprite@2x` in the directory above `all_sprites` to make sprite sheets. We need both a normal and an `@2x` version for high DPI monitors.   
5. This will create some files: `sprite.png`, `sprite.json`, `sprite@2x.png`, and `sprite@2x.json`. Push these to github. After it updates your new sprites will be available.


</details>

#### Resources and tutorials
<details><summary>mapbox-gl-js</summary>

- [choropleth tutorial](https://www.mapbox.com/help/choropleth-studio-gl-pt-1/)   
- [mapbox-gl-js API](https://www.mapbox.com/mapbox-gl-js/api/)   
- [mapbox-gl-geocoder](https://www.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder/)   
- [attaching geocoder to DOM nodes](https://bl.ocks.org/tristen/a09627f01d3a3bc54139d52a5eb01386)   
- [mapbox camera](https://www.mapbox.com/help/how-web-apps-work/#the-camera)   
- [style specification](https://www.mapbox.com/mapbox-gl-js/style-spec/)   
- [exporting python data as geojson](https://geoffboeing.com/2015/10/exporting-python-data-geojson/)   
- [converting to geojson with R](https://blog.exploratory.io/creating-geojson-out-of-shapefile-in-r-40bc0005857d)   

</details>
<details><summary>javascript, html, and css</summary>

- [tabbed browsing](https://www.w3schools.com/howto/howto_js_tabs.asp)    
- [working with JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)

</details>

<details><summary>mapping inspiration</summary>

- [#BagItNYC](http://bagitnyc.org/)
- [Manhattan Population Explorer](https://manpopex.us/)   


</details>

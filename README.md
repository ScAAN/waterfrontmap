# EJA Waterfront Justice Project Map
A collaboration between [NYC-EJA](http://www.nyc-eja.org/) and [ScAAN](http://scaan.net/).   
Mapping weather, human industry, and social demographics of SMIAs.    

[**CURRENT MAP**](http://scaan.net/waterfrontmap/) //
[**EJA MAPS**](http://www.tandfonline.com/doi/full/10.1080/13549839.2014.949644?scroll=top&needAccess=true) //
[**EJA-WJP INFORMATION**](http://www.nyc-eja.org/campaigns/waterfront-justice-project/)   
   
   
<img src="https://github.com/ScAAN/waterfrontmap/blob/master/Assets/images/demo.gif" width="350" height="350">

#### Work in progress
<details><summary>Recent changes</summary>
   
- [x] (11/9) Adressing comments and bugs -Maija
- [x] (10/5) Visuals and explore fix -Maija
- [x] (9/30) Various bugfixes -Maija       

</details>

<details><summary>Open issues</summary>

- [ ] Mapbox icons disappearing bug
- [ ] Change data names to be the same in vector data
- [ ] There is some kind of typo in vector data causing `Error at Actor.recieve`
- [ ] Update all sources (double-check sources, re-download and re-process data)

</details>

<details><summary>Feature wish list</summary>  

- [ ] Make python script executable (see [this](https://medium.com/dreamcatcher-its-blog/making-an-stand-alone-executable-from-a-python-script-using-pyinstaller-d1df9170e263) to make the executeable and [this](https://stackoverflow.com/questions/47692213/reducing-size-of-pyinstaller-exe) to reduce the size)  
- [ ] Pay for icons ([here](https://thenounproject.com/coquet_adrien/))   
- [ ] Automate data conversion to vector   
- [ ] New data ([Future High Tide With sea level rise](https://www1.nyc.gov/site/planning/data-maps/open-data.page#waterfront), [FEMA flood insurance](http://www.region2coastal.com/view-flood-maps-data/view-preliminary-flood-map-data/), post irene flooding, sandy impacted zones, manufacturing zoning districts (1-3), total population)   
- [ ] [Comment any extra ideas here](https://docs.google.com/document/d/1FwlZTbRV0J3WiBpiMt1InUbtlwiGd-douNtTXKUXKMo/edit)

</details>

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

<details><summary> How to update story mode </summary>
   
We now have a story mode. This works by reading in the information stored in the csv file `Processing\Text\story_text.csv`, converting it to a json file (`Processing\Text\story_text.json`) which is then hosted on github and read. To use this:    

1. Enter your story into `story_text.csv`, each line is a page, with the specified SMIA (`pageSMIA`), layer (`pageLayer`), title (`pageTitle`), and description text (`pageText`). Please be careful to put exact layer names in the layer field, and specify SMIA's with a number from 0-7 where 0 is a zoomed out view of all the SMIAs.   
2. Save this csv, make sure it is in `Processing\Text\` and it is a normal csv   
3. Run `Processing\text_conversion_small.py`   
4. Push changes to github or upload `story_text.json` manually   
5. Wait for the raw file to refresh (~5 minutes)   
6. Finished! Of course, if there are any typos in the layer names or SMIA numbers in your csv file, strange things might start to happen. Make sure to always check for typos. The most common one is a typo in the layer names which are case sensitive.    

</details>

<details><summary> How to update layer and SMIA text</summary>
   
Information text for layers and SMIAs is now updated through `Processing\Text\general_text.json`. Update this json by editing `Processing\Text\layer_text.csv` and `Processing\Text\smia_text.csv` and converting with `Processing\text_conversion_small.py`. To use this:

1. To control layer information: enter your layer info into `layer_text.csv`, each line is a layer with a layer id (`id`), legend id (`legend`), description text (`text`), and source text (`source`)  
2. To control SMIA information: using `smia_text.csv` enter the smia name (`name`), number (`number`) and hover box description (`description`)   
3. Save these csvs, make sure they are in `Processing\Text\`  
4. Run `Processing\text_conversion_small.py`   
5. Push changes to github or upload `general_text.json` manually   
6. Wait for the raw file to refresh (~5 minutes)   
7. Finished! As with the story, make sure to check for typos.   

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

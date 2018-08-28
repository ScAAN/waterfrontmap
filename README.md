# EJA Waterfront Justice Map Project
A collaboration between [NYC-EJA](http://www.nyc-eja.org/) and [ScAAN](http://scaan.net/).   
Mapping weather, human industry, and social demographics of SMIAs.    

[**CURRENT MAP**](http://scaan.net/waterfrontmap/) //
[**OLD MAPS**](http://www.tandfonline.com/doi/full/10.1080/13549839.2014.949644?scroll=top&needAccess=true) //
[**INFORMATION**](http://www.nyc-eja.org/campaigns/waterfront-justice-project/)

<img src="https://github.com/ScAAN/waterfrontmap/blob/master/Assets/demo.gif" width="350" height="350">

#### Open Issues 
<details><summary>issues</summary> 
   
- [ ] Change data names to be the same in vector data 
- [ ] Add feedback form (see [this](https://stackoverflow.com/questions/38620919/make-contact-form-for-github-page?rq=1) or make a [google form](https://www.google.com/forms/about/))
- [ ] Make python script executable (see [this](https://medium.com/dreamcatcher-its-blog/making-an-stand-alone-executable-from-a-python-script-using-pyinstaller-d1df9170e263) to make the executeable and [this](https://stackoverflow.com/questions/47692213/reducing-size-of-pyinstaller-exe) to reduce the size)
- [ ] Make explore information have consistent order
- [ ] Input error checking for enhanced story 
- [ ] Diag svg doesn't render seamlessly
- [ ] Pay for icons ([here](https://thenounproject.com/coquet_adrien/))
- [ ] Switch to jQuery
   
</details>

#### Changelog
<details><summary>changes</summary>  

- [x] (8/28) Enhanced story mode -Maija
- [x] (8/14) Percent uninsured and cosmetics -Maija 
- [x] (7/29) Checking off to-do list -Maija
- [x] (7/22) Deep cleaning +bugfixes -Maija
- [x] (7/18) Story mode, legend info, bulk storage + bugfixes
- [x] (6/25) Search bar -Maija
- [x] (6/18) Performance improvements -Billy 
- [ ] Automate data conversion to vector
- [ ] New data
- [ ] [Comment any extra ideas here](https://docs.google.com/document/d/1FwlZTbRV0J3WiBpiMt1InUbtlwiGd-douNtTXKUXKMo/edit)

</details>

#### Data
<details><summary>Currently plotted</summary>   

-  (removed) NYC Basic Geography ([mapbox-streets-v7](https://www.mapbox.com/vector-tiles/mapbox-streets-v7/))
-  SMIA ([from NYC planning](https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-wrp.page))
-  Percent people of color ([Census Bulk Download](http://census.ire.org/data/bulkdata.html))
-  Percent below poverty line ([Census fact finder](https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml))
-  Zoning ([inside NYC data portal](http://data.beta.nyc//dataset/635e26b3-2acf-4f55-8780-2619660fdf66/resource/e5528464-9a00-40a7-8b85-21e9b25d6c24/download/d52d598c77484806876b8f897d51f805nyczoning.geojson))
-  Hurricane Storm Surge ([SOURCE???](placeholder))
-  Median household income ([SOURCE???](placeholder))
-  EPA EPCRA Toxics Release Inventory (TRI) sites ([from EPA](https://www.epa.gov/toxics-release-inventory-tri-program/tri-basic-data-files-calendar-years-1987-2016), converted with [OGRE](http://ogre.adc4gis.com/))
- [superfund class 2 sites](https://www.dec.ny.gov/cfmx/extapps/derexternal/index.cfm?pageid=3)
- [active bulk storage facilities (CBS and MOSF)](https://www.dec.ny.gov/cfmx/extapps/derexternal/index.cfm?pageid=4)
- evacuation zone (SOURCE?)
- Percent uninsured (From CHS 2009 @ DOMH) ([source 1](https://a816-healthpsi.nyc.gov/epiquery/CHS/CHSXIndex.html) & [source 2](https://www1.nyc.gov/site/doh/data/health-tools/maps-gis-data-files-for-download.page))


</details>

<details><summary>Future plotting</summary>   

- [Future High Tide With sea level rise?](https://www1.nyc.gov/site/planning/data-maps/open-data.page#waterfront)
- [FEMA flood insurance](http://www.region2coastal.com/view-flood-maps-data/view-preliminary-flood-map-data/) (make sure to look at the metadata)
- post irene flooding
- Sandy Impacted zones
- manufacturing zoning districts (1-3)
- total population

</details>

#### How to use?
<details><summary>How to use enhanced story mode</summary>

We now have a story mode! This works by reading in the information stored in the csv file `Processing\Text\story_text.csv`, converting it to a json file (`Processing\Text\story_text.json`) which is then hosted on github and read.   

To use this:

1. Enter your story into `story_text.csv`, each line is a page, with the specified SMIA (`pageSMIA`), layer (`pageLayer`), title (`pageTitle`), and description text (`pageText`). Please be careful to put exact layer names in the layer field, and specify SMIA's with a number from 0-7 where 0 is a zoomed out view of all the SMIAs. 
2. Save this csv, make sure it is in `Processing\Text\` and it is a normal csv
3. Run `Processing\text_conversion_small.py`
4. Push changes to github or upload `story_text.json` manually
5. Wait for the raw file to refresh (~5 minutes)
6. Finished! 

Of course, if there are any typos in the layer names or SMIA numbers in your csv file, strange things might start to happen. Make sure to always check for typos! 

</details>

<details><summary>How to update text</summary>

Information text for layers and SMIAs is now updated through `Processing\Text\general_text.json`. Update this json by editing `Processing\Text\layer_text.csv` and `Processing\Text\smia_text.csv` and converting with `Processing\text_conversion_small.py`.

To use this:

1. (a) To control layer information: enter your layer info into `layer_text.csv`, each line is a layer with a layer id (`id`), legend id (`legend`), description text (`text`), and source text (`source`)
1. (b) To control SMIA information: using `smia_text.csv` enter the smia name (`name`), number (`number`) and hover box description (`description`)
2. Save these csvs, make sure they are in `Processing\Text\` 
3. Run `Processing\text_conversion_small.py`
4. Push changes to github or upload `general_text.json` manually
5. Wait for the raw file to refresh (~5 minutes)
6. Finished! 

As with the story, make sure to check for typos. 

</details>



<details><summary>How to add info to map (Billy's Guide)</summary>

<details><summary>Old/Basic guide</summary>

1. Convert to geojson (if necessary).
2. Use [mapshaper](http://mapshaper.org/) or similar website to check
   that the geography info in the geojson is correct.
3. Use the notebook `WFM_datahists` jupyter notebook in this directory
   to check the other properties (we should probably re-write the code
   there to make it a little easier to load in geojson and inspect the
   various properties).
4. You may need to add a field that is either a calculation on the
   existing properties (like `Perc_POC_P003009` in
   `reduced_census.geojson`) or a simplification of an existing property
   (like `Human_Readable_Zone` in `nyzd.geojson`)
5. Find the field you want to plot and determine its values.
6. Go to `index.html` and find the various `map.addLayer` commands. If
   your data is categorical, base it on the `"Zoning"` layer; if it's
   numerical, base it on the `"Percent People of Color"`
   layer. Use [Color Brewer](http://colorbrewer2.org/) to find colors
   (python's `seaborn` library also has a very good selection of
   palettes; you can see an example of how to get hex codes from
   `seaborn` at the top of the notebook). Make sure to give your layer
   a descriptive id.
7. Add a legend near the top with the other legends. This should be
   very similar to the `fill-color` field in your layer. Make sure
   your legend has a descriptive id.
8. Find the `toggleableLayerIds`, `toggleableLegendIds`, and
   `dataNames` variables at the bottom of the `index.html` files. Add
   the layer id to `toggleableLayerIds`, the layer id : legend id pair
   to `toggleableLegendIds`, and the property name : some explanatory
   text pair to `dataNames`..
9. That should be it! But it probably won't be. Your browser developer
   tools may help determine what's going on. Common issues are issues
   with the geojson's geography info (but step 2 should've helped you
   check that) and type issues (if the data is stored as a number and
   your comparing it to strings, for example).

</details>

Unfortunately, as of June 17, 2018, that's no longer how we're doing
this.   

In order
to
[improve performance](https://www.mapbox.com/help/mapbox-gl-js-performance/),
we're making all our data vector tilesets and combining them into one
source (both steps
use [tippecanoe](https://github.com/mapbox/tippecanoe); the
`tippecannoe.sh` script handles this, though you'll need to add
newdata sets as necessary). They then have to be uploaded to
billbrod's mapbox account. We probably want it to either be a ScAAN
mapbox account or a project-specific one (rather than a personal one),
eventually, but this will do for now.

The tileset we use is `data.mbtiles` in the Data directory (it can be
viewed using [mbview](https://github.com/mapbox/mbview), but we cannot
load data from a local tileset for some reason).

The above steps (Old/Basic guide) will still get data on the map and should be used for
testing and as a stop-gap, but eventually we'll want to make sure the
data is folded into the tileset we're using.

</details>

<details><summary>How to add new sprites</summary>

Adding new sprites is annoying. In order to do this, you need to:
create a custom sprite sheet
(using [spritezero](https://github.com/mapbox/spritezero)), put that
sprite sheet somewhere on the internet, and use a custom style.json to
point to it in
the
[sprite property](https://www.mapbox.com/mapbox-gl-js/style-spec/#sprite). Currently,
we do this using
the
[light v8 style.json](https://github.com/jingsam/mapbox-gl-styles/blob/master/Light.json),
which was the best one I could find. This is slightly different than
the light v9 we were using earlier.

A variety of Creative Commons-licensed icons can be found
at [the Noun Project](Porjechttps://thenounproject.com/), we then just
need to add about info appropriately (see about.txt in this
directory).

Once you download icons from there, open them up
using [Inkscape](https://inkscape.org/en/) and resize / recolor them
as needed. The `-15` icons in the default mapbox sprite sheet are 21 x
21 pixels, the `-11` ones are 17 by 17. Save these out appropriately,
then run `spritezero` in the directory containing (they must be svgs
and remember move all files you don't want in the sprite sheet) them
like so: `spritezero sprite .` This will create `sprite.png` and
`sprite.json`, which you shold move to the Assets directory in the
project (these spritezero commands can all be handled by the
`sprites.sh` script found in the Processing directory). Then, after
pushing to github, the line `"sprite":
"https://raw.githubusercontent.com/ScAAN/waterfrontmap/master/Assets/sprite",`
in your style.json will correctly load in the sprites.

</details>

#### Resources and tutorials 
<details><summary>Coding resources </summary>

- [mapbox-gl sprites](https://github.com/mapbox/mapbox-gl-styles/tree/master/sprites)
- [mapbox-gl geocoder control](https://github.com/mapbox/mapbox-gl-geocoder)
- [mapbox-gl-js style spec](https://www.mapbox.com/mapbox-gl-js/style-spec/)
- [mapbox-gl-js guide](https://www.mapbox.com/mapbox-gl-js/api/)
- [chloropleth tutorial](https://www.mapbox.com/help/choropleth-studio-gl-pt-1/)
- [choropleth example](https://www.mapbox.com/mapbox-gl-js/example/updating-choropleth/)
- [toggle layers example](https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/)
- [static map API](https://www.mapbox.com/help/how-static-maps-work/)
- [making geojsons with python](http://geoffboeing.com/2015/10/exporting-python-data-geojson/)
- [tabbed browsing with CSS and js](https://www.w3schools.com/howto/howto_js_tabs.asp)
- [removing mapbox labels](https://stackoverflow.com/questions/43841144/remove-all-labels-on-mapbox-gl-js)

</details>

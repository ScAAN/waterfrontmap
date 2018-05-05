# EJA Waterfront Justice Map Project
mapping weather, human industry, and social demographics of SMIAs  
  
**CURRENT MAP**: http://scaan.net/waterfrontmap/  
**INFORMATION**: [general information from EJA](http://www.nyc-eja.org/campaigns/waterfront-justice-project/), [peer reviewed EJA paper](http://www.tandfonline.com/doi/full/10.1080/13549839.2014.949644?scroll=top&needAccess=true)  
**PLAN**: Meet EJA in early May (?) + fix minor NA issues when clicking through the map

### Changes to the whole code 
- Layers now turn on and off via `format->visibility instead` of `paint->opacity`, as a consequence of this, there are now some invisible layers for hovering 
- Removed `float:center` and a bunch of style properties that I don't think were doing anything. I hope that didn't break anything?
- I got two line legend text to work with a kind of ugly solution: a div floated right containing a div with two lines of text and a span with the legend item. 

### To do!
 
- [x] Add toggle abilities 
- [x] Add hovering capability
- [ ] Clean the code 
- [ ] Make no data spaces hatched 
- [ ] Add address hone-in capability
- [ ] Continue to add new data
- [ ] [Comment any extra ideas here](https://docs.google.com/document/d/1FwlZTbRV0J3WiBpiMt1InUbtlwiGd-douNtTXKUXKMo/edit)

## Data 

### Currently plotted
-  NYC Basic Geography ([mapbox-streets-v7](https://www.mapbox.com/vector-tiles/mapbox-streets-v7/))
-  SMIA ([from NYC planning](https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-wrp.page))
-  Percent people of color (needs source!)
-  Percent below poverty line (needs source! Is it from the ACS 2016 downloaded from the [census fact finder?](https://factfinder.census.gov/faces/nav/jsf/pages/download_center.xhtml))
-  Zoning ([from somewhere inside NYC data portal](http://data.beta.nyc//dataset/635e26b3-2acf-4f55-8780-2619660fdf66/resource/e5528464-9a00-40a7-8b85-21e9b25d6c24/download/d52d598c77484806876b8f897d51f805nyczoning.geojson))
-  Hurricane Storm Surge (needs source!)
-  EPA EPCRA Toxics Release Inventory (TRI) sites ([from EPA](https://www.epa.gov/toxics-release-inventory-tri-program/tri-basic-data-files-calendar-years-1987-2016) and converted with [OGRE](http://ogre.adc4gis.com/))

### Unused data sources?
<details><summary>Are we using these? We should probably keep track,</summary>   

- [NYC shape files](https://www1.nyc.gov/site/planning/data-maps/open-data.page) (I don't think we're using this?)
- [Demographic data from ACS](http://www1.nyc.gov/site/planning/data-maps/nyc-population/american-community-survey.page) (How are we downloading this, and is it for race or poverty or both?)
- [Census TIGER data](https://www.census.gov/geo/maps-data/data/tiger-data.html) (I don't think we're using this?)
- [Neighborhood Data](http://data.beta.nyc/dataset/pediacities-nyc-neighborhoods) (I don't think we're using this?)
- [Poverty Data](https://factfinder.census.gov/faces/tableservices/jsf/pages/productview.xhtml?src=bkmk) (But the link is broken)
  
</details>

### To plot in the future
- [FEMA flood insurance](http://www.region2coastal.com/view-flood-maps-data/view-preliminary-flood-map-data/) (make sure to look at the metadata)
- Percent uninsured (From the Community Health Survey 2009 at the Department Of Health
  and Mental Health) ([current data](https://a816-healthpsi.nyc.gov/epiquery/CHS/CHSXIndex.html) & [also current data?](https://www1.nyc.gov/site/doh/data/health-tools/maps-gis-data-files-for-download.page))
- [superfund class 2 sites](https://www.dec.ny.gov/cfmx/extapps/derexternal/index.cfm?pageid=3) (needs to be geocoded)
- [active bulk storage facilities (PBS and MOSF)](https://www.dec.ny.gov/cfmx/extapps/derexternal/index.cfm?pageid=4) (needs to be geocoded)
- post irene flooding

## Recent Notes
### How to add info to map (Billy's Guide) 
<details><summary> </summary>
	
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

### Feedback/Notes from presentation on Wednesday, March 7

<details><summary> </summary>  
	
Presented the map we have so far to the broader ScAAN group to try and
get people's impressions and hear some feedback. 
People were very
impressed with the map and thought, if we could make it more general,
that it would be a powerful framework to try and visualize inequity
across the city. Would also be very cool (though fairly difficult) to do a Monte
Carlo-type approach as used in gerrymandering cases: how do the
current distributions of SMIAs compare to randomly generated ones? People made a bunch of things for other
data they'd be interested in seeing on the map:  

 - air quality index (apparently real estate agents have access to
   this somehow)
 - total population
 - hospital admissions for asthma or other environmental-related
   issues (though probably too complex?)
 - what's in the SMIA (both the points shown in the report as well as
   information on the businesses / plants there)
 - average income
 - school funding
 - distance to / wait at nearest polling place

</details>



## Extras
<details><summary> Coding resources </summary>  
	
### Coding Sources
- [pyshp](https://pypi.python.org/pypi/pyshp), python library that
  looks like it might be able to read shape files and write GeoJSONs.
    - [gist](https://gist.github.com/frankrowe/6071443) to read in a
      shape file and save a GeoJSON
- [mapbox](https://www.mapbox.com/), the platform we're using
- [#BagItNYC map](http://bagitnyc.org/map/), map that partly inspired
  us

### Mapbox resources
- [how to add layers](https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/)
- [how to make a choropleth](https://www.mapbox.com/help/choropleth-studio-gl-pt-1/)
- [style specs](https://www.mapbox.com/mapbox-gl-js/style-spec/)
- [choropleth example](https://www.mapbox.com/mapbox-gl-js/example/updating-choropleth/)
- [this](https://www.mapbox.com/help/mapbox-gl-js-expressions/) will
  probably be helpful in drawing a circle with a half mile / mile
	  radius from the SMIA borders
</details>


<details><summary> Older version Maps </summary>

- [Billy's](https://api.mapbox.com/styles/v1/billbrod/cj97ob0wq0s2w2rph9kkdgpck.html?fresh=true&title=true&access_token=pk.eyJ1IjoiYmlsbGJyb2QiLCJhIjoiY2o5N21wOWV5MDFlYjJ5bGd4aW9jZWwxNiJ9.LpT502DJ1ruuPRLp3AW_ow#10.0/40.675708/-73.891521/0)
- [Maija's](https://api.mapbox.com/styles/v1/mh3155/cjcp8bg653u402rprz0sf5jl6.html?fresh=true&title=true&access_token=pk.eyJ1IjoibWgzMTU1IiwiYSI6ImNqOXJqNHJ5YTZjd28ycXM0Z2dubTJjaXMifQ.czkeapIuZDbzsydf5oH7wg#9.6/40.724588/-73.998055/0)
</details>

<details><summary> Old notes </summary>
	
### Brainstorm Goals of this project: make a very cool interactive map
I. What information should it show?
Relevant quantities of interest mapped across significant maritime and industrial areas (SMIAs)
Currently they are showing:
1. weather events
    - storm surges (NYSEMO Hurricane Storm Surge Zones)
    - damage from Irene
2. land use (is it residential / commercial etc?)
3. threats to public health and dangerous /toxic businesses 
    - manufacturing zoning districts
    - Class 2 superfund sites
    - DEC active bulk storage facilities
    - EPCRA toxic release inventory sites
4. all contrasted against social issues
    - how many POC live in the area
    - population below 200% poverty
    - percent population uninsured
    
II. What cool things should it do (product experience)?
- switch layers
- scroll
- zoom
- clicking to see things
- time courses if data allows for it?

III. What is the data like?
Aggregated from many public sources but it seems some is private since they say they it “relies, wherever possible, on publicly available data-sets and methodologies that could be reproduced by city planners and EJ communities working in collaboration”. But we can probably ask them for their downloaded / aggregated copy?  
-  [New York citys Waterfront Revitalization Program](https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-wrp.page)- information geodata/ shapefiles about SMIA, CZB and other types of waterfront boundaries
- Storm surges -> New York state emergencey management office
- Land zoning and use -> NYC dept of planning
- Toxics -> US EPA TRI programme
- Demographics-> from the US census bureau and NYC-DOMH  


IV. What map making tool is the best for these constraints? 
- Brainstorm options / pros / cons (*** recommended by others)
- Openlayers ***
- Leaflet 
- MapBox ***
- SVG
- Google fusion tables
- Google maps API
- CartoDB
- QGIS
- D3
- Tableau
</details>



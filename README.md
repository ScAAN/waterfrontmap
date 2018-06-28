# EJA Waterfront Justice Map Project
A collaborative project between the [NYC-EJA](http://www.nyc-eja.org/) and [ScAAN](http://scaan.net/). Mapping weather, human industry, and social demographics of SMIAs.     
  
Industrial and maritime development is encouraged by zoning regulations that have created Special Maritime and Industrial Areas (SMIAs) -- areas with a less strict approval process than other waterfront applications. These designations were given in largely low-income communities of color without considering climate change impacts and vulnerable populations in these areas. The NYC-EJA advocates for regulations to protect those who live and work around the SMIAs by promoting the safe and responsible use of hazardous materials and toxic chemicals, as well as supporting climate change adaptation measures. 
  
**CURRENT MAP**: http://scaan.net/waterfrontmap/  
**OLD MAPS**: [EJA peer reviewed paper](http://www.tandfonline.com/doi/full/10.1080/13549839.2014.949644?scroll=top&needAccess=true)   
**INFORMATION**: [EJA-WJP website](http://www.nyc-eja.org/campaigns/waterfront-justice-project/)

### Changes 
<details><summary>Latest</summary>  
	
- [x] (6/25) Search bar -Maija
- [x] (6/18) Performance improvements -Billy
- [x] (6/17) Legend fix -Maija

</details>
<details><summary>Upcoming</summary>  
	
- [ ] Deep clean of code
- [ ] Make no data areas hatched 
- [ ] New data
- [ ] [Comment any extra ideas here](https://docs.google.com/document/d/1FwlZTbRV0J3WiBpiMt1InUbtlwiGd-douNtTXKUXKMo/edit)

</details>

### Data 
<details><summary>Currently plotted</summary>   
	
-  NYC Basic Geography ([mapbox-streets-v7](https://www.mapbox.com/vector-tiles/mapbox-streets-v7/))
-  SMIA ([from NYC planning](https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-wrp.page))
-  Percent people of color ([Census Bulk Download](http://census.ire.org/data/bulkdata.html))
-  Percent below poverty line ([Census fact finder](https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml))
-  Zoning ([inside NYC data portal](http://data.beta.nyc//dataset/635e26b3-2acf-4f55-8780-2619660fdf66/resource/e5528464-9a00-40a7-8b85-21e9b25d6c24/download/d52d598c77484806876b8f897d51f805nyczoning.geojson))
-  Hurricane Storm Surge ([SOURCE???](placeholder))
-  Median household income ([SOURCE???](placeholder)) 
-  EPA EPCRA Toxics Release Inventory (TRI) sites ([from EPA](https://www.epa.gov/toxics-release-inventory-tri-program/tri-basic-data-files-calendar-years-1987-2016), converted with [OGRE](http://ogre.adc4gis.com/))

</details>

<details><summary>Future plotting</summary>   
	
- [FEMA flood insurance](http://www.region2coastal.com/view-flood-maps-data/view-preliminary-flood-map-data/) (make sure to look at the metadata)
- Percent uninsured (From CHS 2009 @ DOMH) ([source 1](https://a816-healthpsi.nyc.gov/epiquery/CHS/CHSXIndex.html) & [source 2](https://www1.nyc.gov/site/doh/data/health-tools/maps-gis-data-files-for-download.page))
- [superfund class 2 sites](https://www.dec.ny.gov/cfmx/extapps/derexternal/index.cfm?pageid=3) (needs geocoding)
- [active bulk storage facilities (PBS and MOSF)](https://www.dec.ny.gov/cfmx/extapps/derexternal/index.cfm?pageid=4) (needs geocoding)
- post irene flooding
- manufacturing zoning districts (1-3)

</details>

### User guide
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

In order to [improve performance](https://www.mapbox.com/help/mapbox-gl-js-performance/),
we're making all our data vector tilesets and combining them into one
source (both steps use [tippecanoe](https://github.com/mapbox/tippecanoe)). They then
have to be uploaded to billbrod's mapbox account. We probably want it
to either be a ScAAN mapbox account or a project-specific one (rather
than a personal one), eventually, but this will do for now. 

The tileset we use is `data.mbtiles` in the Data directory (it can be
viewed using [mbview](https://github.com/mapbox/mbview), but we cannot
load data from a local tileset for some reason).

The above steps (Old/Basic guide) will still get data on the map and should be used for
testing and as a stop-gap, but eventually we'll want to make sure the
data is folded into the tileset we're using.
   
</details>



### Extras
<details><summary>Misc. data sources</summary>   

- [NYC shape files](https://www1.nyc.gov/site/planning/data-maps/open-data.page)
- [Demographic data from ACS](http://www1.nyc.gov/site/planning/data-maps/nyc-population/american-community-survey.page)
- [Census TIGER data](https://www.census.gov/geo/maps-data/data/tiger-data.html)
- [Neighborhood Data](http://data.beta.nyc/dataset/pediacities-nyc-neighborhoods)
- [Poverty Data](https://factfinder.census.gov/faces/tableservices/jsf/pages/productview.xhtml?src=bkmk)
  
</details>

<details><summary>Coding resources </summary>
	
- [mapbox-gl sprites](https://github.com/mapbox/mapbox-gl-styles/tree/master/sprites)
- [mapbox-gl geocoder control](https://github.com/mapbox/mapbox-gl-geocoder)
- [mapbox-gl-js style spec](https://www.mapbox.com/mapbox-gl-js/style-spec/)
- [chloropleth tutorial](https://www.mapbox.com/help/choropleth-studio-gl-pt-1/)
- [choropleth example](https://www.mapbox.com/mapbox-gl-js/example/updating-choropleth/)
- [toggle layers example](https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/)

</details>

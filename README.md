# EJA Waterfront Justice Map Project
mapping weather, human industry, and social demographics of SMIAs


## Current Plan!
1. Meet EJA in early May to get feedback
2. Fix minor NA issues when clicking through the map


## Current map 
http://scaan.net/waterfrontmap/


# Plotted Already
-  NYC Basic Geography
-  SMIA
-  % people of color *
-  Zoning
-  Hurricane Storm Surge
-  % of Families Below People Of Color


# Potential New Data
- [FEMA flood insurance](http://www.region2coastal.com/view-flood-maps-data/view-preliminary-flood-map-data/),
the shapefile download is a zip file that has many shapefiles, the
metadata.txt file in that directory contains information describing
what each of them are.
- % uninsured Community Health Survey 2009 Department Of Health
  and Mental Health * (Current Data: https://a816-healthpsi.nyc.gov/epiquery/CHS/CHSXIndex.html & https://www1.nyc.gov/site/doh/data/health-tools/maps-gis-data-files-for-download.page)
- % below 200% of poverty level *
- EPA EPCRA toxics release inventory Toxics Release Inventory
  (TRI) sites *
  ([from EPI website](https://www.epa.gov/enviro/geospatial-data-download-service) and
  then convert to geojson
  using [togeojson](https://github.com/mapbox/togeojson))
- superfund class 2 sites 
- active bulk storage facilities
- post irene flooding


## Current to do
- Add Toggle Abilities
- Add Hovering Capability
- Add Address Hone-in Capability
- Continue To Add New Data
- (Any extra idea's, comment them here: https://docs.google.com/document/d/1FwlZTbRV0J3WiBpiMt1InUbtlwiGd-douNtTXKUXKMo/edit)

# Recent Notes For Project

## How to add info to map (Billy's Guide)

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

## Feedback/Notes from presentation on Wednesday, March 7

Presented the map we have so far to the broader ScAAN group to try and
get people's impressions and hear some feedback. People were very
impressed with the map and thought, if we could make it more general,
that it would be a powerful framework to try and visualize inequity
across the city. To that end, people made a bunch of things for other
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
 
would also be very cool (though fairly difficult) to do a Monte
Carlo-type approach as used in gerrymandering cases: how do the
current distributions of SMIAs compare to randomly generated ones?

## Older Version Maps

- [Billy's](https://api.mapbox.com/styles/v1/billbrod/cj97ob0wq0s2w2rph9kkdgpck.html?fresh=true&title=true&access_token=pk.eyJ1IjoiYmlsbGJyb2QiLCJhIjoiY2o5N21wOWV5MDFlYjJ5bGd4aW9jZWwxNiJ9.LpT502DJ1ruuPRLp3AW_ow#10.0/40.675708/-73.891521/0)
- [Maija's](https://api.mapbox.com/styles/v1/mh3155/cjcp8bg653u402rprz0sf5jl6.html?fresh=true&title=true&access_token=pk.eyJ1IjoibWgzMTU1IiwiYSI6ImNqOXJqNHJ5YTZjd28ycXM0Z2dubTJjaXMifQ.czkeapIuZDbzsydf5oH7wg#9.6/40.724588/-73.998055/0)


## General Information
- [General information NYC EJA waterfront justice](http://www.nyc-eja.org/campaigns/waterfront-justice-project/)
- [Peer reviewed EJA paper](http://www.tandfonline.com/doi/full/10.1080/13549839.2014.949644?scroll=top&needAccess=true)


## Current Sources
- [NYC shape files](https://www1.nyc.gov/site/planning/data-maps/open-data.page)
- [Demographic data from ACS](http://www1.nyc.gov/site/planning/data-maps/nyc-population/american-community-survey.page)
- [New York citys Waterfront Revitalization Program](https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-wrp.page)-
  information geodata/ shapefiles about SMIA, CZB and other types of
  waterfront boundaries
- [Census TIGER data](https://www.census.gov/geo/maps-data/data/tiger-data.html),
  we should look into the licensing of this to make sure we can use it
  freely and publically
- [Zoning Data] (http://data.beta.nyc//dataset/635e26b3-2acf-4f55-8780-2619660fdf66/resource/e5528464-9a00-40a7-8b85-21e9b25d6c24/download/d52d598c77484806876b8f897d51f805nyczoning.geojson)
- [Neighborhood Data] (http://data.beta.nyc/dataset/pediacities-nyc-neighborhoods)
- [Poverty Data] (https://factfinder.census.gov/faces/tableservices/jsf/pages/productview.xhtml?src=bkmk)
  
  
## Coding Sources
- [pyshp](https://pypi.python.org/pypi/pyshp), python library that
  looks like it might be able to read shape files and write GeoJSONs.
    - [gist](https://gist.github.com/frankrowe/6071443) to read in a
      shape file and save a GeoJSON
- [mapbox](https://www.mapbox.com/), the platform we're using
- [#BagItNYC map](http://bagitnyc.org/map/), map that partly inspired
  us


## Mapbox resources

- [how to add layers](https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/)
- [how to make a choropleth](https://www.mapbox.com/help/choropleth-studio-gl-pt-1/)
- [style specs](https://www.mapbox.com/mapbox-gl-js/style-spec/)
- [choropleth example](https://www.mapbox.com/mapbox-gl-js/example/updating-choropleth/)
- [this](https://www.mapbox.com/help/mapbox-gl-js-expressions/) will
  probably be helpful in drawing a circle with a half mile / mile
	  radius from the SMIA borders


# Extra Notes


## Brainstorm Goals of this project: make a very cool interactive map


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




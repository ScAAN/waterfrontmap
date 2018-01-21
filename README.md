# waterfrontmap
mapping weather, human industry, and social demographics of SMIAs

## MAPS WE HAVE TO RECREATE
- [x] FEMA flood insurance
- [ ] % people of color
- [x] % uninsured  CHS 2009 DOMH
- [ ] % below 200% of poverty level
- [ ] hurricane storm surge zones
- [ ] land use 
- [ ] manufacturing zoning districts
- [ ] threats to public health and hurricaine strome surge zones
- [ ] superfund class 2 sites 
- [ ] active bluk storage facilities
- [ ] EPA EPCRA toxics release inventory TRI stites 
- [ ] post irene flooding

## Current to do
- get one more data set
- learn how to make things 1/2 mile away
- make toggle able layers
- add some hovering info
- host it somewhere

## Current maps
- [Billy's](https://api.mapbox.com/styles/v1/billbrod/cj97ob0wq0s2w2rph9kkdgpck.html?fresh=true&title=true&access_token=pk.eyJ1IjoiYmlsbGJyb2QiLCJhIjoiY2o5N21wOWV5MDFlYjJ5bGd4aW9jZWwxNiJ9.LpT502DJ1ruuPRLp3AW_ow#10.0/40.675708/-73.891521/0)
- [Maija's](https://api.mapbox.com/styles/v1/mh3155/cjcp8bg653u402rprz0sf5jl6.html?fresh=true&title=true&access_token=pk.eyJ1IjoibWgzMTU1IiwiYSI6ImNqOXJqNHJ5YTZjd28ycXM0Z2dubTJjaXMifQ.czkeapIuZDbzsydf5oH7wg#9.6/40.724588/-73.998055/0)

## Information
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
  
## Resources
- [pyshp](https://pypi.python.org/pypi/pyshp), python library that
  looks like it might be able to read shape files and write GeoJSONs.
    - [gist](https://gist.github.com/frankrowe/6071443) to read in a
      shape file and save a GeoJSON
- [mapbox](https://www.mapbox.com/), the platform we're using
- [#BagItNYC map](http://bagitnyc.org/map/), map that partly inspired
  us

## Plan!
1. Someone email to ask for the data
2. Research / ask friends about map making tools 
3. Optionally... make a simple practice map with your favorite tool and some public data
4. Regroup next weds or after next scaan meeting to discuss

## Goals of this project: make a very cool interactive map

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


## Mapbox resources

- [how to add layers](https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/)
- [how to make a choropleth](https://www.mapbox.com/help/choropleth-studio-gl-pt-1/)

# waterfrontmap
mapping weather, human industry, and social demographics of SMIAs

## Information
- [General information NYC EJA waterfront justice](http://www.nyc-eja.org/campaigns/waterfront-justice-project/)
- [Peer reviewed EJA paper](http://www.tandfonline.com/doi/full/10.1080/13549839.2014.949644?scroll=top&needAccess=true)

## Plan!
1. Someone email to ask for the data
2. Research / ask friends about map making tools 
3. Optionally... make a simple practice map with your favorite tool and some public data
3. Regroup next weds or after next scaan meeting to discuss

## Goals of this project: make a very cool interactive map

I. What information should it show?  
Relevant quantities of interest mapped across significant maritime and industrial areas (SMIAs)  
Currently they are showing:
1. weather events
    - storm surges
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

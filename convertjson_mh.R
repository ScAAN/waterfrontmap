#### Converting Shapefiles to GEOJSON
#https://blog.exploratory.io/creating-geojson-out-of-shapefile-in-r-40bc0005857d

#### Import/load library

install.packages('rgdal')
install.packages('spdplyr')
install.packages('geojsonio')
install.packages('geojsonlint')
install.packages('rmapshaper')

library(rgdal)
library(spdplyr)
library(geojsonio)
library(geojsonlint)
library(rmapshaper)

#####################
# INPUTS: 
# folder name / layer name 
name = "nyzd"
# your path to data folder 
mypath = "/Users/Maija/Documents/Python/waterfrontmap/Data/"
#####################
setwd(mypath)

# NOW WE CONVERT! 
#Read the data
censustract <- readOGR(dsn = paste0(mypath,name),
layer = name, 
verbose = FALSE)
#Simplify the geometry information of GeoJSON.
censustractsim <- ms_simplify(censustract)
#Now convert to geojson
censustract_json <- geojson_json(censustractsim)
#Finally, write file
geojson_write(censustract_json, file = paste0(mypath,name,"_converted.geojson"))
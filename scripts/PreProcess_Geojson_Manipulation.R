#### Converting Shapefiles to GEOJSON

#### Import/load library

install.packages('rgdal')
install.packages('spdplyr')
install.packages('geojsonio')
install.packages('geojsonlint')

library(rgdal)
library(spdplyr)
library(geojsonio)
library(geojsonlint)

#####################
#load .Shp here
##Please insert your own folder/pathfile and file/pathfile below
censustract <- readOGR(dsn = "/Users/juliansaliani/Downloads/tl_2010_36_tract10 (Race)", #folder pathfile
layer = "tl_2010_36_tract10", #file/pathfile
verbose = FALSE) 


#####################
#load .CSV data here
csvload <- read.csv("/Users/juliansaliani/Downloads/tl_2010_36_tract10 (Race)/all_140_in_36.P3.csv")

#####################
#combine shpfile with csv columns
for(i in 1:dim(csvload)[2]){
censustractcombined <- cbind(censustractcombined,csvload[,i])
}

#####################
#rename columns with correct ID's
names(censustractcombined)[13:dim(censustractcombined)[2]] <- names(csvload)
#seems to work with those two packages

#####################
#Now convert to geojson
censustract_json <- geojson_json(censustract)

#####################
#Finally, write file
geojson_write(censustract_json, file = "/Users/juliansaliani/Downloads/tl_2010_36_tract10 (Race)/export1.geojson")


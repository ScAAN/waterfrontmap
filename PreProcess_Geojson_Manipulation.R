#### Converting Shapefiles to GEOJSON

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
#load .Shp here

#two files to analyze
files <- c("all_140_in_36.P3_Total.csv","all_140_in_36.P3_Perc.csv")

for(p in 1:2){

##Please insert your own folder/pathfile and file/pathfile below
censustract <- readOGR(dsn = "/Users/juliansaliani/Downloads/tl_2010_36_tract10 (Race)", #folder pathfile
layer = "tl_2010_36_tract10", #file/pathfile
verbose = FALSE) 


#####################
#load .CSV data here
csvload <- read.csv(paste0("/Users/juliansaliani/Downloads/tl_2010_36_tract10 (Race)/",files[p]))

#####################
#combine shpfile with csv columns
censustractcombined <- censustract
for(i in 1:dim(csvload)[2]){
censustractcombined <- cbind(censustractcombined,csvload[,i])
}

#####################
#rename columns with correct ID's
names(censustractcombined)[13:dim(censustractcombined)[2]] <- names(csvload)

#censustractcombined <- censustractcombined[,-which(duplicated(names(censustractcombined)) == TRUE)]
  #seems to work with those two packages

# Simplify the geometry information of GeoJSON.
censustractsim <- ms_simplify(censustractcombined)

#####################
#Now convert to geojson
censustract_json <- geojson_json(censustractsim)

#####################
#Finally, write file
geojson_write(censustract_json, file = paste0("/Users/juliansaliani/Downloads/tl_2010_36_tract10 (Race)/NY_Census_Race_Data__R_Manipulated-V",p,".geojson"))

}
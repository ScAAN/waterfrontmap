#### Converting Shapefiles to GEOJSON

#Description: this script takes the bulk download from the census website and creates a geojson
#for that data.  It also attaches another csv concerning poverty level, which is file csvload2.

#Right now this script pulls in two data sources: one that shows Race data per census tract from the census bulk export file: http://census.ire.org/data/bulkdata.html
#Another from this source __________Get Angela's Source____________ that describes poverty level per census tract.
#You need to include three file paths, 
#one for the shape files as 'filepath1'
#one for the csv that has the race level per census tract 'filepath2'
#one for the csv with the poverty level data as well 'filepath3'

#The matching section takes place in lines 59-70, which use GEOID to match both CSV's
#If you are adding another CSV, make sure to have the GEOID for each census tract since that's the census identifier.


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
file <- "all_140_in_36.P3_Perc.csv"

#file path for the race shape file data.  The first dimension is the directory path one level before the file, while the second is the file name
##This is necessary for the readOGR function.
filepath1 <- c("/Users/juliansaliani/Downloads/tl_2010_36_tract10 (Race)","tl_2010_36_tract10")
#This is the csv for the census tract race data
filepath2 <- "/Users/juliansaliani/Downloads/tl_2010_36_tract10 (Race)/all_140_in_36.P3_Perc.csv"
#This is the csv with the data for the % of families below poverty level
filepath3 <- "/Users/juliansaliani/Downloads/ACS_2006-2010_economiccharacteristics.csv" 
#This is the export file for the geojson layer to export
exportpath <- "/Users/juliansaliani/Downloads/tl_2010_36_tract10 (Race)/NY_Census_Race_Data__R_Manipulated_With_Poverty.geojson"


##Please insert your own folder/pathfile and file/pathfile below
censustract <- readOGR(dsn = filepath1[1], #folder pathfile
layer = filepath1[2], #file/pathfile
verbose = FALSE)


#####################
#load .CSV data here
csvload <- read.csv(filepath2)

csvload2 <- read.csv(filepath3)


#####################
#Match Multiple CSV's to GeoJson

csvload <- csvload[match(censustract$GEOID10,csvload$GEOID),]

csvloadV2 <- cbind(csvload,-100)

#match up poverty data, but don't use first value as that's the column name.

csvloadV2[na.omit(match(csvload2[,2],csvload[,1])),22] <- as.character(csvload2[2:4510,480])

colnames(csvloadV2)[22] <- "% of Families Below Poverty Level"

#####################
#combine shpfile with csv columns
censustractcombined <- censustract
for(i in 1:dim(csvloadV2)[2]){
censustractcombined <- cbind(censustractcombined,csvloadV2[,i])
}

#####################
#rename columns with correct ID's
names(censustractcombined)[13:dim(censustractcombined)[2]] <- names(csvloadV2)

#censustractcombined <- censustractcombined[,-which(duplicated(names(censustractcombined)) == TRUE)]
  #seems to work with those two packages

# Simplify the geometry information of GeoJSON.
#censustractsim <- ms_simplify(censustractcombined)

#####################
#Now convert to geojson
censustract_json <- geojson_json(censustractcombined)

#####################
#Finally, write file
geojson_write(censustract_json, file = exportpath)


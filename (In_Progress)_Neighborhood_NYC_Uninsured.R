
library(rgdal)
library(spdplyr)
library(geojsonio)
library(geojsonlint)
library(rmapshaper)

#####################
#load .Shp here

#two files to analyze
  setwd("/Users/juliansaliani/Downloads/UHF_42_DOHMH_2009")
  ##Please insert your own folder/pathfile and file/pathfile below
  censustract <- readOGR(dsn = "/Users/juliansaliani/Downloads/UHF_42_DOHMH_2009", #folder pathfile
                         layer = "UHF_42_DOHMH_2009", #file/pathfile
                         verbose = FALSE) 
  
  
  #####################
  #load .CSV data here
  Names <- read.csv("NameCSV.csv",header=FALSE)
  input <- 1:68
  multiples <- input[(input %% 2) == 0]
  Names <- Names[multiples-1,]
  Population <- read.csv("PopData.csv",header=FALSE)
  Population_Calculate <- as.matrix(Population[multiples,2:3])
  for(i in 1:dim(Population_Calculate)[1]){
    for(j in 1:dim(Population_Calculate)[2]){
      Population_Calculate[i,j] <- gsub(",","",Population_Calculate[i,j])
    }
  }
  PopulationFinal <- round(as.numeric(as.character(Population_Calculate[,2])) / as.numeric(as.character(Population_Calculate[,1]))*100,0)
  Exit <- as.data.frame(matrix(nrow=34,ncol=2))
  for(i in 1:34){
  Exit[i,1] <- strsplit(as.character(Names[,2]),"[ ]")[i][[1]][1]
  Exit[i,2] <- PopulationFinal[i]
  }
  colnames(Exit) <- c("UFH","% Uninsured")
  
  #####################
  #Match CSV to GeoJson
  
  censusdataframe <- cbind(as.data.frame(censustract),0)
  colnames(censusdataframe)[7] <- "Uninsured_Perc"
  for(i in 2:43){
  censusdataframe[i,7] <- Exit[grep(censusdataframe[i,2],Exit[,1]),2]
  }
  #####################
  #combine shpfile with csv columns
  censustractcombined <- cbind(censustract,censusdataframe[,7])

  #####################
  #rename columns with correct ID's
  names(censustractcombined)[7] <- "Uninsured_Perc"
  
  #censustractcombined <- censustractcombined[,-which(duplicated(names(censustractcombined)) == TRUE)]
  #seems to work with those two packages
  
  # Simplify the geometry information of GeoJSON.
  #censustractsim <- ms_simplify(censustractcombined)
  
  #####################
  #Now convert to geojson
  censustract_json <- geojson_json(censustractcombined)
  
  #####################
  #Finally, write file
  geojson_write(censustract_json, file = "/Users/juliansaliani/Downloads/UHF_42_DOHMH_2009/NeighborhoodUninsured.geojson")
  

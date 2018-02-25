
#convert nyzd to geojson
#https://blog.exploratory.io/creating-geojson-out-of-shapefile-in-r-40bc0005857d

# INPUTS: 
# your path 
p = "/Users/Maija/Documents/Python/waterfrontmap/Data/"
# folder name / layer name 
n = "nyzd"


# NOW WE CONVERT! 
#Read the data
censustract <- readOGR(dsn = paste0(p,n),
layer = n, 
verbose = FALSE)
#Simplify the geometry information of GeoJSON.
censustractsim <- ms_simplify(censustract)
#Now convert to geojson
censustract_json <- geojson_json(censustractsim)
#Finally, write file
geojson_write(censustract_json, file = paste0(p,n,"_converted.geojson"))
test <- readLines(url("http://data.beta.nyc//dataset/635e26b3-2acf-4f55-8780-2619660fdf66/resource/e5528464-9a00-40a7-8b85-21e9b25d6c24/download/d52d598c77484806876b8f897d51f805nyczoning.geojson"))

library(geojson)

exp <- as.geojson(test)

exp <- geojson_json(test)

geojson_write(exp, file = paste0("/Users/juliansaliani/Downloads/nyzdtest4.geojson"))
# How to update map text

### How it works
Map text is controlled by the content of several excel tables (".csv" files). We then convert the information in these tables to a format that can be used by the website (".json" format / the file `map_text.json`) and upload it to GitHub. The process is as below:



1. Edit text tables
2. Convert to .json
3. Upload to GitHub

**Currently please just do (1) and send the edited csv files to Maija. She will convert and upload them.**

### 1. Editing text tables
Download the whole contents of our GitHub repository so you have up to date versions of all files. Tables (.csv files) are located in `waterfrontmap/Processing/Text`. To update them, open them in Microsoft Excel and edit them according to the instructions below. Text must use [HTML formatting](https://www.w3schools.com/html/html_formatting.asp), if you don't know how to do HTML formatting avoid any formatting or special characters.

+ `story_text.csv`: specifies content of story tab of the map  
This table specifies the content of the story presentation. Each row contains the information to display a "page" of the story (total pages is the number of rows minus one). Story pages have 6 properties:  
  + `pageIdx`: an number which controls advanced formatting of page (`0`, `1`, or `2`).
      + `0` show SMIA information on mouse hover + fly to SMIA on click.
      + `1` show SMIA information on mouse hover.  
      + `2` do nothing on hover.
  + `pageSMIA`: an number which controls what SMIA the map zooms in on. SMIAs go from the number 1-7. Enter `0` to leave the map zoomed out.   
  + `pageLayer`: text which controls what data layer is shown on the map. Enter layer name **exactly** as it is specified in `layer_text.csv`.   
  + `BulkLayers`: text controls what bulk storage sites are shown in addition to the map data. Enter each name exactly as specified below, separated by commas and no spaces between names. (i.e. `TRI,MOSF,CBS,SUPERFUND2`).   
      + `TRI` (Toxic release inventory sites)  
      + `MOSF` (Major oil storage facility)   
      + `CBS` (Chemical bulk storage)  
      + `SUPERFUND2` (Superfund class 2 sites)   
  + `pageTitle`:  text string which specifies the page title text.
  + `PageText`: text string which specifies the page description text.


+ `layer_text.csv`: specifies the names and descriptions for map data  
Each row contains the information for a single map layer. **Only edit the "text" column.** This controls the Description text of that data on the map.

+ `smia_text.csv`: specifies SMIA names, numbers, descriptions, and map info   
Each row contains the information for a single SMIA. **Only edit the "description" column.** This controls SMIA description displayed after hovering over a SMIA.

+ `legend_text.csv`: specifies legend entries and colors. **Do not modify this file.**

**after editing send the edited files (`story_text`,`layer_text.csv`,`smia_text.csv`) to Maija. She will update the website.**

### 2. Converting to .json
To convert the .csv tables to a .json file, you'll need to use `python 3`. You can either use an online python interpreter or install `python 3` and `pandas` on your machine.

##### METHOD A - use online python interpreter (recommended)
1. Find an online python interpreter (google "online python interpreter"). I recommend [repl.it](https://repl.it/repls/TangibleUntriedGnudebugger) if available (https://repl.it/repls/TangibleUntriedGnudebugger).
2. Upload all csv files and the file `text_conversion_online.py`.
3. Install the package named `pandas` (see below images)
4. Run `text_conversion.py` (see below images)
5. The file `Processing/Text/map_text.json` should now created! Download it (see below images).
6. Check output file (`Processing/Text/text_conversion_oe.txt`) for any information on errors. See below for details on how to correct them.

##### METHOD B - install python on your computer
1. Install `python 3` on your computer (https://realpython.com/installing-python/)
2. Make sure you are connected to the internet, and double click the file `Processing/text_conversion.py`. The python package `pandas` will be installed.
3. The file `Processing/Text/map_text.json` should now be updated!
4. Check output file (`Processing/Text/wfm_text_conversion_oe.txt`) for any information on errors. See below for details on how to correct them.  

### 3. Uploading to GitHub
If you know how to use GitHub just push or submit a push request. Otherwise, go to our GitHub and upload the whole `Processing` folder using the upload button (see images below).

### Troubleshooting
Things might not work when you first try to update. Before contacting us, check if you made any of these common mistakes.

1. Using special characters- this may not be obvious, especially if text was copied and pasted from a pdf or word document. Try copying and pasting from notepad or similar program. Also remember that m-dash is a special character. If you absolutely must use a special character, use HTML.
2. Incorrect layer names- this can cause all sorts of errors or bugs in the map display. Make sure that layer names are always spelled the exact same way.
3. Not waiting long enough- GitHub takes time to update it's raw files (5-20 min usually) and GitHub pages also takes time to update. Don't expect changes to be reflected on the website instantaneously after an upload or push.

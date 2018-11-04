#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
text_conversion_small.py

A function which converts csv files to json files for waterfrontmap

Requires: pandas

Formatting:  
1. story_text.csv 
    - One line for each story page    
    - All pages for a given smia must occur consecutively
    - columns: pageSMIA, pageLayer, pageTitle, pageText
2. layer_text.csv 
    - One line for each layer
    - columns: id, legend, text, source
3. smia_text.csv 
    - One line for each smia (and 0 for the intro)
    - columns: name, number, description
4. legend_text.csv
    - one ENTRY row and one COLOR row for each layer 
    - don't have to fill out bulk storage 
    
Remember to push to github after you convert! The map operates off of the 
raw github files. 

@author: Maija
"""

# settings and setup 
# -----------------------------------------------------------------------------

# output file names
out_filename = 'map_text.json'
output_file = 'text_conversion_oe.txt'

# properties to index by for layer and smia text 
layerprop = 'id'
smiaprop = 'name'

# expected file encoding 
file_encoding = 'utf8'

# import stuff 
# (keep as small as possible for pyinstaller)
from os import chdir, path, getcwd
from json import dump as jsondump
import pandas as pd     

# open output file 
f_out= open(output_file, 'w', encoding=file_encoding)

# functions 
# -----------------------------------------------------------------------------
# make DF become json (list) - for story pages
def become_story_json(df):
    newjson = [dict() for x in range(len(df))]
    cols = list(df)
    for row in range(len(df)):
        for name in cols:
            if 'numpy' in str(type(df[name][row])):
                newjson[row][name]= int(df[name][row])
            else:
                newjson[row][name]= df[name][row]
            
    return newjson

# make DF become json (dict instead of list) - for smia and layers
def become_wordy_json(df,prop):
    newjson = {}
    cols = list(df)
    cols.remove(prop)
    for row in range(len(df)):
        id = df[prop][row]
        newjson[id] = {}
        for name in cols:
            # get rid of numpy ints which screw up json conversion 
            if 'numpy' in str(type(df[name][row])):
                newjson[id][name]= int(df[name][row])
            else:
                newjson[id][name]= df[name][row]
    return newjson

# make df become json (simple lists) - for legend text
def become_simple_json(df):
    newjson ={}
    for name in list(df):
        newjson[name] = [x for x in df[name] if str(x)!='nan']            
    return newjson

# remove numpy typing from series
def stop_numpy(series,myfunc):
    new_series = [myfunc(x) for x in series]
    return new_series

# print text to file AND console
def printout(text,file):
    print(str(text)) 
    file.write(text + '\n')
    
# try to read csv and print useful error messages if failure
def try_readcsv(file_name,file_encoding,f_out):
    try:
        if path.exists(file_name)==False: printout('ERROR: file "' + file_name + '" not found!',f_out)
        df = pd.read_csv(open(file_name),encoding=file_encoding)
        printout('loaded: ' + file_name,f_out)
    except Exception as e:
        printout('ERROR: file "' + file_name + '" failed to load!',f_out)
        printout('ERROR MESSAGE:- %s' % e,f_out)
    return df

# -----------------------------------------------------------------------------
# now the script starts . . . 
# -----------------------------------------------------------------------------

# set cwd  and print to error file 
try:
    # information in output error file 
    printout('---------------------------------',f_out)
    printout('| WATERFRONTMAP TEXT PROCESSING |',f_out)
    printout('---------------------------------',f_out)
    printout( __file__ + ' running via python file... ',f_out)
    printout('output file: ' + output_file,f_out)
    printout('expected encoding: ' + file_encoding,f_out)
    chdir(path.dirname(__file__))
    printout('current working directory: ' + str(getcwd()),f_out)
except Exception as e:
    printout('ERROR: could not set working directory',f_out)
    printout('ERROR MESSAGE:- %s' % e,f_out)
    printout('Attempting to continue anyways...',f_out)


# first convert the general text (LAYER & SMIA & LEGEND)
# -----------------------------------------------------------------------------

# load and convert LEGEND TEXT 
file_name = 'legend_text.csv'
df = try_readcsv(file_name,file_encoding,f_out)
legenddata = become_simple_json(df)

# load and convert LAYER TEXT 
file_name = 'layer_text.csv'
df = try_readcsv(file_name,file_encoding,f_out)
layerdata = become_wordy_json(df,layerprop)
# save the layer names for input checking in the story 
layer_names = df[layerprop]
layer_names[len(layer_names)] = 'Highlight'

# load and covert SMIA TEXT
file_name = 'smia_text.csv'
df = try_readcsv(file_name,file_encoding,f_out)
smiadata = become_wordy_json(df,smiaprop)
# save smia zoom, lat, and lng for processing in the story 
# stop being numpy number types! 
zoomMat = stop_numpy(df['zoom'],int)
latMat = stop_numpy(df['lat'],float)
lngMat = stop_numpy(df['lng'],float)


# second process and convert the story text 
# -----------------------------------------------------------------------------
# load STORY text 
file_name = 'story_text.csv'
df = try_readcsv(file_name,file_encoding,f_out)

# first check for typos 
validate_layer = df['pageLayer']
validate_smia = df['pageSMIA']
typo_layer = [item for item in set(validate_layer) if item not in set(layer_names)]
typo_smia =  [item for item in set(validate_smia) if item not in set(list(range(0,8)))]
if len(typo_smia)>0: printout('ERROR: you have a SMIA out of the range 0-7!' + str(typo_smia),f_out)
if len(typo_layer)>0: printout('ERROR: one or more layer(s) has a typo!: ' + str(typo_layer),f_out)

# convert to json
data = become_story_json(df)
njson = len(data)
printout('story processed: total length, ' + str(njson) + ' pages',f_out)

# add zoom, lng and lat fields based on SMIA number
# also count the first occurence of each SMIA so we can jump to it
SMIA_first_page = [0] * 8
for page in range(njson):
    SMIA = data[page]['pageSMIA']
    data[page]['pageZoom'] = zoomMat[SMIA]
    data[page]['pageLng']  = lngMat[SMIA]
    data[page]['pageLat']  = latMat[SMIA]
    if page>0:
        if SMIA!=(data[page-1]['pageSMIA']):
            # check for SMIA with more than one first occurence
            if SMIA_first_page[SMIA] !=0: printout('ERROR: your csv contains non-consecutive pages with the same SMIA number, see page: ' + str(page),f_out)
            SMIA_first_page[SMIA] = page
        
# format data
storydata = dict()
storydata['data'] = data
storydata['global_max_page'] = njson
storydata['SMIA_first_page'] = SMIA_first_page


# now format and save
# -----------------------------------------------------------------------------
# format data 
fulldata = dict()
fulldata['legend'] = legenddata
fulldata['layer'] = layerdata
fulldata['smia'] = smiadata
fulldata['story'] = storydata

# save data (pretty)
with open(out_filename, 'w') as f:
    jsondump(fulldata, f, sort_keys=True,indent=4)    
    printout('Success! text saved in "' + out_filename + '"',f_out)

f_out.close()
#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
text_conversion_small.py

A function which converts csv files to json files for waterfrontmap

Requires: os, pandas, json

Formatting:  
1. Text\story_text.csv 
    - One line for each story page    
    - All pages for a given smia must occur consecutively
    - columns: pageSMIA, pageLayer, pageTitle, pageText
2. Text\layer_text.csv 
    - One line for each layer
    - columns: id, legend, text, source
3. Text\smia_text.csv 
    - One line for each smia (and 0 for the intro)
    - columns: name, number, description
    
Remember to push to github after you convert! The map operates off of the 
raw github files. 

@author: Maija
"""

# settings and setup 
# -----------------------------------------------------------------------------
verbose = False

# properties to index by for general text 
layerprop = 'id'
smiaprop = 'name'


# import stuff
import os
import pandas as pd 
import json

# set cwd 
os.chdir(os.path.dirname(__file__))
if verbose: print("current working directory: " + str(os.getcwd()))


# functions 
# -----------------------------------------------------------------------------
# make DF become json (list) - for story pages
def become_json(df):
    newjson = [dict() for x in range(len(df))]
    cols = list(df)
    for row in range(len(df)):
        for name in cols:
            if "numpy" in str(type(df[name][row])):
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
            if "numpy" in str(type(df[name][row])):
                newjson[id][name]= int(df[name][row])
            else:
                newjson[id][name]= df[name][row]
    return newjson

# -----------------------------------------------------------------------------
# now the script starts . . . 
# -----------------------------------------------------------------------------


# first convert the general text (LAYER & SMIA)
# -----------------------------------------------------------------------------

# load and convert LAYER TEXT 
file_name = 'Text\\layer_text.csv'
if os.path.exists(file_name)==False: print("ERROR: layer file not found!")
df = pd.read_csv(open(file_name),encoding='utf-8')
layerdata = become_wordy_json(df,layerprop)

# save the layer names for input checking in the story 
layer_names = df[layerprop]
layer_names[len(layer_names)] = "Highlight"

# load and covert SMIA TEXT
file_name = 'Text\\smia_text.csv'
if os.path.exists(file_name)==False: print("ERROR: smia file not found!")
df = pd.read_csv(open(file_name),encoding='utf-8')
smiadata = become_wordy_json(df,smiaprop)

# MISC 
# manual variable which we'll remove once vector data is updated 
dataNames = {'human_readable_zone': 'Land use: ',
'Perc_POC_P003009': 'Percent people of color: ',
'% of Families Below Poverty Level': 'Percent below poverty level: ',
'CATEGORY': 'Storm surge zone: ',
'Median Household Income': 'Median household income: ',
'hurricane': 'Hurricane evacuation zone: ',
'perc_uninsured': 'Percent Uninsured'}

# format data 
fulldata = dict()
fulldata["layer"] = layerdata
fulldata["smia"] = smiadata
fulldata["dataNames"] = dataNames
        
# save data (pretty)
output_file = 'Text\\general_text.json'
with open(output_file, 'w') as f:
    json.dump(fulldata, f, sort_keys=True,indent=4)




# second convert the story text 
# -----------------------------------------------------------------------------
# load STORY text 
file_name = 'Text\\story_text.csv'
if os.path.exists(file_name)==False: print("ERROR: story file not found!")
df = pd.read_csv(open(file_name),encoding='utf-8')

# first check for typos 
validate_layer = df['pageLayer']
validate_smia = df['pageSMIA']
typo_layer = [item for item in set(validate_layer) if item not in set(layer_names)]
typo_smia =  [item for item in set(validate_smia) if item not in set(list(range(0,8)))]
if len(typo_smia)>0: print("ERROR: you have a SMIA out of the range 0-7!" + str(typo_smia))
if len(typo_layer)>0: print("ERROR: one or more layer(s) has a typo!: " + str(typo_layer))

# convert to json
data = become_json(df)
njson = len(data)
if verbose: print("story loaded, length: " + str(njson) + " pages")

# zoom levels and coordinates for each smia (manually chosen)
zoomMat = [10,12,12,12,12,12,12,12];
latMat = [-73.9978,-73.97256593122793,-73.93480042828487,-74.23091192935536,
-74.00743616089453,-73.8939875925258,-74.01499944630518,-74.13713363755667]; 
lngMat = [40.7209,40.70337539892057, 40.73043814252142, 40.5505517824447
, 40.68650785503232, 40.80730643781723, 40.658442081047724, 40.64057887695694]; 

# add zoom, lng and lat fields based on SMIA number
# also count the first occurence of each SMIA so we can jump to it
SMIA_first_page = [0,0,0,0,0,0,0,0]
for page in range(njson):
    SMIA = data[page]["pageSMIA"]
    data[page]["pageZoom"] = zoomMat[SMIA]
    data[page]["pageLng"]  = lngMat[SMIA]
    data[page]["pageLat"]  = latMat[SMIA]
    if page>0:
        if SMIA!=(data[page-1]["pageSMIA"]):
            # check for SMIA with more than one first occurence
            if SMIA_first_page[SMIA] !=0: print("ERROR: your csv contains non-consecutive pages with the same SMIA number, see page: " + str(page))
            SMIA_first_page[SMIA] = page
        
        
# format data
fulldata = dict()
fulldata["data"] = data
fulldata["global_max_page"] = njson
fulldata["SMIA_first_page"] = SMIA_first_page

# save data (pretty)
output_file = 'Text\\story_text.json'
with open(output_file, 'w') as f:
    json.dump(fulldata, f, sort_keys=True,indent=4)

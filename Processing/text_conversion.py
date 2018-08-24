#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Created on Fri Aug 24 16:20:47 2018








@author: Maija
"""

# import stuff
import os
import sys
os.chdir(os.path.dirname(sys.argv[0]))
cwd = os.getcwd()
print(cwd)
import pandas as pd 
import numpy as np
import json
from pandas.api.types import is_string_dtype
from pandas.api.types import is_numeric_dtype

# make DF become json 
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

# make DF become json (with names instead of numbers)
def become_wordy_json(df,prop):
    newjson = {}
    cols = list(df)
    cols.remove(prop)
    for row in range(len(df)):
        id = df[prop][row]
        newjson[id] = {}
        for name in cols:
            if "numpy" in str(type(df[name][row])):
                newjson[id][name]= int(df[name][row])
            else:
                newjson[id][name]= df[name][row]
    return newjson



# LAYER TEXT 
file_name = 'Text\\layer_text.csv'
df = pd.read_csv(open(file_name),encoding='utf-8')
layerdata = become_wordy_json(df,'id')

# SMIA TEXT
file_name = 'Text\\smia_text.csv'
df = pd.read_csv(open(file_name),encoding='utf-8')
smiadata = become_wordy_json(df,'name')

# MISC 
dataNames = {'human_readable_zone': 'Land use: ',
'Perc_POC_P003009': 'Percent people of color: ',
'% of Families Below Poverty Level': 'Percent below poverty level: ',
'CATEGORY': 'Storm surge zone: ',
'Median Household Income': 'Median household income: ',
'hurricane': 'Hurricane evacuation zone: ',
'perc_uninsured': 'Percent Uninsured'}

#

# save data
fulldata = dict()
fulldata["layer"] = layerdata
fulldata["smia"] = smiadata
fulldata["dataNames"] = dataNames
# save data (pretty)
output_file = 'Text\\general_text.json'
with open(output_file, 'w') as f:
    json.dump(fulldata, f, sort_keys=True,indent=4)


# STORY 
file_name = 'Text\\story_text.csv'
print("file exists?")
print(os.path.isfile(file_name))
df = pd.read_csv(open(file_name),encoding='utf-8')
data = become_json(df)

njson = len(data)

# manual 
zoomMat = [10,12,12,12,12,12,12,12];
latMat = [-73.9978,-73.97256593122793,-73.93480042828487,-74.23091192935536,
-74.00743616089453,-73.8939875925258,-74.01499944630518,-74.13713363755667]; 
lngMat = [40.7209,40.70337539892057, 40.73043814252142, 40.5505517824447
, 40.68650785503232, 40.80730643781723, 40.658442081047724, 40.64057887695694]; 

# add zoom, lng and lat fields based on SMIA number
# also count the first occurence of each SMIA 
SMIA_first_page = [0,0,0,0,0,0,0,0]
for page in range(njson):
    SMIA = data[page]["pageSMIA"]
    data[page]["pageZoom"] = zoomMat[SMIA]
    data[page]["pageLng"]  = lngMat[SMIA]
    data[page]["pageLat"]  = latMat[SMIA]
    if page>0:
        if SMIA!=(data[page-1]["pageSMIA"]):
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

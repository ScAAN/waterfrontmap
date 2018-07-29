// Layer names, numbers, and text
var toggleableLayerIds = ['Percent People of Color', 'Zoning', 'Percent of Families Below Poverty Line', 'Hurricane Storm Surge Zones',
'Median Household Income','Bulk Storage Sites'];
var toggleableLegendIds = {'Percent People of Color': 'race-legend',
'Zoning': 'zoning-legend',
'Percent of Families Below Poverty Line': 'poverty-legend',
'Hurricane Storm Surge Zones': 'surge-legend',
'Median Household Income': 'income-legend',
'Bulk Storage Sites': 'bulk-legend'};
var dataNames = {'human_readable_zone': 'Land use: ',
'Perc_POC_P003009': 'Percent people of color: ',
'% of Families Below Poverty Level': 'Percent below poverty level: ',
'CATEGORY': 'Hurricane zone: ',
'Median Household Income': 'Median household income: '};
// 'neighborhood':'NYC Neighborhood: '};
var smiaNumbers = {'Brooklyn Navy Yard':'1',
'Newtown Creek':'2',
'Staten Island West Shore':'3',
'Red Hook':'4',
'South Bronx':'5',
'Sunset Park':'6',
'Kill Van Kull':'7'};
var smiaTitle = ['SMIA # 1 : Brooklyn Navy Yard',
'SMIA # 2 : Newtown Creek',
'SMIA # 3 : Staten Island West Shore',
'SMIA # 4 : Red Hook',
'SMIA # 5 : South Bronx',
'SMIA # 6 : Sunset Park',
'SMIA # 7 : Kill Van Kull'];
var smiaText = {'Brooklyn Navy Yard':'The Brooklyn Navy Yard is a 227-acre publicly owned industrial park characterized by a diversity of small businesses. The Navy Yard has more than 2,000 permanent jobs on site, and provides an estimated 3,000 temporary jobs to crews of film and television shoots at Steiner Studios. The robust increase in business activity between 200 and 2008 is attributed to a dramatic redevelopment effort, harnessing more than $500 million in public and private investment.',
'Newtown Creek':'Newtown Creek, at over 780 acres the city’s largest SMIA, abuts portions of the Greenpoint, Williamsburg, Long Island City, and Maspeth industrial areas. The waterfront area is characterized by heavy industry and municipal facilities, many of which are water-dependent.',
'Staten Island West Shore':'No information about this SMIA yet.',
'Red Hook':'The Red Hook SMIA is approximately 120 acres and is more than 90 percent publicly owned. The SMIA is home to the Red Hook Container Terminal and Brooklyn Piers Port Authority Marine Terminal.',
'South Bronx':'The South Bronx SMIA is more than 850 acres in size, stretching from Port Morris on the Harlem River to Hunts Point on the East River. Wholesale trade is the dominant industry. The SMIA is home to the city\'s produce distribution center at Hunts Point, the Fulton Fish market, and other food distributors.',
'Sunset Park':'Nearly 600 acres, the Sunset Park SMIA extends from Erie Basin to Owl\'s Head, an area characterized by water-dependent facilities, concentrations  of  industrial  activity,  well-buffered  manufacturing  districts,  and  vacant  sites  and  brownfields  of  significant  size.  A  small portion of the SMIA abuts the Gowanus Canal, a waterway that was designated a Superfund Site in 2010.',
'Kill Van Kull':'The Kill Van Kull SMIA stretches from Howland Hook to Snug Harbor. It contains a concentration of maritime uses including a marine terminal and dry docks for ship repair. The SMIA is approximately 665 acres and zoned to permit a broad range of commercial and industrial uses. In 2008, there were more than 70 firms employing more than 3,300 people in the SMIA. The overwhelming number of jobs - more than 70 percent - were in transportation and warehousing.'};

var smiaDescription = ['The Brooklyn Navy Yard is a 227-acre publicly owned industrial park characterized by a diversity of small businesses. The Navy Yard has more than 2,000 permanent jobs on site, and provides an estimated 3,000 temporary jobs to crews of film and television shoots at Steiner Studios. The robust increase in business activity between 200 and 2008 is attributed to a dramatic redevelopment effort, harnessing more than $500 million in public and private investment.',
'Newtown Creek, at over 780 acres the city’s largest SMIA, abuts portions of the Greenpoint, Williamsburg, Long Island City, and Maspeth industrial areas. The waterfront area is characterized by heavy industry and municipal facilities, many of which are water-dependent.',
'No information about this SMIA yet.',
'The Red Hook SMIA is approximately 120 acres and is more than 90 percent publicly owned. The SMIA is home to the Red Hook Container Terminal and Brooklyn Piers Port Authority Marine Terminal.',
'The South Bronx SMIA is more than 850 acres in size, stretching from Port Morris on the Harlem River to Hunts Point on the East River. Wholesale trade is the dominant industry. The SMIA is home to the city\'s produce distribution center at Hunts Point, the Fulton Fish market, and other food distributors.',
'Nearly 600 acres, the Sunset Park SMIA extends from Erie Basin to Owl\'s Head, an area characterized by water-dependent facilities, concentrations  of  industrial  activity,  well-buffered  manufacturing  districts,  and  vacant  sites  and  brownfields  of  significant  size.  A  small portion of the SMIA abuts the Gowanus Canal, a waterway that was designated a Superfund Site in 2010.',
'The Kill Van Kull SMIA stretches from Howland Hook to Snug Harbor. It contains a concentration of maritime uses including a marine terminal and dry docks for ship repair. The SMIA is approximately 665 acres and zoned to permit a broad range of commercial and industrial uses. In 2008, there were more than 70 firms employing more than 3,300 people in the SMIA. The overwhelming number of jobs - more than 70 percent - were in transportation and warehousing.'];
  var smiaLat = [-73.97256593122793,-73.93480042828487,-74.23091192935536,
-74.00743616089453,-73.8939875925258,-74.01499944630518,-74.13713363755667];
var smiaLng = [40.70337539892057, 40.73043814252142, 40.5505517824447
, 40.68650785503232, 40.80730643781723, 40.658442081047724, 40.64057887695694];
var legendText = {'Percent People of Color': 'From the US census 2016. SMIAs tend to have higher proportions of people of color.',
'Zoning': 'NYC zoning districts are designated by NYC DOB (?). Though SMIAs are predominately in designated manufacturing zones, they are surrounded by largely residential areas.',
'Percent of Families Below Poverty Line': 'From the US census 2016. The population within and around SMIAs is frequently below poverty level, especially in #1, Brooklyn Navy Yard and #5, South Bronx',
'Hurricane Storm Surge Zones': 'Hurricane storm storm surge zones are determined by NYC Emergency Management (?). All SMIAs are in hurricane storm surge zones.',
'Median Household Income': 'From the US census 2016. The population within and around SMIAs has low household income, especially in #1, Brooklyn Navy Yard and #5, South Bronx',
'Bulk Storage Sites': 'Bulk storage sites from EPCRA (TRI) and DEC (MOSF, CBS, Superfund). Bulk storage sites are concentrated in SMIAs, especially #2, Newtown Park and #6, Sunset Park'};
var legendSource = {'Percent People of Color': 'US Census 2010, divided by census tract, downloaded from <a href="http://census.ire.org/data/bulkdata.html">CENSUS.IRE.ORG</a>',
'Zoning': 'NYC Zoning designations, last updated 2015(?), downloaded from <a href="http://data.beta.nyc//dataset/635e26b3-2acf-4f55-8780-2619660fdf66/resource/e5528464-9a00-40a7-8b85-21e9b25d6c24/download/d52d598c77484806876b8f897d51f805nyczoning.geojson">data.Beta.NYC</a>',
'Percent of Families Below Poverty Line': 'US Census 2010, divided by census tract, downloaded from <a href="https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml">US Census Bureau</a>',
'Hurricane Storm Surge Zones': '(?) 2016 Hurricane evacuation Zones from the <a href="https://geo.nyu.edu/catalog/nyu_2451_34571">NYC-DEM</a>.',
'Median Household Income': '(?) US Census 2010, divided by census tract, downloaded from <a href="https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml">US Census Bureau</a>',
'Bulk Storage Sites': '2016 EPCRA TRI sites from <a href="https://www.epa.gov/toxics-release-inventory-tri-program/tri-basic-data-files-calendar-years-1987-2016">US EPA</a>. DEC active  MOSF, CBS and superfund class 2 sites (7/18/2018) from <a href="https://www.dec.ny.gov/cfmx/extapps/derexternal/index.cfm?pageid=4">NYS DEC</a> and <a href="https://www.dec.ny.gov/cfmx/extapps/derexternal/index.cfm?pageid=3">NYS DEC</a>'};

var smiaIntro = "As the threats of climate change increase, destructive storms like Superstorm Sandy, Hurricane Katrina, and Hurricane Harvey will expose the vulnerabilities of costal communities overburdened by industrial and chemical facilities. Of interest are NYC’s Significant Maritime and Industrial Areas (SMIAs), clusters of industry and polluting infrastructure along the waterfront. SMIAs are located in classic environmental justice communities- predominantly low-income communities of color - in the south Bronx, Brooklyn, Queens and Staten Island, which are also hurricane storm surge zones. The WJP is a research and advocacy campaign focusing on community resiliency that seeks to reduce potential toxic exposures and public health risks associated with climate change and storm surge in the City’s industrial waterfront.";

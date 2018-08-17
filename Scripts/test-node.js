var convertExcel=require("excel-as-json").processFile;
console.log(convertExcel)
convertExcel("story_text.xlsx","story_text_raw.json")

var map=require("./../../package.json");
var topolr=require("topolr-util");
module.exports={
    command: "version",
    desc: "topolr-doc version",
    paras: [],
    fn:function(){
        topolr.log("(color:11=> version is {{version}})",map);
    }
}
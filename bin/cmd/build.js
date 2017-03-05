var topolr=require("topolr-util");
module.exports={
    command: "build",
    desc: "build the site",
    paras: [],
    fn:function(){
        var path=process.cwd()+"/topolr.doc.config.json";
        if(topolr.file(path).isExists()) {
            require("./../../main")(require(path)).render().done(function () {
                topolr.log("(color:green=> build done)")
            }).fail(function (a) {
                topolr.log("(color:red=> {{error}})",{error:a});
            });
        }else{
            topolr.log("(color:11=> config file is not exists,init the project first.)");
        }
    }
}
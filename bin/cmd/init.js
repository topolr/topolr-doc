var topolr=require("topolr-util");
module.exports={
    command: "init",
    desc: "init the build config file",
    paras: [],
    fn:function(){
        var path=process.cwd()+"/topolr.doc.config.json";
        if(!topolr.file(path).isExists()){
            var t={
                basePath:(process.cwd()+"/_source/").replace(/\\/g,"/"),
                sourcePath:"./docs",
                layoutPath:"./layout",
                modulePath:"./module",
                output:"../",
                devSitePath:"http://localhost/yoursitename",
                pubSitePath:"your site base url"
            };
            topolr.file(path).write(JSON.stringify(t,null,4));
            topolr.log("(color:11=> config build success,your can edit it)");
        }else{
            topolr.log("(color:11=> config file is exists)");
        }
    }
}
var topolr=require("topolr-util");
var doc=function (obj,container) {
    topolr.extend(this,{
        sort:"",
        title:"",
        desc:"",
        keywords:"",
        layout:"",
        name:"index",
        content:""
    },obj);
    this._container=container;
    this.sitePath=container.getSitePath();
};
doc.prototype.getURL=function () {
    return this._container.getSitePath()+"/"+this.sort.replace(/\./g,"/")+"/"+this.name+".html";
};
doc.prototype.getOutputPath=function () {
    return this._container.getOutputPath()+this.sort.replace(/\./g,"/")+"/"+this.name+".html";
};
doc.prototype.getContentHTML=function () {
    var marked = require('marked'),ps=topolr.promise();
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
    });
    marked(this.content, function (err, r) {
        if (err){
            ps.reject(err);
        }else{
            ps.resolve(r);
        }
    });
    return ps;
};
doc.prototype._render=function () {
    var path=this._container.getLayoutPath()+this.layout+".html";
    var template=topolr.file(path).readSync();
    var ths=this;
    return this.getContentHTML().then(function (content) {
        ths.contentHTML=content;
        return topolr.template(template).render(ths);
    }).then(function (str) {
        return topolr.file(ths.getOutputPath()).write(str);
    });
};
doc.prototype.getContainer=function () {
    return this._container;
};
module.exports=doc;
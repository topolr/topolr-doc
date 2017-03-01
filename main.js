var topolr=require("topolr-util");
var base=require("./base/base");
module.exports=function (option) {
    var _base=base(option);
    topolr.setTemplateGlobalMacro("module",function (attr,render) {
        var name=attr.name,data=attr.data;
        var template=topolr.file(_base.getModulePath()+name+".html").readSync();
        var p = topolr.template(template);
        var t = p.render({
            data:data,
            pages:_base
        });
        for (var i in p._caching) {
            this._caching[i] = p._caching[i];
        }
        return t;
    });
    return _base;
}
var topolr=require("topolr-util");
var config=require("./config");
var doc=require("./antity/doc");
var sort=require("./antity/sort");
var waiter = {
    _data: {},
    _tid: null,
    _time: 500,
    _fn: null,
    _times: 0,
    add: function (type, path) {
        if (!waiter._data[type]) {
            waiter._data[type] = [];
        }
        if (waiter._data[type].indexOf(path) === -1) {
            waiter._data[type].push(path);
        }
        if (waiter.tid !== null) {
            clearTimeout(waiter.tid);
        }
        setTimeout(function () {
            var _has = false;
            for (var i in waiter._data) {
                _has = true;
            }
            if (_has) {
                waiter._fn && waiter._fn(waiter._data, waiter._times);
                waiter._times++;
            }
            waiter._data = {};
            waiter._tid = null;
        }, waiter._time);
        return this;
    },
    setHandler: function (fn) {
        waiter._fn = fn;
        return this;
    }
};

var base=function (option) {
    this.option=topolr.extend(true,{
        basePath:""
    },config,option);
    this.option.basePath=require("path").normalize(this.option.basePath).replace(/\\/g,"/");
    this.option.sourcePath=require("path").resolve(this.option.basePath,this.option.sourcePath).replace(/\\/g,"/");
    this.option.layoutPath=require("path").resolve(this.option.basePath,this.option.layoutPath).replace(/\\/g,"/");
    this.option.output=require("path").resolve(this.option.basePath,this.option.output).replace(/\\/g,"/");
    this.option.modulePath=require("path").resolve(this.option.basePath,this.option.modulePath).replace(/\\/g,"/");
    this.devSitePath=this.option.devSitePath[this.option.devSitePath.length-1]==="/"?this.option.devSitePath:(this.option.devSitePath+"/");
    this.pubSitePath=this.option.pubSitePath[this.option.pubSitePath.length-1]==="/"?this.option.pubSitePath:(this.option.pubSitePath+"/");
    this._dev=false;
    base.reset.call(this);
};
base.reg={
    comment:/\<\!\-\-[\s\S]*?\-\-\>/,
    info:/@([\s\S]*?);/g
};
base.map=function () {
    var path=this.option.sourcePath,ths=this;
    topolr.file(path,true).scan().forEach(function (a) {
        var suffix=topolr.file(a).suffix();
        if(suffix==="md"){
            var doc=base.getDocObject.call(ths,a,topolr.file(a).readSync());
            doc&&ths._doclist.push(doc);
        }
    });
};
base.sort=function () {
    this._sortMapping={};
    //{0:{name:obj},1:{name:obj}}
    var ths=this;
    for(var i=0;i<this._doclist.length;i++){
        var _sort=this._doclist[i].sort;
        var _paths=_sort.split(".");
        _paths.forEach(function (a,i) {
            if(a) {
                var b = null, p = null;
                if (!ths._sortMapping[i]) {
                    b = sort(a);
                    ths._sortMapping[i] = {};
                    ths._sortMapping[i][a] = b;
                } else {
                    if (!ths._sortMapping[i][a]) {
                        b = sort(a);
                        ths._sortMapping[i][a] = b;
                    } else {
                        b = ths._sortMapping[i][a];
                    }
                }
                var q = i - 1;
                if (q >= 0) {
                    var p = ths._sortMapping[q][_paths[q]]
                }
                b.parent = p;
                if (p) {
                    var has = false;
                    for (var m = 0; m < p.list.length; m++) {
                        if (p.list[m].name === b.name) {
                            has = true;
                        }
                    }
                    if (!has) {
                        p.list.push(b);
                    }
                }
            }
        });
    }
    var et=this._sortMapping["0"],rt=[];
    for(var i in et){
        rt.push(et[i]);
    }
    this._sortList=rt;
};
base.getDocObject=function (path,content) {
    var name=require("path").normalize(path).replace(/\\/g,"/").split("/").pop().split(".").shift();
    var a=content.match(base.reg.comment);
    if(a&&a.length>0){
        var info=a[0].match(base.reg.info);
        if(info){
            var obj={
                name:name
            };
            for(var i=0;i<info.length;i++){
                var b=info[i].trim();
                b=b.substring(1,b.length-1);
                var c=b.split(" ");
                var key=c.shift().trim();
                obj[key]=c.join(" ").trim()||"";
            }
            obj.content=content.replace(base.reg.comment,"");
            obj.fileInfo=topolr.file(path).infoSync();
            return new doc(obj,this);
        }
    }
    return null;
};
base.reset=function () {
    var ths=this;
    ["basePath","sourcePath","layoutPath","output","modulePath"].forEach(function (a) {
        var b=ths.option[a];
        if(b[b.length-1]!=="/"){
            ths.option[a]=ths.option[a]+"/";
        }
    });
    this._doclist=[];
    base.map.call(this);
    base.sort.call(this);
    this.sortList=this._sortList;
    this.docList=this._doclist;
};
base.prototype.getLayoutPath=function () {
    return this.option.layoutPath;
};
base.prototype.getSourcePath=function () {
    return this.option.sourcePath;
};
base.prototype.getBasePath=function () {
    return this.option.basePath;
};
base.prototype.getSitePath=function () {
    if(this._dev){
        return this.devSitePath;
    }else{
        return this.pubSitePath;
    }
};
base.prototype.getOutputPath=function () {
    return this.option.output;
};
base.prototype.getModulePath=function () {
    return this.option.modulePath;
};
base.prototype.getDocList=function () {
    return this._doclist;
};
base.prototype.getDocListBySort=function (sort) {
    var r=[];
    for(var i=0;i<this._doclist.length;i++){
        var a=this._doclist[i];
        var _sort=a.sort;
        if(_sort===sort||_sort.indexOf(sort+".")===0){
            r.push(a);
        }
    }
    return r;
};
base.prototype.getSortMapping=function () {
    return this._sortList;
};
base.prototype.render=function () {
    var ps=topolr.promise(function (a) {
        a();
    });
    for(var i=0;i<this._doclist.length;i++){
        (function (doc) {
            ps.then(function () {
                return doc._render();
            });
        })(this._doclist[i]);
    }
    return ps;
};
base.prototype.watch=function () {
    var ths=this;
    ths._dev=true;
    require('chokidar').watch(this.getBasePath(), {ignored: /[\/\\]\./}).on('change', function (path) {
        waiter.add("edit", path);
    }).on('add', function (path) {
        waiter.add("add", path);
    }).on('unlink', function (path) {
        waiter.add("remove", path);
    }).on("ready", function () {
        waiter.setHandler(function (a, times) {
            var t=new Date();
            var _y=t.getFullYear(),_m=(t.getMonth()+1),_d=t.getDate(),_h=t.getHours(),_mi=t.getMinutes(),_s=t.getSeconds();
            var p=_y+"-"+(_m<10?("0"+_m):_m)+"-"+(_d<10?("0"+_d):_d)+
                " "+(_h<10?("0"+_h):_h)+":"+(_mi<10?("0"+_mi):_mi)+":"+(_s<10?("0"+_s):_s);
            topolr.log("(color:11=>[BUILT] {{time}})",{time:p});
            base.reset.call(ths);
            ths.render().done(function () {
                topolr.log("(color:green=> build done)")
            }).fail(function () {
                topolr.log("(color:red=> {{error}})",{error:a});
            });
        });
    }).on("error", function () {
    });
};

module.exports=function (option) {
    return new base(option||{});
};
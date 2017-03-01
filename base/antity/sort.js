var sort=function (name) {
    this.name=name;
    this.parent=null;
    this.list=[];
};
sort.prototype.getSortFullName=function () {
    var a=this,r=[];
    while(a){
        r.unshift(a.name);
        a=a.parent;
    }
    return r.join(".");
};

module.exports=function (name) {
    return new sort(name);
};
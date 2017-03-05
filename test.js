require("./main")({
    basePath:"/Users/wangjinliang/git/topolr/source/",
    output:"../",
    sitePath:"http://topolr.org"
}).render().done(function () {
    console.log("done")
}).fail(function (a) {
    console.log(a);
});
require("./main")({
    basePath:"/Users/wangjinliang/git/topolr/source/",
    output:"../",
    sitePath:"http://localhost:8080/topolr"
}).render().done(function () {
    console.log("done")
}).fail(function (a) {
    console.log(a);
});
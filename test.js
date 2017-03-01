require("./main")({}).render().done(function () {
    console.log("done")
}).fail(function (a) {
    console.log(a);
});
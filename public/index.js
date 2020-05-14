define("preload", function (res) {
  res.Echo("<input id='i'><button id='a'>Submit</button>");
});
define("postload", function (document) {
  document.GetObjectById("a").OnClick(_=>{
    document.GetObjectById("i").Value(v=>{
      document.GetObjectById("i").SetValue("");
      console.log(v);
    });
  });
})
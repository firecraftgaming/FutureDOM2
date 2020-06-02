define("preload", function (res) {
  database = res.GetPublicDatabase();
  res.Echo("<input id='i'><button id='a'>Post</button><div>"+(
    database.SELECT("Test1", ["Name", "Lastname"]).map(v => "<p>" + v.Name + " " + v.Lastname + "</p>").join("")
  )+"</div>");
});
define("postload", function (document) {
  document.GetObjectById("a").onclick = _=>{
    document.GetObjectById("i").value.clb = v=>{
      document.GetObjectById("i").value = "";
      database.INSERT("Test1", v.split(" "))
    };
  };
})
define("preload", function (res) {
  database = res.GetDatabase();
  if (!database.msgs) database.msgs = []; if (!database.clbs) database.clbs = [];
  res.Echo("<input id='i'><button id='a'>Post</button><div id='b'></div>");
});
define("postload", function (document) {
  var name = "";
  database.clbs.push(_ => {
    var s = "";
    for (var o of database.msgs) s += "<p>" + o + "</p>";
    document.GetObjectById("b").innerHTML = s;
  });
  document.GetObjectById("a").onclick(_=>{
    document.GetObjectById("i").value.clb = v=>{
      document.GetObjectById("i").value = "";
      if (name == "") name = v; else database.msgs.push(`${name}: ${v}`);
      for (var o of database.clbs) o();
    };
  });
})
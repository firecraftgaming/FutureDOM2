const vm = require("vm");
const fs = require("fs");
const http = require("http");
const ws = require("ws");
const root = "./public";
var i = 0;
const server = http.createServer((req, res) => {
  ResponseObject.res[""+i] = res;
  PageLoader.Parse(req, res, i); 
  i++;
}).listen(8080);
const wss = new ws.Server({server});
connections = {};
var Response = {};
Response.callbacks = {};
Response.callbackiterator = 0;
Response.Callback = (callbackid, args) => {
  Response.callbacks[""+callbackid].apply(null, args);
};
Response.Register = (callback) => {
  Response.callbacks[""+Response.callbackiterator] = callback;
  Response.callbackiterator++;
  return Response.callbackiterator-1;
}
wss.on("connection", (ws, req) => {
  var msg = req.url;
  msg = msg.substr(msg.indexOf("=")+1);
  ws.id = msg;
  connections[msg] = ws;
  PageLoader.Defined.postload[""+msg]({
    GetObject: s => DocumentModel.GetObject(msg, s),
    GetObjectById: id => DocumentModel.GetObjectById(id, msg)
  });

  ws.on("message", msg => {
    var a = JSON.parse(msg);
    var r = Response[a.func].apply(this, a.args);
  });
});

var PageLoader = {};
var ResponseObject = {};
var DocumentModel = {};
var ObjectModel = {};
ObjectModel.Send = (id, data) => {
  connections[""+id].send(JSON.stringify(data));
};
ObjectModel.InnerText = (id, value, selector) => {
  ObjectModel.Send(id, {func: "InnerText", args: [value, selector]});
};
ObjectModel.InnerHTML = (id, value, selector) => {
  ObjectModel.Send(id, {func: "InnerHTML", args: [value, selector]});
};
ObjectModel.OnClick = (id, clb, selector) => {
  ObjectModel.Send(id, {func: "OnClick", args: [selector, Response.Register(clb)]});
};
ObjectModel.Value = (id, clb, selector) => {
  ObjectModel.Send(id, {func: "Value", args: [selector, Response.Register(clb)]});
}
ObjectModel.SetValue = (id, value, selector) => {
  ObjectModel.Send(id, {func: "SetValue", args: [selector, value]});
}
DocumentModel.GetObject = (id, selector) => {
  var o = {};
  o.InnerText = value => ObjectModel.InnerText(id, value, selector);
  o.OnClick = clb => ObjectModel.OnClick(id, clb, selector);
  o.Value = clb => ObjectModel.Value(id, clb, selector);
  o.SetValue = value => ObjectModel.SetValue(id, value, selector)
  return o;
};
DocumentModel.GetObjectById = (id, pageid) => {
  return DocumentModel.GetObject(pageid, "#"+id);
};
ResponseObject.res = {};
ResponseObject.Echo = (html, id) => {
  if (!ResponseObject.res[""+id]) return;
  ResponseObject.res[""+id].write(html);
};
ResponseObject.Load = (file, id) => {
  var f = fs.readFileSync(file).toString();
  ResponseObject.Echo(f, id)
}
PageLoader.Defined = {
  "preload": {},
  "postload": {}
};
PageLoader.Define = (name, func, id) => {
  name = name.toLowerCase();
  if (name != "preload" && name != "postload") return;
  PageLoader.Defined[name][""+id] = func;
};
PageLoader.ApplyScript = (script, res) => {
  res.write("<script>"+script+"</script>");
};
PageLoader.Parse = (req, res, id) => {
  url = root+req.url;
  pp = url.indexOf("?");
  params = pp > -1 ? url.substr(pp+1) : "";
  url = pp > -1 ? url.substr(0, pp) : url;
  if (!fs.existsSync(url)) return res.end("404");
  var stats = fs.lstatSync(url);
  url = stats.isDirectory() ? url+"index.js" : url;

  if (!url.endsWith("index.js") && fs.existsSync(url)) return res.end(fs.readFileSync(url).toString());

  PageLoader.ApplyScript("var pageid = '"+id+"'", res);
  PageLoader.ApplyScript(fs.readFileSync("./datahandler.js").toString(), res);

  var success = PageLoader.RunFile(url, id);
  if (!success) return res.end(404);
  var f = PageLoader.Defined["preload"][""+id];
  if (!f) return res.end("Error No PreLoad Definition");
  f({
    Echo: v => ResponseObject.Echo(v, id)
  });
  ResponseObject.res[""+id].end();
}
PageLoader.RunFile = (file, id) => {
  exists = fs.existsSync(file);
  if (!exists) return false;
  vm.runInNewContext(fs.readFileSync(file).toString(), {console, define: (name, func) => PageLoader.Define(name, func, id), run: v => PageLoader.RunFile(root+v, id)})
  return true;
}


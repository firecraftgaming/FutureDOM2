let x = {};
const {DocumentModel, ObjectModel, PageDatabase, PageLoader, PublicDatabase, Response, ResponseObject} = require("/Modules.js");
x.Send = (id, data) => {
  global.wss.connections[id.toString()].send(JSON.stringify(data));
};
x.InnerText = (id, clb, selector) => {
  x.Send(id, {func: "InnerText", args: [selector, Response.Register(clb)]});
};
x.InnerHTML = (id, clb, selector) => {
  x.Send(id, {func: "InnerHTML", args: [selector, Response.Register(clb)]});
};
x.SetInnerText = (id, value, selector) => {
  x.Send(id, {func: "SetInnerText", args: [value, selector]});
};
x.SetInnerHTML = (id, value, selector) => {
  x.Send(id, {func: "SetInnerHTML", args: [value, selector]});
};
x.OnClick = (id, clb, selector) => {
  x.Send(id, {func: "OnClick", args: [selector, Response.Register(clb)]});
};
x.Value = (id, clb, selector) => {
  x.Send(id, {func: "Value", args: [selector, Response.Register(clb)]});
}
x.SetValue = (id, value, selector) => {
  x.Send(id, {func: "SetValue", args: [selector, value]});
}
x.Copy = (id, selector) => {
  var o = {};
  o.__defineSetter__("innerText", v => x.SetInnerText(id, v, selector));
  o.__defineGetter__("innerText", _ => {
    var a = {clb: _=>{}};
    let clb = v => a.clb(v);
    x.InnerText(id, clb, selector);
    return a;
  });
  o.__defineSetter__("innerHTML", v => x.SetInnerHTML(id, v, selector));
  o.__defineGetter__("innerHTML", _ => {
    var a = {clb: _=>{}};
    let clb = v => a.clb(v);
    x.InnerHTML(id, clb, selector);
    return a;
  });
  o.__defineSetter__("onclick", clb => x.OnClick(id, clb, selector));
  o.__defineSetter__("value", v => x.SetValue(id, v, selector));
  o.__defineGetter__("value", _ => {
    var a = {clb: _=>{}};
    let clb = v => a.clb(v);
    x.Value(id, clb, selector);
    return a;
  });
  return o;
}
module.exports = x;
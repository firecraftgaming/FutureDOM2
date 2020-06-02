let x = {};
x.Send = (id, data, wss) => {
  wss.connections[id.toString()].send(JSON.stringify(data));
};
x.InnerText = (id, clb, selector, wss, Response) => {
  x.Send(id, {func: "InnerText", args: [selector, Response.Register(clb)]}, wss);
};
x.InnerHTML = (id, clb, selector, wss, Response) => {
  x.Send(id, {func: "InnerHTML", args: [selector, Response.Register(clb)]}, wss);
};
x.SetInnerText = (id, value, selector, wss) => {
  x.Send(id, {func: "SetInnerText", args: [value, selector]}, wss);
};
x.SetInnerHTML = (id, value, selector, wss) => {
  x.Send(id, {func: "SetInnerHTML", args: [value, selector]}, wss);
};
x.OnClick = (id, clb, selector, wss, Response) => {
  x.Send(id, {func: "OnClick", args: [selector, Response.Register(clb)]}, wss);
};
x.Value = (id, clb, selector, wss, Response) => {
  x.Send(id, {func: "Value", args: [selector, Response.Register(clb)]}, wss);
}
x.SetValue = (id, value, selector, wss) => {
  x.Send(id, {func: "SetValue", args: [selector, value]}, wss);
}
x.Copy = (id, selector, wss, Response) => {
  var o = {};
  o.__defineSetter__("innerText", v => x.SetInnerText(id, v, selector, wss));
  o.__defineGetter__("innerText", _ => {
    var a = {clb: _=>{}};
    let clb = v => a.clb(v);
    x.InnerText(id, clb, selector, wss, Response);
    return a;
  });
  o.__defineSetter__("innerHTML", v => x.SetInnerHTML(id, v, selector, wss));
  o.__defineGetter__("innerHTML", _ => {
    var a = {clb: _=>{}};
    let clb = v => a.clb(v);
    x.InnerHTML(id, clb, selector, wss, Response);
    return a;
  });
  o.onclick = clb => x.OnClick(id, clb, selector, wss, Response);
  o.__defineSetter__("value", v => x.SetValue(id, v, selector, wss));
  o.__defineGetter__("value", _ => {
    var a = {clb: _=>{}};
    let clb = v => a.clb(v);
    x.Value(id, clb, selector, wss, Response);
    return a;
  });
  return o;
}
module.exports = x;
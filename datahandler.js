

var u = window.location.href;
var p = window.location.protocol;
var ws = new WebSocket("wss:"+u.substr(p.length)+"?id="+pageid);
ws.onopen = _ => {
  var Response = {};
  Response.InnerText = (value, selector) => {
    Array.from(document.querySelectorAll(selector)).forEach(v => v.innerText = value);
  };
  Response.InnerHTML = (value, selector) => {
    Array.from(document.querySelectorAll(selector)).forEach(v => v.innerHTML = value);
  };
  Response.OnClick = (selector, callbackID) => {
    Array.from(document.querySelectorAll(selector)).forEach(v => {
      v.onclick = e => {
        ws.send(JSON.stringify({func: "Callback", args: [callbackID, []]}));
      }
    });
  }
  Response.Value = (selector, callbackID) => {
    Array.from(document.querySelectorAll(selector)).forEach(v => {
      ws.send(JSON.stringify({func: "Callback", args: [callbackID, [v.value]]}));
    });
  }
  Response.SetValue = (selector, value) => {
    Array.from(document.querySelectorAll(selector)).forEach(v => {
      v.value = value;
    });
  }
  ws.onmessage = e => {
    var a = JSON.parse(e.data);
    var r = Response[a.func].apply(this, a.args);
  }
}
ws.onclose = _ => {
  alert("Something went wrong with your connection to the FutureDOM server. That means that most of the interactions wont work please reload the page.")
}
ws.onerror = onclose;
//Start connection
var ws = new WebSocket("wss://"+window.location.host+"/?id="+pageid);

//A helper function to call a callback
ws.Callback = (callbackID, args=[]) => {
  ws.send(JSON.stringify([callbackID, args]));
};
ws.onopen = _ => {
  var Response = {};

  //All the response functions
  Response.InnerText = (value, selector) => {
    Array.from(document.querySelectorAll(selector)).forEach(v => {
      ws.Callback(callbackID, [v.innerText]);
    });
  };
  Response.InnerHTML = (value, selector) => {
    Array.from(document.querySelectorAll(selector)).forEach(v => {
      ws.Callback(callbackID, [v.innerHTML]);
    });
  };
  Response.SetInnerText = (value, selector) => {
    Array.from(document.querySelectorAll(selector)).forEach(v => v.innerText = value);
  };
  Response.SetInnerHTML = (value, selector) => {
    Array.from(document.querySelectorAll(selector)).forEach(v => v.innerHTML = value);
  };
  Response.OnClick = (selector, callbackID) => {
    Array.from(document.querySelectorAll(selector)).forEach(v => {
      v.onclick = e => {
        ws.Callback(callbackID)
      }
    });
  }
  Response.Value = (selector, callbackID) => {
    Array.from(document.querySelectorAll(selector)).forEach(v => {
      ws.Callback(callbackID, [v.value]);
    });
  }
  Response.SetValue = (selector, value) => {
    Array.from(document.querySelectorAll(selector)).forEach(v => {
      v.value = value;
    });
  }

  //Run the right function with the tright arguments from the request at the server
  ws.onmessage = e => {
    var a = JSON.parse(e.data);
    var r = Response[a.func].apply(this, a.args);
  }
}

//Display error when connection gets closed
ws.onerror = ws.onclose = _ => {
  alert("Something went wrong with your connection to the FutureDOM server. That means that most of the interactions wont work please reload the page.")
}
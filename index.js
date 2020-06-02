const vm = require("vm");
const fs = require("fs");
const http = require("http");
const ws = require("ws");

const Response = require("./Modules/Response.js");
const PageLoader = require("./Modules/PageLoader.js");
const ResponseObject = require("./Modules/ResponseObject.js");
const DocumentModel = require("./Modules/DocumentModel.js");
const ObjectModel = require("./Modules/ObjectModel.js");
const PageDatabase = require("./Modules/PageDatabase.js");
const PublicDatabase = require("./Modules/PublicDatabase.js");

const config = JSON.parse(fs.readFileSync("config.json"));

let currentID = 0;
//Init the http server
const server = http.createServer((req, res) => {
  //Store the response object with the ID as key so it can be accessed from define("preload").
  ResponseObject.res[currentID.toString()] = res;
  PageLoader.Parse(req, currentID, ResponseObject, PageDatabase, PublicDatabase); 
  currentID++;
}).listen(config.port);

//Init the WebSocket server
const wss = new ws.Server({server});
wss.connections = {};
wss.on("connection", (ws, req) => {
  //Get the ID of the client and assign the connections ID to the ID that got retrieved.
  let ID = req.url.substr(req.url.indexOf("=")+1);
  ws.id = ID;
  wss.connections[ID] = ws;

  //Call PostLoad
  PageLoader.Defined.postload[ID.toString()]({
    GetObject: selector => DocumentModel.GetObject(ID, selector, ObjectModel, Response, wss),
    GetObjectById: id => DocumentModel.GetObjectById(id, ID, ObjectModel, Response, wss),
    get body() {
      return DocumentModel.GetObject(ID, "body", ObjectModel, Response, wss);
    }
  });

  //Define value return function
  ws.on("message", msg => {
    Response.Callback.apply(null, JSON.parse(msg));
  });
});

module.exports = "";
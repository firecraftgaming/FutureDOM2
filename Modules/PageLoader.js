const vm = require("vm");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("config.json"));

let x = {};

//Storage for the two defineable functions
x.Defined = {
  "preload": {},
  "postload": {}
};

//Define function used to store functions like preload and postload
x.Define = (name, func, id) => {
  //Check if name isnt "preload" or "postload" and if it isnt eaither of them return false
  name = name.toLowerCase();
  if (name != "preload" && name != "postload") return false;
  //Set the input function as either "preload" or "postload" of that ID
  x.Defined[name][id.toString()] = func;
};

//A script to print a script to the page
x.ApplyScript = (script, res) => {
  //Prints a script tag on the response
  res.write("<script>"+script+"</script>");
};

//A parsing script this is the main functiont that calls when a page loads
x.Parse = (req, id, ResponseObject, PageDatabase, PublicDatabase) => {
  let res = ResponseObject.res[id.toString()];

  //Parse Url
  let url = (config.root+req.url).split("?");
  let path = url.shift();
  let params = url.join("?");
  
  //Check if file doesnt exist and if it is a directory
  if (!fs.existsSync(path)) return res.end("404");
  path = fs.lstatSync(path).isDirectory() ? path+"index.js" : path;

  //If file doesnt end with index.js return it as an normal file
  if (!path.endsWith("index.js")) return res.end(fs.readFileSync(path).toString());

  //Load the client script for communication.
  x.ApplyScript("var pageid = '"+id+"'", res);
  x.ApplyScript(fs.readFileSync("./datahandler.js").toString(), res);

  //Try to load the index.js file
  let success = x.RunFile(path, id);
  if (!success) return res.end(404);

  //Look if the file contains a preload function if not display error
  var f = x.Defined.preload[id.toString()];
  if (!f) {
    console.log(`Id: ${id} on Path: ${path} issued the "No Preload Definition" error`);
    return res.end("Error No PreLoad Definition");
  }
  //Give the Echo and Load functions to the preload function.
  f({
    Echo: v => ResponseObject.Echo(v, id),
    Load: v => ResponseObject.Load(v, id),
    GetDatabase: _ => PageDatabase.RetrieveDatabase(path),
    GetPublicDatabase: name => PublicDatabase
  });

  //stop the response object after preload is done with its logic
  ResponseObject.res[id.toString()].end();
}
x.RunFile = (file, id) => {
  //Check if file exists if not return false
  exists = fs.existsSync(file);
  if (!exists) return false;

  //Run the file and return true
  vm.runInNewContext(fs.readFileSync(file).toString(), {
    console,
    define: (name, func) => x.Define(name, func, id),
    run: v => x.RunFile(config.root+v, id)
  })
  return true;
}

module.exports = x;
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("config.json"));

var x = {};
//Storage for the response object of an ID
x.res = {};

//Echo is a function to write to the page
x.Echo = (html, id) => {
  if (!x.res[id.toString()]) return false;
  x.res[id.toString()].write(html);
};
//Load is a function to write and file to a page
x.Load = (file, id) => {
  var f = fs.readFileSync(config.root + file).toString();
  x.Echo(f, id)
}

module.exports = x;
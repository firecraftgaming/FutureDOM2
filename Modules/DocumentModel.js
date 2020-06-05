let x = {};
const {DocumentModel, ObjectModel, PageDatabase, PageLoader, PublicDatabase, Response, ResponseObject} = require("/Modules.js");
x.GetObject = (pageid, selector) => {
  return ObjectModel.Copy(pageid, selector, global.wss);
};
x.GetObjectById = (id, pageid) => {
  return x.GetObject(pageid, "#"+id, global.wss);
};
module.exports = x;
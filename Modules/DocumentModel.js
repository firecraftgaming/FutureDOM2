let x = {};
x.GetObject = (pageid, selector, ObjectModel, Response, wss) => {
  return ObjectModel.Copy(pageid, selector, wss, Response);
};
x.GetObjectById = (id, pageid, ObjectModel, Response, wss) => {
  return x.GetObject(pageid, "#"+id, ObjectModel, Response, wss);
};
module.exports = x;
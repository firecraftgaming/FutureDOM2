var x = {};

x.DocumentModel = global.DocumentModel = global.DocumentModel || require("./Modules/" + "DocumentModel" + ".js");
x.ObjectModel = global.ObjectModel = global.ObjectModel || require("./Modules/" + "ObjectModel" + ".js");
x.PageDatabase = global.PageDatabase = global.PageDatabase || require("./Modules/" + "PageDatabase" + ".js");
x.PageLoader = global.PageLoader = global.PageLoader || require("./Modules/" + "PageLoader" + ".js");
x.PublicDatabase = global.PublicDatabase = global.PublicDatabase || require("./Modules/" + "PublicDatabase" + ".js");
x.Response = global.Response = global.Response || require("./Modules/" + "Response" + ".js");
x.ResponseObject = global.ResponseObject = global.ResponseObject || require("./Modules/" + "ResponseObject" + ".js");

module.exports = x;

//const {DocumentModel, ObjectModel, PageDatabase, PageLoader, PublicDatabase, Response, ResponseObject} = require("./Modules.js");
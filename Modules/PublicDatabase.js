const fs = require("fs");

let databases = {

};
let x = {};
x.save = () => {
  for (let k of Object.keys(databases)) {
    let o = databases[k];
    let data = o.data;
    let parsedData = "\"" + o.fields.map(v => v.name).join("\",\"") + "\"";
    parsedData += "\n";
    parsedData += "\"" + o.fields.map(v => v.defaultValue).join("\",\"") + "\"";
    for (let i in data) {
      parsedData += "\n";
      let a = "\"" + data[i].join("\",\"") + "\"";
      parsedData += a;
    }
    fs.writeFile("./databases/"+o.name+".csv", parsedData, _=>{})
  }
};
x.parseCSV = (csv) => {
  var a = csv.split("\n").map(v => v.split(","));
  return a.map(v => {
    var e = [];
    var c = 0;
    v.forEach((v2, i) => {
      v2 = " "+v2+" ";
      if (c == 1) v2 = v[i-1] + v2;
      c = (c == 1) ? 0 : v2.split("\"")-1;
      if (c != 1) e.push(v2);
    });
    return e.map(v => v.substr(2, v.length-4));
  });
};
x.load = () => {
  fs.readdir("./databases", function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err);

    files.forEach(function (file) {
      let data = fs.readFileSync("./databases/"+file).toString();
      file = file.split(".").shift();
      data = x.parseCSV(data);
      console.log(data);
      let f = data.shift();
      x.create(file, data.shift().map((v, i) => {
        return x.createField(f[i], v)
      }));
      for (var o of data) {
        x.INSERT(file, o);
      }
    });
  });
  x.save();
};
x.createField = (field, defaultValue) => {
  return {
    name: field,
    defaultValue
  };
};
x.create = (name, fields) => {
  if (databases[name]) return false;
  let a = {};
  a.name = name;
  a.fields = fields;
  a.data = [];
  a.INSERT = (fields, values) => {
    if (!values) return a.INSERT(a.fields.map(v => v.name), fields);
    let b = [];
    for (let o of a.fields) {
      b.push(o.defaultValue);
    }
    for (let i in fields) {
      for (let j in a.fields) {
        if (fields[i] == a.fields[j].name) {
          b[j] = values[i];
        }
      }
    }
    a.data.push(b);
    return b;
  };
  return databases[name] = a;
};
x.INSERT = (database, fields, values) => {
  var r;
  if (!values) r = databases[database].INSERT(fields); else r = databases[database].INSERT(fields, values);
  x.save();
  return r;
};
function row(fields, index, database) {
  //filters row so only the fields that should be included are included
  let r = databases[database].data[index];
  let isa = fields.map(v => databases[database].fields.findIndex(e => e.name == v));
  let a = r.filter((v, i) => isa.indexOf(i) > -1);
  r = {};
  a.forEach((v, i) => r[fields[i]] = v);
  return r;
}
x.SELECT = (database, fields, where=_=>true, limit=0) => {
  var rows = [];
  for (var i in databases[database].data) {
    var a = row(fields, i, database);
    var r = where(a, i);
    if (r) rows.push(a);
    if (i >= limit && limit > 0) break;
  }
  return rows;
};

x.load();


module.exports = x;
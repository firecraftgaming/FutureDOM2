var dataStore = {

}
let x = {};
x.RetrieveDatabase = (page) => {
  if (!dataStore[page]) dataStore[page] = {};
  return dataStore[page];
}
module.exports = x;
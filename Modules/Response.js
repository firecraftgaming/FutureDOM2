var x = {};

//Callback system
x.callbacks = {};
x.callbackiterator = 0;
x.Callback = (callbackid, args) => {
  x.callbacks[callbackid.toString()].apply(null, args);
};
x.Register = (callback) => {
  x.callbacks[x.callbackiterator.toString()] = callback;
  x.callbackiterator++;
  return x.callbackiterator-1;
}

module.exports = x;
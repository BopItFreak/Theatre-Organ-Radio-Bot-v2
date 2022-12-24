const TheaterOrgan = require('./src/theater-organ');
let organ = new TheaterOrgan();
//Hx7CZ2Nyza8_UmmzhiWM2JYXG4KzkJW9UFtFQayF-PS2U_0etQyEmgdSms8ElwnIjLXo
//https://canary.discord.com/api/webhooks/991123323406798928/Hx7CZ2Nyza8_UmmzhiWM2JYXG4KzkJW9UFtFQayF-PS2U_0etQyEmgdSms8ElwnIjLXo
process.on("uncaughtException", e => {
  console.log("Error " + e)
});

Object.defineProperty(Array.prototype, 'chunk', {
  value: function (n) {
      return Array.from(Array(Math.ceil(this.length / n)), (_, i) => this.slice(i * n, i * n + n));
  }
});

global.truncate = function(str, max, sep) {
  max = max || 10;
  var len = str.length;
  if (len > max) {
    sep = sep || "...";
    var seplen = sep.length;
    if (seplen > max) {
      return str.substr(len - max);
    }
    var n = -0.5 * (max - len - seplen);
    var center = len / 2;
    var front = str.substr(0, center - n);
    var back = str.substr(len - center + n);
    return front + sep + back;
  }
  return str;
}
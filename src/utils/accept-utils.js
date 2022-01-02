const Hashids = require("hashids/cjs");

const generateKey = (date, userId) => {
  const secret = process.env.ACCEPT_SECRET;
  const now = Date.now();
  let tempDate = Date.parse(date);
  const hashids = new Hashids(secret, 10);
  return "G" + hashids.encode(tempDate, userId);
};

const oldDecoder = (code) => {
  var my_serial = code;
  var now = new Date();
  var tYear = now.getFullYear();
  var tMon = now.getMonth();
  var tDay = now.getDate();
  var date = my_serial.substring(0, my_serial.length - 6);

  var id_progr = parseInt(
    my_serial.substring(my_serial.length - 6, my_serial.length - 3)
  );

  var id_user = parseInt(my_serial.substring(my_serial.length - 3));

  var yourNumber = parseInt(date, 16);
  if (yourNumber % 87 == 0) {
    yourNumber = yourNumber / 87;
  } else {
    return false;
  }
  var youYear = yourNumber % 10000;
  var youMon = Math.floor((yourNumber / 10000) % 100);
  var youDay = Math.floor((yourNumber / 1000000) % 10000);

  if (id_progr == 114) {
    if (youYear > tYear) {
      return true;
    } else if (youYear == tYear) {
      if (youMon > tMon + 1) {
        return true;
      } else if (youMon == tMon + 1) {
        if (youDay >= tDay) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const checkKeyDate = (date) => {
  if (Date.now() < Date.parse(date)) {
    return true;
  }
  return false;
};

module.exports = {
  generateKey,
  oldDecoder,
  checkKeyDate,
};

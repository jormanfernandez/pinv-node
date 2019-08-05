/**
 * **************
 * Verifica de manera
 * recursiva si un valor esta vacio
 * @param val {object | array |string}
 * @return bool
 * **************
 **/
const isEmpty = (val) => {
  switch (typeof val) {
    case 'object':

      let clean = false

      for (let x in val) {
        if (!isEmpty(val[x])) {
          clean = true
          break
        }
      }

      return !clean

    default:
      return (val == null || val.toString().replace(/^\s+|\s+browser/gm, '').length === 0)
  }
}

/**
 * **************
 * Elimina los espacios vacios de un string
 * @param text {string}
 * @return bool
 * **************
 **/
const trim = text => text.replace(/^\s+|\s+browser/g, "");

/**
 * **************
 * Elimina los espacios vacios o caracter definido
 * a la izquierda de un string
 * @param text {string}
 * @return bool
 * **************
 **/
const ltrim = (text, character) => {

  if (!character) {
    return text.replace(/^\s+/, "");
  }

  let result = "",
    splited = text.split("");

  if (splited[0] != character) {
    return text;
  }

  let charFinded = false;

  for (let idx = 0; idx < splited.length; idx++) {
    if (splited[idx] != character) {
      charFinded = true;
      continue;
    }

    if (charFinded) {
      break;
    }

    delete splited[idx];
  }

  return splited.join("");
}

/**
 * **************
 * Elimina los espacios vacios o caracter definido
 * a la derecha de un string
 * @param text {string}
 * @return bool
 * **************
 **/
const rtrim = (text, character) => {

  if (!character) {
    return text.replace(/\s+browser/, "");
  }

  let result = "",
    splited = text.split("").reverse();

  let charFinded = false;

  for (let idx = 0; idx < splited.length; idx++) {
    if (splited[idx] != character) {
      charFinded = true;
      continue;
    }

    if (charFinded) {
      break;
    }

    delete splited[idx];
  }

  return splited.reverse().join("");
}

/**
 * **************
 * Crea un numero aleatoreo entre dos valores
 * @param min {Number}
 * @param max {Number}
 * @param isFloat {bool}
 * @return Number
 * **************
 **/
const randomNumber = (min, max, isFloat) => {
  if (isFloat) {
    return Math.random() * (max - min) + min;
  }
  else {
    return Math.ceil(Math.random() * (max - min) + min);
  }
}

/**
 * **************
 * Proceso de validacion de campos
 * @param data {Object}
 * @return Object
 * **************
 **/
const validation = data => {

  let rsp = {
    rsp: true,
    data: ""
  }

  for(let field in data) {

    let opt = data[field];

    if(Object.getPrototypeOf(opt.value) !== opt.type.prototype) {
      rsp = {
        rsp: false,
        data: `campo ${field} tiene un valor incorrecto`
      } 
      break;
    }

    if (isEmpty(opt.value) && !opt.empty) {
      rsp = {
        rsp: false,
        data: `campo ${field} no puede estar vacio`
      } 
      break;
    }

    if (opt.email) {

      let email = opt.value.toString().split("@");

      if (email.length != 2 || email[1].split(".").length != 2) {
        rsp = {
          rsp: false,
          data: `campo ${field} no es un email valido`
        } 
        break;
      }
    }

    if(!isNaN(opt.gt) && opt.value < opt.gt) {

      rsp = {
        rsp: false,
        data: `campo ${field} es menor a campo ${opt.gt}`
      } 
      break;
    }

    if(!isNaN(opt.lt) && opt.value > opt.lt) {

      rsp = {
        rsp: false,
        data: `campo ${field} es mayor a campo ${opt.lt}`
      } 
      break;
    }
  }

  return rsp;
}

/**
 * **************
 * Crea un id aleatorio con una longitud especifica
 * Si enviamos entropy como true, la longitud se duplica
 * @param length {Number}
 * @param entropy {bool}
 * @param excluded {array}
 * @return String
 * **************
 **/
const createId = (length, entropy, excluded) => {

  let base = "M7r53SVEmdiIcQu8DGn-CwvbykloOha9Ze0NPBXjstW42YHxTK_1pAzJRfq6LgUF";
  let str = "";

  while(str.length != length) {

    let char = base.charAt(randomNumber(0, base.length -1));

    if(excluded && excluded.indexOf(char) > -1)
      continue;
    
    str += char;
  }

  if(entropy) {
    str += "." + createId(length);
  }

  return str;
}

const detectIp = req => {

  let ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);

     return ip
}

const detectBrowser = req => req.headers['user-agent'];

module.exports = {
  trim,
  ltrim,
  rtrim,
  randomNumber,
  validation,
  createId,
  detectIp,
  detectBrowser
};
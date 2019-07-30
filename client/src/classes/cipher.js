class Cipher {

  constructor(salt) {
    this.key = "Kfz#!w¿ñbY?[hQ=vnuZ0{Ñ¡$2Lc7jVC/sP6yXSe1HI)(JGNUM4]r5p%ERiF\"Dgtml3daABTkO} *xo89Wq".split("");
    this.salt = salt;

    this.excluded = [];
  }

  _inicio(str) {
    const ascii = str.charCodeAt(0);
    const primero = (ascii * str.split("").length * (ascii * 2.1));
    let result = "";

    switch (true) {
      case (primero < 0):
        result = "0"+primero;
      break;
      case (primero > 99):
        result = primero.toString()[0]+""+primero.toString()[1];
      break;
      default:
        result = primero;
    }

    for(let char of str) {

      let idx = this.key.indexOf(char);

      if(idx > -1) {

        if(idx >= (this.key.length - 1))
          idx = -1;

        result += this.key[idx + 1];
      } else {
        result += char;
      }
    }

    return result;
  }

  _revertir(string) {
    let result = "";
    let i = 0;

    for(let char of string) {

      if(i < 2) {
        i++;
        continue;
      }

      let idx = this.key.indexOf(char);

      if(idx > -1) {

        if(idx < 1)
          idx = this.key.length;

        result += this.key[idx - 1];
      } else {
        result += char;
      }
    }

    return result;
  }

  cifrar(str) {
      // ---------------
      // Transformamos primeramente la string
      // ---------------

      str = this._inicio(str);
      let result = "";

      for(let i = 0; i < str.length; i++) {

        let hiddeChar = str.charCodeAt(i);
        let keyChar = this.salt.charCodeAt((i%this.salt.length));
        let character = String.fromCharCode(parseInt(hiddeChar) + parseInt(keyChar));

        result += "" + character;
      }

      // ---------------
      // Devolvemos el valor Base64 de la cadena cifrada
      // ---------------
      return Base64.encode(result);
  }

  descifrar(str) {

      let result = "";
      // ---------------
      // Deciframos el base64 de la cadena
      // ---------------
      str = Base64.decode(str);

      for(let i = 0; i < str.length; i++) {

        let hiddeChar = str.charCodeAt(i);
        let keyChar = this.salt.charCodeAt((i%this.salt.length));
        let character = String.fromCharCode(parseInt(hiddeChar) - parseInt(keyChar));

        result += "" + character;
      }

      // ---------------
      // Metodo para llevar a su punto inicial
      // ---------------
      return this._revertir(result);
  }
}
/* eslint-disable */
export const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]
export const dias = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
]
export const isEmpty = val => {
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
      return (val == null || val.toString().replace(/^\s+|\s+$/gm, '').length === 0)
  }
}
export const centerElement = element => {
  element.style = 'left: 0 margin: auto '

  let windowsHeight = (window.innerHeight / 2)
  let padding = 3

  try {
    let el = element.$el.children[0]
    let elHeight = parseInt(el.clientHeight + padding)

    let fromTop = parseInt(windowsHeight - (elHeight / 2))

    if (fromTop < 0) {
      fromTop = 5
    }

    element.style += 'top: ' + fromTop + 'px'
  } catch (e) {
    let initialHeight = 210
    let fromTop = parseInt(windowsHeight - (initialHeight / 2))
    element.style += 'top: ' + fromTop + 'px'
    setTimeout(element.center, 2)
  }

  return element.style
}
export const trim = (text) => text.replace(/^\s+|\s+$/g, '')
export const ltrim = (text, character) => {
  if (!character) {
    return text.replace(/^\s+/, '')
  }
  let splited = text.split('')

  if (splited[0] !== character) {
    return text
  }

  let charFinded = false

  for (let idx = 0; idx < splited.length; idx++) {
    if (splited[idx] !== character) {
      charFinded = true
      continue
    }

    if (charFinded) {
      break
    }

    delete splited[idx]
  }

  return splited.join('')
}
export const rtrim = (text, character) => {
  if (!character) {
    return text.replace(/\s+$/, '')
  }
  let splited = text.split('').reverse()
  let charFinded = false

  for (let idx = 0; idx < splited.length; idx++) {
    if (splited[idx] !== character) {
      charFinded = true
      continue
    }

    if (charFinded) {
      break
    }

    delete splited[idx]
  }

  return splited.reverse().join('')
}
export const processImage = (image, component) => {
  const aceptedTypes = ['image/jpeg', 'image/png']

  if (aceptedTypes.indexOf(image.type) < 0) {
    component.message = ''
    component.button.isSending = false

    return component.$root.popWindow({
      type: 'error',
      title: 'Formato incorrecto',
      message: ['El archivo enviado es inválido', 'Solo aceptamos imágenes con formato PNG o JPEG']
    })
  }

  if ((image.size / 1024) > 1024) {
    component.message = ''
    component.button.isSending = false

    return component.$root.popWindow({
      type: 'error',
      title: 'Archivo muy grande',
      message: ['La imagen es muy pesada', 'El archivo puede tener un tamaño máximo de 1 MB']
    })
  }

  let reader = new FileReader()
  reader.onload = () => {
    let check = new Image()
    check.src = (URL || webkitURL).createObjectURL(image)
    check.onload = () => {
      let width = check.naturalWidth
      let height = check.naturalHeight

      component.message = ''
      component.button.isSending = false

      /**/
      if (component.aceptedResolution.indexOf(width) < 0 || component.aceptedResolution.indexOf(height) < 0) {
        (URL || webkitURL).revokeObjectURL(check.src)

        let resolutions = ''
        for (let name of component.aceptedResolution) {
          resolutions += '[' + name + 'px-' + name + 'px] '
        }

        resolutions = trim(resolutions)

        return component.$root.popWindow({
          type: 'info',
          title: 'Tamaño incorrecto',
          message: ['La imagen debe tener una de las siguientes resoluciones', resolutions]
        })
      }

      component.person.image.blob = check
      component.person.image.name = image.name
      component.person.image.type = image.type
    }
  }

  reader.onerror = () => {
    component.message = ''
    component.button.isSending = false

    component.$root.popWindow({
      type: 'error',
      title: 'Ha ocurrido un error cargando la imagen',
      message: [reader.error.message, 'Por favor pruebe nuevamente']
    })
  }

  reader.readAsDataURL(image)
}
export const espLanguage = () => {
  let language = {
    rlt: false,
    yearSuffix: '',
    ymd: false,
    _days: dias.map(name => name.substring(0, 3)),
    _months: meses,
    _monthsAbbr: meses.map(name => name.substring(0, 3)),
    _language: 'Español'
  }

  for (let idx in language) {
    if (idx[0] !== '_') {
      continue
    }

    language[idx.substring(1, idx.length)] = language[idx]
  }

  return language
}
export const formatDate = date => {
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()

  if (day < 10) {
    day = '0' + day
  }

  if (month < 10) {
    month = '0' + month
  }

  return [
    day,
    month,
    year
  ].join('/')
}
export const dateToNormal = date => {
  date = date instanceof Date ? date : new Date(date)

  let time = [
    date.getDate(),
    'de',
    meses[date.getMonth()],
    'del',
    date.getFullYear()
  ]

  return time.join(' ')
}
export const dateToTime = date => {
  date = date instanceof Date ? date : new Date(date)

  let time = [
    'A los',
    date.getDate(),
    'días del mes de',
    meses[date.getMonth()],
    'del',
    date.getFullYear()
  ]

  return time.join(' ')
}
export const Unidades = num => {
  switch (num) {
    case 1:
      return 'UN'
    case 2:
      return 'DOS'
    case 3:
      return 'TRES'
    case 4:
      return 'CUATRO'
    case 5:
      return 'CINCO'
    case 6:
      return 'SEIS'
    case 7:
      return 'SIETE'
    case 8:
      return 'OCHO'
    case 9:
      return 'NUEVE'
    default:
      return ''
  }
}
export const Decenas = num => {
  let decena = Math.floor(num / 10)
  let unidad = num - (decena * 10)
  switch (decena) {
    case 1:
      switch (unidad) {
        case 0:
          return 'DIEZ'
        case 1:
          return 'ONCE'
        case 2:
          return 'DOCE'
        case 3:
          return 'TRECE'
        case 4:
          return 'CATORCE'
        case 5:
          return 'QUINCE'
        default:
          return 'DIECI' + Unidades(unidad)
      }
    case 2:
      switch (unidad) {
        case 0:
          return 'VEINTE'
        default:
          return 'VEINTI' + Unidades(unidad)
      }
    case 3:
      return DecenasY('TREINTA', unidad)
    case 4:
      return DecenasY('CUARENTA', unidad)
    case 5:
      return DecenasY('CINCUENTA', unidad)
    case 6:
      return DecenasY('SESENTA', unidad)
    case 7:
      return DecenasY('SETENTA', unidad)
    case 8:
      return DecenasY('OCHENTA', unidad)
    case 9:
      return DecenasY('NOVENTA', unidad)
    case 0:
      return Unidades(unidad)
  }
}
export const DecenasY = (strSin, numUnidades) => numUnidades > 0 ? strSin + ' Y ' + Unidades(numUnidades) : strSin
export const Centenas = num => {
  let centenas = Math.floor(num / 100)
  let decenas = num - (centenas * 100)
  switch (centenas) {
    case 1:
      if (decenas > 0) {
        return 'CIENTO ' + Decenas(decenas)
      }
      return 'CIEN'
    case 2:
      return 'DOSCIENTOS ' + Decenas(decenas)
    case 3:
      return 'TRESCIENTOS ' + Decenas(decenas)
    case 4:
      return 'CUATROCIENTOS ' + Decenas(decenas)
    case 5:
      return 'QUINIENTOS ' + Decenas(decenas)
    case 6:
      return 'SEISCIENTOS ' + Decenas(decenas)
    case 7:
      return 'SETECIENTOS ' + Decenas(decenas)
    case 8:
      return 'OCHOCIENTOS ' + Decenas(decenas)
    case 9:
      return 'NOVECIENTOS ' + Decenas(decenas)
    default:
      return Decenas(decenas)
  }
}
export const Seccion = (num, divisor, strSingular, strPlural) => {
  let cientos = Math.floor(num / divisor)
  let resto = num - (cientos * divisor)
  let letras = ''
  if (cientos > 0) {
    letras = cientos > 1 ? Centenas(cientos) + ' ' + strPlural : strSingular
  } else {
    letras = strSingular
  }
  if (resto > 0) {
    letras += ''
  }
  return letras
}
export const Miles = num => {
  let divisor = 1000
  let cientos = Math.floor(num / divisor)
  let resto = num - (cientos * divisor)
  let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL')
  let strCentenas = Centenas(resto)
  return strMiles === '' || cientos === 0 ? strCentenas : strMiles + ' ' + strCentenas 
}
export const Millones = num => {
  let divisor = 1000000
  let cientos = Math.floor(num / divisor)
  let resto = num - (cientos * divisor)
  let strMillones = Seccion(num, divisor, millon(true), millon(false))
  let strMiles = Miles(resto)
  return strMillones === '' || cientos === 0 ? strMiles : strMillones + ' ' + strMiles 
}
export const millon = singular => singular ? 'UN MILLON' : 'MILLONES'
export const NumberAsString = num => {
  let strNum = num.toString()
  let cents = ''

  strNum = ltrim(strNum, '0')

  let currency = {
    sing: 'BOLÍVAR',
    plur: 'BOLÍVARES',
    centPlur: 'CÉNTIMOS',
    centSing: 'CÉNTIMO'
  }

  if (strNum.contains('.')) {
    strNum = strNum.split('.')
    cents = new Number(strNum[strNum.length -1].substring(0, 2))
    strNum = strNum[0]
  }

  let number = new Number(strNum)

  if (number < 1 && cents < 1) {
    return `CERO ${currency.plur} CON CERO ${currency.centPlur}`
  }

  let result = ''

  if (strNum.length > 9) {
    return num.toLocaleString('id') + ` ${currency.plur}`
  }

  result = trim(Millones(number).replaceAll('  ', ' '))
  result += ' ' + (number < 2 ? currency.sing : currency.plur)
  result += ' CON ' + (cents > 0 ? trim(Millones(cents).replaceAll('  ', ' ')) : 'CERO') + ` ${currency.centPlur}` 

  return result
}
export const checkName = name => {
  let isValid = true
  let invalidCharacters = '\'! @#$%^&*()_+=-[]{}()`<>|/\\1234567890'.split('')

  for (let idx in invalidCharacters) {

    if (!name.contains(invalidCharacters[idx])) {
      continue
    }

    isValid = false

    break
  }

  return isValid
}
export const randomNumber = (min, max, isFloat) => {
  if (isFloat) {
    return Math.random() * (max - min) + min;
  }
  else {
    return Math.ceil(Math.random() * (max - min) + min);
  }
}
export const generateId = length => {

  let id = '';
  let hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_';

  while(id.length < length) {
    id += hash.charAt(randomNumber(0, hash.length -1));
  }

  return id;
}

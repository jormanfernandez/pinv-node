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
export const extractDate = date => {
  date = date instanceof Date ? date : new Date(date)

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const time = [
    day.toString().padStart(2, '0'),
    month.toString().padStart(2, '0'),
    year
  ]

  return time.join('/')
}
export const extractTime = date => {
  date = date instanceof Date ? date : new Date(date)
  const hour = date.getHours()
  const pm = hour > 12

  const time = [
    (pm ? hour - 12 : hour).toString().padStart(2, '0'),
    date.getMinutes().toString().padStart(2, '0'),
    date.getSeconds().toString().padStart(2, '0')
  ]

  return `${time.join(':')} ${!pm ? 'am' : 'pm'}`
}
export const extractExtendedDate = date => {
  date = date instanceof Date ? date : new Date(date)

  const time = [
    date.getDate(),
    'de',
    meses[date.getMonth()],
    'del',
    date.getFullYear()
  ]

  return time.join(' ')
}
export const extractFormalDate = date => {
  date = date instanceof Date ? date : new Date(date)

  const time = [
    'A los',
    date.getDate(),
    'días del mes de',
    meses[date.getMonth()],
    'del',
    date.getFullYear()
  ]

  return time.join(' ')
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

  const hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_';
  let id = '';

  while(id.length < length) {
    id += hash.charAt(randomNumber(0, hash.length -1));
  }

  return id;
}
export const objectToCsv = (objArray) => {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
    let str = ''

    console.log(array)

    array.forEach(value => {
      let line = '';
      for (let index in value) {
          line += value[index];
            line += ','
      }
      line = line.substr(0, line.length -1)

      str += `${line}\r\n`;
    })

    return str;
}
export const exportCSV = (items, filename) => {
  let headers = {}

  for(let key of Object.keys(items[0])) {
    headers[key] = key
  }

  items.unshift(headers)
  const jsonObject = JSON.stringify(items)
  const csv = objectToCsv(jsonObject)

  console.log(csv)

  const exportedFilenmae = filename || 'export.csv'

  let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, exportedFilenmae)
  } else {
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', exportedFilenmae)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
export const getDateLang = () => {
  let lang = {
    "_language": "English",
    "_months": meses,
    "_days": dias.map(value => value.substr(0, 3)),
    "rtl": false,
    "ymd": false,
    "yearSuffix": ""
  }
  lang._monthsAbbr = lang._months.map(value => value.substr(0, 3))
  lang.months = lang._months
  lang.monthsAbbr = lang._monthsAbbr
  lang.days = lang._days
  return lang
}

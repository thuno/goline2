class StatusApi {
  /// status code = 401
  static token = 401

  /// status code = 404
  static notFound = 404

  /// status code = 800
  static refreshToken = 800

  /// status code = 200
  static complete = 200

  /// status code = 500
  static error = 500

  /// status code = 1000
  static errorPhoneNumber = 1000

  /// status code = 1202
  static errorOTP = 1202

  /// status code = 402
  static exist = 402

  static statusName (code) {
    switch (code) {
      case StatusApi.token:
        return 'Token'
      case StatusApi.refreshToken:
        return 'Refresh Token'
      case StatusApi.complete:
        return 'Complete'
      case StatusApi.error:
        return 'Error'
      case StatusApi.errorPhoneNumber:
        return 'Error Phone Number'
      case StatusApi.errorOTP:
        return 'Error OTP'
      case StatusApi.exist:
        return 'Exist'
      case StatusApi.notFound:
        return 'Not Found'
      default:
        return 'Complete'
    }
  }
}

var arrayConstructor = [].constructor
var objectConstructor = {}.constructor

function checkTypeof (object) {
  if (object === null) {
    return 'null'
  }
  if (typeof object === 'object') {
    if (object.constructor === arrayConstructor) {
      return 'array'
    }
    if (object.constructor === objectConstructor) {
      return 'object'
    }
  } else {
    return typeof object
  }
}

class Ultis {
  static dateDefault = new Date('01/01/2021').getTime()

  static set_timeRefreshToken () {
    var result = new Date(Date.now())
    result.setDate(result.getDate() + 30)
    result.setMinutes(result.getMinutes() - 10)
    // result.setSeconds(result.getSeconds() + 30);
    localStorage.setItem('time_tokenRefresh', result)
  }

  static get_timeRefreshToken () {
    let time = new Date(localStorage.getItem('time_tokenRefresh')).getTime()
    return time
  }

  static toSecond (time) {
    return Math.floor(Math.abs(Date.now() - Ultis.dateDefault) / 1000 - time)
  }
  static toMinus (time) {
    return Math.floor(
      (Math.abs(Date.now() - Ultis.dateDefault) / 1000 - time) / 60
    )
  }
  static toHours (time) {
    return Math.floor(
      (Math.abs(Date.now() - Ultis.dateDefault) / 1000 - time) / 3600
    )
  }

  static getTimeEdit (time) {
    if (Ultis.toHours(time) >= 24) {
      return `${Math.floor(Ultis.toHours(time) / 24)} days`
    } else if (0 < Ultis.toHours(time) && Ultis.toHours(time) < 24) {
      return `${Ultis.toHours(time)} hours`
    } else {
      if (Ultis.toMinus(time) > 0) {
        return `${Ultis.toMinus(time)} minutes`
      } else {
        return `${Ultis.toSecond(time)} seconds`
      }
    }
  }

  static money (number, a) {
    var val = (number / 1).toFixed(a)
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  static Unmoney (number) {
    return number.toString().replace(/,/g, '')
  }
  static stringToDate (_date, _format, _delimiter) {
    var dayformat = _format
    var hourformat = ''
    var day = _date
    var hours = ''
    var isHour = false
    if (_format.trim().indexOf(' ') > -1) {
      dayformat = _format.trim().split(' ')[0]
      hourformat = _format.trim().split(' ')[1]
      day = _date.trim().split(' ')[0]
      hours = _date.trim().split(' ')[1]
      isHour = true
    }
    var formatLowerCase = dayformat.toLowerCase()
    var formatItems = formatLowerCase.split(_delimiter)
    var dateItems = day.split(_delimiter)
    var monthIndex = formatItems.indexOf('mm')
    var dayIndex = formatItems.indexOf('dd')
    var yearIndex = formatItems.indexOf('yyyy')
    var hour = 0
    var min = 0
    var sec = 0
    if (isHour) {
      var tmpHour = hourformat.split(':')
      var hourindex = tmpHour.indexOf('HH')
      if (hourindex < 0) {
        hourindex = tmpHour.indexOf('hh')
      }
      var mmindex = tmpHour.indexOf('mm')
      var ssindex = tmpHour.indexOf('ss')
      var time = hours.split(':')
      hour = time[hourindex]
      min = time[mmindex]
      sec = time[ssindex]
    }
    var month = parseInt(dateItems[monthIndex])
    month -= 1
    var formatedDate = new Date(
      dateItems[yearIndex],
      month,
      dateItems[dayIndex],
      hour,
      min,
      sec
    )
    return formatedDate
  }

  //stringToDate("17/9/2014", "dd/MM/yyyy", "/");
  //stringToDate("9/17/2014", "mm/dd/yyyy", "/")
  //stringToDate("9-17-2014", "mm-dd-yyyy", "-")
  //stringToDate("9-17-2014 14:20:20", "mm-dd-yyyy HH:mm:ss", "-")
  //stringToDate("9-17-2014 02:30:30", "mm-dd-yyyy hh:mm:ss", "-")
  static datetoString (x, y) {
    var z = {
      M: x.getMonth() + 1,
      d: x.getDate(),
      h: x.getHours(),
      m: x.getMinutes(),
      s: x.getSeconds()
    }
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
      return ((v.length > 1 ? '0' : '') + z[v.slice(-1)]).slice(-2)
    })
    return y.replace(/(y+)/g, function (v) {
      return x.getFullYear().toString().slice(-v.length)
    })
  }
  dateDefault = new Date('2022-1-1')

  static setStorage (key, value) {
    localStorage.setItem(key, value)
  }
  static getStorage (key) {
    return localStorage.getItem(key)
  }
  static removeFromStorage (key) {
    return localStorage.removeItem(key)
  }
  //1: năm, 2: quý,3: tháng, 4: tuần,5: ngày, 6: giờ, 7: phút, 8: giây
  static dateAdd (date, type, units) {
    if (!(date instanceof Date)) return undefined
    var ret = new Date(date)
    var checkRollover = function () {
      if (ret.getDate() != date.getDate()) ret.setDate(0)
    }
    switch (type) {
      case 1:
        ret.setFullYear(ret.getFullYear() + units)
        checkRollover()
        break
      case 2:
        ret.setMonth(ret.getMonth() + 3 * units)
        checkRollover()
        break
      case 3:
        ret.setMonth(ret.getMonth() + units)
        checkRollover()
        break
      case 4:
        ret.setDate(ret.getDate() + 7 * units)
        break
      case 5:
        ret.setDate(ret.getDate() + units)
        break
      case 6:
        ret.setTime(ret.getTime() + units * 3600000)
        break
      case 7:
        ret.setTime(ret.getTime() + units * 60000)
        break
      case 8:
        ret.setTime(ret.getTime() + units * 1000)
        break
      default:
        ret = undefined
        break
    }
    return ret
  }

  static removeStorage (key) {
    return localStorage.removeItem(key)
  }

  static randomString (length) {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
  static convertFormToJSON (form) {
    const array = $(form).serializeArray() // Encodes the set of form elements as an array of names and values.

    const json = {}
    $.each(array, function () {
      json[this.name] = this.value || ''
    })
    return json
  }
  static decodeJwtResponse (token) {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    return JSON.parse(jsonPayload)
  }

  static percentToHex = p => {
    // const percent = Math.max(0, Math.min(100, p)); // bound percent from 0 to 100
    const intValue = Math.round((p / 100) * 255) // map percent to nearest integer (0 - 255)
    const hexValue = intValue.toString(16) // get hexadecimal representation
    return hexValue.padStart(2, '0').toUpperCase() // format with leading 0 and upper case characters
  }

  static hexToPercent = h => {
    const pValue = parseInt(h, 16)
    const percent = Math.round((pValue / 255) * 100)
    return percent
  }

  static hexToRGB (hex) {
    let alpha = false,
      h = hex.slice(hex.startsWith('#') ? 1 : 0)
    if (h.length === 3) h = [...h].map(x => x + x).join('')
    else if (h.length === 8) alpha = true
    h = parseInt(h, 16)
    return (
      'rgb' +
      (alpha ? 'a' : '') +
      '(' +
      (h >>> (alpha ? 24 : 16)) +
      ', ' +
      ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
      ', ' +
      ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
      (alpha ? `, ${h & 0x000000ff}` : '') +
      ')'
    )
  }

  static colorNameToHex (color) {
    let colors = {
      aliceblue: 'f0f8ff',
      antiquewhite: 'faebd7',
      aqua: '00ffff',
      aquamarine: '7fffd4',
      azure: 'f0ffff',
      beige: 'f5f5dc',
      bisque: 'ffe4c4',
      black: '000000',
      blanchedalmond: 'ffebcd',
      blue: '0000ff',
      blueviolet: '8a2be2',
      brown: 'a52a2a',
      burlywood: 'deb887',
      cadetblue: '5f9ea0',
      chartreuse: '7fff00',
      chocolate: 'd2691e',
      coral: 'ff7f50',
      cornflowerblue: '6495ed',
      cornsilk: 'fff8dc',
      crimson: 'dc143c',
      cyan: '00ffff',
      darkblue: '00008b',
      darkcyan: '008b8b',
      darkgoldenrod: 'b8860b',
      darkgray: 'a9a9a9',
      darkgreen: '006400',
      darkkhaki: 'bdb76b',
      darkmagenta: '8b008b',
      darkolivegreen: '556b2f',
      darkorange: 'ff8c00',
      darkorchid: '9932cc',
      darkred: '8b0000',
      darksalmon: 'e9967a',
      darkseagreen: '8fbc8f',
      darkslateblue: '483d8b',
      darkslategray: '2f4f4f',
      darkturquoise: '00ced1',
      darkviolet: '9400d3',
      deeppink: 'ff1493',
      deepskyblue: '00bfff',
      dimgray: '696969',
      dodgerblue: '1e90ff',
      firebrick: 'b22222',
      floralwhite: 'fffaf0',
      forestgreen: '228b22',
      fuchsia: 'ff00ff',
      gainsboro: 'dcdcdc',
      ghostwhite: 'f8f8ff',
      gold: 'ffd700',
      goldenrod: 'daa520',
      gray: '808080',
      green: '008000',
      greenyellow: 'adff2f',
      honeydew: 'f0fff0',
      hotpink: 'ff69b4',
      'indianred ': 'cd5c5c',
      indigo: '4b0082',
      ivory: 'fffff0',
      khaki: 'f0e68c',
      lavender: 'e6e6fa',
      lavenderblush: 'fff0f5',
      lawngreen: '7cfc00',
      lemonchiffon: 'fffacd',
      lightblue: 'add8e6',
      lightcoral: 'f08080',
      lightcyan: 'e0ffff',
      lightgoldenrodyellow: 'fafad2',
      lightgrey: 'd3d3d3',
      lightgreen: '90ee90',
      lightpink: 'ffb6c1',
      lightsalmon: 'ffa07a',
      lightseagreen: '20b2aa',
      lightskyblue: '87cefa',
      lightslategray: '778899',
      lightsteelblue: 'b0c4de',
      lightyellow: 'ffffe0',
      lime: '00ff00',
      limegreen: '32cd32',
      linen: 'faf0e6',
      magenta: 'ff00ff',
      maroon: '800000',
      mediumaquamarine: '66cdaa',
      mediumblue: '0000cd',
      mediumorchid: 'ba55d3',
      mediumpurple: '9370d8',
      mediumseagreen: '3cb371',
      mediumslateblue: '7b68ee',
      mediumspringgreen: '00fa9a',
      mediumturquoise: '48d1cc',
      mediumvioletred: 'c71585',
      midnightblue: '191970',
      mintcream: 'f5fffa',
      mistyrose: 'ffe4e1',
      moccasin: 'ffe4b5',
      navajowhite: 'ffdead',
      navy: '000080',
      oldlace: 'fdf5e6',
      olive: '808000',
      olivedrab: '6b8e23',
      orange: 'ffa500',
      orangered: 'ff4500',
      orchid: 'da70d6',
      palegoldenrod: 'eee8aa',
      palegreen: '98fb98',
      paleturquoise: 'afeeee',
      palevioletred: 'd87093',
      papayawhip: 'ffefd5',
      peachpu: 'ffdab9',
      peru: 'cd853f',
      pink: 'ffc0cb',
      plum: 'dda0dd',
      powderblue: 'b0e0e6',
      purple: '800080',
      rebeccapurple: '663399',
      red: 'ff0000',
      rosybrown: 'bc8f8f',
      royalblue: '4169e1',
      saddlebrown: '8b4513',
      salmon: 'fa8072',
      sandybrown: 'f4a460',
      seagreen: '2e8b57',
      seashell: 'fff5ee',
      sienna: 'a0522d',
      silver: 'c0c0c0',
      skyblue: '87ceeb',
      slateblue: '6a5acd',
      slategray: '708090',
      snow: 'fffafa',
      springgreen: '00ff7f',
      steelblue: '4682b4',
      tan: 'd2b48c',
      teal: '008080',
      thistle: 'd8bfd8',
      tomato: 'ff6347',
      turquoise: '40e0d0',
      violet: 'ee82ee',
      wheat: 'f5deb3',
      white: 'ffffff',
      whitesmoke: 'f5f5f5',
      yellow: 'ffff00',
      yellowgreen: '9acd32'
    }

    return colors[color.toLowerCase()]
  }

  static rgbToHex (rgba) {
    let splitRgba = rgba
      .replace(/(rgba|\(|\)|rgb)/g, '')
      .split(',')
      .map(vl => parseFloat(vl))
    let r = splitRgba[0].toString(16)
    let g = splitRgba[1].toString(16)
    let b = splitRgba[2].toString(16)
    let a = Math.round(255).toString(16)
    if (splitRgba[3]) {
      a = Math.round(splitRgba[3] * 255).toString(16)
    }

    if (r.length == 1) r = '0' + r
    if (g.length == 1) g = '0' + g
    if (b.length == 1) b = '0' + b
    if (a.length == 1) a = '0' + a

    return '#' + r + g + b + a
  }

  static prettyJsonToString (data, space) {
    return JSON.stringify(data, null, 6).replace(
      /\n( *)/g,
      function (match, p1) {
        return '<br>' + '&nbsp;'.repeat(p1.length)
      }
    )
  }

  static async get (url, headers) {
    var respond = await fetch(url, {
      method: 'GET', // or 'PUT'
      headers: headers
    }).then(response => response.json())
    return respond
  }

  static async post (url, headers, data) {
    //debugger;
    var respond = await fetch(url, {
      method: 'POST', // or 'PUT'
      headers: headers,
      body: JSON.stringify({
        username: 'liemnt.bk@gmail.com',
        pass: 'liem1234'
      })
    }).then(response => response.json())
    return respond
  }
  static handleListInput (listInput) {
    let _obj = {}
    listInput.forEach(function (item) {
      if (item?.Name != '') {
        let name = item.Name
        _obj[name] = item.Value
      }
    })
    return _obj
  }

  static handleRequestUrl (request, listParam) {
    let param = ''
    listParam.forEach(function (e) {
      if (e.Name != null && e.Name != '') {
        param.concat(e.Name + '=' + e.value + '&')
      }
    })
    var requestUrl = request.Url
    if (param != '') {
      requestUrl = requestUrl + '?' + param.slice(0, -1)
    }
    return requestUrl
  }
  static syntaxHighlight (json) {
    json = JSON.stringify(json, null, 6)

    return json.replace(/\n( *)/g, function (match, p1) {
      var cls = 'number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'
        } else {
          cls = 'string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean'
      } else if (/null/.test(match)) {
        cls = 'null'
      }
      return (
        '<br>' +
        '&nbsp;'.repeat(p1.length) +
        '<span class="' +
        cls +
        '">' +
        match +
        '</span>'
      )
    })
  }

  static generateRandomColor () {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }

  static generateLightColorRgb () {
    return (
      'rgb(' +
      (Math.floor((256 - 229) * Math.random()) + 230) +
      ',' +
      (Math.floor((256 - 229) * Math.random()) + 230) +
      ',' +
      (Math.floor((256 - 229) * Math.random()) + 230) +
      ')'
    )
  }

  static generateDarkColorRgb (number) {
    const red = Math.floor(((number ?? Math.random()) * 256) / 2)
    const green = Math.floor(((number ?? Math.random()) * 256) / 2)
    const blue = Math.floor(((number ?? Math.random()) * 256) / 2)
    return 'rgb(' + red + ', ' + green + ', ' + blue + ')'
  }

  static toSlug (input) {
    return input
      .toString()
      .toLowerCase()
      .replace(/đ/g, 'd')
      .replace(/[í|ì|ỉ|ĩ|ị]/g, 'i')
      .replace(/[ý|ỳ|ỷ|ỹ|ỵ]/g, 'y')
      .replace(/[á|à|ả|ã|ạ|â|ă|ấ|ầ|ẩ|ẫ|ậ|ắ|ằ|ẳ|ẵ|ặ]/g, 'a')
      .replace(/[é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ]/g, 'e')
      .replace(/[ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự]/g, 'u')
      .replace(/[ó|ò|ỏ|õ|ọ|ô|ơ|ố|ồ|ổ|ỗ|ộ|ớ|ờ|ở|ỡ|ợ]/g, 'o')
      .replace(/\s+/g, ' ')
      .replace(/({|}|\(|\)|<|>)/g, '')
      .replaceAll(/(\\|\/)/g, '-')
      .replaceAll(' ', '-')
  }

  static isColor (color) {
    const hex = /(#){0,1}[0-9A-Fa-f]{6,8}$/i
    if (color.match(hex)) return true
    else {
      let s = new Option().style
      s.color = color
      return s.color == color
    }
  }
}

Array.prototype.filterAndMap = function (callbackfn) {
  let k,
    len,
    result = []

  // Method cannot be run on an array that does not exist.
  if (this == null) {
    throw new TypeError('this is null or not defined')
  }

  // Loop through array.
  len = this.length
  k = 0
  while (k < len) {
    if (k in this) {
      // For each element, if callback returns truthy, add it to
      // result array.
      if (callbackfn) {
        if (!result.includes(callbackfn.call(undefined, this[k], k, this))) {
          result.push(callbackfn.call(undefined, this[k], k, this))
        }
      } else {
        if (!result.includes(this[k])) {
          result.push(this[k])
        }
      }
    }
    k = k + 1
  }
  return result
}

const showPopupObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    let elementHTML = entry.target
    let elementRect = elementHTML.getBoundingClientRect()
    let screenRect = document.body.getBoundingClientRect()
    let transformX = 0
    let transformY = 0
    if (elementRect.x < screenRect.x) {
      transformX = screenRect.x - elementRect.x
    }
    if (elementRect.y < screenRect.y) {
      transformY = screenRect.y - elementRect.y
    }
    if (elementRect.x + elementRect.width > screenRect.x + screenRect.width) {
      transformX =
        screenRect.x + screenRect.width - (elementRect.x + elementRect.width)
    }
    if (elementRect.y + elementRect.height > screenRect.y + screenRect.height) {
      transformY =
        screenRect.y + screenRect.height - (elementRect.y + elementRect.height)
    }
    elementHTML.style.transform = `translate(${transformX}px,${transformY}px)`
  })
})

function caclTextSize (text, font) {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  context.font = font
  let metrics = context.measureText(text)
  return { width: metrics.width, height: metrics.height }
}

var keyid = 'escape' // Key ESC
var is_dbclick = false
const factor = 0.05
const min_scale = 0.02
const max_scale = 256
var listLine = [] // gid, x,y,x1,y1
var width = document.body?.clientWidth
var height = document.body?.clientHeight
var totalH = height + scale
var totalW = width + scale
var showF12 = false
var selectPath
var design_view_index = 0
var prototypePoint
var prototype_selected_page
const isMac = navigator.userAgent.indexOf('Mac OS X') != -1

document.onpaste = function (e) {
  if (
    document.activeElement.contentEditable == 'true' ||
    document.activeElement.localName == 'input' ||
    // document.activeElement.localName == 'p' ||
    copy_item
  )
    return
  e.stopPropagation()
  e.preventDefault()
  let fileList = []
  for (let fileItem of e.clipboardData.items) {
    if (FileDA.acceptFileTypes.some(type => type == fileItem.type)) {
      fileList.push(fileItem.getAsFile())
    }
  }
  if (fileList.length > 0) {
    let imgDocument = document.getElementById('popup_img_document')
    if (imgDocument) {
      let eventHadleData = {
        targetElement: 'popup_img_document',
        dataTransfer: fileList
      }
      handleImportFile(eventHadleData)
    } else {
      let eventHadleData = {
        targetElement: 'canvas_view',
        dataTransfer: fileList,
        pageX: divMain.offsetWidth / 2,
        pageY: divMain.offsetHeight / 2
      }
      handleImportFile(eventHadleData)
    }
  }
}

let keyTimeStamp = 0

function keyUpEvent(event) {
  console.log('keyup:', keyid, event.key)
  isKeyUp = true
  if (
    (document.activeElement.localName === 'input' &&
      !document.activeElement.readOnly) ||
    document.activeElement.closest('.w-text') ||
    action_list[action_index]?.index != undefined
  )
    return
  event.preventDefault()

  let isCtrlKey = isMac ? event.metaKey : event.ctrlKey

  if (checkpad === 0) {
    switch (keyid) {
      case 'enter': // enter
        break
      case 'f12': // f12
      // showF12 = !showF12;
      // if (showF12) {
      //   RequestDA.init();
      // } else {
      //   $(".f12-container").css("display", "none");
      // }
      // break;
      case '//': // \
        if (isCtrlKey) {
        }
        break
      case 'a': // a
        if (isCtrlKey) {
        } else if (event.shiftKey) {
          addAutoLayout()
        }
        break
      case 'u': // u
        if (isCtrlKey) {
        }
        break
      case 'b': // b
        if (isCtrlKey) {
        }
        break
      case 'i': // i
        if (isCtrlKey) {
        }
        break
      case 'k': // k
        if (isCtrlKey && event.altKey) {
          if (selected_list.some(e => !e.IsWini)) createComponent()
        }
        break
      case '/': // /
        if (isCtrlKey) {
        }
        break
      case 'y': // y
        if (isCtrlKey) {
        }
        break
      case 'tab': // tab
        break
      case '0': // 0
        if (isCtrlKey) {
        }
        break
      case '-': // -
        break
      case '+': // +
        break
      case '{': // {
        break
      case '}': // }
        break
      case '[': // []
        if (isCtrlKey && event.altKey) {
          if (selected_list.length > 0) sendToBack()
        } else if (isCtrlKey) {
          sendBackward()
        }
        break
      case ']': // ]
        if (isCtrlKey && event.altKey) {
          if (selected_list.length > 0) bringToFront()
        } else if (isCtrlKey) {
          if (selected_list.length > 0) bringFrontward()
        }
        break
      case 'arrowleft': // left
        break
      case 'arrowup': // up
        break
      case 'arrowright': // right
        break
      case 'arrowdown': // down
        break
      case 'v': // v
        if (copy_item && isCtrlKey) {
          pasteWbase()
        }
        break
      case 'z': // z
        if (isCtrlKey && event.shiftKey) {
          // shiftCtrlZ();
        } else if (isCtrlKey && action_list.length > 0) {
          // ctrlZ()
        }
        keyid = 'escape'
        break
      case 't': // t
        toolStateChange(ToolState.text)
        break
      case 'f': // f
        toolStateChange(ToolState.container)
        break
      case 'c': // c
        if (selected_list.length > 0 && isCtrlKey) {
          saveWbaseCopy()
        }
        break
      case 'r': // r
        if (event.shiftKey && isCtrlKey) {
          event.preventDefault()
        } else {
          toolStateChange(ToolState.rectangle)
        }
        break
      case ' ': // space
        toolStateChange(ToolState.move)
        break
      case 'delete': // delete
        if (selected_list.length > 0) {
          WBaseDA.delete(selected_list)
        }
        break
      case 'backspace': // delete
        if (selected_list.length > 0) {
          WBaseDA.delete(selected_list)
        }
        break
      default:
        if (
          event.key?.toLowerCase() != 'alt' &&
          event.key?.toLowerCase() != 'shift' &&
          event.key?.toLowerCase() != 'control' &&
          event.key?.toLowerCase() != 'meta'
        )
          keyid = 'escape'
        $('#choose-component-popup').css('display', 'none')
        toolStateChange(ToolState.move)
        break
    }
  }
}

document.body.onresize = function () {
  width = this.body.clientWidth
  height = this.body.clientHeight
  totalH = height + scale
  totalW = width + scale
  canvas.width = totalW
  canvas.height = totalH
  canvasr.width = width
  canvasr.height = height
  objscroll.w = width - leftw - reightw
  objscroll.h = height - 48
  positionScrollLeft()
  positionScrollTop()
}
var divMain = document.getElementById('canvas_view')
var divSection = document.getElementById('divSection')
document.ondragover = function (e) {
  e.stopPropagation()
  e.preventDefault()
}

document.ondrop = function (e) {
  e.stopPropagation()
  e.preventDefault()
  dropFile(e)
}

function dropFile(event) {
  let fileList = []
  for (let fileItem of event.dataTransfer.files) {
    if (FileDA.acceptFileTypes.some(type => type == fileItem.type)) {
      fileList.push(fileItem)
    }
  }
  if (fileList.length > 0) {
    let imgDocument = document.getElementById('popup_img_document')
    if (imgDocument?.contains(event.target)) {
      let eventHadleData = {
        targetElement: 'popup_img_document',
        dataTransfer: fileList
      }
      handleImportFile(eventHadleData)
    } else if (
      event.target.id == 'canvas_view' ||
      divMain.contains(event.target)
    ) {
      let eventHadleData = {
        targetElement: 'canvas_view',
        dataTransfer: fileList,
        pageX: event.pageX,
        pageY: event.pageY
      }
      handleImportFile(eventHadleData)
    }
  }
}

divSection.style.transform = `scale(${scale}, ${scale})`
var line = 1,
  t = 0,
  l = 0
let previousX, previousY
var canvas = document.createElement('canvas')

canvas.width = totalW
canvas.height = totalH
canvas.style.position = 'absolute'
canvas.style.top = t * scale + 'px'
canvas.style.left = l * scale + 'px'
canvas.id = 'canvas_line'
canvas.style.backgroundColor = 'transparent'
canvas.style.pointerEvents = 'none'
divMain.appendChild(canvas)
var ctx = canvas.getContext('2d')
var canvasr = document.createElement('canvas')
canvasr.width = width
canvasr.height = height
canvasr.style.top = '0px'
canvasr.style.left = '0px'
canvasr.style.position = 'absolute'
canvasr.id = 'canvas_rect'
canvasr.style.backgroundColor = 'transparent'
canvasr.style.pointerEvents = 'none'
divMain.appendChild(canvasr)
var ctxr = canvasr.getContext('2d')

var objr,
  objscroll = {
    x: 0,
    y: 0,
    x1: 0,
    y1: 0,
    w: width - leftw - reightw,
    h: height - 48,
    wc: 1,
    hc: 1,
    xo: 0,
    yo: 0,
    xo1: 0,
    yo1: 0
  }
var scrollTop = document.createElement('div')
scrollTop.style.width = 5 + 'px'
scrollTop.style.height = 100 + 'px'
scrollTop.style.position = 'absolute'
scrollTop.style.top = objscroll.y + 'px'
scrollTop.style.right = reightw + 'px'
scrollTop.style.borderRadius = '2px'
scrollTop.id = 'e060a4db-2b24-4ca6-89ea-0ff75d4fc79e'
scrollTop.style.backgroundColor = '#D9D9D9'
divMain.appendChild(scrollTop)

var scrollLeft = document.createElement('div')
//scrollLeft.style.width = 100 + "px";
scrollLeft.style.height = 5 + 'px'
scrollLeft.style.position = 'absolute'
scrollLeft.style.bottom = 5 + 'px'
scrollLeft.style.left = leftw + 'px'
scrollLeft.id = 'f01230bb-83e6-4320-b642-33f65c0f8696'
scrollLeft.style.borderRadius = '2px'
scrollLeft.style.backgroundColor = 'red'
//dive.style.pointerEvents = "none";
divMain.appendChild(scrollLeft)
var idscroll = ''

function initScroll(listp) {
  if (listp.length > 0) {
    var psition = listp.map(m => m.PositionItem)
    var psitionw = listp.map(
      m => parseFloat(m.PositionItem.Left.replace('px', '')) + m.FrameItem.Width
    )
    var psitionh = listp.map(
      m => parseFloat(m.PositionItem.Top.replace('px', '')) + m.FrameItem.Height
    )
    objscroll.xo = objscroll.x = Math.min(
      ...psition.map(m => parseFloat(m.Left.replace('px', '')))
    )
    objscroll.yo = objscroll.y = Math.min(
      ...psition.map(m => parseFloat(m.Top.replace('px', '')))
    )
    leftx = -objscroll.x * scale
    topx = -objscroll.y * scale
    divSection.style.top = topx + 'px'
    divSection.style.left = leftx + 'px'
    objscroll.xo1 = objscroll.x1 = Math.max(...psitionw)
    objscroll.yo1 = objscroll.y1 = Math.max(...psitionh)
    if (((objscroll.x1 - objscroll.x) * scale) / objscroll.w > 1)
      scrollLeft.style.width =
        Math.max(
          (objscroll.w * objscroll.w) / ((objscroll.x1 - objscroll.x) * scale),
          50
        ) + 'px'
    else scrollLeft.style.width = '0px'
    if (objscroll.h / ((objscroll.y1 - objscroll.y) * scale) > 1)
      scrollTop.style.height =
        Math.max(
          (objscroll.h * objscroll.h) / ((objscroll.y1 - objscroll.y) * scale),
          50
        ) + 'px'
    else scrollTop.style.height = '0px'
    //objscroll.wc = ((objscroll.x1 - objscroll.x) * scale) / objscroll.w;
    //objscroll.hc = ((objscroll.y1 - objscroll.y) * scale) / objscroll.h;

    input_scale_set(scale * 100)
    positionScrollLeft()
    positionScrollTop()
    //var divd = document.getElementById();
  }
}

function positionScrollLeft() {
  if (-leftx / scale <= objscroll.xo) objscroll.x = -leftx / scale
  else objscroll.x = objscroll.xo
  if (-leftx / scale >= objscroll.xo1) objscroll.x1 = -leftx / scale
  else objscroll.x1 = objscroll.xo1
  objscroll.wc = ((objscroll.x1 - objscroll.x) * scale) / objscroll.w
  if (objscroll.wc > 1)
    scrollLeft.style.width = Math.max(objscroll.w / objscroll.wc, 50) + 'px'
  else scrollLeft.style.width = '0px'
  var sl = leftw - (leftx + objscroll.x * scale) / objscroll.wc
  scrollLeft.style.left =
    Math.max(
      leftw + 5,
      Math.min(objscroll.w - scrollLeft.offsetWidth + leftw - 8, Math.abs(sl))
    ) + 'px'
}

function positionScrollTop() {
  if (-topx / scale <= objscroll.yo) objscroll.y = -topx / scale
  else objscroll.y = objscroll.yo
  if (-topx / scale >= objscroll.yo1) objscroll.y1 = -topx / scale
  else objscroll.y1 = objscroll.yo1
  objscroll.hc = ((objscroll.y1 - objscroll.y) * scale) / objscroll.h
  if (objscroll.hc > 1)
    scrollTop.style.height = Math.max(objscroll.h / objscroll.hc, 50) + 'px'
  else scrollTop.style.height = '0px'
  var st = 48 - (topx + objscroll.y * scale) / objscroll.hc
  scrollTop.style.top =
    Math.max(
      53,
      Math.min(objscroll.h - scrollTop.offsetHeight + 35, Math.abs(st))
    ) + 'px'
}

function selectBox(list_wbase_item) {
  if (list_wbase_item.length > 0) {
    var selectHTML = list_wbase_item.map(e =>
      (document.getElementById(e.GID) ?? e.value).getBoundingClientRect()
    )
    var maxX = Math.max(...selectHTML.map(m => m.right))
    var maxY = Math.max(...selectHTML.map(m => m.bottom))
    var box_select = {
      gid: uuidv4(),
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }
    box_select.x = Math.min(...selectHTML.map(m => m.x))
    box_select.y = Math.min(...selectHTML.map(m => m.y))
    box_select.w = maxX - box_select.x
    box_select.h = maxY - box_select.y
    // top left
    box_select.o1 = { x: box_select.x, y: box_select.y }
    // center of topleft vs bottomleft
    box_select.o2 = { x: box_select.x, y: box_select.y + box_select.h / 2 }
    // bottom left
    box_select.o3 = { x: box_select.x, y: box_select.y + box_select.h }
    // center of topleft vs topright
    box_select.o4 = { x: box_select.x + box_select.w / 2, y: box_select.y }
    // center of select box rect
    box_select.o5 = {
      x: box_select.x + box_select.w / 2,
      y: box_select.y + box_select.h / 2
    }
    // center of bottomleft vs bottom right
    box_select.o6 = {
      x: box_select.x + box_select.w / 2,
      y: box_select.y + box_select.h
    }
    // top right
    box_select.o7 = { x: box_select.x + box_select.w, y: box_select.y }
    // center of topright vs bottomright
    box_select.o8 = {
      x: box_select.x + box_select.w,
      y: box_select.y + box_select.h / 2
    }
    // bottom right
    box_select.o9 = {
      x: box_select.x + box_select.w,
      y: box_select.y + box_select.h
    }
    return box_select
  }
  return undefined
}

function updateHoverWbase(wb, onAlt) {
  let isOnchange = hover_wbase !== wb
  if (isOnchange) {
    if (wb) {
      hover_wbase = wb
      hover_box = selectBox([wb])
      if (onAlt && select_box) {
        var obj1 = select_box
        var listc = [
          {
            o: hover_box.o1,
            kc: Math.sqrt(
              (obj1.o5.x - hover_box.o1.x) * (obj1.o5.x - hover_box.o1.x) +
              (obj1.o5.y - hover_box.o1.y) * (obj1.o5.y - hover_box.o1.y)
            )
          },
          {
            o: hover_box.o3,
            kc: Math.sqrt(
              (obj1.o5.x - hover_box.o3.x) * (obj1.o5.x - hover_box.o3.x) +
              (obj1.o5.y - hover_box.o3.y) * (obj1.o5.y - hover_box.o3.y)
            )
          },
          {
            o: hover_box.o7,
            kc: Math.sqrt(
              (obj1.o5.x - hover_box.o7.x) * (obj1.o5.x - hover_box.o7.x) +
              (obj1.o5.y - hover_box.o7.y) * (obj1.o5.y - hover_box.o7.y)
            )
          },
          {
            o: hover_box.o9,
            kc: Math.sqrt(
              (obj1.o5.x - hover_box.o9.x) * (obj1.o5.x - hover_box.o9.x) +
              (obj1.o5.y - hover_box.o9.y) * (obj1.o5.y - hover_box.o9.y)
            )
          }
        ]
        listc.sort((a, b) => a.kc - b.kc)
        var d = obj1.o5.x > listc[0].o.x ? -1 : 1
        var dh = obj1.o5.y > listc[0].o.y ? -1 : 1
        var listl = []
        var listt = []
        if (Math.abs(obj1.o5.x - listc[0].o.x) > obj1.w / 2) {
          var o1 = {
            gid: wb.GID,
            x: obj1.o5.x + (d * obj1.w) / 2,
            y: obj1.o5.y,
            x1: listc[0].o.x,
            y1: obj1.o5.y,
            l: true
          }
          var o2 = {
            gid: wb.GID,
            x: listc[0].o.x,
            y: obj1.o5.y,
            x1: listc[0].o.x,
            y1: listc[0].o.y,
            l: false
          }
          listl.push(o1)
          listl.push(o2)
          listt.push({
            gid: wb.GID,
            x: (o1.x + o1.x1) / 2,
            y: (o1.y + o1.y1) / 2,
            t: Math.round(Math.abs(o1.x - o1.x1) / scale),
            l: true
          })
        }
        if (Math.abs(obj1.o5.y - listc[0].o.y) > obj1.h / 2) {
          var o1 = {
            gid: wb.GID,
            x: obj1.o5.x,
            y: listc[0].o.y,
            x1: obj1.o5.x,
            y1: obj1.o5.y + (dh * obj1.h) / 2,
            l: true
          }
          var o2 = {
            gid: wb.GID,
            x: listc[0].o.x,
            y: listc[0].o.y,
            x1: obj1.o5.x,
            y1: listc[0].o.y,
            l: false
          }
          listl.push(o1)
          listl.push(o2)
          listt.push({
            gid: wb.GID,
            x: (o1.x + o1.x1) / 2,
            y: (o1.y + o1.y1) / 2,
            t: Math.round(Math.abs(o1.y - o1.y1) / scale),
            l: false
          })
        }

        updateLines(listl)
        updateTexts(listt)
      }
    } else {
      hover_wbase = undefined
      hover_box = undefined
    }
    left_view.querySelectorAll('.layer_wbase_tile').forEach(layerHTML => {
      if (layerHTML.id.includes(`${wb?.GID}`)) {
        layerHTML.classList.add('onhover')
      } else {
        layerHTML.classList.remove('onhover')
      }
    })
    wdraw()
  }
}

var toph = 0
function offsetScale(x, y) {
  return { x: (x - leftx) / scale, y: (y - topx) / scale - toph }
}
function offsetConvertScale(x, y) {
  return { x: x * scale + leftx, y: (y + toph) * scale + topx }
}

document.addEventListener('contextmenu', event => event.preventDefault())

var parent = divSection,
  offsetp = { x: 0, y: 0 },
  parent_offset1 = { x: 0, y: 0 }
let listWbOnScreen = []
function selectParent(event) {
  parent = divSection
  if (selected_list.length && !event.altKey &&
    selected_list[0].value.closest(`.wbaseItem-value[isinstance]`) &&
    selected_list.some(e => [...e.value.classList].some(cls => cls.startsWith('w-st')))
  ) {
    parent = document.getElementById(select_box_parentID) ?? divSection
    let elementRect = parent.getBoundingClientRect()
    element_offset = offsetScale(elementRect.x, elementRect.y)
  } else {
    let current_level =
      parseInt(document.getElementById(select_box_parentID)?.getAttribute('level') ?? '0') + 1
    if (checkpad === 0) {
      const disabledInstance = selected_list.some(e => e.IsWini)
      const component = selected_list.length && selected_list[0].value.closest(`.wbaseItem-value[iswini]:not(*[level="${selected_list[0].Level}"])`)
      listWbOnScreen = []
      listWbOnScreen.push(
        ...divSection.querySelectorAll(
          `.wbaseItem-value:is(.w-container, .w-textformfield, .w-button, .w-table ${selected_list.every(
            wb => wb.IsWini && !wb.value.classList.contains('w-variant')
          )
            ? ',.w-variant'
            : ''
          })${disabledInstance ? ':not(*[isinstance], *[isinstance] *)' : ''}`
        )
      )
      if (component) {
        listWbOnScreen = listWbOnScreen.filter(e => !e.closest(`.wbaseItem-value[iswini]`) || component.contains(e))
      }
    }
    let list = listWbOnScreen
    let containVariant = selected_list.some(wb => wb.value.classList.contains('w-variant') || wb.value.querySelector('.w-variant'))
    let objp = list.filter(eHTML => {
      const eLevel = parseInt(eHTML.getAttribute('level'))
      if ([...alt_list, ...selected_list].some(wb => wb.GID === eHTML.id || wb.value.contains(eHTML))) {
        return false
      }
      //
      if (containVariant && eHTML.closest('.wbaseItem-value.w-variant')) {
        return false
      }
      if (event.metaKey || (!isMac && event.ctrlKey)) return true
      //
      let is_enable = false
      if (eLevel <= current_level) is_enable = true
      return is_enable
    })
    objp = objp.sort((a, b) => {
      let value =
        parseInt(b.getAttribute('level')) - parseInt(a.getAttribute('level'))
      if (value) {
        return value
      } else {
        return $(b).index() - $(a).index()
      }
    })
    var element_offset
    parent = objp.find(eHTML => {
      let elementRect = eHTML.getBoundingClientRect()
      element_offset = offsetScale(elementRect.x, elementRect.y)
      return (
        element_offset.x <= event.pageX / scale - leftx / scale &&
        element_offset.x + eHTML.offsetWidth >=
        event.pageX / scale - leftx / scale &&
        element_offset.y <= event.pageY / scale - topx / scale &&
        element_offset.y + eHTML.offsetHeight >=
        event.pageY / scale - topx / scale
      )
    })
  }
  if (parent) {
    if (
      drag_start_list.length > 0 &&
      parseInt(parent.getAttribute('level')) > 1 &&
      !(event.metaKey || (!isMac && event.ctrlKey))
    ) {
      let pRect = parent.getBoundingClientRect()
      let grdPRect = parent.parentElement.getBoundingClientRect()
      if (
        (pRect.x === grdPRect.x &&
          pRect.y === grdPRect.y &&
          pRect.width === grdPRect.width &&
          pRect.height === grdPRect.height) ||
        Math.abs(event.pageX / scale - leftx / scale - pRect.x) <= 3 ||
        Math.abs(
          element_offset.x +
          parent.offsetWidth -
          event.pageX / scale +
          leftx / scale
        ) <= 3 ||
        Math.abs(event.pageY / scale - topx / scale - pRect.y) <= 3 ||
        Math.abs(
          pRect.y + parent.offsetWidth - event.pageY / scale + topx / scale
        ) <= 3
      ) {
        parent = parent.parentElement
        element_offset = offsetScale(grdPRect.x, grdPRect.y)
      }
    }
    let layerPrefix = layer_view.querySelector(
      `.layer_wbase_tile[id="${parent.id}"] > .prefix-btn`
    )
    if (layerPrefix) {
      layerPrefix.className = layerPrefix.className.replace('right', 'down')
    }
  } else {
    element_offset = null
    parent = divSection
  }
  offsetp.x = element_offset?.x ?? 0
  offsetp.y = element_offset?.y ?? 0
  if (checkpad === 0) {
    parent_offset1.x = offsetp.x
    parent_offset1.y = offsetp.y
  }
}

var clearAction = false
function downListener(event) {
  if (
    !document.getElementById('wini_features') &&
    event.target.localName != 'input' &&
    !document.activeElement.closest('.w-text') &&
    ToolState.create_new_type.every(ts => ts !== tool_state) &&
    document.body.contains(right_view)
  ) {
    event.activeElement = document.activeElement
    event.path = [...event.composedPath()]
    let mouseOffset = offsetScale(event.pageX, event.pageY)
    let rectOffset
    if (select_box) {
      rectOffset = offsetScale(select_box.x, select_box.y)
      rectOffset.w = select_box.w / scale
      rectOffset.h = select_box.h / scale
    }
    //
    if (event.detail % 2 === 0) {
      doubleClickEvent(event)
    } else {
      let tmp = action_list.length
      checkHoverElement(event)
      clickEvent(event)
      clearAction = tmp !== action_list.length
    }
    WiniIO.emitMouse(
      {
        xMouse: mouseOffset.x,
        yMouse: mouseOffset.y,
        x: rectOffset?.x,
        y: rectOffset?.y,
        w: rectOffset?.w,
        h: rectOffset?.h
      },
      20
    )
    //
  } else return
}

function scrollbdClick(x, y, w, h) {
  scale = Math.min(objscroll.w / w, objscroll.h / h)
  scale = scale * 0.8
  scale = Math.max(min_scale, Math.min(max_scale, scale))
  input_scale_set(scale * 100)
  scrollScale(width / 2 - x * scale, height / 2 + -y * scale, true)
  divSection.style.transform = `scale(${scale}, ${scale})`
  paintCanvas(true)
}

function scrollScale(x, y) {
  if (topx != y) {
    topx = y
    divSection.style.top = topx + 'px'
    positionScrollTop()
  }
  if (leftx != x) {
    leftx = x
    divSection.style.left = leftx + 'px'
    positionScrollLeft()
  }
}
var checkpad = 0
var listbox = [],
  lists = []
var idbutton = ''
var objsc
var instance_drag
var sortLayer
var sortSkin
var listCurve = []
function centerViewInitListener() {
  window.addEventListener('mousemove', moveListener)
  divMain.addEventListener('mousedown', function (event) {
    if (
      !document.getElementById('wini_features') &&
      event.target !== document.activeElement &&
      ToolState.create_new_type.every(ts => ts !== tool_state)
    ) {
      event.activeElement = document.activeElement
      event.path = [...event.composedPath()]
      previousX = event.pageX
      previousY = event.pageY
      //
      //
    } else return
  })
  window.addEventListener('mouseup', upListener)
  divMain.addEventListener('wheel', e => {
    e.preventDefault()
    hover_wbase = undefined
    var delta = e.delta || e.wheelDelta
    if (delta === undefined) {
      //we are on firefox
      delta = e.originalEvent.detail
    }
    if (isMac ? e.metaKey : e.ctrlKey) {
      delta = Math.max(-1, Math.min(1, delta)) // cap the delta to [-1,1] for cross browser consistency
      zoom_point = {
        x: (e.pageX - leftx) / scale,
        y: (e.pageY - topx) / scale
      }
      scale += delta * factor * scale
      scale = Math.max(min_scale, Math.min(max_scale, scale))
      scrollScale(
        e.pageX - zoom_point.x * scale,
        e.pageY - zoom_point.y * scale,
        true
      )
      input_scale_set(scale * 100)
      divSection.style.transform = `scale(${scale}, ${scale})`
    } else if (e.shiftKey || e.deltaX != 0)
      scrollScale(e.wheelDelta < 0 ? leftx - 70 : leftx + 70, topx, true)
    else scrollScale(leftx, e.wheelDelta < 0 ? topx - 70 : topx + 70, true)
    select_box = selectBox(selected_list)
    paintCanvas(true)
    PageDA.saveSettingsPage()
  })
  window.addEventListener('keydown', event => {
    console.log('keydown:', keyid, event.key)
    if (
      (document.activeElement.localName === 'input' &&
        !document.activeElement.readOnly) ||
      document.activeElement.id === 'project_name' ||
      action_list[action_index]?.index != undefined
    ) {
      if (event.key === 'Enter') {
        document.activeElement.blur()
        window.getSelection().removeAllRanges()
      }
      return
    } else if (document.activeElement.closest('.w-text')) {
      return
    } else if (event.key?.toLowerCase() === 'tab') {
      event.preventDefault()
    }
    let currentKey = keyid
    keyTimeStamp = event.timeStamp
    if (event.metaKey) {
      setTimeout(function () {
        if (keyTimeStamp === event.timeStamp) {
          if (currentKey !== keyid) {
            keyUpEvent(event)
            currentKey = keyid
          }
          setTimeout(function () {
            if (currentKey === keyid) {
              keyid = null
            }
          }, 430)
        }
      }, 120)
    }
    keyid = event.key?.toLowerCase()
    if (event.key.trim() === '') {
      event.preventDefault()
      toolStateChange(ToolState.hand_tool)
    } else if (
      event.key?.toLowerCase() === 'z' ||
      event.key?.toLowerCase() === '=' ||
      event.key?.toLowerCase() === '-' ||
      event.key?.toLowerCase() === '0'
    ) {
      event.preventDefault()
    } else return
  })
  window.addEventListener('keyup', keyUpEvent, false)
  initObserver()
}

function initObserver() {
  const childrenObserve = [
    divSection,
    ...divSection.querySelectorAll(':scope > .w-variant')
  ]
  childrenObserve.forEach(parentPage => {
    childObserver.observe(parentPage, {
      childList: true
    })
  })
  const wbResize = [
    ...divSection.querySelectorAll(`:scope > .wbaseItem-value.w-container`),
    ...divSection.querySelectorAll(
      `:scope > .wbaseItem-value.w-variant > .wbaseItem-value.w-container`
    ),
    ...divSection.querySelectorAll(
      `:scope > .wbaseItem-value.w-variant > .wbaseItem-value.w-container`
    )
  ]
  wbResize.forEach(page => {
    resizeWbase.observe(page)
  })
  listShowName = [
    ...divSection.querySelectorAll(
      `:scope > .wbaseItem-value:is(.w-container, .w-variant, *[iswini]):not(*[isinstance])`
    )
  ]
}

const childObserver = new MutationObserver(mutationList => {
  mutationList.forEach(mutation => {
    mutation.removedNodes.forEach(wbaseValue => {
      let listBrpKey = ProjectDA.obj.ResponsiveJson.BreakPoint.map(brp =>
        brp.Key.match(brpRegex).pop().replace(/[()]/g, '')
      )
      let listClass = [...wbaseValue.classList, 'min-brp'].filter(wbClass =>
        listBrpKey.every(brpKey => brpKey != wbClass)
      )
      wbaseValue.className = listClass.join(' ')
      if (wbaseValue.classList.contains('w-variant')) {
        childObserver.disconnect(wbaseValue, {
          childList: true
        })
        wbaseValue
          .querySelectorAll(':scope > .w-container')
          .forEach(childHTML => {
            let listClass = [...childHTML.classList, 'min-brp'].filter(
              wbClass => listBrpKey.every(brpKey => brpKey != wbClass)
            )
            childHTML.className = listClass.join(' ')
            resizeWbase.disconnect(childHTML)
          })
      }
    })
    mutation.addedNodes.forEach(wbaseValue => {
      if (
        wbaseValue.classList.contains('w-container') &&
        wbaseValue.getAttribute('width-type') === 'fit'
      ) {
        let localResponsive =
          ProjectDA.obj.ResponsiveJson ?? ProjectDA.responsiveJson
        let closestBrp = localResponsive.BreakPoint.filter(
          brp => wbaseValue.offsetWidth >= brp.Width
        )
        if (closestBrp.length > 0 && ProjectDA.obj.ResponsiveJson) {
          closestBrp = closestBrp
            .pop()
            .Key.match(brpRegex)
            .pop()
            .replace(/[()]/g, '')
          let listBrpKey = ProjectDA.obj.ResponsiveJson.BreakPoint.map(brp =>
            brp.Key.match(brpRegex).pop().replace(/[()]/g, '')
          )
          let listClass = [...wbaseValue.classList, 'min-brp'].filter(wbClass =>
            listBrpKey.every(brpKey => brpKey != wbClass)
          )
          wbaseValue.className = listClass.join(' ')
          wbaseValue.className += ` ${closestBrp}`
        }
        resizeWbase.observe(wbaseValue)
      } else if (wbaseValue.classList.contains('w-variant')) {
        childObserver.observe(wbaseValue, {
          childList: true
        })
        wbaseValue
          .querySelectorAll(':scope > .w-container')
          .forEach(childHTML => resizeWbase.observe(childHTML))
      }
    })
    if (mutation.target === divSection) {
      listShowName = [
        ...divSection.querySelectorAll(`:scope > .wbaseItem-value[iswini]`),
        ...divSection.querySelectorAll(
          `:scope > .wbaseItem-value:is(.w-container, .w-variant):not(*[isinstance])`
        )
      ].sort((a, b) => parseInt(b.style.zIndex) - parseInt(a.style.zIndex))
    }
  })
})

var lstc = []
var dragTime = 0
function moveListener(event) {
  if (document.activeElement.closest('.w-text') || (event.target.localName === 'input' && !event.target.readOnly))
    return
  event.preventDefault()
  let target_view
  // check drag resize left view
  if (((!instance_drag && left_view.offsetWidth > 0) || left_view.resizing) && !sortLayer) {
    let pageContainerY = document.getElementById('div_list_page').getBoundingClientRect()
    if (left_view.resizing) {
      if (document.body.style.cursor === 'e-resize') {
        left_view.style.width = event.pageX + 'px'
      } else {
        document.getElementById('div_list_page').style.height =
          event.pageY - (pageContainerY.bottom - pageContainerY.height) + 'px'
      }
      return
    } else if (
      isInRange(
        event.pageX,
        left_view.offsetWidth - 8,
        left_view.offsetWidth + 8
      )
    ) {
      document.body.style.cursor = 'e-resize'
      if (event.buttons == 1) {
        left_view.resizing = true
        left_view.style.width = event.pageX + 'px'
        return
      }
    } else if (
      layer_view.offsetWidth > 0 &&
      isInRange(event.pageX, 0, left_view.offsetWidth) &&
      isInRange(
        event.pageY,
        pageContainerY.bottom - 8,
        pageContainerY.bottom + 4
      )
    ) {
      document.body.style.cursor = 'n-resize'
      if (event.buttons == 1) {
        left_view.resizing = true
        document.getElementById('div_list_page').style.height =
          event.pageY - (pageContainerY.bottom - pageContainerY.height) + 'px'
        return
      }
    } else {
      document.body.style.cursor = null
    }
  } else {
    document.body.style.cursor = null
  }
  // check edit data
  if (event.buttons == 1 && PageDA.enableEdit) {
    dragTime++
    if (dragTime < 4 && design_view_index !== 1) return
    let divImgDoc = document.getElementById('popup_img_document')
    if (instance_drag) {
      target_view = 'left_view'
    } else if (divImgDoc?.getAttribute('offset')) {
      let oldOffset = JSON.parse(divImgDoc.getAttribute('offset')) ?? {
        x: event.clientX,
        y: event.clientY
      }
      let newLeft = divImgDoc.offsetLeft + event.clientX - oldOffset.x
      let newTop = divImgDoc.offsetTop + event.clientY - oldOffset.y
      if (newLeft >= 0) divImgDoc.style.left = newLeft + 'px'

      if (newTop >= 88) divImgDoc.style.top = newTop + 'px'

      divImgDoc.setAttribute(
        'offset',
        JSON.stringify({ x: event.clientX, y: event.clientY })
      )
    } else if (
      (sortLayer || event.target.closest('.layer_wbase_tile')) &&
      [ToolState.hand_tool, ...ToolState.resize_type].every(ts => tool_state != ts) &&
      drag_start_list.length === 0
    ) {
      target_view = 'left_view'
      sortLayer = document.createElement('div')
    } else if (
      sortSkin ||
      event.target.classList.contains('skin_tile_option')
    ) {
      target_view = 'right_view'
    } else {
      target_view = event.target.closest(
        `div[id="popup_img_document"], div[id="canvas_view"], div[id="left_view"], div[id="right_view"]`
      )?.id
    }
  }
  switch (target_view) {
    case 'canvas_view':
      time_down = 0
      switch (idbutton) {
        case scrollTop.id:
          objscroll.hc =
            ((objscroll.y1 - objscroll.y) * scale) /
            (objscroll.h - scrollTop.offsetHeight - 13)
          topx -= (event.pageY - miny) * objscroll.hc
          divSection.style.top = topx + 'px'
          scrollTop.style.top =
            scrollTop.offsetTop + (event.pageY - miny) + 'px'
          miny = event.pageY
          paintCanvas(false)
          break
        case scrollLeft.id:
          objscroll.wc =
            ((objscroll.x1 - objscroll.x) * scale) /
            (objscroll.w - scrollLeft.offsetWidth - 13)
          leftx -= (event.pageX - minx) * objscroll.wc
          divSection.style.left = leftx + 'px'
          scrollLeft.style.left =
            scrollLeft.offsetLeft + (event.pageX - minx) + 'px'
          minx = event.pageX
          paintCanvas(false)
          break
        default:
          var xp = event.pageX - minx,
            yp = event.pageY - miny
          if (tool_state === ToolState.hand_tool) {
            handToolDrag(event)
          } else if (isAroundPoint(prototypePoint, event) || drag_prototype_endppoint) {
            dragPrototypeLine(event)
          } else if (keyid != 'z' && design_view_index !== 1) {
            let isCreate = false
            if (ToolState.create_new_type.some(tool => tool_state == tool) && checkpad == 0) {
              let offset_convert = offsetScale(
                Math.min(minx, event.pageX),
                Math.min(miny, event.pageY)
              )
              let parentHTML = event.target.closest(
                `.wbaseItem-value:is(.w-container, .w-textformfield, .w-button, .w-table):not(*[isinstance])`
              )
              createWbaseHTML({
                parentid: parentHTML?.id ?? wbase_parentID,
                x: Math.round(offset_convert.x),
                y: Math.round(offset_convert.y),
                w: 10,
                h: 10
              })
              if (WBaseDA.enumEvent === EnumEvent.add) {
                toolStateChange(ToolState.resize_bot_right)
                isCreate = true
              }
            }
            if (!isCreate) {
              if (ToolState.resize_type.some(tool => tool_state == tool)) {
                WBaseDA.enumEvent ??= EnumEvent.edit
                handleResizeXYWH({ xp: xp, yp: yp })
                updateUISelectBox()
              } else {
                if (!selected_list.length) {
                  handleWbSelectedList([hover_wbase])
                }
                if (select_box && !objr) {
                  if (checkpad == 0)
                    lstc = [...parent.querySelectorAll(':scope > .wbaseItem-value')].filter(eHTML => !isHidden(eHTML))
                  selectParent(event)
                  // top left
                  let select_box_o1 = select_box.o1
                  // bottom right
                  let select_box_o9 = select_box.o9
                  if (checkpad > 0 ||
                    (isInRange(event.pageX, select_box_o1.x, select_box_o9.x) &&
                      isInRange(event.pageY, select_box_o1.y, select_box_o9.y))
                  ) {
                    var xb = 0,
                      yb = 0
                    if (checkpad === 0) {
                      drag_start_list = []
                      selected_list.forEach(wb => {
                        let eHTMLRect = wb.value.getBoundingClientRect()
                        let eHTMLOffset = offsetScale(eHTMLRect.x, eHTMLRect.y)
                        wb.tmpX = eHTMLOffset.x - parent_offset1.x
                        wb.tmpY = eHTMLOffset.y - parent_offset1.y
                        if (!event.altKey) {
                          if (
                            wb.value.getAttribute('width-type') === 'fill' ||
                            [Constraints.left_right, Constraints.scale].some(e => wb.value.getAttribute('constx') === e)
                          ) {
                            wb.value.style.width = wb.value.offsetWidth + 'px'
                            wb.value.style.flex = null
                          }
                          if (
                            wb.value.getAttribute('height-type') === 'fill' ||
                            [Constraints.top_bottom, Constraints.scale].some(e => wb.value.getAttribute('consty') === e)
                          ) {
                            wb.value.style.height = wb.value.offsetHeight + 'px'
                            wb.value.style.flex = null
                          }
                        }
                      })
                      drag_start_list = JSON.parse(JSON.stringify(selected_list))
                    }

                    if (
                      Math.abs(event.pageX - previousX) > 2 ||
                      Math.abs(event.pageY - previousY) > 2
                    ) {
                      if (event.altKey) {
                        dragAltUpdate(xb + xp / scale, yb + yp / scale, event)
                      } else {
                        dragWbaseUpdate(xb + xp / scale, yb + yp / scale, event)
                      }
                      checkpad++
                      if (checkpad % 2 === 0) wdraw()
                    }
                  } else {
                    handleWbSelectedList()
                    removeAllRectselects()
                  }
                } else {
                  scanSelectList(event)
                  var xm = Math.min(minx, event.pageX),
                    ym = Math.min(miny, event.pageY),
                    xma = Math.max(minx, event.pageX),
                    yma = Math.max(miny, event.pageY)
                  objr = {
                    gid: drawid,
                    x: xm,
                    y: ym - toph,
                    w: xma - xm,
                    h: yma - ym
                  }
                  updateRects([objr])
                }
              }
            }
          } else {
            var xm = Math.min(minx, event.pageX),
              ym = Math.min(miny, event.pageY),
              xma = Math.max(minx, event.pageX),
              yma = Math.max(miny, event.pageY)
            objr = {
              gid: drawid,
              x: xm,
              y: ym - toph,
              w: xma - xm,
              h: yma - ym
            }
            updateRects([objr])
          }
          break
      }
      if (checkpad === 0) {
        let mouseOffset = offsetScale(event.pageX, event.pageY)
        let rectOffset
        let rRect = objr ?? select_box
        if (rRect) {
          rectOffset = offsetScale(rRect.x, rRect.y)
          rectOffset.w = rRect.w / scale
          rectOffset.h = rRect.h / scale
        }
        WiniIO.emitMouse({
          xMouse: mouseOffset.x,
          yMouse: mouseOffset.y,
          x: rectOffset?.x,
          y: rectOffset?.y,
          w: rectOffset?.w,
          h: rectOffset?.h,
          isSelect: false
        })
      }
      break
    case 'left_view':
      if (instance_drag) {
        dragInstanceUpdate(event)
      } else if (event.target.classList?.contains('instance_demo')) {
        previousX = event.pageX
        previousY = event.pageY
        const instDemo = event.target.querySelector('.wbaseItem-value')
        instance_drag = instDemo.cloneNode(true)
        let target_rect = instDemo.getBoundingClientRect()
        document.body.style.cssText = event.target.closest('.instance-container').style.cssText
        document.body.appendChild(instance_drag)
        instance_drag.style.pointerEvents = 'none'
        instance_drag.style.left = target_rect.x + target_rect.width + 'px'
        instance_drag.style.top = target_rect.y + target_rect.height + 'px'
        instance_drag.style.zIndex = 2
      } else if (sortLayer) {
        ondragSortLayer(event)
      }
      break
    case 'right_view':
      break
    case 'popup_img_document':
      if (event.target.className?.includes('img_folder_demo')) {
        previousX = event.pageX
        previousY = event.pageY
        instance_drag = document.createElement('div')
        document.body.appendChild(instance_drag)
        let targetComputeStyle = window.getComputedStyle(event.target)
        let target_rect = event.target.getBoundingClientRect()
        instance_drag.style.backgroundImage = targetComputeStyle.backgroundImage
        instance_drag.style.backgroundSize = targetComputeStyle.backgroundSize
        instance_drag.style.width = targetComputeStyle.width
        instance_drag.style.height = targetComputeStyle.height
        instance_drag.style.position = 'absolute'
        instance_drag.style.pointerEvents = 'none'
        instance_drag.style.left = target_rect.x + 'px'
        instance_drag.style.top = target_rect.y + 'px'
        instance_drag.style.transform = null
        instance_drag.style.zIndex = 2
        instance_drag.fileid = parseInt(event.target.getAttribute('fileid'))
      }
      break
    default:
      if (PageDA.enableEdit) {
        if (
          event.target?.className == 'header_popup_skin' &&
          event.buttons == 1
        ) {
          let popupSkin = event.target.parentElement
          let startOffset = {
            x: popupSkin.offsetLeft,
            y: popupSkin.offsetTop,
            move: {
              x: event.pageX,
              y: event.pageY
            }
          }
          if (popupSkin.getAttribute('startOffset')) {
            startOffset = JSON.parse(popupSkin.getAttribute('startOffset'))
          } else {
            popupSkin.setAttribute('startOffset', JSON.stringify(startOffset))
          }
          popupSkin.style.left =
            startOffset.x + (event.pageX - startOffset.move.x) + 'px'
          popupSkin.style.top =
            startOffset.y + (event.pageY - startOffset.move.y) + 'px'
        }
        idbutton = event.target.id
        minx = event.pageX
        miny = event.pageY
        checkpad = 0
        if (
          event.target.id == 'canvas_view' ||
          (divSection.contains(event.target) &&
            [ToolState.hand_tool, ...ToolState.create_new_type].every(
              tool => tool_state != tool
            ))
        ) {
          checkHoverElement(event)
        }
        if (select_box != undefined) {
          checkResize(event)
        }
      } else {
        var xp = event.pageX - minx,
          yp = event.pageY - miny
        if (tool_state === ToolState.hand_tool && event.buttons == 1) {
          handToolDrag(event)
        } else if (
          (event.target.id == 'canvas_view' ||
            divSection.contains(event.target)) &&
          document.body.contains(right_view)
        ) {
          if (event.buttons === 1) {
            scanSelectList(event)
          } else {
            minx = event.pageX
            miny = event.pageY
            checkHoverElement(event)
          }
        }
      }
      break
  }
  if (
    checkpad === 0 &&
    document.body.querySelector(`.wbaseItem-value[loading="true"]`)
  ) {
    document.body.style.setProperty('--loadingX', event.pageX + 'px')
    document.body.style.setProperty('--loadingY', event.pageY + 'px')
  }
}

function handToolDrag(event) {
  let dragX = 0
  let dragY = 0
  // skip the drag when the x position was not changed
  if (event.pageX - previousX !== 0) {
    dragX = previousX - event.pageX
    previousX = event.pageX
  }
  // skip the drag when the y position was not changed
  if (event.pageY - previousY !== 0) {
    dragY = previousY - event.pageY
    previousY = event.pageY
  }
  // scrollBy x and y
  if (dragX !== 0 || dragY !== 0) {
    leftx = leftx - dragX
    topx = topx - dragY
    divSection.style.left = leftx + 'px'
    divSection.style.top = topx + 'px'
  }
  paintCanvas(false)
}

function scanSelectList(event) {
  console.log('scan')
  var xm = Math.min(minx, event.pageX),
    ym = Math.min(miny, event.pageY),
    xma = Math.max(minx, event.pageX),
    yma = Math.max(miny, event.pageY)
  objr = {
    gid: drawid,
    x: xm,
    y: ym - toph,
    w: xma - xm,
    h: yma - ym
  }
  updateRects([objr])
  //
  let offsetdraw = offsetScale(objr.x, objr.y)
  let _range = {
    xMin: offsetdraw.x,
    yMin: offsetdraw.y,
    xMax: offsetdraw.x + objr.w / scale,
    yMax: offsetdraw.y + objr.h / scale
  }
  let newList = []
  let divSectionWbase = [
    ...divSection.querySelectorAll(
      `.wbaseItem-value[level="1"], .wbaseItem-value[level="2"]`
    )
  ]
  newList.push(...divSectionWbase)
  newList = newList.filter(eHTML => {
    if (isHidden(eHTML)) {
      return false
    }

    // let parentElement = $(eHTML).parents(
    //   `.wbaseItem-value.w-container[level="1"], .wbaseItem-value.w-variant[level="1"]`
    // )[0]

    // if (parentElement) return false

    return elementIsInRange(
      eHTML,
      _range,
      ['w-container', 'w-variant'].some(e => eHTML.classList.contains(e))
    )
  })
  let checkList = [...newList]
  newList = newList.filter(e => checkList.every(item => !item.contains(e)))
  if (selected_list.length > 0) {
    newList = newList.filter(
      wbHTML => wbHTML.getAttribute('parentid') === select_box_parentID
    )
  }
  selected_list = []
  let newListWBase = wbase_list.filter(
    e =>
      window.getComputedStyle(e.value).pointerEvents !== 'none' &&
      newList.some(eHTML => e.GID == eHTML.id)
  )
  handleWbSelectedList(newListWBase)
}

function checkHoverElement(event) {
  let titleHover
  if (titleList.length > 0)
    titleHover = titleList.find(
      title =>
        isInRange(event.pageX, title.value.x, title.value.xMax) &&
        isInRange(event.pageY, title.value.y, title.value.yMax)
    )
  if (titleHover) {
    let wbase_item = wbase_list.find(e => e.GID == titleHover.id)
    updateHoverWbase(wbase_item, event.altKey)
  } else if (event.target !== divSection) {
    listRectHover = []
    listLine = []
    listText = []
    let currentLevel = 1
    let currentListPPage = []
    if (selected_list.length > 0) {
      currentLevel = selected_list[0].Level
      if (currentLevel > 1)
        currentListPPage = [
          ...$(selected_list[0].value).parents(`.wbaseItem-value`)
        ]
    }
    let _target = [
      event.target,
      ...$(event.target).parents('.wbaseItem-value')
    ].find(wbHTML => {
      if (!wbHTML.classList.contains('wbaseItem-value')) {
        return false
      }
      let is_enable = false
      let target_level = parseInt(wbHTML.getAttribute('level'))
      switch (target_level) {
        case 1:
          if (wbHTML.getAttribute('isinstance') === 'true') {
            is_enable = true
          } else if (
            ['w-container', 'w-variant'].some(e =>
              wbHTML.classList.contains(e)
            ) &&
            !event.altKey
          ) {
            is_enable = wbHTML.childElementCount === 0
          } else {
            is_enable = target_level <= currentLevel
          }
          break
        default:
          let parentPage = $(wbHTML).parents(
            `.w-container:not(*[isinstance]), .w-variant:not(*[isinstance])`
          )[0]
          if (target_level === 2 && parentPage) {
            is_enable = true
          } else if (event.metaKey || (!isMac && event.ctrlKey)) {
            is_enable = true
          } else if (
            target_level <= currentLevel &&
            currentListPPage.some(
              pPage => pPage.id === wbHTML.getAttribute('parentid')
            )
          ) {
            is_enable = true
          }
          break
      }
      return is_enable
    })
    if (_target) {
      updateHoverWbase(
        wbase_list.find(m => m.GID === _target.id),
        event.altKey
      )
    } else {
      updateHoverWbase()
    }
  } else {
    updateHoverWbase()
  }
}

var drag_prototype_endppoint

function dragPrototypeLine(event) {
  drag_prototype_endppoint = { x: event.pageX, y: event.pageY }
  wdraw()
}

function isAroundPoint(off, event) {
  return (
    off &&
    event.pageX >= off.x - 6 &&
    event.pageX <= off.x + 6 &&
    event.pageY >= off.y - 6 &&
    event.pageY <= off.y + 6
  )
}

function checkResize(event) {
  if (selected_list.every(e => window.getComputedStyle(e.value).pointerEvents !== 'none') &&
    !selected_list[0].value.closest(`.wbaseItem-value[isinstance]:not(*[level="${selected_list[0].Level}"])`)
  ) {
    // top_left
    let select_box_o1 = select_box.o1
    // bottom_left
    let select_box_o2 = select_box.o3
    // top_right
    let select_box_o3 = select_box.o7
    // bottom_right
    let select_box_o4 = select_box.o9
    // prototype point
    let topPoint, rightPoint, botPoint, leftPoint
    if (design_view_index == 1) {
      topPoint = select_box.o4
      rightPoint = select_box.o8
      botPoint = select_box.o6
      leftPoint = select_box.o2
    }
    if (isAroundPoint(topPoint, event)) {
      prototypePoint = topPoint
      toolStateChange(ToolState.move)
      wdraw()
    } else if (isAroundPoint(rightPoint, event)) {
      prototypePoint = rightPoint
      toolStateChange(ToolState.move)
      wdraw()
    } else if (isAroundPoint(botPoint, event)) {
      prototypePoint = botPoint
      toolStateChange(ToolState.move)
      wdraw()
    } else if (isAroundPoint(leftPoint, event)) {
      prototypePoint = leftPoint
      toolStateChange(ToolState.move)
      wdraw()
    } else if (isAroundPoint(select_box_o1, event)) {
      toolStateChange(ToolState.resize_top_left)
    } else if (isAroundPoint(select_box_o2, event)) {
      toolStateChange(ToolState.resize_bot_left)
    } else if (isAroundPoint(select_box_o3, event)) {
      toolStateChange(ToolState.resize_top_right)
    } else if (isAroundPoint(select_box_o4, event)) {
      toolStateChange(ToolState.resize_bot_right)
    } else if (
      event.pageX >= select_box_o1.x - 4 &&
      event.pageX <= select_box_o1.x + 4 &&
      event.pageY >= select_box_o1.y &&
      event.pageY <= select_box_o2.y
    ) {
      toolStateChange(ToolState.resize_left)
    } else if (
      event.pageX >= select_box_o3.x - 4 &&
      event.pageX <= select_box_o3.x + 4 &&
      event.pageY >= select_box_o3.y &&
      event.pageY <= select_box_o2.y
    ) {
      toolStateChange(ToolState.resize_right)
    } else if (
      event.pageX >= select_box_o1.x &&
      event.pageX <= select_box_o3.x &&
      event.pageY >= select_box_o1.y - 4 &&
      event.pageY <= select_box_o1.y + 4
    ) {
      toolStateChange(ToolState.resize_top)
    } else if (
      event.pageX >= select_box_o1.x &&
      event.pageX <= select_box_o3.x &&
      event.pageY >= select_box_o2.y - 4 &&
      event.pageY <= select_box_o2.y + 4
    ) {
      toolStateChange(ToolState.resize_bot)
    } else {
      if (selected_list.length == 1 && design_view_index == 1) {
        let selectedPage = document.getElementById(selected_list[0].GID)
        if (selectedPage.id == event.target.id || selectedPage.contains(event.target)) {
          let listPoint = [topPoint, rightPoint, botPoint, leftPoint]
          listPoint.sort((a, b) => {
            let distanceA = Math.sqrt(
              (event.pageX - a.x) * (event.pageX - a.x) +
              (event.pageY - a.y) * (event.pageY - a.y)
            )
            let distanceB = Math.sqrt(
              (event.pageX - b.x) * (event.pageX - b.x) +
              (event.pageY - b.y) * (event.pageY - b.y)
            )
            return distanceA - distanceB
          })
          prototypePoint = listPoint[0]
          toolStateChange(ToolState.move)
          wdraw()
        } else if (prototypePoint) {
          prototypePoint = undefined
          wdraw()
        }
      }
      toolStateChange(ToolState.move)
    }
  }
}

var drawid = uuidv4(),
  minx = 0,
  miny = 0,
  wd = 0,
  hd = 0

var divtest_rectid = ''
function eventdiv(event) {
  if (keyid == ' ') {
    var divre = document.getElementById(divtest_rectid)
    if (divre) {
      divre.style.top = (topx + event.pageY) / scale + 'px'
      divre.style.left = (leftx + event.pageX) / scale + 'px'
    }
    if (event.button) divtest_rectid = ''
  }
}

var listText = [] // gid, x,y,t

var listRect = [] // gid, x,y,x1,y1
var listRectHover = [] // gid, x,y,x1,y1
var listRectSelect = [] // gid, x,y,x1,y1
let titleList = []
const imgMouseMove = new Image()
let imgMouseSrc = `data:image/svg+xml;charset=utf-8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.10657 20L5 4L18 12.3526L11.7455 14.1567L8.10657 20Z" fill="#FAFAFA" stroke-linecap="square"/>
</svg>`
const imgCom = new Image()
let imgComSrc = `data:image/svg+xml;charset=utf-8,<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.375 2.625L4.08211 3.33211L5.29289 4.54289L6 5.25L6.70711 4.54289L7.91789 3.33211L8.625 2.625L7.91789 1.91789L6.70711 0.707107L6 0L5.29289 0.707107L4.08211 1.91789L3.375 2.625ZM7.21079 2.625L6 3.83579L4.78921 2.625L6 1.41421L7.21079 2.625ZM3.375 9.375L4.08211 10.0821L5.29289 11.2929L6 12L6.70711 11.2929L7.91789 10.0821L8.625 9.375L7.91789 8.66789L6.70711 7.45711L6 6.75L5.29289 7.45711L4.08211 8.66789L3.375 9.375ZM7.21079 9.375L6 10.5858L4.78921 9.375L6 8.16421L7.21079 9.375ZM0.707107 6.70711L0 6L0.707107 5.29289L1.91789 4.08211L2.625 3.375L3.33211 4.08211L4.54289 5.29289L5.25 6L4.54289 6.70711L3.33211 7.91789L2.625 8.625L1.91789 7.91789L0.707107 6.70711ZM2.625 7.21079L3.83579 6L2.625 4.78921L1.41421 6L2.625 7.21079ZM6.75 6L7.45711 6.70711L8.66789 7.91789L9.375 8.625L10.0821 7.91789L11.2929 6.70711L12 6L11.2929 5.29289L10.0821 4.08211L9.375 3.375L8.66789 4.08211L7.45711 5.29289L6.75 6ZM10.5858 6L9.375 7.21079L8.16421 6L9.375 4.78921L10.5858 6Z" fill="rgb(123, 97, 255)"/>
</svg>
`
imgCom.src = imgComSrc
let drawIn = 0
let listShowName = []
function wdraw() {
  // drawIn = performance.now();
  ctxr.clearRect(0, 0, width, height)
  // ctxr.lineWidth = 1;
  // ctxr.strokeStyle = "red";
  // for (var i = 0; i < listLine.length; i++) {
  //   ctxr.beginPath();
  //   if (listLine[i].l) ctxr.setLineDash([]);
  //   else ctxr.setLineDash([10, 2]);
  //   ctxr.moveTo(listLine[i].x, listLine[i].y);
  //   ctxr.lineTo(listLine[i].x1, listLine[i].y1);
  //   ctxr.stroke();
  // }
  // ctxr.beginPath();
  // ctxr.setLineDash([]);

  if (
    hover_wbase &&
    selected_list.every(e => e.GID !== hover_wbase.GID) &&
    checkpad == 0
  ) {
    var objset = offsetScale(hover_box.x, hover_box.y)
    var objse = offsetConvertScale(Math.round(objset.x), Math.round(objset.y))
    ctxr.strokeStyle =
      hover_wbase.IsWini ||
        hover_wbase.IsInstance ||
        $(hover_wbase.value).parents(
          `.wbaseItem-value[iswini],.wbaseItem-value[isinstance]`
        ).length
        ? '#7B61FF'
        : '#1890FF'
    ctxr.strokeRect(objse.x, objse.y, hover_box.w, hover_box.h)
  } else if (parent?.id?.length == 36 && checkpad > 0) {
    let parentRect = parent.getBoundingClientRect()
    ctxr.strokeStyle =
      parent.getAttribute('iswini') === 'true' ||
        parent.getAttribute('isinstance') === 'true' ||
        $(parent).parents(`.wbaseItem-value[iswini],.wbaseItem-value[isinstance]`)
          .length
        ? '#7B61FF'
        : '#1890FF'
    ctxr.strokeRect(
      parentRect.x,
      parentRect.y,
      parentRect.width,
      parentRect.height
    )
  }

  // draw select_box
  if (
    select_box &&
    !document.activeElement.closest('.w-text') &&
    ((checkpad == 0 && tool_state == ToolState.move) ||
      ToolState.resize_type.some(tool => tool == tool_state))
  ) {
    var objset = offsetScale(select_box.x, select_box.y)
    var objse = offsetConvertScale(Math.round(objset.x), Math.round(objset.y))
    ctxr.strokeStyle =
      selected_list.every(e => e.IsWini || e.IsInstance) ||
        $(selected_list[0].value).parents(
          `.wbaseItem-value[iswini],.wbaseItem-value[isinstance]`
        ).length
        ? '#7B61FF'
        : '#1890FF'
    ctxr.strokeRect(objse.x, objse.y, select_box.w, select_box.h)
    if (prototypePoint) {
      ctxr.strokeStyle = '#E14337'
      ctxr.lineWidth = 1
      ctxr.arc(prototypePoint.x, prototypePoint.y, 6, 0, 2 * Math.PI)
      ctxr.stroke()
      ctxr.closePath()
    }
  }

  if (tool_state !== ToolState.hand_tool) {
    for (let i = 0; i < listShowName.length; i++) {
      let wbaseHTML = listShowName[i]
      let wbaseRect = wbaseHTML.getBoundingClientRect()
      let scaleOffset = offsetScale(wbaseRect.x, wbaseRect.y)
      let canvasOff = offsetConvertScale(
        Math.round(scaleOffset.x),
        Math.round(scaleOffset.y)
      )
      let isActive =
        selected_list.some(wbaseItem => wbaseItem.GID === wbaseHTML.id) ||
        hover_wbase?.GID === wbaseHTML.id ||
        parent.id === wbaseHTML.id
      let isWini = wbaseHTML.getAttribute('iswini') === 'true'
      ctxr.fillStyle = isWini ? '#7B61FF' : isActive ? '#1890FF' : 'grey'
      ctxr.font = '12px Inter'
      let txtoffX = 0
      let t = titleList.find(e => e.id === wbaseHTML.id)
      if (isWini) {
        ctxr.drawImage(
          imgCom,
          canvasOff.x,
          canvasOff.y - Math.min(8 * scale, 12) - 10,
          12,
          12
        )
        txtoffX = 16
      }
      let txt =
        document.getElementById('inputName:' + wbaseHTML.id)?.value ??
        wbase_list.find(e => e.GID == wbaseHTML.id)?.name
      ctxr.fillText(
        txt,
        canvasOff.x + txtoffX,
        canvasOff.y - Math.min(8 * scale, 12)
      )
      if (wbaseHTML.getAttribute('lock') !== 'true') {
        if (t) {
          t.value = {
            x: canvasOff.x,
            y: canvasOff.y - Math.min(8 * scale, 12) - 16,
            xMax: canvasOff.x + txtoffX + ctxr.measureText(txt).width,
            yMax: canvasOff.y
          }
          t.sort = i
        } else {
          titleList.push({
            id: wbaseHTML.id,
            value: {
              x: canvasOff.x,
              y: canvasOff.y - Math.min(8 * scale, 12) - 16,
              xMax: canvasOff.x + txtoffX + ctxr.measureText(txt).width,
              yMax: canvasOff.y
            },
            sort: i
          })
        }
      }
    }
    titleList = titleList
      .filter(e => e && listShowName.some(wb => wb.id === e.id))
      .sort((a, b) => a.sort - b.sort)
  }

  //! draw prototype
  drawCurvePrototype()

  // ctxr.stroke();
  // ctxr.fillStyle = "#E14337";
  // ctxr.font = "12px Roboto";
  // for (var i = 0; i < listText.length; i++) {
  //   ctxr.fillText(listText[i].t, listText[i].x, listText[i].y);
  // }
  // ctxr.stroke();

  ctxr.strokeStyle = '#1890ffb3'
  ctxr.fillStyle = '#1890ff26'
  for (let rRect of listRect) {
    if (checkTypeof(rRect.ID) === 'number') {
      let rRectCustomer = PageDA.customerList.find(
        cus => cus.CustomerID === rRect.ID
      )
      if (rRectCustomer) {
        let rRectColor = rRectCustomer?.color ?? Ultis.generateRandomColor()
        let coloredSvgXml = imgMouseSrc.replace(
          '#FAFAFA',
          Ultis.hexToRGB(rRectColor.replace('#', ''))
        )
        imgMouseMove.src = coloredSvgXml
        let mouseOffset = offsetConvertScale(
          Math.round(rRect.xMouse),
          Math.round(rRect.yMouse)
        )
        let rectOffset
        if (rRect.w) {
          rectOffset = offsetConvertScale(
            Math.round(rRect.x),
            Math.round(rRect.y)
          )
          ctxr.strokeStyle = rRectColor
          ctxr.fillStyle = rRectColor + '26'
          rectOffset.w = rRect.w * scale
          rectOffset.h = rRect.h * scale
          ctxr.fillRect(rectOffset.x, rectOffset.y, rectOffset.w, rectOffset.h)
          ctxr.strokeRect(
            rectOffset.x,
            rectOffset.y,
            rectOffset.w,
            rectOffset.h
          )
          ctxr.drawImage(imgMouseMove, mouseOffset.x, mouseOffset.y)
        } else {
          ctxr.drawImage(imgMouseMove, mouseOffset.x, mouseOffset.y)
        }
        ctxr.fillStyle = rRectColor
        ctxr.fillRect(
          mouseOffset.x + 20,
          mouseOffset.y + 18,
          ctx.measureText(rRectCustomer.CustomerName ?? 'Anonymous').width + 4,
          14
        )
        ctxr.font = '10px Roboto'
        ctxr.fillStyle = 'white'
        ctxr.fillText(
          rRectCustomer.CustomerName ?? 'Anonymous',
          mouseOffset.x + 24,
          mouseOffset.y + 28
        )
      }
    } else {
      ctxr.fillRect(rRect.x, rRect.y, rRect.w, rRect.h)
      ctxr.strokeRect(rRect.x, rRect.y, rRect.w, rRect.h)
    }
  }
  listRect = []
}

function getPagePrototypePoint(page) {
  let convert_position = page.getBoundingClientRect()
  return {
    o1: {
      x: convert_position.x + convert_position.width / 2,
      y: convert_position.y
    },
    o2: {
      x: convert_position.x + convert_position.width,
      y: convert_position.y + convert_position.height / 2
    },
    o3: {
      x: convert_position.x + convert_position.width / 2,
      y: convert_position.y + convert_position.height
    },
    o4: {
      x: convert_position.x,
      y: convert_position.y + convert_position.height / 2
    }
  }
}

function drawArrow(ctxr, startPoint, endPoint) {
  var headlen = 10 * scale
  var dx = endPoint.x - (startPoint.x + (endPoint.x - startPoint.x) * 0.8)
  var dy = endPoint.y - startPoint.y
  var angle

  if (controlPoint == 1 && (direction == 'top' || direction == 'bottom')) {
    angle = Math.atan2(dy, dx)
  } else {
    switch (direction) {
      case 'right':
        angle = Math.atan2(0, 0)
        break
      case 'top':
        angle = Math.atan2(-90 * 0.8, 0)
        break
      case 'left':
        angle = Math.atan2(0, -90 * 0.8)
        break
      case 'bottom':
        angle = Math.atan2(90, 0)
        break
      default:
        angle = Math.atan2(0, -90)
        break
    }
  }
  ctxr.lineTo(endPoint.x, endPoint.y)
  // /6=> mặc định góc mũi tên là 60 độ
  ctxr.lineTo(
    endPoint.x - headlen * Math.cos(angle - Math.PI / 6),
    endPoint.y - headlen * Math.sin(angle - Math.PI / 6)
  )
  ctxr.moveTo(endPoint.x, endPoint.y)
  ctxr.lineTo(
    endPoint.x - headlen * Math.cos(angle + Math.PI / 6),
    endPoint.y - headlen * Math.sin(angle + Math.PI / 6)
  )
}
var controlPoint = 2
var isHorizontal = true
var direction
// vẽ đường các đường nối trong màn hình prototype
function drawCurvePrototype() {
  if (design_view_index == 1) {
    if (drag_prototype_endppoint && prototypePoint) {
      ctxr.beginPath()
      ctxr.strokeStyle = '#E14337'
      ctxr.lineWidth = 2
      ctxr.moveTo(prototypePoint.x, prototypePoint.y)

      // let controlPoint1 =
      ctxr.bezierCurveTo(
        prototypePoint.x +
        (drag_prototype_endppoint.x - prototypePoint.x) * 0.5,
        prototypePoint.y,
        prototypePoint.x +
        (drag_prototype_endppoint.x - prototypePoint.x) * 0.5,
        drag_prototype_endppoint.y,
        drag_prototype_endppoint.x,
        drag_prototype_endppoint.y
      )
      ctxr.stroke()
    }
    ctxr.beginPath()
    ctxr.lineWidth = 2
    //nếu là màn hình prototype
    listCurve = []
    for (let witem of wbase_list) {
      if (witem.GID == selected_list[0]?.GID) {
        ctxr.strokeStyle = '#1890FF'
      } else {
        ctxr.strokeStyle = '#1890FF50'
      }
      if (witem.PrototypeID != null && witem.PrototypeID != '') {
        let startPage = document.getElementById(witem.GID)
        let endPage = document.getElementById(witem.PrototypeID)
        if (endPage) {
          let startPosition = startPage.getBoundingClientRect()
          let endPosition = endPage.getBoundingClientRect()

          let listPoint1 = getPagePrototypePoint(startPage)
          let listPoint2 = getPagePrototypePoint(endPage)

          let _startPoint
          let _endPoint

          if (startPosition.x + startPosition.width < endPosition.x) {
            _startPoint = listPoint1.o2
            if (startPosition.y + startPosition.height < endPosition.y) {
              _endPoint = listPoint2.o1
              controlPoint = 1
              direction = 'bottom'
            } else if (startPosition.y > endPosition.y + endPosition.height) {
              _endPoint = listPoint2.o3
              controlPoint = 1
              direction = 'top'
            } else {
              _endPoint = listPoint2.o4
              controlPoint = 2
              direction = 'right'
            }
            isHorizontal = true
          } else if (startPosition.x > endPosition.x + endPosition.width) {
            _startPoint = listPoint1.o4
            if (startPosition.y + startPosition.height < endPosition.y) {
              _endPoint = listPoint2.o1
              controlPoint = 1
              direction = 'bottom'
            } else if (startPosition.y > endPosition.y + endPosition.height) {
              _endPoint = listPoint2.o3
              controlPoint = 1
              direction = 'top'
            } else {
              _endPoint = listPoint2.o2
              controlPoint = 2
              direction = 'left'
            }
            isHorizontal = true
          } else {
            if (startPosition.y > endPosition.y + endPosition.height) {
              _startPoint = listPoint1.o1
              _endPoint = listPoint2.o3
              controlPoint = 2
              isHorizontal = false
              direction = 'top'
            } else if (startPosition.y + startPosition.height < endPosition.y) {
              _startPoint = listPoint1.o3
              _endPoint = listPoint2.o1
              controlPoint = 2
              isHorizontal = false
              direction = 'bottom'
            } else {
              _startPoint = listPoint1.o2
              _endPoint = listPoint2.o2
              controlPoint = 1
              direction = 'top'
            }
          }

          let curve = new Path2D()

          curve.arc(_startPoint.x, _startPoint.y, 6 * scale, 0, 2 * Math.PI)

          curve.moveTo(_startPoint.x, _startPoint.y)
          if (controlPoint == 2) {
            if (isHorizontal) {
              curve.bezierCurveTo(
                _startPoint.x + (_endPoint.x - _startPoint.x) * 0.5,
                _startPoint.y,
                _startPoint.x + (_endPoint.x - _startPoint.x) * 0.5,
                _endPoint.y,
                _endPoint.x,
                _endPoint.y
              )
            } else {
              curve.bezierCurveTo(
                _startPoint.x,
                _endPoint.y + (_startPoint.y - _endPoint.y) / 2,
                _endPoint.x,
                _endPoint.y + (_startPoint.y - _endPoint.y) / 2,
                _endPoint.x,
                _endPoint.y
              )
            }
          } else {
            curve.quadraticCurveTo(
              _startPoint.x + (_endPoint.x - _startPoint.x) * 0.8,
              _startPoint.y,
              _endPoint.x,
              _endPoint.y
            )
          }

          drawArrow(curve, _startPoint, _endPoint)

          listCurve.push({
            curveValue: curve,
            startPoint: _startPoint,
            startPage: witem
          })
          ctxr.stroke(curve)
        } else {
          witem.PrototypeID = null
        }
      }
    }
  }
}

//list = [{ gid: gid, x: x, y: y, x1: x1, y1: y1 }]
function removeLines(list = []) {
  if (list.length > 0) {
    listLine = listLine.filter(e => !list.some(m => m.gid == e.gid))
    wdraw()
  }
}
//list = [{ gid: gid, t: t, x: x, y: y }]
function removeTexts(list = []) {
  if (list.length > 0) {
    listText = listText.filter(e => !list.some(m => m.gid == e.gid))
    wdraw()
  }
}
//list = [{ gid: gid, x: x, y: y, w: w, h: h }]
function removeRests(list = []) {
  if (list.length > 0) {
    listRect = listRect.filter(e => !list.some(m => m.gid == e.gid))
    wdraw()
  }
}
function removeAllRects() {
  listRect = []
  wdraw()
}
//list = [{ gid: gid, x: x, y: y, w: w, h: h }]
function removeRectHovers(list = []) {
  if (list.length > 0) {
    listRectHover = listRectHover.filter(e => !list.some(m => m.gid == e.gid))
    wdraw()
  }
}
function removeAllRectHovers() {
  listRectHover = []
  wdraw()
}
function removeAllRectselects() {
  listRectSelect = []
  wdraw()
}
function removeAllLine() {
  listLine = []
  wdraw()
}
function removeAllText() {
  listText = []
  wdraw()
}

function updateLines(list = []) {
  if (list.length > 0) {
    listLine = listLine.filter(e => !list.some(m => m.gid == e.gid))
    listLine.push(...list)
    wdraw()
  }
}
//list = [{ gid: gid, t: t, x: x, y: y }]
function updateTexts(list = []) {
  if (list.length > 0) {
    listText = listText.filter(e => !list.some(m => m.gid == e.gid))
    listText.push(...list)
    wdraw()
  }
}
//list = [{ gid: gid, x: x, y: y, w: w, h: h }]
function updateRects(list = []) {
  if (list.length > 0) {
    listRect = listRect.filter(e => !list.some(m => m.gid == e.gid))
    listRect.push(...list)
    wdraw()
  }
}

function updateRectHovers(list = []) {
  if (list.length > 0) {
    listRectHover = listRectHover.filter(e => !list.some(m => m.gid == e.gid))
    listRectHover.push(...list)
    wdraw()
  }
}

function updateRectSelects(list = []) {
  if (list.length > 0) {
    listRectSelect = listRectSelect.filter(e => !list.some(m => m.gid == e.gid))
    listRectSelect.push(...list)
    wdraw()
  }
}

function paintCanvas(check) {
  wdraw()
  l = leftx / scale - Math.floor(leftx / scale)
  t = topx / scale - Math.floor(topx / scale)
  //alert(l + " " +t);
  canvas.style.top = (t - 1) * scale + 'px'
  canvas.style.left = (l - 1) * scale + 'px'
  ////canvasr.style.top = (1-t) * scale + "px";
  ////canvasr.style.left = (1-l) * scale + "px";
  PageDA.settingsPage = true
  if (scale >= 16) {
    if (check) painLine(l, t)
  } else if (canvas) ctx.clearRect(0, 0, totalW, totalH)
  //
}

function painLine(l, t) {
  ctx.clearRect(0, 0, totalW, totalH)
  ctx.save()
  totalH = height + scale
  totalW = width + scale
  var maxf = totalW >= totalH ? totalW : totalH
  var minf = totalW >= totalH ? totalH : totalW
  canvas.width = totalW
  canvas.height = totalH
  ctx.beginPath()
  if (canvas.getContext) {
    var j = 0
    for (i = 0; i <= minf; i += scale) {
      ctx.moveTo(0, i + l + line)
      ctx.lineTo(totalW, i + l + line)
      ctx.moveTo(i + t + line, 0)
      ctx.lineTo(i + t + line, totalH)
      j = i
    }
    if (maxf == totalH)
      for (i = j; i <= maxf; i += scale) {
        ctx.moveTo(0, i + l + line)
        ctx.lineTo(totalW, i + l + line)
      }
    else
      for (i = j; i <= maxf; i += scale) {
        ctx.moveTo(i + t + line, 0)
        ctx.lineTo(i + t + line, totalH)
      }
  }
  ctx.strokeStyle = '#E8E8E8'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()
}

function doubleClickEvent(event) {
  console.log('doubleClickEvent ' + checkpad)
  is_dbclick = true
  if (tool_state === ToolState.move) {
    let element_path = [...event.path]
    if (PageDA.enableEdit) {
      let parent_index = element_path.findIndex(e => e.id === hover_wbase?.GID)
      let currentLevel = selected_list.length > 0 ? selected_list[0].Level : 1
      let target_element =
        element_path
          .slice(0, parent_index)
          .find(
            eHTML =>
              eHTML.classList?.contains('wbaseItem-value') &&
              eHTML.getAttribute('Level') == currentLevel + 1
          ) ?? element_path[parent_index]
      if (
        selected_list.length == 1 &&
        target_element?.id == selected_list[0].GID
      ) {
        if (target_element.classList.contains('w-text')) {
          target_element.querySelector('span').contentEditable = true
          target_element.querySelector('span').focus()
        } else if (event.target.localName == 'path') {
          selectPath?.remove()
          selectPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          )
          selectPath.setAttribute('parentid', selected_list[0].GID)
          selectPath.setAttribute('d', event.target.getAttribute('d'))
          selectPath.setAttribute(
            'stroke-width',
            1 / scale < 0.2 ? 0.2 : 1 / scale > 1 ? 1 : 1 / scale
          )
          selectPath.setAttribute('stroke', 'black')
          event.target.parentElement.appendChild(selectPath)
          let colorsSelectionList = document.getElementById(
            'colors_selection_list'
          )
          let pathIndex = Array.from(event.target.parentNode.children).indexOf(
            event.target
          )
          for (let i = 0; i < colorsSelectionList.childNodes.length; i++) {
            if (i == pathIndex) {
              colorsSelectionList.childNodes[i].style.backgroundColor =
                '#e6f7ff'
            } else {
              colorsSelectionList.childNodes[i].style.backgroundColor =
                'transparent'
            }
          }
        }
      } else {
        selectPath?.remove()
        selectPath = undefined
        let colorsSelectionList = document.getElementById(
          'colors_selection_list'
        )
        if (colorsSelectionList) {
          colorsSelectionList.childNodes.forEach(
            eHTML => (eHTML.style.backgroundColor = 'transparent')
          )
        }
        if (checkpad == 0) {
          if (element_path.some(ele => ele.id == 'canvas_view')) {
            if (
              target_element != document &&
              target_element &&
              target_element.classList?.contains('textfield')
            )
              target_element = target_element.parentElement
            if (clearAction) clearActionListFrom(action_index - 1)
            handleWbSelectedList(
              wbase_list.filter(element => element.GID === target_element?.id)
            )
          }
        } else {
          checkpad = 0
          updateUISelectBox()
        }
      }
    } else {
      if (element_path.some(ele => ele.id === 'canvas_view')) {
        if (
          target_element != document &&
          target_element.classList?.contains('textfield')
        )
          target_element = target_element.parentElement
        if (clearAction) clearActionListFrom(action_index - 1)
        handleWbSelectedList(
          wbase_list.filter(element => element.GID == target_element?.id)
        )
      }
    }
  }
}

function clickEvent(event) {
  console.log('clickEvent ' + checkpad)
  if (tool_state != ToolState.hand_tool) {
    positionScrollLeft()
    positionScrollTop()
    previousX = event.pageX
    previousY = event.pageY
    if (event.button == 2) {
      let popup_function = document.getElementById('wini_features')
      if (hover_wbase && selected_list.length == 0) {
        handleWbSelectedList([hover_wbase])
      }
      if (popup_function) {
        popup_function.remove()
      } else {
        setTimeout(function () {
          popupRightClick(event)
        }, 150)
      }
    } else if (keyid != 'z') {
      if (checkpad == 0) {
        if (event.target.closest('div[id="canvas_view"]')) {
          if (listCurve.length > 0) {
            let selectedPrototype = listCurve.find(_curve =>
              ctxr.isPointInStroke(_curve.curveValue, event.pageX, event.pageY)
            )
            if (selectedPrototype) {
              ctxr.strokeStyle = '#1890FF'
              ctxr.stroke(selectedPrototype.curveValue)
              handleWbSelectedList([selectedPrototype.startPage])
            } else {
              if (
                event.shiftKey &&
                hover_wbase.ParentID === select_box_parentID
              )
                handleWbSelectedList([...selected_list, hover_wbase])
              else handleWbSelectedList([hover_wbase])
            }
          } else {
            if (event.shiftKey && hover_wbase?.ParentID === select_box_parentID)
              handleWbSelectedList([...selected_list, hover_wbase])
            else handleWbSelectedList([hover_wbase])
          }
          if (
            event.target.localName == 'path' &&
            selectPath?.getAttribute('parentID') == select_box_parentID
          ) {
            selectPath?.remove()
            selectPath = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'path'
            )
            selectPath.setAttribute('parentID', selected_list[0].GID)
            selectPath.setAttribute('d', event.target.getAttribute('d'))
            selectPath.setAttribute(
              'stroke-width',
              1 / scale < 0.2 ? 0.2 : 1 / scale > 1 ? 1 : 1 / scale
            )
            selectPath.setAttribute('stroke', 'black')
            event.target.parentElement.appendChild(selectPath)
            let colorsSelectionList = document.getElementById(
              'colors_selection_list'
            )
            let pathIndex = Array.from(
              event.target.parentNode.children
            ).indexOf(event.target)
            for (let i = 0; i < colorsSelectionList.childNodes.length; i++) {
              if (i == pathIndex) {
                colorsSelectionList.childNodes[i].style.backgroundColor =
                  '#e6f7ff'
              } else {
                colorsSelectionList.childNodes[i].style.backgroundColor =
                  'transparent'
              }
            }
          } else {
            selectPath?.remove()
            selectPath = undefined
            let colorsSelectionList = document.getElementById(
              'colors_selection_list'
            )
            if (colorsSelectionList)
              colorsSelectionList.childNodes.forEach(
                eHTML => (eHTML.style.backgroundColor = 'transparent')
              )
          }
        }
      } else {
        checkpad = 0
        updateUISelectBox()
      }
    }
  }
}

function upListener(event) {
  // updateUIF12();
  if (document.activeElement.closest('.w-text') || (event.target.localName === 'input' && !event.target.readOnly))
    return
  left_view.resizing = false
  console.log('up ', checkpad, action_list)
  event.preventDefault()
  if (event.target?.classList?.contains('header_popup_skin')) {
    event.target.parentElement.removeAttribute('startOffset')
    return
  }
  let target_view = event.target.closest('div[id="canvas_view"]')
  if (instance_drag && target_view) {
    if (instance_drag.getAttribute('projectid')) {
      dragInstanceEnd(event)
    } else {
      let fileItem = FileDA.list.find(e => e.ID === instance_drag.fileid)
      const url = fileItem.Url.replaceAll(' ', '%20')
      if (url.endsWith('.svg') && fileItem.Size <= 2200) {
        var newRect = JSON.parse(JSON.stringify(WbClass.imgSvg))
        newRect.Name = url.split('/').pop().replace('.svg', '')
        newRect.AttributesItem.Content = url
      } else {
        newRect = JSON.parse(JSON.stringify(WbClass.rectangle))
        newRect.Name = 'Rectangle'
        newRect.Css = `background-image: url(${urlImg + url});`
      }
      FileDA.getImageSize(urlImg + url).then(async imgSize => {
        let offset = offsetScale(event.pageX, event.pageY)
        if (url.endsWith('.svg') && fileItem.Size <= 2200) {
          newRect.Css = (await createIcon({ url: urlImg + url })).style.cssText
        }
        let newObj = createWbaseHTML({
          w: imgSize.w,
          h: imgSize.h,
          x: offset.x,
          y: offset.y,
          parentid: parent.id?.length == 36 ? parent.id : wbase_parentID,
          newObj: newRect
        })
        WBaseDA.add({ listWb: [newObj] })
      })
    }
  } else if (sortLayer) {
    endDragSortLayer()
  } else if (drag_prototype_endppoint) {
    if (
      event.target.id != 'canvas_view' &&
      !event.target.contains(selected_list[0].value)
    ) {
      selected_list[0].PrototypeID = event.target.closest(
        '.wbaseItem-value[level="1"]'
      )?.id
      selected_list[0].ProtoType = 1 //On tap
      if (selected_list[0].JsonEventItem) {
        selected_list[0].JsonEventItem.push(
          { Name: 'Prototype', Data: [] },
          { Name: 'Animation', Data: {} }
        )
      } else {
        selected_list[0].JsonEventItem = [
          { Name: 'Prototype', Data: [] },
          { Name: 'Animation', Data: {} }
        ]
      }
      WBaseDA.edit(selected_list, EnumObj.wBaseAttribute)
      update_UI_prototypeView()
    } else {
    }
    drag_prototype_endppoint = null
  } else if (target_view && !document.getElementById('wini_features')) {
    console.log(' zoom' + keyid)
    if (keyid == 'z' && !(event.metaKey || (!isMac && event.ctrlKey))) {
      if (event.altKey && scale > min_scale) {
        // zoom -
        console.log(' zoom -')
        zoom_point = {
          x: (previousX - leftx) / scale,
          y: (previousY - topx) / scale
        }
        scale = scale / 2
        scale = Math.max(min_scale, Math.min(max_scale, scale))
        scrollScale(
          previousX - zoom_point.x * scale,
          previousY - zoom_point.y * scale
        )
        input_scale_set(scale * 100)
        divSection.style.transform = `scale(${scale}, ${scale})`
        listRect = []
        paintCanvas(true)
      } else if (scale < max_scale) {
        //zoom +
        console.log(' zoom +')
        if (objr) {
          var td = offsetScale(objr.x + objr.w / 2, objr.y + objr.h / 2)
          scale =
            scale * Math.min(objscroll.w / objr.w, objscroll.h / objr.h) * 0.9
          scale = Math.max(min_scale, Math.min(max_scale, scale))
          scrollScale(width / 2 - td.x * scale, height / 2 - td.y * scale, true)
        } else {
          zoom_point = {
            x: (event.pageX - leftx) / scale,
            y: (event.pageY - topx) / scale
          }
          scale = scale * 2
          scale = Math.max(min_scale, Math.min(max_scale, scale))
          scrollScale(
            event.pageX - zoom_point.x * scale,
            event.pageY - zoom_point.y * scale
          )
        }
        input_scale_set(scale * 100)
        divSection.style.transform = `scale(${scale}, ${scale})`
        listRect = []
        paintCanvas(true)
      }
      //keyid = "escape";
    } else if (
      ToolState.create_new_type.some(e => e === tool_state) &&
      checkpad == 0
    ) {
      let offset_convert = offsetScale(
        Math.min(minx, event.pageX),
        Math.min(miny, event.pageY)
      )
      let parentHTML = event.target.closest(
        '.w-container,.w-textformfield,.w-button,.w-table'
      )
      createWbaseHTML({
        parentid: parentHTML?.id ?? wbase_parentID,
        x: offset_convert.x,
        y: offset_convert.y
      })
    } else if (WBaseDA.enumEvent === EnumEvent.add) {
      handleCompleteAddWbase()
    } else if (!checkpad) {
      downListener(event)
    } else if (ToolState.resize_type.some(e => tool_state === e)) {
      debugger
    } else if (event.altKey) {
      dragAltEnd()
    } else {
      dragWbaseEnd()
    }
  }
  hidePopup(event)
  //
  // switch (WBaseDA.enumEvent) {
  //   case EnumEvent.copy:
  //     WBaseDA.copy(WBaseDA.listData)
  //     if (window.getComputedStyle(assets_view).display != 'none') {
  //       initUIAssetView()
  //     }
  //     break
  //   case EnumEvent.add:
  //     let list_add = []
  //     if (WBaseDA.listData.length > 0) {
  //       list_add = WBaseDA.listData
  //     } else {
  //       list_add = selected_list.filter(wb => {
  //         wb.Css = wb.value.style.cssText
  //         return !wb.value.classList.contains('w-text')
  //       })
  //     }
  //     // ! add wbase thường
  //     // action_list[action_index].selected = [
  //     //   ...list_add
  //     //     .filter(e => e.ParentID === selected_list[0].ParentID)
  //     //     .map(wbasItem => JSON.parse(JSON.stringify(wbasItem)))
  //     // ]
  //     if (list_add.length > 0) {
  //       // let isUpdateTable = list_add.some(e => e.CateID === EnumCate.table)
  //       // WBaseDA.add(
  //       //   list_add,
  //       //   undefined,
  //       //   isUpdateTable ? EnumEvent.edit : EnumEvent.add,
  //       //   isUpdateTable ? EnumObj.wBaseAttribute : EnumObj.wBase
  //       // )
  //       if (
  //         list_add[0].value.closest(`.w-table[level="${list_add[0].Level}"]`)
  //       ) {
  //       } else if (
  //         list_add[0].value.closest(
  //           `:is(.w-col, .w-row)[level="${list_add[0].Level}"]`
  //         )
  //       ) {
  //         WBaseDA.parent([
  //           wbase_list.find(e => e.GID === list_add[0].ParentID),
  //           ...list_add
  //         ])
  //       } else {
  //         WBaseDA.add({
  //           listWb: list_add
  //         })
  //       }
  //     }
  //     break
  //   case EnumEvent.edit:
  //     let listUpdate = []
  //     if (
  //       !$(selected_list[0].value).parents(`.wbaseItem-value[iswini]`)
  //         ?.length ||
  //       selected_list[0].IsInstance ||
  //       selected_list[0].IsWini
  //     ) {
  //       for (let wb of selected_list) {
  //         if (window.getComputedStyle(wb.value).position === 'absolute')
  //           updateConstraints(wb.value)
  //         if (wb.IsWini && !wb.value.classList.contains('w-variant')) {
  //           let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === wb.GID)
  //           let cssRule = StyleDA.docStyleSheets.find(rule => {
  //             let selector = [...divSection.querySelectorAll(rule.selectorText)]
  //             const check = selector.includes(wb.value)
  //             if (check)
  //               selector.forEach(e => {
  //                 if (wb.value.getAttribute('width-type')) {
  //                   e.setAttribute(
  //                     'width-type',
  //                     wb.value.getAttribute('width-type')
  //                   )
  //                 } else {
  //                   e.removeAttribute('width-type')
  //                 }
  //                 if (wb.value.getAttribute('height-type')) {
  //                   e.setAttribute(
  //                     'height-type',
  //                     wb.value.getAttribute('height-type')
  //                   )
  //                 } else {
  //                   e.removeAttribute('height-type')
  //                 }
  //               })
  //             return check
  //           })
  //           if (wb.value.style.width && wb.value.style.width !== 'auto') {
  //             cssRule.style.width = wb.value.style.width
  //             wb.value.style.width = null
  //           }
  //           if (wb.value.style.height && wb.value.style.height !== 'auto') {
  //             cssRule.style.height = wb.value.style.height
  //             wb.value.style.height = null
  //           }
  //           if (wb.value.style.flex) cssRule.style.flex = wb.value.style.flex
  //           wb.value.style.flex = null
  //           cssItem.Css = cssItem.Css.replace(
  //             new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
  //             cssRule.cssText
  //           )
  //           StyleDA.editStyleSheet(cssItem)
  //         }
  //         wb.Css = wb.value.style.cssText
  //         listUpdate.push(wb)
  //       }
  //     } else {
  //       let pWbComponent = selected_list[0].value.closest(
  //         `.wbaseItem-value[iswini]`
  //       )
  //       let cssItem = StyleDA.cssStyleSheets.find(
  //         e => e.GID === pWbComponent.id
  //       )
  //       for (let wb of selected_list) {
  //         if (window.getComputedStyle(wb.value).position === 'absolute')
  //           updateConstraints(wb.value)
  //         let cssRule = StyleDA.docStyleSheets.find(rule => {
  //           let selector = [...divSection.querySelectorAll(rule.selectorText)]
  //           const check = selector.includes(wb.value)
  //           if (check)
  //             selector.forEach(e => {
  //               if (wb.value.getAttribute('width-type')) {
  //                 e.setAttribute(
  //                   'width-type',
  //                   wb.value.getAttribute('width-type')
  //                 )
  //               } else {
  //                 e.removeAttribute('width-type')
  //               }
  //               if (wb.value.getAttribute('height-type')) {
  //                 e.setAttribute(
  //                   'height-type',
  //                   wb.value.getAttribute('height-type')
  //                 )
  //               } else {
  //                 e.removeAttribute('height-type')
  //               }
  //             })
  //           return check
  //         })
  //         if (wb.value.style.width) cssRule.style.width = wb.value.style.width
  //         if (wb.value.style.height)
  //           cssRule.style.height = wb.value.style.height
  //         if (wb.value.style.flex) cssRule.style.flex = wb.value.style.flex
  //         if (wb.value.style.top) cssRule.style.top = wb.value.style.top
  //         if (wb.value.style.right) cssRule.style.right = wb.value.style.right
  //         if (wb.value.style.bottom)
  //           cssRule.style.bottom = wb.value.style.bottom
  //         if (wb.value.style.left) cssRule.style.left = wb.value.style.left
  //         if (wb.value.style.transform)
  //           cssRule.style.transform = wb.value.style.transform
  //         wb.value.style = null
  //         cssItem.Css = cssItem.Css.replace(
  //           new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
  //           cssRule.cssText
  //         )
  //         wb.Css = null
  //       }
  //       StyleDA.editStyleSheet(cssItem)
  //     }
  //     if (listUpdate.length) WBaseDA.edit(listUpdate, EnumObj.wBase)
  //     reloadEditOffsetBlock()
  //     break
  //   case EnumEvent.parent:
  //     let list_update = []
  //     if (WBaseDA.listData.length == 0) {
  //       if (selected_list[0].ParentID != wbase_parentID) {
  //         list_update.push(
  //           wbase_list.find(e => e.GID == selected_list[0].ParentID)
  //         )
  //       }
  //       list_update.push(...selected_list)
  //     } else {
  //       list_update = WBaseDA.listData
  //     }
  //     WBaseDA.parent(list_update)
  //     break
  //   default:
  //     break
  // }
  WBaseDA.enumEvent = null
  // WBaseDA.listData = []
  // drag_start_list = []
  checkpad = 0
  dragTime = 0
  objr = null
  if (target_view === divMain) {
    let mouseOffset = offsetScale(event.pageX, event.pageY)
    let rectOffset
    if (select_box) {
      rectOffset = offsetScale(select_box.x, select_box.y)
      rectOffset.w = select_box.w / scale
      rectOffset.h = select_box.h / scale
    }
    WiniIO.emitMouse({
      xMouse: mouseOffset.x,
      yMouse: mouseOffset.y,
      x: rectOffset?.x,
      y: rectOffset?.y,
      w: rectOffset?.w,
      h: rectOffset?.h
    })
  }
  document.getElementById('popup_img_document')?.removeAttribute('offset')
  document.body.removeAttribute('style')
  if (instance_drag && target_view !== 'canvas_view') {
    instance_drag?.remove()
    instance_drag = null
  }
  PageDA.saveSettingsPage()
}

function elementIsInRange(element, range, checkAll = false) {
  // nếu checkAllObj = true thì phải toàn bộ Obj nằm trong range hàm mới return true
  let parentElemetList = [...$(element).parents('.wbaseItem-value')]

  let _parentX = 0
  let _parentY = 0
  if (parentElemetList.length > 0) {
    _parentX = parentElemetList.map(e => e.offsetLeft).reduce((a, b) => a + b)
    _parentY = parentElemetList.map(e => e.offsetTop).reduce((a, b) => a + b)
  }
  let originOffset = {
    xMin: element.offsetLeft + _parentX,
    yMin: element.offsetTop + _parentY,
    xMax: element.offsetLeft + _parentX + element.offsetWidth,
    yMax: element.offsetTop + _parentY + element.offsetHeight
  }
  if (checkAll) {
    if (
      originOffset.xMin >= range.xMin &&
      originOffset.xMax <= range.xMax &&
      originOffset.yMin >= range.yMin &&
      originOffset.yMax <= range.yMax
    )
      return true
  } else {
    if (
      isInRange(originOffset.xMin, range.xMin, range.xMax) &&
      (isInRange(range.yMax, originOffset.yMin, originOffset.yMax) ||
        isInRange(originOffset.yMax, range.yMin, range.yMax))
    ) {
      return true
    }
    if (
      isInRange(originOffset.yMin, range.yMin, range.yMax) &&
      (isInRange(range.xMax, originOffset.xMin, originOffset.xMax) ||
        isInRange(originOffset.xMax, range.xMin, range.xMax))
    ) {
      return true
    }
    if (
      isInRange(originOffset.xMax, range.xMin, range.xMax) &&
      (isInRange(originOffset.yMax, range.yMin, range.yMax) ||
        isInRange(range.yMax, originOffset.yMin, originOffset.yMax))
    ) {
      return true
    }
    if (
      isInRange(originOffset.yMax, range.yMin, range.yMax) &&
      (isInRange(originOffset.xMax, range.xMin, range.xMax) ||
        isInRange(range.xMax, originOffset.xMin, originOffset.xMax))
    ) {
      return true
    }
  }
  return false
}

function isInRange(number, min, max, isEqual = false) {
  if (isEqual) return number >= min && number <= max
  else return number > min && number < max
}

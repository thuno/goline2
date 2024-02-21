function setupRightView() {
  // setup tab change
  // create elements in design view
  right_view.onkeydown = function (e) {
    if (e.key === 'Enter' && document.activeElement.localName === 'input') {
      document.activeElement.blur()
    }
  }
  updateUIDesignView()
}

$('body').on('click', '.tab_right', function () {
  if (design_view_index != $(this).data('index')) {
    design_view_index = $(this).data('index')
    let x = document.getElementsByClassName('right_tab_view')
    for (let i = 0; i < x.length; i++) {
      x[i].style.display = 'none'
    }
    document.getElementById(this.innerHTML.trim()).style.display = 'block'
    wdraw()
    for (let tab of document.getElementsByClassName('tab_right')) {
      tab.style.opacity = 0.7
    }
    this.style.opacity = 1
    switch (design_view_index) {
      case 0:
        updateUIDesignView()
        break
      case 1:
        update_UI_prototypeView()
        break
      case 2:
        create_stateContainer()
        break
      default:
        break
    }
  }
})

// update UI design view when selected change
function updateUIDesignView() {
  let scrollY = design_view.scrollTop
  let listEditContainer = document.createDocumentFragment()
  if (selected_list.length === 0) {
    let editCanvasBground = createCanvasBackground()
    listEditContainer.appendChild(editCanvasBground)
    let winiRes = winiResponsive()
    listEditContainer.appendChild(winiRes)
    let breakpoint = createBreakpoint()
    listEditContainer.appendChild(breakpoint)
    let localSkins = createSelectionSkins()
    listEditContainer.appendChild(localSkins)
  } else {
    let editAlign = EditAlignBlock()
    let editSizePosition = EditOffsetBlock()
    // let selectClass = selectionClass()
    listEditContainer.appendChild(editAlign)
    listEditContainer.appendChild(editSizePosition)
    // listEditContainer.appendChild(selectClass)
    // if (selected_list.length === 1 && selected_list[0].IsWini && selected_list[0].CateID !== EnumCate.variant) {
    //   let editVariables = createVariables();
    //   listEditContainer.appendChild(editVariables);
    // }
    if (select_box_parentID != wbase_parentID &&
      selected_list.some(e => window.getComputedStyle(e.value).position === 'absolute')) {
      var editConstraints = EditConstraintsBlock()
      listEditContainer.appendChild(editConstraints)
    }
    if (selected_list.every(wb => wb.Level > 1 && window.getComputedStyle(wb.value).position !== 'absolute')) {
      let framePage = selected_list[0].value.closest(
        `.w-form[level="1"], .w-container[level="1"], w-variant > .w-form[level="2"], w-variant > .w-container[level="2"]`
      )
      if (framePage) {
        let selectColByBrp = colNumberByBrp(framePage.getAttribute('width-type') !== 'fit')
        listEditContainer.appendChild(selectColByBrp)
      }
    }
    if (selected_list.some(wb => WbClass.parent.some(e => wb.value.classList.contains(e))) || selected_list.length > 1) {
      let editAutoLayout = EditLayoutBlock()
      listEditContainer.appendChild(editAutoLayout)
    }
    //
    if (selected_list.some(wb => ['w-text', 'w-svg'].every(e => !wb.value.classList.contains(e)))) {
      let editBackground = EditBackgroundBlock()
      listEditContainer.appendChild(editBackground)
    }
    if (selected_list.filter(wb => wb.value.classList.contains('w-svg')).length === 1) {
      let editIconColor = EditIconColorBlock()
      listEditContainer.appendChild(editIconColor)
    }
    if (selected_list.some(wb => ['w-text', 'w-textformfield'].some(e => wb.value.classList.contains(e)))) {
      let editTextStyle = EditTypoBlock()
      listEditContainer.appendChild(editTextStyle)
    }
    if (selected_list.some(wb => ['w-checkbox', ...WbClass.borderEffect].some(e => wb.value.classList.contains(e)))) {
      let editBorder = EditBorderBlock()
      listEditContainer.appendChild(editBorder)
    }
    if (selected_list.some(wb => WbClass.borderEffect.some(e => wb.value.classList.contains(e)))) {
      let editEffect = EditEffectBlock()
      listEditContainer.appendChild(editEffect)
    }
    // let editVariants = createEditVariants();
    // listEditContainer.appendChild(editVariants);
  }
  design_view.replaceChildren(listEditContainer)
  if (selected_list.some(
    wb => [...wb.value.classList].some(cls => cls.startsWith('w-st')) &&
      wb.value.closest(`.wbaseItem-value[isinstance]:not(*[level="${wb.Level}"])`))
  ) {
    design_view.querySelectorAll('.uneditable-instance').forEach(e => {
      e.style.pointerEvents = 'none'
      e.querySelectorAll('input').forEach(eInput => (eInput.disabled = true))
    })
    if (editConstraints) editConstraints.style.pointerEvents = 'none'
  }
  design_view.scrollTo({
    top: scrollY,
    behavior: 'smooth'
  })
}

// edit canvas background color
function createCanvasBackground() {
  var canvas_view_background = document.createElement('div')
  canvas_view_background.id = 'canvas_view_background'
  canvas_view_background.className = 'col'
  canvas_view_background.style.width = '100%'
  canvas_view_background.style.borderBottom = '1px solid #e5e5e5'

  canvas_view_background.innerHTML = `<p class="semibold1" style="margin: 16px 16px 4px 16px">Background</p>
  <div class="row change-color" style="height: 32px; width: 148px; margin: 6px 12px; padding: 0 4px; border: 1.5px solid transparent; overflow: hidden; border-radius: 2px">
    <div style="width: 16px; height: 16px; background-color: #e5e5e5; border-radius: 2px; margin-right: 8px"></div>
    <input class="regular1 edit-color" value='E5E5E5' style="height: 100%; minWidth: 0;color: #595959;flex: 1;padding: 4px; border: none;border-right: 1.5px solid transparent"/>
    <input class="regular1 edit-opacity" value='100%' style="height: 100%; width: 40px;color: #595959;flex: 1;padding: 4px; border: none"/>
  </div>`
  $(canvas_view_background).on('focus', '.edit-color', function (ev) {
    ev.target.style.outline = 'none'
    ev.target.style.borderRightColor = '#F3F3F3'
    ev.target.parentElement.style.borderColor = '#1890FF'
    ev.target.setSelectionRange(0, ev.target.value.length)
  })
  $(canvas_view_background).on('blur', '.edit-color', function (ev) {
    ev.target.style.borderRightColor = 'transparent'
    ev.target.parentElement.style.borderColor = 'transparent'
  })
  $(canvas_view_background).on('focus', '.edit-opacity', function (ev) {
    ev.target.style.outline = 'none'
    ev.target.parentElement.style.borderColor = '#1890FF'
    ev.target.setSelectionRange(0, ev.target.value.length)
  })
  $(canvas_view_background).on('blur', '.edit-opacity', function (ev) {
    ev.target.parentElement.style.borderColor = 'transparent'
  })
  $(canvas_view_background).on('mouseover', '.change-color', function () {
    if (this.lastChild != document.activeElement) {
      this.style.borderColor = '#F3F3F3'
      this.childNodes[1].style.borderRightColor = '#F3F3F3'
    }
  })
  $(canvas_view_background).on('mouseout', '.change-color', function () {
    if (this.lastChild != document.activeElement) {
      this.style.borderColor = 'transparent'
      this.childNodes[1].style.borderRightColor = 'transparent'
    }
  })
  return canvas_view_background
}

// edit align UI
function EditAlignBlock() {
  let editAlignContainer = document.createElement('div')
  editAlignContainer.id = 'edit_align_div'
  let isEnable = selected_list.every(
    wb =>
      ((selected_list.length > 1 || wb.Level > 1) &&
        window.getComputedStyle(wb.value).position === 'absolute') ||
      wb.value.classList.contains('w-block') ||
      wb.value.querySelector(':scope > .fixed-position')
  )
  editAlignContainer.setAttribute('enable', isEnable)
  editAlignContainer.replaceChildren(
    ...[
      'align left',
      'align horizontal center',
      'align right',
      'align top',
      'align vertical center',
      'align bottom'
    ].map(alignType => {
      let btnAlign = document.createElement('img')
      btnAlign.className = 'img-button size-32'
      if (isEnable)
        btnAlign.onclick = function () {
          handleEditAlign(alignType)
          reloadEditOffsetBlock()
          reloadEditConstraintsBlock()
        }
      return btnAlign
    })
  )
  return editAlignContainer
}

function reloadEditAlignBlock() {
  let newEditAlign = EditAlignBlock()
  document.getElementById('edit_align_div').replaceWith(newEditAlign)
}

// edit position UI
function EditOffsetBlock() {
  let edit_size_position_div = document.createElement('div')
  edit_size_position_div.id = 'edit_size_position_div'
  edit_size_position_div.className = 'edit-container col'
  if (
    select_box_parentID === wbase_parentID &&
    selected_list.every(
      e => !e.IsInstance && e.value.classList.contains('w-container')
    )
  ) {
    let pageDeviceContainer = document.createElement('div')
    pageDeviceContainer.className = 'page-device-container row'
    let btn_select_frame_size = document.createElement('button')
    pageDeviceContainer.appendChild(btn_select_frame_size)
    btn_select_frame_size.onclick = function (e) {
      e.stopPropagation()
      let popup = document.createElement('div')
      popup.className = 'popup_select_device col wini_popup popup_remove'
      for (let i = 0; i < listDevice.length; i++) {
        let col = document.createElement('nav')
        col.className = 'col'
        if (i + 1 != listDevice.length)
          col.style.borderBottom = '0.5px solid #e5e5e5'
        for (let device of listDevice[i]) {
          let option = document.createElement('div')
          option.className = 'w-device-option-tile'
          option.onclick = function (ev) {
            ev.stopPropagation()
            handleEditOffset({ width: device.Width, height: device.Height })
            popup.remove()
            reloadEditOffsetBlock()
          }
          option.innerHTML = `<i class="fa-solid fa-check" style="visibility: ${btn_title.innerHTML === device.Name ? 'visible' : 'hidden'
            }"></i><span>${device.Name}</span><span>${device.Width}x${device.Height
            }</span>`
          col.appendChild(option)
        }
        popup.appendChild(col)
      }
      document.getElementById('body').appendChild(popup)
      if (
        popup.getBoundingClientRect().bottom >
        document.body.getBoundingClientRect().bottom
      ) {
        popup.style.height = `${document.body.getBoundingClientRect().bottom -
          popup.getBoundingClientRect().y
          }px`
      }
    }
    let listSize = selected_list
      .filter(wb => wb.value.classList.contains('w-container'))
      .filterAndMap(
        wb =>
          `${parseInt(wb.value.offsetWidth)}x${parseInt(wb.value.offsetHeight)}`
      )
    btn_select_frame_size.innerHTML = `<p class="semibold1">${listSize.length === 1
      ? listDevice
        .reduce((a, b) => a.concat(b))
        .find(device => `${device.Width}x${device.Height}` === listSize[0])
        ?.Name ?? 'Device size'
      : 'Device size'
      }</p><i class="fa-solid fa-chevron-down fa-2xs"></i>`
    edit_size_position_div.appendChild(pageDeviceContainer)
  }

  //
  let editXYContainer = document.createElement('div')
  editXYContainer.className = 'row'
  // input edit left position
  let list_offsetX = selected_list.filterAndMap(wb =>
    `${getWBaseOffset(wb).x}`.replace('.00', '')
  )
  let edit_left = _textField({
    id: 'edit_position_item_left',
    label: 'X',
    value: list_offsetX.length == 1 ? list_offsetX[0] : 'mixed',
    onBlur: function (ev) {
      let newValue = parseFloat(ev.target.value)
      if (!isNaN(newValue)) {
        handleEditOffset({ x: newValue })
      }
    }
  })
  // input edit right position
  let list_offsetY = selected_list.filterAndMap(wb =>
    `${getWBaseOffset(wb).y}`.replace('.00', '')
  )
  let edit_top = _textField({
    id: 'edit_position_item_top',
    label: 'Y',
    value: list_offsetY.length == 1 ? list_offsetY[0] : 'mixed',
    onBlur: function (ev) {
      let newValue = parseFloat(ev.target.value)
      if (!isNaN(newValue)) {
        handleEditOffset({ y: newValue })
      }
    }
  })
  editXYContainer.replaceChildren(edit_left, edit_top)
  let parentHTML = divSection.querySelector(
    `.wbaseItem-value.w-container[id="${select_box_parentID}"]`
  )
  if (parentHTML && window.getComputedStyle(parentHTML).display.match('flex')) {
    let isFixPos = selected_list.every(e =>
      e.value.classList.contains('fixed-position')
    )
    let iconFixPos = document.createElement('img')
    iconFixPos.className = `img-button size-28 tlwh-option ${isFixPos ? ' toggle' : ''
      } ${selected_list.some(
        wb =>
          !wb.value.classList.contains('w-variant') &&
          wb.value.closest('.wbaseItem-value[iswini]')
      )
        ? ' disabled'
        : ''
      }`
    iconFixPos.src =
      'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/fix_position.svg'
    edit_top.lastChild.disabled = !isFixPos
    edit_left.lastChild.disabled = !isFixPos
    iconFixPos.onclick = function () {
      isFixPos = !isFixPos
      handleEditOffset({ fixPosition: isFixPos })
      if (isFixPos) this.classList.add('toggle')
      else this.classList.remove('toggle')
      edit_top.lastChild.disabled = !isFixPos
      edit_left.lastChild.disabled = !isFixPos
      reloadEditAlignBlock()
      reloadEditOffsetBlock()
      reloadEditConstraintsBlock()
    }
    editXYContainer.appendChild(iconFixPos)
  }
  edit_size_position_div.appendChild(editXYContainer)
  //
  //
  let editWHContainer = document.createElement('div')
  editWHContainer.className = 'row uneditable-instance'
  // input edit width
  let list_width = selected_list.filterAndMap(e => e.value.offsetWidth)
  let edit_width = _textField({
    id: 'edit_frame_item_w',
    label: 'W',
    value: list_width.length === 1 ? list_width[0] : 'mixed',
    onBlur: function (ev) {
      let newValue = parseFloat(ev.target.value)
      if (!isNaN(newValue)) {
        handleEditOffset({ width: newValue, ratioWH: isRatio })
      }
    }
  })
  // input edit height
  let list_height = selected_list.filterAndMap(e => e.value.offsetHeight)
  let edit_height = _textField({
    id: 'edit_frame_item_h',
    label: 'H',
    value: list_height.length == 1 ? list_height[0] : 'mixed',
    onBlur: function (ev) {
      let newValue = parseFloat(ev.target.value)
      if (!isNaN(newValue)) {
        handleEditOffset({ height: newValue, ratioWH: isRatio })
      }
    }
  })
  let isRatio = selected_list.some(wb =>
    WbClass.scale.some(e => wb.value.classList.contains(e))
  )
  let icon_ratioWH = document.createElement('img')
  icon_ratioWH.src = `https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/${isRatio ? 'ratioWH' : 'un_ratioWH'
    }.svg`
  icon_ratioWH.className =
    'img-button size-28 tlwh-option' + (isRatio ? ' toggle' : '')
  if (!isRatio) {
    icon_ratioWH.onclick = function () {
      isRatio = !isRatio
      this.src = `https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/${isRatio ? 'ratioWH' : 'un_ratioWH'
        }.svg`
      if (isRatio) this.classList.add('toggle')
      else this.classList.remove('toggle')
    }
  }
  editWHContainer.replaceChildren(edit_width, edit_height, icon_ratioWH)
  edit_size_position_div.appendChild(editWHContainer)

  if (
    selected_list.every(wb => {
      let computeSt = window.getComputedStyle(wb.value)
      return (
        WbClass.scale.every(e => !wb.value.classList.contains(e)) &&
        (computeSt.display.match(/(flex|table)/g) ||
          computeSt.position !== 'absolute')
      )
    })
  ) {
    let resizeContainer = document.createElement('div')
    resizeContainer.className = 'row uneditable-instance'
    resizeContainer.style.height = '32px'
    const initResizeW = function () {
      let vl = selected_list.filterAndMap(
        wb => wb.value.getAttribute('width-type') ?? 'fixed'
      )
      vl = vl.length > 1 ? 'mixed' : vl[0] === 'fit' ? 'hug' : vl[0]
      edit_width.lastChild.disabled = vl !== 'fixed'
      icon_ratioWH.style.display = vl === 'fixed' ? null : 'none'
      return vl
    }
    let resizeWBtn = _btnSelectResizeType(true, initResizeW())
    const initResizeH = function () {
      let vl = selected_list.filterAndMap(
        wb => wb.value.getAttribute('height-type') ?? 'fixed'
      )
      vl = vl.length > 1 ? 'mixed' : vl[0] === 'fit' ? 'hug' : vl[0]
      edit_height.lastChild.disabled = vl !== 'fixed'
      icon_ratioWH.style.display ??= vl === 'fixed' ? null : 'none'
      return vl
    }
    let resizeHBtn = _btnSelectResizeType(false, initResizeH())
    resizeContainer.replaceChildren(resizeWBtn, resizeHBtn)
    edit_size_position_div.appendChild(resizeContainer)
  }
  // input edit radius
  const allowRadius = [
    EnumCate.rectangle,
    EnumCate.frame,
    EnumCate.form,
    EnumCate.textformfield,
    EnumCate.button
  ]
  let showInputRadius = selected_list.filter(wb =>
    allowRadius.some(ct => wb.CateID === ct)
  )
  let radiusContainer = document.createElement('div')
  radiusContainer.className = 'row'
  // input edit rotate
  let edit_rotate = _textField({
    icon: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/rotate_rect.svg',
    value: 0
  })
  if (showInputRadius.length > 0) {
    let list_radius_value = showInputRadius.map(e =>
      window
        .getComputedStyle(e.value)
        .borderRadius.split(' ')
        .map(brvl => parseFloat(brvl.replace('px')))
    )
    list_radius_value = [].concat(...list_radius_value).filterAndMap()
    let edit_radius = _textField({
      icon: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/radius_rect.svg',
      value: list_radius_value.length == 1 ? list_radius_value[0] : 'mixed',
      onBlur: function (ev) {
        let newValue = parseFloat(ev.target.value)
        if (isNaN(newValue)) {
          let list_radius_value = list_seleted_radius.map(e => [
            e.StyleItem.FrameItem.TopLeft,
            e.StyleItem.FrameItem.TopRight,
            e.StyleItem.FrameItem.BottomLeft,
            e.StyleItem.FrameItem.BottomRight
          ])
          list_radius_value = [].concat(...list_radius_value).filterAndMap()
          ev.target.value =
            list_radius_value.length == 1 ? list_radius_value[0] : 'mixed'
        } else {
          handleEditOffset({ radius: newValue })
          _row_radius_detail
            .querySelectorAll(':scope > input')
            .forEach(i => (i.value = newValue))
        }
      }
    })
    let toggleRadiusDetails = document.createElement('img')
    toggleRadiusDetails.setAttribute('show-details', false)
    toggleRadiusDetails.className = 'radius-details img-button size-24'
    toggleRadiusDetails.onclick = function () {
      toggleRadiusDetails.setAttribute(
        'show-details',
        toggleRadiusDetails.getAttribute('show-details') != 'true'
      )
      edit_radius.style.pointerEvents =
        toggleRadiusDetails.getAttribute('show-details') == 'true'
          ? 'none'
          : 'auto'
    }
    radiusContainer.replaceChildren(
      edit_rotate,
      edit_radius,
      toggleRadiusDetails
    )
    edit_size_position_div.appendChild(radiusContainer)
    // fifth line contain 4 rect radius topleft, topright, botleft, botright
    let _row_radius_detail = document.createElement('div')
    _row_radius_detail.id = 'row_radius_detail'
    let icon_HTML = document.createElement('img')
    icon_HTML.src =
      'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/radius_rect.svg'
    icon_HTML.className = 'img-button size-24'
    _row_radius_detail.replaceChildren(
      icon_HTML,
      ...[
        'borderTopLeftRadius',
        'borderTopRightRadius',
        'borderBottomLeftRadius',
        'borderBottomRightRadius'
      ].map(radiusProp => {
        let radiusInputDetail = document.createElement('input')
        let rvalue = showInputRadius.filterAndMap(e =>
          window.getComputedStyle(e.value)[radiusProp].replace('px', '')
        )
        radiusInputDetail.value = rvalue.length === 1 ? rvalue[0] : 'mixed'
        radiusInputDetail.onfocus = function () {
          this.setSelectionRange(0, this.value.length)
        }
        return radiusInputDetail
      })
    )
    $('body').on(
      'blur',
      '#row_radius_detail > input:nth-child(2)',
      function () {
        let newValue = parseFloat(this.value)
        if (isNaN(newValue)) {
          let list_top_left_value = selected_list
            .filter(e => e.StyleItem.FrameItem?.TopLeft != undefined)
            .map(e => e.StyleItem.FrameItem.TopLeft)
          let top_left_value = list_top_left_value[0]
          list_top_left_value = list_top_left_value.filter(
            e => e != top_left_value
          )
          this.value =
            list_top_left_value.length == 0 ? top_left_value : 'mixed'
        } else {
          handleEditOffset({ radiusTL: newValue })
          edit_radius.lastChild.value =
            [
              ..._row_radius_detail.querySelectorAll(':scope > input')
            ].filterAndMap(i => i.value).length > 1
              ? 'mixed'
              : this.value
        }
      }
    )
    $('body').on(
      'blur',
      '#row_radius_detail > input:nth-child(3)',
      function () {
        let newValue = parseFloat(this.value)
        if (isNaN(newValue)) {
          let list_top_right_value = selected_list
            .filter(e => e.StyleItem.FrameItem?.Topright != undefined)
            .map(e => e.StyleItem.FrameItem.TopRight)
          let top_right_value = list_top_right_value[0]
          list_top_right_value = list_top_right_value.filter(
            e => e != top_right_value
          )
          this.value =
            list_top_right_value.length == 0 ? top_right_value : 'mixed'
        } else {
          handleEditOffset({ radiusTR: newValue })
          edit_radius.lastChild.value =
            [
              ..._row_radius_detail.querySelectorAll(':scope > input')
            ].filterAndMap(i => i.value).length > 1
              ? 'mixed'
              : this.value
        }
      }
    )
    $('body').on(
      'blur',
      '#row_radius_detail > input:nth-child(4)',
      function () {
        let newValue = parseFloat(this.value)
        if (isNaN(newValue)) {
          let list_bot_left_value = selected_list
            .filter(e => e.StyleItem.FrameItem?.BottomLeft != undefined)
            .map(e => e.StyleItem.FrameItem.BottomLeft)
          let bot_left_value = list_bot_left_value[0]
          list_bot_left_value = list_bot_left_value.filter(
            e => e != bot_left_value
          )
          this.value =
            list_bot_left_value.length == 0 ? bot_left_value : 'mixed'
        } else {
          handleEditOffset({ radiusBL: newValue })
          edit_radius.lastChild.value =
            [
              ..._row_radius_detail.querySelectorAll(':scope > input')
            ].filterAndMap(i => i.value).length > 1
              ? 'mixed'
              : this.value
        }
      }
    )
    $('body').on(
      'blur',
      '#row_radius_detail > input:nth-child(5)',
      function () {
        let newValue = parseFloat(this.value)
        if (isNaN(newValue)) {
          let list_bot_right_value = selected_list
            .filter(e => e.StyleItem.FrameItem?.BottomRight != undefined)
            .map(e => e.StyleItem.FrameItem.BottomRight)
          let bot_right_value = list_bot_right_value[0]
          list_bot_right_value = list_bot_right_value.filter(
            e => e != bot_right_value
          )
          this.value =
            list_bot_right_value.length == 0 ? bot_right_value : 'mixed'
        } else {
          handleEditOffset({ radiusBR: newValue })
          edit_radius.lastChild.value =
            [
              ..._row_radius_detail.querySelectorAll(':scope > input')
            ].filterAndMap(i => i.value).length > 1
              ? 'mixed'
              : this.value
        }
      }
    )
    edit_size_position_div.appendChild(_row_radius_detail)
  }
  if (
    selected_list.filter(wb =>
      ['w-container', 'w-button', 'w-textformfield', 'w-variant'].some(e =>
        wb.value.classList.contains(e)
      )
    ).length > 0
  ) {
    // sixth line is btn checkboc clip content (overflow)
    let btn_clip_content = document.createElement('label')
    btn_clip_content.className = 'row regular1 uneditable-instance'
    btn_clip_content.style.margin = '4px 0 0 16px'
    btn_clip_content.innerHTML = `<input type="checkbox"${selected_list
      .filter(wb =>
        ['w-container', 'w-button', 'w-textformfield', 'w-variant'].some(e =>
          wb.value.classList.contains(e)
        )
      )
      .every(wb =>
        window.getComputedStyle(wb.value).overflow.includes('hidden')
      )
      ? ' checked'
      : ''
      } style="margin-right: 8px; width: fit-content" />Clip content`
    $(btn_clip_content).on('change', 'input', function (ev) {
      handleEditOffset({ isClip: ev.target.checked })
    })
    edit_size_position_div.appendChild(btn_clip_content)
  }
  return edit_size_position_div
}

// update style HTML edit position UI
function reloadEditOffsetBlock() {
  let newEditSizePositionForm = EditOffsetBlock()
  document
    .getElementById('edit_size_position_div')
    .replaceWith(newEditSizePositionForm)
}

// edit auto layout
function EditLayoutBlock() {
  let wbList = selected_list.filter(wb =>
    WbClass.parent.some(e => wb.value.classList.contains(e))
  )
  let isEditTable =
    wbList.length > 0 &&
    wbList.every(wb => wb.value.classList.contains('w-table'))
  let editContainer = document.createElement('div')
  editContainer.id = 'edit_auto_layout_div'
  editContainer.className = 'edit-container col'
  let header = document.createElement('div')
  header.id = 'edit-layout-header'
  header.className = `ds-block-header`
  header.innerHTML = `<p>${isEditTable ? 'Table layout' : 'Auto layout'
    }</p><i class="fa-solid fa-minus fa-sm"></i><i class="fa-solid fa-plus fa-sm"></i>`
  editContainer.appendChild(header)
  let showDetails = selected_list.every(wb =>
    window.getComputedStyle(wb.value).display.match(/(flex|table)/g)
  )
  if (showDetails) {
    if (
      selected_list.some(wb =>
        wb.value.closest('.wbaseItem-value[iswini]:not(.w-variant)')
      )
    )
      header.classList.add('disable')
    header.querySelector('.fa-plus').remove()
    let body = document.createElement('div')
    editContainer.appendChild(body)
    body.className = 'row'
    let isVertical = wbList.every(wb =>
      ['w-col', 'w-table'].some(e => wb.value.classList.contains(e))
    )
    let selectDirection = document.createElement('div')
    selectDirection.className = 'group_btn_direction uneditable-instance'
    selectDirection.innerHTML = `<i class="fa-solid fa-arrow-down fa-xs" style="background-color: ${isVertical ? '#e5e5e5' : 'transparent'
      }"></i><i class="fa-solid fa-arrow-right fa-xs" style="background-color: ${isVertical ? 'transparent' : '#e5e5e5'
      }"></i>`
    if (
      wbList.every(
        wb =>
          ['w-textformfield', 'w-table'].every(
            e => !wb.value.classList.contains(e)
          ) &&
          !wb.IsInstance &&
          !wb.value.closest('.wbaseItem-value[iswini]')
      )
    ) {
      $(header).on('click', '.fa-minus', function () {
        removeLayout()
        reloadEditLayoutBlock()
      })
      $(selectDirection).on('click', '.fa-arrow-down', function () {
        if (!isVertical) {
          handleEditLayout({ direction: 'Vertical' })
          reloadEditLayoutBlock()
        }
      })
      $(selectDirection).on('click', '.fa-arrow-right', function () {
        if (isVertical) {
          handleEditLayout({ direction: 'Horizontal' })
          reloadEditLayoutBlock()
        }
      })
    } else {
      header.querySelector('.fa-minus').remove()
    }
    let alignContainer = _alignTable({
      isVertical: isVertical,
      value:
        mainAxisToAlign(
          wbList[0].value.style.justifyContent ??
          StyleDA.docStyleSheets.find(cssRule =>
            [...divSection.querySelectorAll(cssRule.selectorText)].includes(
              wbList[0].value
            )
          )?.style?.justifyContent,
          !isVertical
        ) +
        crossAxisToAlign(
          wbList[0].value.style.alignItems ??
          StyleDA.docStyleSheets.find(cssRule =>
            [...divSection.querySelectorAll(cssRule.selectorText)].includes(
              wbList[0].value
            )
          )?.style?.alignItems,
          !isVertical
        )
    })
    let btn_extension = document.createElement('i')
    btn_extension.className = 'fa-solid fa-ellipsis icon_btn_default_style'
    body.replaceChildren(selectDirection, alignContainer, btn_extension)

    // input edit child space
    if (!isEditTable) {
      let childSpaceValues = wbList.filterAndMap(wb =>
        parseFloat(
          window
            .getComputedStyle(wb.value)
          [
            wb.value.classList.contains('w-col') ? 'row-gap' : 'column-gap'
          ].replace('px', '')
        )
      )
      let inputChildSpace = _textField({
        width: '88px',
        icon: `https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/${isVertical ? 'vertical' : 'horizontal'
          } child spacing.svg`,
        value: childSpaceValues.length == 1 ? childSpaceValues[0] : 'mixed',
        onBlur: function (ev) {
          let newValue = parseFloat(ev.target.value)
          if (!isNaN(newValue)) {
            handleEditLayout({ childSpace: newValue })
            reloadEditLayoutBlock()
          } else {
            ev.target.value =
              childSpaceValues.length == 1 ? childSpaceValues[0] : 'mixed'
          }
        }
      })
      $(inputChildSpace).css({ position: 'absolute', left: '0', bottom: '0' })
      body.appendChild(inputChildSpace)
      if (wbList.every(wb => !wb.value.classList.contains('w-textformfield'))) {
        let isWrapRow = document.createElement('div')
        isWrapRow.className = 'row'
        isWrapRow.style.width = '100%'
        let btnIsWarp = document.createElement('label')
        btnIsWarp.className = 'row regular1 check-box-label uneditable-instance'
        btnIsWarp.innerHTML = `<input type="checkbox"${wbList
          .filterAndMap(wb => window.getComputedStyle(wb.value).flexWrap)
          .every(e => e === 'wrap')
          ? ' checked'
          : ''
          } />Wrap content`
        btnIsWarp.firstChild.onchange = function (ev) {
          handleEditLayout({ isWrap: ev.target.checked })
        }
        let runSpaceValues = wbList.filterAndMap(wb =>
          parseFloat(
            (
              wb.value.style.getPropertyValue('--run-space') ??
              StyleDA.docStyleSheets
                .find(cssRule =>
                  [
                    ...divSection.querySelectorAll(cssRule.selectorText)
                  ].includes(wbList[0].value)
                )
                ?.style?.getPropertyValue('--run-space')
            ).replace('px', '')
          )
        )
        let inputRunSpace = _textField({
          width: '88px',
          icon: `https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/${isVertical ? 'horizontal' : 'vertical'
            } child spacing.svg`,
          value: runSpaceValues.length == 1 ? runSpaceValues[0] : 'mixed',
          onBlur: function (ev) {
            let newValue = parseFloat(ev.target.value)
            if (!isNaN(newValue)) {
              handleEditLayout({ runSpace: newValue })
              reloadEditLayoutBlock()
            } else {
              ev.target.value =
                runSpaceValues.length == 1 ? runSpaceValues[0] : 'mixed'
            }
          }
        })
        isWrapRow.replaceChildren(btnIsWarp, inputRunSpace)
        let btnIsScroll = document.createElement('label')
        btnIsScroll.className =
          'row regular1 check-box-label uneditable-instance'
        btnIsScroll.innerHTML = `<input type="checkbox"${wbList
          .filterAndMap(wb => window.getComputedStyle(wb.value).overflow)
          .every(e => e.includes('scroll'))
          ? ' checked'
          : ''
          }/>Overflow scroll`
        if (
          wbList.some(
            wb =>
              (wb.value.classList.contains('w-col') &&
                wb.value.getAttribute('height-type') === 'fit') ||
              (wb.value.classList.contains('w-row') &&
                wb.value.getAttribute('width-type') === 'fit')
          )
        ) {
          btnIsScroll.setAttribute('disabled', 'true')
        } else {
          btnIsScroll.firstChild.onchange = function (ev) {
            handleEditLayout({ isScroll: ev.target.checked })
          }
        }
        editContainer.replaceChildren(
          ...editContainer.children,
          isWrapRow,
          btnIsScroll
        )
      }
    }

    // input padding
    let isShowPadDetails = false
    let paddingLefts = wbList.filterAndMap(e =>
      window.getComputedStyle(e.value).paddingLeft.replace('px', '')
    )
    let padLeftValue = paddingLefts.length == 1 ? paddingLefts[0] : 'mixed'
    let paddingTops = wbList.filterAndMap(e =>
      window.getComputedStyle(e.value).paddingTop.replace('px', '')
    )
    let padTopValue = paddingTops.length == 1 ? paddingTops[0] : 'mixed'
    let paddingRights = wbList.filterAndMap(e =>
      window.getComputedStyle(e.value).paddingRight.replace('px', '')
    )
    let padRightValue = paddingRights.length == 1 ? paddingRights[0] : 'mixed'
    let paddingBots = wbList.filterAndMap(e =>
      window.getComputedStyle(e.value).paddingBottom.replace('px', '')
    )
    let padBotValue = paddingBots.length == 1 ? paddingBots[0] : 'mixed'
    let paddingContainer = document.createElement('div')
    paddingContainer.className = 'row'
    paddingContainer.style.flexWrap = 'wrap'
    paddingContainer.style.gap = '4px'
    paddingContainer.style.marginTop = '6px'
    editContainer.appendChild(paddingContainer)
    let input_padding_horizontal = _textField({
      width: '88px',
      icon: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding horizontal.svg',
      value: padLeftValue == padRightValue ? padLeftValue : 'mixed',
      onBlur: function (ev) {
        let newValue = parseFloat(ev.target.value)
        if (newValue != undefined) {
          handleEditPadding({ left: newValue, right: newValue })
          input_padding_left.lastChild.value = ev.target.value
          padLeftValue = ev.target.value
          input_padding_right.lastChild.value = ev.target.value
          padRightValue = ev.target.value
        } else {
          ev.target.value =
            padLeftValue == padRightValue ? padLeftValue : 'mixed'
        }
      }
    })
    let input_padding_vertical = _textField({
      width: '88px',
      icon: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding vertical.svg',
      value: padTopValue == padBotValue ? padTopValue : 'mixed',
      onBlur: function (ev) {
        let newValue = parseFloat(ev.target.value)
        if (newValue != undefined) {
          handleEditPadding({ top: newValue, bottom: newValue })
          input_padding_top.lastChild.value = ev.target.value
          padTopValue = ev.target.value
          input_padding_bottom.lastChild.value = ev.target.value
          padBotValue = ev.target.value
        } else {
          ev.target.value = padTopValue == padBotValue ? padTopValue : 'mixed'
        }
      }
    })
    input_padding_vertical.style.marginLeft = '6px'
    let input_padding_left = _textField({
      width: '88px',
      icon: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding left.svg',
      value: padLeftValue,
      onBlur: function (ev) {
        let newValue = parseFloat(ev.target.value)
        if (!isNaN(newValue)) {
          handleEditPadding({ left: newValue })
          padLeftValue = ev.target.value
          input_padding_horizontal.lastChild.value =
            padLeftValue == padRightValue ? padLeftValue : 'mixed'
        } else {
          ev.target.value = padLeftValue
        }
      }
    })
    let input_padding_top = _textField({
      width: '88px',
      icon: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding top.svg',
      value: padTopValue,
      onBlur: function (ev) {
        let newValue = parseFloat(ev.target.value)
        if (!isNaN(newValue)) {
          handleEditPadding({ top: newValue })
          padTopValue = ev.target.value
          input_padding_vertical.lastChild.value =
            padTopValue == padBotValue ? padTopValue : 'mixed'
        } else {
          ev.target.value = padTopValue
        }
      }
    })
    input_padding_top.style.marginLeft = '6px'
    let icon_padding_details = document.createElement('img')
    icon_padding_details.className = 'img-button size-24'
    icon_padding_details.style.borderRadius = '2px'
    icon_padding_details.style.margin = '4px 0 0 6px'
    icon_padding_details.src =
      'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding details.svg'
    let input_padding_right = _textField({
      width: '88px',
      icon: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding right.svg',
      value: padRightValue,
      onBlur: function (ev) {
        let newValue = parseFloat(ev.target.value)
        if (!isNaN(newValue)) {
          handleEditPadding({ right: newValue })
          padRightValue = ev.target.value
          input_padding_horizontal.lastChild.value =
            padLeftValue == padRightValue ? padLeftValue : 'mixed'
        } else {
          ev.target.value = padRightValue
        }
      }
    })

    let input_padding_bottom = _textField({
      width: '88px',
      icon: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding bottom.svg',
      value: padBotValue,
      onBlur: function (ev) {
        let newValue = parseFloat(ev.target.value)
        if (!isNaN(newValue)) {
          handleEditPadding({ bottom: newValue })
          padBotValue = ev.target.value
          input_padding_vertical.lastChild.value =
            padTopValue == padBotValue ? padTopValue : 'mixed'
        } else {
          ev.target.value = padBotValue
        }
      }
    })
    input_padding_bottom.style.marginLeft = '6px'
    paddingContainer.replaceChildren(
      input_padding_horizontal,
      input_padding_vertical,
      input_padding_left,
      input_padding_top,
      icon_padding_details,
      input_padding_right,
      input_padding_bottom
    )
    icon_padding_details.onclick = function () {
      isShowPadDetails = !isShowPadDetails
      toggleShowDetails()
    }
    toggleShowDetails()
    function toggleShowDetails() {
      if (isShowPadDetails) {
        input_padding_horizontal.style.display = 'none'
        input_padding_vertical.style.display = 'none'
        input_padding_left.style.display = 'flex'
        input_padding_top.style.display = 'flex'
        input_padding_right.style.display = 'flex'
        input_padding_bottom.style.display = 'flex'
        icon_padding_details.style.borderColor = '#e5e5e5'
      } else {
        input_padding_horizontal.style.display = 'flex'
        input_padding_vertical.style.display = 'flex'
        input_padding_left.style.display = 'none'
        input_padding_top.style.display = 'none'
        input_padding_right.style.display = 'none'
        input_padding_bottom.style.display = 'none'
        icon_padding_details.style.borderColor = 'transparent'
      }
    }
  } else {
    header.querySelector('.fa-minus').remove()
    if (
      selected_list.every(wb =>
        wb.value.closest('.wbaseItem-value[iswini]:not(.w-variant)')
      )
    ) {
      header.classList.add('disable')
    } else {
      $(header).on('click', '.fa-plus', function () {
        addAutoLayout()
        reloadEditLayoutBlock()
      })
    }
  }
  return editContainer
}

// update style HTML edit auto layout UI
function reloadEditLayoutBlock() {
  let newEditAutoLayout = EditLayoutBlock()
  document.getElementById('edit_auto_layout_div').replaceWith(newEditAutoLayout)
}

// create text field UI
function _textField({
  id,
  width = '82px',
  icon,
  label,
  value,
  iconSize = '24px',
  onBlur
}) {
  let inputContainer = document.createElement('div')
  inputContainer.id = id
  inputContainer.className = 'text_field_right_view'
  inputContainer.style.width = width
  inputContainer.innerHTML = `${icon
    ? `<img src="${icon}" style="box-sizing: border-box; padding: 6px; width: ${iconSize}; width: ${iconSize}"/>`
    : ''
    }${label
      ? `<p class="label-5" style="color: #BFBFBF; margin-left: 4px">${label}</p>`
      : ''
    }<input class="input_text_field" value=${value} style="background-color: transparent" />`
  inputContainer.lastChild.onfocus = function () {
    this.select()
  }
  inputContainer.lastChild.onblur = onBlur
  return inputContainer
}

// ! Constraints
function EditConstraintsBlock() {
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-constraints'
  editContainer.className = 'edit-container col'

  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  editContainer.appendChild(header)

  let title = document.createElement('p')
  title.innerHTML = 'Constraints'
  header.appendChild(title)

  let bodyContainer = document.createElement('div')
  bodyContainer.className = 'col'
  editContainer.appendChild(bodyContainer)

  //
  let editConstContainer = document.createElement('div')
  editConstContainer.className = 'row'
  bodyContainer.appendChild(editConstContainer)
  let constraintsXValues = selected_list.filterAndMap(e =>
    e.value.getAttribute('constx')
  )
  let constraintsX =
    constraintsXValues.length === 1 ? constraintsXValues[0] : 'mixed'
  let constraintsYValues = selected_list.filterAndMap(e =>
    e.value.getAttribute('consty')
  )
  let constraintsY =
    constraintsYValues.length === 1 ? constraintsYValues[0] : 'mixed'

  let constraintsRect = document.createElement('div')
  constraintsRect.className = 'connstraints-rect'
  let selectConstraintsCol = document.createElement('div')
  selectConstraintsCol.className = 'col'
  editConstContainer.replaceChildren(constraintsRect, selectConstraintsCol)

  let listContraintsX = [
    Constraints.left,
    Constraints.right,
    Constraints.center
  ]
  let listContraintsY = [
    Constraints.top,
    Constraints.bottom,
    Constraints.center
  ]
  if (
    selected_list.every(wb =>
      WbClass.scale.every(e => !wb.value.classList.contains(e))
    )
  ) {
    if (
      selected_list.every(wb => wb.value.getAttribute('width-type') !== 'fit')
    ) {
      listContraintsX.push(Constraints.left_right, Constraints.scale)
    }
    if (
      selected_list.every(wb => wb.value.getAttribute('height-type') !== 'fit')
    ) {
      listContraintsY.push(Constraints.top_bottom, Constraints.scale)
    }
  }

  let smallConstRect = document.createElement('div')
  constraintsRect.appendChild(smallConstRect)

  for (let constY of listContraintsY.slice(0, 3)) {
    let selectBtn = document.createElement('div')
    selectBtn.className = 'constraint-selector-outerVertical'
    let typeLine = document.createElement('div')
    if (constY === constraintsY.toLowerCase()) {
      typeLine.style.backgroundColor = '#007be5'
      selectBtn.style.pointerEvents = 'none'
    } else if (constraintsY.toLowerCase().includes(constY)) {
      typeLine.style.backgroundColor = '#007be5'
    }
    selectBtn.appendChild(typeLine)
    switch (constY) {
      case Constraints.top:
        selectBtn.style.top = '0px'
        break
      case Constraints.center:
        selectBtn.style.top = '50%'
        selectBtn.style.padding = '2px'
        selectBtn.style.transform = 'translate(-50%, -50%)'
        typeLine.style.height = '12px'
        break
      case Constraints.bottom:
        selectBtn.style.bottom = '0px'
        break
      default:
        break
    }
    selectBtn.onclick = function () {
      handleEditConstraints({ constY: constY })
      reloadEditConstraintsBlock()
    }
    constraintsRect.appendChild(selectBtn)
  }

  for (let constX of listContraintsX.slice(0, 3)) {
    let selectBtn = document.createElement('div')
    selectBtn.className = 'constraint-selector-outerHorizontal'
    let typeLine = document.createElement('div')
    if (constX === constraintsX.toLowerCase()) {
      typeLine.style.backgroundColor = '#007be5'
      selectBtn.style.pointerEvents = 'none'
    } else if (constraintsX.toLowerCase().includes(constX)) {
      typeLine.style.backgroundColor = '#007be5'
    }
    selectBtn.appendChild(typeLine)
    switch (constX) {
      case Constraints.left:
        selectBtn.style.left = '0px'
        break
      case Constraints.center:
        selectBtn.style.left = '50%'
        selectBtn.style.padding = '2px'
        selectBtn.style.transform = 'translate(-50%, -50%)'
        typeLine.style.width = '12px'
        break
      case Constraints.right:
        selectBtn.style.right = '0px'
        break
      default:
        break
    }
    selectBtn.onclick = function () {
      handleEditConstraints({ constX: constX })
      reloadEditConstraintsBlock()
    }
    constraintsRect.appendChild(selectBtn)
  }

  let dropdownConstX = _btnDropDownSelect({
    initvalue: constraintsX,
    listvalue:
      constraintsX !== 'mixed'
        ? listContraintsX
        : ['mixed', ...listContraintsX],
    onselect: value => {
      handleEditConstraints({ constX: value })
      reloadEditConstraintsBlock()
    }
  })

  let dropdownConstY = _btnDropDownSelect({
    initvalue: constraintsY,
    listvalue:
      constraintsY !== 'mixed'
        ? listContraintsY
        : ['mixed', ...listContraintsY],
    onselect: value => {
      handleEditConstraints({ constY: value })
      reloadEditConstraintsBlock()
    }
  })

  selectConstraintsCol.replaceChildren(dropdownConstX, dropdownConstY)

  return editContainer
}

function reloadEditConstraintsBlock() {
  if (document.getElementById('edit-constraints')) {
    let newEditConst = EditConstraintsBlock()
    document.getElementById('edit-constraints').replaceWith(newEditConst)
  }
}

//create button select resizing type
function _btnSelectResizeType(isW = true, type) {
  type = type.toLowerCase()
  let btn_resize = document.createElement('div')
  btn_resize.className = 'btn_resize' + (isW ? ' width' : ' height')
  let icon_resize = document.createElement('span')
  btn_resize.appendChild(icon_resize)
  if (!isW) {
    icon_resize.style.transform = 'rotate(90deg)'
  }
  let title = document.createElement('p')
  title.innerHTML = type
  btn_resize.appendChild(title)
  switch (type) {
    case 'hug':
      icon_resize.innerHTML = SVGIcon.hug_content
      break
    case 'fill':
      icon_resize.innerHTML = SVGIcon.fill_container
      break
    default:
      icon_resize.innerHTML = SVGIcon.fixed_size
      break
  }
  let icon_down = document.createElement('i')
  btn_resize.appendChild(icon_down)
  icon_down.className = 'fa-solid fa-chevron-down fa-2xs'
  icon_down.style.opacity = 0.8
  btn_resize.onclick = function () {
    document.querySelector('#body > .popup_list_resize_type')?.remove()
    let popup_list_resize_type = document.createElement('div')
    popup_list_resize_type.className =
      'popup_list_resize_type col wini_popup popup_remove'
    let resizeType = ['fixed', 'hug', 'fill']
    if (type === 'mixed') resizeType.unshift('mixed')
    popup_list_resize_type.replaceChildren(
      ...resizeType.map(vl => {
        let option = document.createElement('div')
        option.className = 'resize-option'
        if (vl === 'mixed' || checkActiveFillHug({ type: vl, isW: isW })) {
          option.innerHTML = `<i class="fa-solid fa-check" style="color: #fff;opacity: ${type === vl ? 1 : 0
            }"></i><span ${isW ? '' : 'style="transform: rotate(90deg)"'
            }>${(vl === 'fixed'
              ? SVGIcon.fixed_size
              : vl === 'hug'
                ? SVGIcon.hug_content
                : SVGIcon.fill_container
            ).replace('#000', '#fff')}</span>${vl === 'hug'
              ? 'hug contents'
              : vl === 'fill'
                ? 'fill container'
                : vl
            }`
        }
        if (vl !== 'mixed')
          option.onclick = function (e) {
            e.stopPropagation()
            if (isW)
              handleEditOffset({
                width: vl === 'hug' ? null : vl === 'fill' ? -1 : vl
              })
            else
              handleEditOffset({
                height: vl === 'hug' ? null : vl === 'fill' ? -1 : vl
              })
            popup_list_resize_type.remove()
            reloadEditOffsetBlock()
          }
        return option
      })
    )
    let offset = this.getBoundingClientRect()
    popup_list_resize_type.style.left = offset.x + 'px'
    popup_list_resize_type.style.top = offset.y + 'px'
    setTimeout(function () {
      document.getElementById('body').appendChild(popup_list_resize_type)
    }, 200)
  }

  return btn_resize
}

// fill || hug
function checkActiveFillHug({ type = 'fill', isW = true }) {
  switch (type) {
    case 'fill':
      let activeFill = false
      if (select_box_parentID !== wbase_parentID) {
        var pWbHTML = document.getElementById(select_box_parentID)
        var pWbComputedSt = window.getComputedStyle(pWbHTML)
        activeFill = pWbComputedSt.display.match(/(flex|table)/g)
      }
      if (activeFill) {
        if (isW) {
          if (pWbHTML.classList.contains('w-row')) {
            if (pWbHTML.getAttribute('width-type') === 'fill') {
              activeFill =
                pWbComputedSt.flexWrap === 'wrap' ||
                !pWbComputedSt.overflow.includes('scroll')
            }
          } else {
            activeFill = pWbComputedSt.flexWrap !== 'wrap'
          }
        } else {
          if (pWbHTML.classList.contains('w-row')) {
            activeFill = pWbComputedSt.flexWrap !== 'wrap'
          } else {
            if (pWbHTML.getAttribute('height-type') === 'fill') {
              activeFill =
                pWbComputedSt.flexWrap === 'wrap' ||
                !pWbComputedSt.overflow.includes('scroll')
            }
          }
        }
      }
      return activeFill
    case 'hug':
      return selected_list.every(wb => {
        if (
          wb.value.classList.contains('w-text') ||
          wb.value.classList.contains('w-table')
        )
          return true
        if (
          isW &&
          (wb.value.getAttribute('constx') === Constraints.left_right ||
            wb.value.getAttribute('constx') === Constraints.scale)
        )
          return false
        if (
          !isW &&
          (wb.value.getAttribute('constx') === Constraints.top_bottom ||
            wb.value.getAttribute('constx') === Constraints.scale)
        )
          return false
        let wbComputeSt = window.getComputedStyle(wb.value)
        if (
          wbComputeSt.display === 'flex' &&
          !(
            wbComputeSt.overflow.includes('scroll') &&
            wbComputeSt.flexWrap === 'wrap'
          )
        ) {
          if (isW) {
            if (!wb.value.classList.contains('w-textformfield')) {
              if (wb.value.classList.contains('w-row')) {
                return (
                  !wbComputeSt.overflow.includes('scroll') &&
                  wbComputeSt.flexWrap !== 'wrap'
                )
              } else if (
                !wb.value.querySelector(`.col-[level="${wb.Level + 1}"]`)
              ) {
                return !wbComputeSt.overflow.includes('scroll')
              }
            }
          } else {
            if (wb.value.classList.contains('w-col')) {
              return (
                wbComputeSt.flexWrap !== 'wrap' &&
                !wbComputeSt.overflow.includes('scroll')
              )
            } else {
              return !wbComputeSt.overflow.includes('scroll')
            }
          }
        }
        return false
      })
    default:
      return true
  }
}

// create alignment type table UI
function _alignTable({ isVertical = true, value }) {
  value = value === 'CenterCenter' ? 'Center' : value
  let alignContainer = document.createElement('div')
  alignContainer.className = 'alignment-container'
  alignContainer.setAttribute('oy', isVertical)
  alignContainer.innerHTML = [
    AlignmentType.top_left,
    AlignmentType.top_center,
    AlignmentType.top_right,
    AlignmentType.left_center,
    AlignmentType.center,
    AlignmentType.right_center,
    AlignmentType.bottom_left,
    AlignmentType.bottom_center,
    AlignmentType.bottom_right
  ]
    .map(
      vl =>
        `<div class='align-option' alignvl="${vl}" style='opacity: ${vl === value ? 1 : 0.05
        }'></div>`
    )
    .join('')
  $(alignContainer).on('click', '.align-option', function (ev) {
    alignContainer.querySelectorAll('.align-option').forEach(e => {
      if (e === ev.target) {
        ev.target.style.opacity = 1
      } else {
        e.style.opacity = 0.05
      }
    })
    handleEditLayout({ alignment: ev.target.getAttribute('alignvl') })
  })
  return alignContainer
}

//! background-color || img
function EditBackgroundBlock() {
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-background'
  editContainer.className = 'edit-container col'
  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  let scaleWb = selected_list.every(wb =>
    WbClass.scale.some(e => wb.value.classList.contains(e))
  )
  header.innerHTML = `<p>${scaleWb ? 'Checked primary color' : 'Background'}</p>
  <button class="action-button skin-btn bg-header-action"></button>
  <i class="fa-regular fa-image fa-sm bg-header-action"></i>
  <i class="fa-solid fa-plus fa-sm bg-header-action"></i>`
  editContainer.appendChild(header)

  let wbBg = selected_list.filterAndMap(
    wb => window.getComputedStyle(wb.value).backgroundImage
  )
  if (wbBg.length === 1) {
    if (wbBg[0] === 'none') {
      wbBg = selected_list.filterAndMap(wb => {
        let bgColor =
          wb.value.style?.backgroundColor?.length > 0
            ? wb.value.style.backgroundColor
            : StyleDA.docStyleSheets.find(cssRule =>
              [...divSection.querySelectorAll(cssRule.selectorText)].includes(
                wb.value
              )
            )?.style?.backgroundColor
        if (bgColor?.match(uuid4Regex)) return bgColor?.match(uuid4Regex)[0]
        else return bgColor?.length === 0 ? null : bgColor
      })
      if (wbBg.length === 1 && wbBg[0]?.length > 0) {
        if (wbBg[0].length === 36) {
          let colorSkin = StyleDA.listSkin.find(skin => wbBg[0] === skin.GID)
          let cateItem
          if (colorSkin) {
            header.querySelector('.fa-plus').remove()
            header.querySelector('.skin-btn').remove()
            if (colorSkin.CateID !== EnumCate.color) {
              cateItem = CateDA.list_color_cate.find(
                e => e.ID == colorSkin.CateID
              )
            }
            let skin_tile = wbaseSkinTile({
              cate: EnumCate.color,
              prefixValue: colorSkin.Css,
              title: (cateItem ? `${cateItem.Name}/` : '') + colorSkin.Name,
              onClick: function () {
                let offset = header.getBoundingClientRect()
                createDropdownTableSkin({
                  cate: EnumCate.color,
                  offset: offset,
                  currentSkinID: colorSkin.GID,
                  cssText: colorSkin.Css
                })
              },
              onRemove: function () {
                handleEditBackground({ hexCode: null })
                reloadEditBackgroundBlock()
              }
            })
            editContainer.appendChild(skin_tile)
            if (scaleWb) skin_tile.lastChild.style.display = 'none'
          }
        } else {
          header.querySelector('.fa-plus').remove()
          var bgColor = wbBg[0].includes('rgb')
            ? Ultis.rgbToHex(wbBg[0]).replace('#', '')
            : wbBg[0]
          let formEdit = createEditColorForm({
            value: `#${bgColor}`,
            onchange: vl => {
              handleEditBackground({ hexCode: vl, onSubmit: false })
            },
            onsubmit: vl => {
              handleEditBackground({ hexCode: vl })
            },
            ondelete: function () {
              handleEditBackground({ hexCode: null })
              reloadEditBackgroundBlock()
            }
          })
          editContainer.appendChild(formEdit)
        }
      }
    } else {
      header.querySelector('.fa-plus').remove()
      let editImgTile = document.createElement('div')
      editImgTile.id = 'select_img_tile'
      editContainer.appendChild(editImgTile)

      let divSelectImg = document.createElement('div')
      divSelectImg.innerHTML = `<div style="background: url(${window
        .getComputedStyle(selected_list[0].value)
        .backgroundImage.replace(
          /(url\("|"\))/g,
          ''
        )}) 0 0 / cover no-repeat; width: 20px; height: 16px; margin: 6px"></div><p>Image</p><input class="regular1" value="100%" style="width: 38px; min-width: 40px;padding: 0 0 0 6px"/>`
      editImgTile.appendChild(divSelectImg)

      $(divSelectImg).on('click', 'div', function () {
        if (!document.getElementById('popup_img_document')) FileDA.init()
      })

      let btnEye = document.createElement('img')
      btnEye.src =
        'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/eye-outline.svg'
      btnEye.style.width = '16px'
      btnEye.style.height = '16px'
      btnEye.style.padding = '6px'
      editImgTile.appendChild(btnEye)

      let btnRemoveBgImg = document.createElement('i')
      btnRemoveBgImg.className = 'fa-solid fa-minus'
      btnRemoveBgImg.style.padding = '10px 8px'
      editImgTile.appendChild(btnRemoveBgImg)
      btnRemoveBgImg.onclick = function () {
        handleEditBackground({ hexCode: null })
        reloadEditBackgroundBlock()
      }
    }
  }
  if (wbBg.length > 1) {
    let notiText = document.createElement('p')
    notiText.className = 'regular1'
    notiText.style.margin = '4px 8px'
    notiText.innerHTML = 'choose a color skin to replace mixed content'
    editContainer.appendChild(notiText)
  }

  $(header).on('click', '.fa-plus', addBackgroundColor)
  $(header).on('click', '.skin-btn', function () {
    let offset = header.getBoundingClientRect()
    createDropdownTableSkin({
      cate: EnumCate.color,
      offset: offset,
      cssText: bgColor ? `#${bgColor}` : null
    })
  })
  $(header).on('click', '.fa-image', function () {
    if (!document.getElementById('popup_img_document')) FileDA.init()
  })

  return editContainer
}

function reloadEditBackgroundBlock() {
  let newEditBackground = EditBackgroundBlock()
  document.getElementById('edit-background').replaceWith(newEditBackground)
}

function EditIconColorBlock() {
  let wbIcon = selected_list.find(wb => wb.value.classList.contains('w-svg'))
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-icon-color'
  editContainer.className = 'edit-container col'
  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  editContainer.appendChild(header)
  let title = document.createElement('p')
  title.innerHTML = 'Icon color'
  header.appendChild(title)

  if (wbIcon.value.style.length) renderIconColorForm(wbIcon.value.style)
  //
  const cssRule = StyleDA.docStyleSheets.find(cssRule =>
    [...divSection.querySelectorAll(cssRule.selectorText)].includes(
      wbIcon.value
    )
  )
  if (cssRule) renderIconColorForm(cssRule.style)
  //
  function renderIconColorForm(wbStyle) {
    for (let i = 0; i < wbStyle.length; i++)
      if (wbStyle[i].startsWith('--svg-color')) {
        let colorValue = wbStyle.getPropertyValue(wbStyle[i])
        if (colorValue.match(uuid4Regex)) {
          let colorSkin = StyleDA.listSkin.find(
            skin => colorValue.match(uuid4Regex)[0] === skin.GID
          )
          if (colorSkin) {
            if (colorSkin.CateID !== EnumCate.color) {
              var cateItem = CateDA.list_color_cate.find(
                e => e.ID == colorSkin.CateID
              )
            }
            editContainer.appendChild(
              wbaseSkinTile({
                cate: EnumCate.color,
                prefixValue: colorSkin.Css,
                title: (cateItem ? `${cateItem.Name}/` : '') + colorSkin.Name,
                onClick: function () {
                  let offset = header.getBoundingClientRect()
                  createDropdownTableSkin({
                    cate: EnumCate.color,
                    offset: offset,
                    currentSkinID: colorSkin.GID,
                    cssText: colorSkin.Css
                  })
                  document
                    .getElementById('popup_table_skin')
                    .setAttribute('edit-type', wbStyle[i])
                },
                handleUnlinkSkin: function () {
                  handleEditIconColor({
                    prop: wbStyle[i],
                    hexCode: colorSkin.Css
                  })
                  reloadEditIconColorBlock()
                }
              })
            )
          }
        } else {
          editContainer.appendChild(
            createEditColorForm({
              value: colorValue,
              onchange: params => {
                handleEditIconColor({
                  prop: wbStyle[i],
                  hexCode: params,
                  onSubmit: false
                })
              },
              onsubmit: params => {
                handleEditIconColor({ prop: wbStyle[i], hexCode: params })
                reloadEditIconColorBlock()
              },
              suffixAction: function () {
                let offset = header.getBoundingClientRect()
                createDropdownTableSkin({
                  cate: EnumCate.color,
                  offset: offset,
                  cssText: colorValue.match(hexRegex)
                    ? `#${colorValue.replace('#', '')}`
                    : `#${Ultis.colorNameToHex(colorValue)}`
                })
                document
                  .getElementById('popup_table_skin')
                  .setAttribute('edit-type', wbStyle[i])
              }
            })
          )
        }
      }
  }
  return editContainer
}

function reloadEditIconColorBlock() {
  let newEditIconColor = EditIconColorBlock()
  document.getElementById('edit-icon-color').replaceWith(newEditIconColor)
}

let list_font_family = [
  'Arial',
  'Algerian',
  'Broadway',
  'Calibri',
  'Curlz MT',
  'Castellar',
  'Freestyle Script',
  'Inter',
  'Roboto',
  'Rubik',
  'Sanchez',
  'Single Day'
]

let list_font_size = [
  9.0, 10.0, 11.0, 12.0, 14.0, 15.0, 16.0, 18.0, 19.0, 20.0, 22.0, 24.0, 28.0,
  32.0, 36.0, 40.0, 56.0
]

let list_font_weight = ['200', '300', '400', '500', '600', '700', '800', '900']

// ! textStyle
function EditTypoBlock() {
  let listTextStyle = selected_list.filter(wb =>
    ['w-text', 'w-textformfield'].some(e => wb.value.classList.contains(e))
  )
  let editContainer = document.createElement('div')
  editContainer.id = 'edit_text_style'
  editContainer.className = 'edit-container col'
  let header = document.createElement('div')
  header.id = 'edit_text_style_header'
  header.className = 'ds-block-header row'
  editContainer.appendChild(header)
  let title = document.createElement('p')
  title.innerHTML = 'Text'
  header.appendChild(title)

  let btnSelectSkin = createButtonAction(
    'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/buttonStyle.svg',
    null,
    function () {
      let offset = header.getBoundingClientRect()
      createDropdownTableSkin({ cate: EnumCate.typography, offset: offset })
    }
  )

  let listTypoSkin = listTextStyle.filterAndMap(wb => {
    let fontSt =
      wb.value.style.font ??
      StyleDA.docStyleSheets.find(cssRule =>
        [...divSection.querySelectorAll(cssRule.selectorText)].includes(
          wb.value
        )
      )?.style?.font
    return fontSt?.replace(/(var\(--|\))/g, '')
  })

  let wbColor = selected_list.filterAndMap(wb => {
    let txtColor =
      wb.value.style?.color?.length > 0
        ? wb.value.style.color
        : StyleDA.docStyleSheets.find(cssRule =>
          [...divSection.querySelectorAll(cssRule.selectorText)].includes(
            wb.value
          )
        )?.style?.color
    if (txtColor?.match(uuid4Regex)) return txtColor?.match(uuid4Regex)[0]
    else return txtColor?.length === 0 ? null : txtColor
  })

  if (wbColor.length === 1) {
    if (wbColor[0].length === 36) {
      let colorSkin = StyleDA.listSkin.find(skin => wbColor[0] === skin.GID)
      if (colorSkin) {
        if (colorSkin.CateID !== EnumCate.color) {
          var cateItem = CateDA.list_color_cate.find(
            e => e.ID == colorSkin.CateID
          )
        }
        var editColor = wbaseSkinTile({
          cate: EnumCate.color,
          prefixValue: colorSkin.Css,
          title: (cateItem ? `${cateItem.Name}/` : '') + colorSkin.Name,
          onClick: function () {
            let offset = header.getBoundingClientRect()
            createDropdownTableSkin({
              cate: EnumCate.color,
              offset: offset,
              currentSkinID: colorSkin.GID,
              cssText: colorSkin.Css
            })
            document
              .getElementById('popup_table_skin')
              .setAttribute('edit-type', 'typo')
          },
          handleUnlinkSkin: function () {
            handleEditTypo({
              hexCode: Ultis.rgbToHex(
                window.getComputedStyle(listTextStyle[0].value).color
              )
            })
            reloadEditTypoBlock()
          }
        })
      }
    } else {
      editColor = createEditColorForm({
        value: Ultis.rgbToHex(
          window.getComputedStyle(listTextStyle[0].value).color
        ),
        onchange: params => {
          handleEditTypo({ color: params, onSubmit: false })
        },
        onsubmit: params => {
          handleEditTypo({ color: params })
          reloadEditTypoBlock()
        },
        suffixAction: function () {
          let offset = editColor.getBoundingClientRect()
          createDropdownTableSkin({
            cate: EnumCate.color,
            offset: offset,
            cssText: Ultis.rgbToHex(
              window.getComputedStyle(listTextStyle[0].value).color
            )
          })
          document
            .getElementById('popup_table_skin')
            .setAttribute('edit-type', 'typo')
        }
      })
    }
  }

  if (listTypoSkin.length === 1 && listTypoSkin[0]?.length === 36) {
    let typoSkin = StyleDA.listSkin.find(skin => listTypoSkin[0] == skin.GID)
    let cateItem = CateDA.list_typo_cate.find(e => e.ID == typoSkin.CateID)
    let wbComputeSt = window.getComputedStyle(listTextStyle[0].value)
    let skin_tile = wbaseSkinTile({
      cate: EnumCate.typography,
      prefixValue: `${wbComputeSt.fontSize}/${wbComputeSt.lineHeight}`,
      title: (cateItem ? `${cateItem.Name}/` : '') + typoSkin.Name,
      onClick: function () {
        let offset = header.getBoundingClientRect()
        createDropdownTableSkin({
          cate: EnumCate.typography,
          offset: offset,
          currentSkinID: typoSkin.GID,
          cssText: typoSkin.Css
        })
      }
    })
    skin_tile.querySelector('p').style.fontWeight = typoSkin.FontWeight
    if (editColor) {
      editColor.style.marginBottom = '6px'
      editContainer.appendChild(editColor)
    }
    editContainer.appendChild(skin_tile)
  } else if (listTypoSkin.some(vl => vl.length === 36)) {
    header.appendChild(btnSelectSkin)
    let notiText = document.createElement('p')
    notiText.className = 'regular1'
    notiText.style.margin = '4px 8px'
    notiText.innerHTML = 'choose a typogrphy skin to replace mixed content'
    editContainer.appendChild(notiText)
  } else {
    header.appendChild(btnSelectSkin)
    let text_style_attribute = document.createElement('div')
    text_style_attribute.className = 'col'
    $(text_style_attribute).css({ width: '100%', 'box-sizing': 'border-box' })
    editContainer.appendChild(text_style_attribute)
    if (editColor) text_style_attribute.appendChild(editColor)
    // select font-family
    let fontFamilyValues = listTextStyle.filterAndMap(
      wb => window.getComputedStyle(wb.value).fontFamily
    )
    let btn_select_font_family = _btnInputSelect({
      initvalue: fontFamilyValues.length === 1 ? fontFamilyValues[0] : 'mixed',
      listvalue:
        fontFamilyValues.length === 1
          ? list_font_family
          : ['mixed', ...list_font_family],
      onselect: option => {
        handleEditTypo({ fontFamily: option })
      }
    })
    $(btn_select_font_family).css({
      'margin-top': '8px',
      'margin-bottom': '8px'
    })
    text_style_attribute.appendChild(btn_select_font_family)
    //
    let div_font_size_weight = document.createElement('div')
    div_font_size_weight.className = 'row'
    $(div_font_size_weight).css({ width: '100%', 'box-sizing': 'border-box' })
    text_style_attribute.appendChild(div_font_size_weight)
    // select font-weight
    let fWeightValues = listTextStyle.filterAndMap(
      wb => window.getComputedStyle(wb.value).fontWeight
    )
    let btn_select_font_weight = _btnDropDownSelect({
      initvalue: fWeightValues.length === 1 ? fWeightValues[0] : 'mixed',
      listvalue:
        fWeightValues.length === 1
          ? list_font_weight
          : ['mixed', ...list_font_weight],
      onselect: value => {
        handleEditTypo({ fontWeight: value })
      }
    })
    div_font_size_weight.appendChild(btn_select_font_weight)
    // select font-size
    let fSizeValues = listTextStyle.filterAndMap(wb =>
      parseFloat(window.getComputedStyle(wb.value).fontSize.replace('px', ''))
    )
    let btn_select_font_size = _btnInputSelect({
      initvalue: fSizeValues.length === 1 ? fSizeValues[0] : 'mixed',
      listvalue:
        fSizeValues.length === 1
          ? list_font_size
          : ['mixed', ...list_font_size],
      onselect: option => {
        if (!isNaN(parseFloat(option))) {
          handleEditTypo({ fontSize: parseFloat(option) })
        }
      },
      extend: true
    })
    btn_select_font_size.style.flex = 1
    div_font_size_weight.appendChild(btn_select_font_size)
    // if (listTextStyle.some(e => e.CateID !== EnumCate.chart)) {
    // row contain edit line-height & letter spacing
    let div_height_spacing = document.createElement('div')
    div_height_spacing.className = 'row'
    $(div_height_spacing).css({
      width: '100%',
      'box-sizing': 'border-box',
      padding: '8px 4px 0 0'
    })
    text_style_attribute.appendChild(div_height_spacing)
    // input line-height
    let lineHeightValues = listTextStyle.filterAndMap(wb =>
      window.getComputedStyle(wb.value).lineHeight.replace('px', '')
    )
    let input_line_height = _textField({
      width: '100%',
      icon: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/line-height.svg',
      value: lineHeightValues.length === 1 ? lineHeightValues[0] : 'mixed',
      onBlur: function (ev) {
        if (
          ev.target.value.toLowerCase() === 'auto' ||
          ev.target.value.toLowerCase() === 'normal'
        ) {
          handleEditTypo({ height: null })
        } else if (!isNaN(parseFloat(ev.target.value))) {
          handleEditTypo({ height: parseFloat(ev.target.value) })
        }
      }
    })
    $(input_line_height).css({ flex: 1, 'margin-right': '8px' })
    div_height_spacing.appendChild(input_line_height)
    // input letter spacing
    let lSpacingValues = listTextStyle.filterAndMap(wb =>
      window.getComputedStyle(wb.value).letterSpacing.replace('px', '')
    )
    let input_letter_spacing = _textField({
      width: '100%',
      value: lSpacingValues.length === 1 ? lSpacingValues[0] : 'mixed',
      icon: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/letter-spacing.svg',
      iconSize: '28px',
      onBlur: function (ev) {
        if (
          ev.target.value.toLowerCase() === 'auto' ||
          ev.target.value.toLowerCase() === 'normal'
        ) {
          handleEditTypo({ letterSpacing: null })
        } else if (!isNaN(parseFloat(ev.target.value))) {
          handleEditTypo({ letterSpacing: parseFloat(ev.target.value) })
        }
      }
    })
    input_letter_spacing.style.flex = 1
    div_height_spacing.appendChild(input_letter_spacing)
    // }
  }
  // if (listTextStyle.some(e => e.CateID !== EnumCate.chart)) {
  // group btn select text auto size
  let autoSizeValues = listTextStyle.filterAndMap(wb => {
    switch (wb.value.getAttribute('width-type')) {
      case 'fit':
        return TextAutoSize.autoWidth
      default:
        if (wb.value.getAttribute('height-type') === 'fit') {
          return TextAutoSize.autoHeight
        } else {
          return TextAutoSize.fixedSize
        }
    }
  })
  let group_btn_auto_size = _groupBtnSelect({
    initvalue: autoSizeValues.length > 1 ? 'mixed' : autoSizeValues[0],
    listvalue: [
      {
        attribute: TextAutoSize.autoWidth,
        src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/auto-width.svg'
      },
      {
        attribute: TextAutoSize.autoHeight,
        src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/auto-height.svg'
      },
      {
        attribute: TextAutoSize.fixedSize,
        src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/fixed-size.svg'
      }
    ],
    onselect: value => {
      switch (value) {
        case TextAutoSize.autoWidth:
          handleEditOffset({ width: null, height: null })
          break
        case TextAutoSize.autoHeight:
          handleEditOffset({ width: 'fixed', height: null })
          break
        case TextAutoSize.fixedSize:
          handleEditOffset({ width: 'fixed', height: 'fixed' })
          break
        default:
          break
      }
      reloadEditConstraintsBlock()
      updateUISelectBox()
    }
  })
  group_btn_auto_size.id = 'group_btn_text_auto_size'
  group_btn_auto_size.style.margin = '8px'
  editContainer.appendChild(group_btn_auto_size)
  let _row = document.createElement('div')
  _row.className = 'row'
  _row.style.padding = '0 8px 8px 8px'
  editContainer.appendChild(_row)
  // group btn select text align
  let textAlignValues = listTextStyle.filterAndMap(
    wb => window.getComputedStyle(wb.value).textAlign
  )
  let group_btn_text_align = _groupBtnSelect({
    initvalue: textAlignValues.length > 1 ? 'mixed' : textAlignValues[0],
    listvalue: [
      {
        attribute: TextAlign.left,
        src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text-align-left.svg'
      },
      {
        attribute: TextAlign.center,
        src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text-align-center.svg'
      },
      {
        attribute: TextAlign.right,
        src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text-align-right.svg'
      }
    ],
    onselect: value => {
      handleEditTypo({ textAlign: value })
      reloadEditTypoBlock()
    }
  })
  _row.appendChild(group_btn_text_align)
  // group btn select text align vertical
  let alignVerticalValues = listTextStyle.filterAndMap(
    wb => window.getComputedStyle(wb.value).alignItems
  )
  let group_btn_text_align_vertical = _groupBtnSelect({
    initvalue:
      alignVerticalValues.length > 1 ? 'mixed' : alignVerticalValues[0],
    listvalue: [
      {
        attribute: TextAlignVertical.top,
        src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text-align-vertical-top.svg'
      },
      {
        attribute: TextAlignVertical.middle,
        src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text-align-vertical-center.svg'
      },
      {
        attribute: TextAlignVertical.bottom,
        src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text-align-vertical-bottom.svg'
      }
    ],
    onselect: value => {
      handleEditTypo({ alignVertical: value })
      reloadEditTypoBlock()
    }
  })
  group_btn_text_align_vertical.style.marginLeft = '42px'
  _row.appendChild(group_btn_text_align_vertical)
  // }
  return editContainer
}

function _groupBtnSelect({ initvalue, listvalue = [], onselect }) {
  let group_btn_select = document.createElement('div')
  group_btn_select.className = 'group_btn_select'
  group_btn_select.replaceChildren(
    ...listvalue.map(vl => {
      let option = document.createElement('img')
      option.src = vl.src
      option.style.width = '24px'
      option.style.height = '24px'
      if (initvalue === vl.attribute) option.style.backgroundColor = '#e5e5e5'
      option.onclick = function () {
        onselect(vl.attribute)
        group_btn_select.querySelectorAll('img').forEach(e => {
          if (e !== option) e.style.backgroundColor = null
          else e.style.backgroundColor = '#e5e5e5'
        })
      }
      return option
    })
  )
  return group_btn_select
}

function reloadEditTypoBlock() {
  let newEditTextStyle = EditTypoBlock()
  document.getElementById('edit_text_style').replaceWith(newEditTextStyle)
}

function _btnInputSelect({
  initvalue = '',
  listvalue = [],
  onselect,
  extend = false
}) {
  let btn_select = document.createElement('div')
  btn_select.className = 'btn_input_select'
  btn_select.innerHTML = `<input value="${initvalue}"/><i class="fa-solid fa-chevron-down"></i>`
  $(btn_select).on('focus', 'input', function () {
    initvalue = this.value
    this.setSelectionRange(0, this.value.length)
  })
  $(btn_select).on('blur', 'input', function () {
    // func edit font family
    if (extend) {
      onselect(this.value)
    } else if (
      listvalue
        .filter(vl => vl != 'mixed')
        .some(vl => vl.toString().toLowerCase() === this.value.toLowerCase())
    ) {
      onselect(
        listvalue.find(vl => vl.toLowerCase() === this.value.toLowerCase())
      )
    } else {
      this.value = initvalue
    }
  })
  $(btn_select).on('click', '.fa-chevron-down', function () {
    setTimeout(function () {
      document.body
        .querySelectorAll('div[id="body"] > .popup_select')
        .forEach(e => e.remove())
      let popup_select = document.createElement('div')
      let popupOffset = btn_select.getBoundingClientRect()
      popup_select.className = 'popup_select col wini_popup popup_remove'
      popup_select.style.left = popupOffset.x + 'px'
      popup_select.style.top = popupOffset.y + 'px'
      popup_select.style.width = btn_select.offsetWidth + 'px'
      popup_select.replaceChildren(
        ...listvalue.map(vl => {
          let option = document.createElement('div')
          if (vl != 'mixed')
            option.onclick = function (e) {
              e.stopPropagation()
              initvalue = vl
              btn_select.querySelector('input').value = vl
              onselect(vl)
              popup_select.remove()
            }
          option.innerHTML = `<i class="fa-solid fa-check" style="color: #ffffff;margin-right: 8px;opacity: ${vl === initvalue ? 1 : 0
            }"></i><span class="semibold2" style="color: #ffffff">${vl}</span>`
          return option
        })
      )
      document.getElementById('body').appendChild(popup_select)
      if (
        popup_select.getBoundingClientRect().bottom > document.body.offsetHeight
      ) {
        popup_select.style.height = `${document.body.offsetHeight - popup_select.getBoundingClientRect().top
          }px`
        popup_select.style.overflowY = 'scroll'
      }
    }, 200)
  })
  return btn_select
}

function _btnDropDownSelect({ initvalue = '', listvalue = [], onselect }) {
  let isString = typeof listvalue[0] === 'string'
  let btnDropDownSelect = document.createElement('div')
  btnDropDownSelect.className = 'btn_dropdown_select'
  btnDropDownSelect.innerHTML = `<span>${initvalue}</span><i class="fa-solid fa-chevron-down"></i>`
  btnDropDownSelect.onclick = function () {
    setTimeout(function () {
      document.body
        .querySelectorAll('div[id="body"] > .popup_select')
        .forEach(popup => popup.remove())
      let popupOffset = btnDropDownSelect.getBoundingClientRect()
      let popup_select_option = document.createElement('div')
      popup_select_option.className = 'popup_select col wini_popup popup_remove'
      popup_select_option.style.left = popupOffset.x + 'px'
      popup_select_option.style.top = popupOffset.y + 'px'
      popup_select_option.style.width = btnDropDownSelect.offsetWidth + 'px'
      popup_select_option.replaceChildren(
        ...listvalue.map(vl => {
          let option = document.createElement('div')
          if (isString ? vl != 'mixed' : vl.value != 'mixed')
            option.onclick = function (e) {
              e.stopPropagation()
              initvalue = vl
              btnDropDownSelect.querySelector('span').value = isString
                ? vl
                : vl.title
              onselect(vl)
              popup_select_option.remove()
            }
          option.innerHTML = `<i class="fa-solid fa-check" style="color: #ffffff;margin-right: 8px;opacity: ${vl === initvalue ? 1 : 0
            }"></i><span class="semibold2" style="color: #ffffff">${isString ? vl : vl.title
            }</span>`
          return option
        })
      )
      document.getElementById('body').appendChild(popup_select_option)
    }, 200)
  }
  return btnDropDownSelect
}

let list_border_style = [
  BorderStyle.dashed,
  BorderStyle.dotted,
  BorderStyle.double,
  BorderStyle.groove,
  BorderStyle.inset,
  BorderStyle.solid
]

//! border
function EditBorderBlock() {
  let listBorder = selected_list.filter(wb =>
    ['w-checkbox', ...WbClass.borderEffect].some(e =>
      wb.value.classList.contains(e)
    )
  )
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-border'
  editContainer.className = 'edit-container col'

  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  header.innerHTML = `<p>Border</p>
  <button class="action-button skin-btn bg-header-action"></button>
  <i class="fa-solid fa-plus fa-sm bg-header-action"></i>`
  editContainer.appendChild(header)

  //
  const borderSide = [
    'border',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left'
  ]
  let listBorderSkin = listBorder.filterAndMap(wb => {
    for (let side of borderSide) {
      if (wb.value.style[side]) {
        return wb.value.style[side].match(uuid4Regex)
          ? wb.value.style[side].replace(/(var\(--|\))/g, '')
          : wb.value.style[side]
      }
    }
    let rule = StyleDA.docStyleSheets.find(cssRule =>
      [...divSection.querySelectorAll(cssRule.selectorText)].includes(wb.value)
    )
    if (rule)
      for (let side of borderSide) {
        if (rule.style[side]) {
          return rule.style[side].match(uuid4Regex)
            ? rule.style[side].replace(/(var\(--|\))/g, '')
            : rule.style[side]
        }
      }
    return null
  })
  if (listBorderSkin.length === 1 && listBorderSkin[0]?.length === 36) {
    header.querySelector('.fa-plus').remove()
    header.querySelector('.skin-btn').remove()
    let borderItem = StyleDA.listSkin.find(
      skin => listBorderSkin[0] === skin.GID
    )
    let cateItem = CateDA.list_border_cate.find(e => e.ID === borderItem.CateID)
    let skin_tile = wbaseSkinTile({
      cate: EnumCate.border,
      prefixValue: Ultis.rgbToHex(
        window.getComputedStyle(listBorder[0].value).borderColor
      ),
      title: (cateItem ? `${cateItem.Name}/` : '') + borderItem.Name,
      onClick: function () {
        let offset = header.getBoundingClientRect()
        createDropdownTableSkin({
          cate: EnumCate.border,
          offset: offset,
          currentSkinID: borderItem.GID,
          cssText: borderItem.Css
        })
      },
      onRemove: function () {
        deleteBorder()
        reloadEditBorderBlock()
      }
    })
    editContainer.appendChild(skin_tile)
  } else if (listBorderSkin.some(vl => vl?.length === 36)) {
    let notiText = document.createElement('span')
    notiText.className = 'regular1'
    notiText.style.margin = '4px 8px'
    notiText.innerHTML = 'Choose a border skin to replace mixed content'
    editContainer.appendChild(notiText)
  } else {
    listBorderSkin = listBorderSkin.filter(e => e !== null)
    //
    if (listBorderSkin.length > 0) {
      header.querySelector('.fa-plus').remove()
      let borderColorValues = listBorder.filterAndMap(wb =>
        Ultis.rgbToHex(window.getComputedStyle(wb.value).borderColor)
      )
      if (borderColorValues.length == 1) {
        let formEditColor = createEditColorForm({
          value: borderColorValues[0],
          onchange: params => {
            handleEditBorder({ color: params, onSubmit: false })
          },
          onsubmit: params => {
            handleEditBorder({ color: params })
            reloadEditBorderBlock()
          },
          ondelete: () => {
            deleteBorder()
            reloadEditBorderBlock()
          }
        })
        editContainer.appendChild(formEditColor)
      }

      let formEditLine = document.createElement('div')
      formEditLine.id = 'form-edit-style'
      formEditLine.className = 'row'
      formEditLine.style.paddingLeft = '4px'
      formEditLine.style.justifyContent = 'space-between'
      editContainer.appendChild(formEditLine)
      let borderStyles = listBorder.filterAndMap(
        wb =>
          window
            .getComputedStyle(wb.value)
            .borderStyle.split(' ')
            .filter(e => e !== 'none')[0]
      )
      let btnSelectStyle = _btnDropDownSelect({
        initvalue: borderStyles.length > 1 ? 'mixed' : borderStyles[0],
        listvalue:
          borderStyles.length === 1
            ? list_border_style
            : ['mixed', ...list_border_style],
        onselect: value => {
          handleEditBorder({ style: value })
          reloadEditBorderBlock()
        }
      })
      btnSelectStyle.style.width = '88px'
      formEditLine.appendChild(btnSelectStyle)
      //
      let widthValues = listBorder.filterAndMap(
        wb =>
          window
            .getComputedStyle(wb.value)
            .borderWidth.split(' ')
            .map(e => parseFloat(e.replace('px', '')))
            .sort((a, b) => b - a)[0]
      )
      let edit_stroke_width = _textField({
        width: '60px',
        icon: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/stroke-width.svg',
        value: widthValues.length > 1 ? 'mixed' : widthValues[0],
        iconSize: '28px',
        onBlur: function (ev) {
          let newValue = parseFloat(ev.target.value)
          if (!isNaN(newValue)) {
            handleEditBorder({ width: ev.target.value })
          }
        }
      })
      formEditLine.appendChild(edit_stroke_width)

      let action_edit_line_container = document.createElement('div')
      action_edit_line_container.className = 'action-container'
      formEditLine.appendChild(action_edit_line_container)

      let sideValues = listBorder.filterAndMap(wb => {
        let borderW = window.getComputedStyle(wb.value).borderWidth.split(' ')
        switch (borderW.length) {
          case 1:
            return BorderSide.all
          case 2:
            if (parseFloat(borderW[0].replace('px', '')) > 0) {
              return BorderSide.top_bottom
            } else {
              return BorderSide.left_right
            }
          default: // case 4
            if (parseFloat(borderW[0].replace('px', '')) > 0) {
              return BorderSide.top
            } else if (parseFloat(borderW[1].replace('px', '')) > 0) {
              return BorderSide.right
            } else if (parseFloat(borderW[2].replace('px', '')) > 0) {
              return BorderSide.bottom
            } else {
              return BorderSide.left
            }
        }
      })

      const listBorderSide = [
        BorderSide.all,
        BorderSide.top,
        BorderSide.left,
        BorderSide.bottom,
        BorderSide.right,
        BorderSide.left_right,
        BorderSide.top_bottom
      ]

      let btnSelectBorderSide = document.createElement('button')
      btnSelectBorderSide.className = 'action-button'
      btnSelectBorderSide.onclick = function () {
        setTimeout(function () {
          document.body
            .querySelectorAll('div[id="body"] > .popup_select')
            .forEach(popup => popup.remove())
          let popupOffset = btnSelectBorderSide.getBoundingClientRect()
          let popup_select_option = document.createElement('div')
          popup_select_option.className =
            'popup_select col wini_popup popup_remove'
          popup_select_option.style.left = popupOffset.x + 'px'
          popup_select_option.style.top = popupOffset.y + 'px'
          popup_select_option.style.transform = 'translateX(-100%)'
          popup_select_option.replaceChildren(
            ...(sideValues.length === 1
              ? listBorderSide
              : ['mixed', ...listBorderSide]
            ).map(vl => {
              let option = document.createElement('div')
              if (vl != 'mixed')
                option.onclick = function (e) {
                  e.stopPropagation()
                  if (
                    selected_list.every(
                      wb => !wb.classList.contains('w-checkbox')
                    )
                  )
                    handleEditBorder({ side: vl })
                  popup_select_option.remove()
                }
              option.innerHTML = `<i class="fa-solid fa-check" style="color: #ffffff;margin-right: 8px;opacity: ${vl === sideValues[0] ? 1 : 0
                }"></i><div style="height: 16px; margin: 4px; background-image: url(https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/border-${vl === 'mixed' ? 'all' : vl
                }.svg)"></div><span class="semibold2" style="color: #ffffff; width: max-content">${vl}</span>`
              return option
            })
          )
          document.getElementById('body').appendChild(popup_select_option)
        }, 200)
      }
      btnSelectBorderSide.style.backgroundImage = `url(https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/border-${sideValues.length > 1 ? 'all' : sideValues[0]
        }-black.svg)`
      action_edit_line_container.appendChild(btnSelectBorderSide)

      // let edit_line_action2 = createButtonAction(
      //   'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/more-horizontal.svg',
      //   null,
      //   function () {}
      // )
      // action_edit_line_container.appendChild(edit_line_action2)
    }
  }
  $(header).on('click', '.skin-btn', function () {
    let offset = header.getBoundingClientRect()
    createDropdownTableSkin({
      cate: EnumCate.border,
      offset: offset,
      cssText: listBorderSkin[0]
    })
  })
  $(header).on('click', '.fa-plus', function () {
    addBorder()
    reloadEditBorderBlock()
  })
  return editContainer
}

function reloadEditBorderBlock() {
  let newEditBorder = EditBorderBlock()
  document.getElementById('edit-border').replaceWith(newEditBorder)
}

// let list_effect_type = [
//   ShadowType.inner,
//   ShadowType.dropdown,
//   ShadowType.layer_blur
// ]
// ! effect
function EditEffectBlock() {
  let listEffect = selected_list.filter(wb =>
    WbClass.borderEffect.some(e => wb.value.classList.contains(e))
  )
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-effect'
  editContainer.className = 'edit-container col'

  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  header.innerHTML = `<p>Effect</p>
  <button class="action-button skin-btn bg-header-action"></button>
  <i class="fa-solid fa-plus fa-sm bg-header-action"></i>`
  editContainer.appendChild(header)

  //
  const effectType = ['filter', 'box-shadow']
  let listEffectSkin = listEffect.filterAndMap(wb => {
    for (let side of effectType) {
      if (wb.value.style[side]) {
        return wb.value.style[side].match(uuid4Regex)
          ? wb.value.style[side].replace(/(var\(--|\))/g, '')
          : wb.value.style[side]
      }
    }
    let rule = StyleDA.docStyleSheets.find(cssRule =>
      [...divSection.querySelectorAll(cssRule.selectorText)].includes(wb.value)
    )
    if (rule)
      for (let side of effectType) {
        if (rule.style[side]) {
          return rule.style[side].match(uuid4Regex)
            ? rule.style[side].replace(/(var\(--|\))/g, '')
            : rule.style[side]
        }
      }
    return null
  })
  if (listEffectSkin.length === 1 && listEffectSkin[0]?.length === 36) {
    header.querySelector('.fa-plus').remove()
    header.querySelector('.skin-btn').remove()
    let effectItem = StyleDA.listSkin.find(
      skin => listEffectSkin[0] === skin.GID
    )
    let cateItem = CateDA.list_effect_cate.find(e => e.ID === effectItem.CateID)
    let skin_tile = wbaseSkinTile({
      cate: EnumCate.effect,
      title: (cateItem ? `${cateItem.Name}/` : '') + effectItem.Name,
      onClick: function () {
        let offset = header.getBoundingClientRect()
        createDropdownTableSkin(EnumCate.effect, offset, effectItem.GID)
      },
      onRemove: function () {
        deleteEffect()
        reloadEditEffectBlock()
      }
    })
    editContainer.appendChild(skin_tile)
  } else if (listEffectSkin.some(vl => vl?.length === 36)) {
    let notiText = document.createElement('span')
    notiText.className = 'regular1'
    notiText.style.margin = '4px 8px'
    notiText.innerHTML = 'Choose a border skin to replace mixed content'
    editContainer.appendChild(notiText)
  } else {
    listEffectSkin = listEffectSkin.filter(e => e !== null)
    if (listEffectSkin.length > 0) {
      header.querySelector('.fa-plus').remove()
      let div_select_eType = document.createElement('div')
      div_select_eType.className = 'row dropdown-effect-tile'
      editContainer.appendChild(div_select_eType)
      // popup edit effect type attribute
      let effect_setting = createButtonAction(
        'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/effect-settings.svg',
        null,
        function () {
          setTimeout(setEffectValue, 200)
        }
      )
      let popupEditEffect = document.createElement('div')
      popupEditEffect.className = 'popup-edit-effect col wini_popup'
      effect_setting.appendChild(popupEditEffect)
      let popup_title = document.createElement('span')
      popup_title.innerHTML = 'Drop shadow'
      popupEditEffect.appendChild(popup_title)
      let div_attribute = document.createElement('div')
      popupEditEffect.appendChild(div_attribute)
      let input_offsetX = _textField({
        id: 'edit_effect_offsetX',
        width: '84px',
        label: 'X',
        value: '0',
        onBlur: function () {
          if (!isNaN(parseFloat(this.value))) {
            handleEditEffect({ offX: parseFloat(this.value) })
          }
        }
      })
      let input_blur = _textField({
        id: 'edit_effect_blur',
        width: '84px',
        label: 'Blur',
        value: '0',
        onBlur: function () {
          if (!isNaN(parseFloat(this.value))) {
            handleEditEffect({ blurRadius: parseFloat(this.value) })
          }
        }
      })
      let input_offsetY = _textField({
        id: 'edit_effect_offsetY',
        width: '84px',
        label: 'Y',
        value: '0',
        onBlur: function () {
          if (!isNaN(parseFloat(this.value))) {
            handleEditEffect({ offY: parseFloat(this.value) })
          }
        }
      })
      let input_spread = _textField({
        id: 'edit_effect_spread',
        width: '84px',
        label: 'Spread',
        value: '0',
        onBlur: function () {
          if (!isNaN(parseFloat(this.value))) {
            handleEditEffect({ spreadRadius: parseFloat(this.value) })
          }
        }
      })
      let input_color = document.createElement('div')
      input_color.style.margin = '4px'
      div_attribute.replaceChildren(
        input_offsetX,
        input_blur,
        input_offsetY,
        input_spread,
        input_color
      )

      //
      function setEffectValue() {
        popupEditEffect.style.display = 'flex'
        if (eTypeValues === 'filter') {
          input_offsetX.style.display = 'none'
          input_offsetY.style.display = 'none'
          input_spread.style.display = 'none'
          input_color.style.display = 'none'
          input_color.replaceChildren()
          let blurValues = listEffect
            .filter(wb => window.getComputedStyle(wb.value).filter !== 'none')
            .filterAndMap(wb =>
              window
                .getComputedStyle(wb.value)
                .filter.replace(/(blur\(|px\))/g, '')
            )
          input_blur.querySelector('input').value =
            blurValues.length > 1 ? 'mixed' : blurValues[0]
        } else {
          let boxShadowList = listEffect
            .filter(
              wb => window.getComputedStyle(wb.value).boxShadow !== 'none'
            )
            .map(wb => {
              let wbShadow = window.getComputedStyle(wb.value).boxShadow
              let color = wbShadow.match(/(rgba|rgb)\(.*\)/g)[0]
              wbShadow = wbShadow.replace(color, '').trim().split(' ')
              return {
                x: parseFloat(wbShadow[0].replace('px')),
                y: parseFloat(wbShadow[1].replace('px')),
                blur: parseFloat(wbShadow[2].replace('px')),
                spread: parseFloat(wbShadow[3].replace('px')),
                color: Ultis.rgbToHex(color)
              }
            })
          let offXValues = boxShadowList.filterAndMap(vl => vl.x)
          let offYValues = boxShadowList.filterAndMap(vl => vl.y)
          let blurValues = boxShadowList.filterAndMap(vl => vl.blur)
          let spreadValues = boxShadowList.filterAndMap(vl => vl.spread)
          let colorValues = boxShadowList.filterAndMap(vl => vl.color)
          input_offsetX.style.display = null
          input_offsetY.style.display = null
          input_spread.style.display = null
          input_offsetX.querySelector('input').value =
            offXValues.length > 1 ? 'mixed' : offXValues[0]
          input_offsetY.querySelector('input').value =
            offYValues.length > 1 ? 'mixed' : offYValues[0]
          input_blur.querySelector('input').value =
            blurValues.length > 1 ? 'mixed' : blurValues[0]
          input_spread.querySelector('input').value =
            spreadValues.length > 1 ? 'mixed' : spreadValues[0]
          if (colorValues.length === 1) {
            input_color.replaceChildren(
              createEditColorForm({
                id: 'edit-effect-color',
                value: colorValues[0],
                onchange: params => {
                  handleEditEffect({ color: params, onSubmit: false })
                },
                onsubmit: params => {
                  handleEditEffect({ color: params })
                }
              })
            )
          } else input_color.replaceChildren()
        }
      }
      //

      let eTypeValues = listEffect.filterAndMap(wb =>
        window.getComputedStyle(wb.value).filter === 'none'
          ? 'box-shadow'
          : 'filter'
      )
      let btn_select_eType = _btnDropDownSelect({
        initvalue: eTypeValues.length > 1 ? 'mixed' : eTypeValues[0],
        listvalue:
          eTypeValues.length == 1 ? effectType : ['mixed', ...effectType],
        onselect: function (option) {
          handleEditEffect({ type: option })
          reloadEditEffectBlock()
        }
      })

      let btn_delete = document.createElement('i')
      btn_delete.className = 'fa-solid fa-minus row'
      btn_delete.onclick = function () {
        deleteEffect()
        reloadEditEffectBlock()
      }
      div_select_eType.replaceChildren(
        effect_setting,
        btn_select_eType,
        btn_delete
      )
    }
  }
  $(header).on('click', '.skin-btn', function () {
    let offset = header.getBoundingClientRect()
    createDropdownTableSkin({
      cate: EnumCate.effect,
      offset: offset,
      cssText: listEffectSkin[0]
    })
  })
  $(header).on('click', '.fa-plus', function () {
    addEffect()
    reloadEditEffectBlock()
  })

  return editContainer
}

function reloadEditEffectBlock() {
  let newEditEffect = EditEffectBlock()
  document.getElementById('edit-effect').replaceWith(newEditEffect)
}

function createEditColorForm({
  id,
  value = '#000000ff',
  onchange,
  onsubmit,
  ondelete,
  suffixAction
}) {
  let editColorTile = document.createElement('div')
  if (id) editColorTile.id = id
  editColorTile.className = 'edit-color-tile'
  editColorTile.style.padding = '0 4px'

  editColorTile.innerHTML = `<div class="parameter-form">
  <input type="color" value=${value.substring(0, 7)} class="color-picker"/>
  <input value="${value
      .replace('#', '')
      .substring(0, 6)
      .toUpperCase()}" class="edit-color-form"/><div class="ver-line"></div><input value="${Ultis.hexToPercent(
        value.replace('#', '').substring(6)
      )}%" class="edit-opacity-form"/>
  </div>
  ${suffixAction
      ? '<img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/buttonStyle.svg"/>'
      : '<div class="row"><i class="fa-regular fa-eye"></i><i class="fa-solid fa-minus"></i></div>'
    }`

  $(editColorTile).on('input', '.color-picker', function () {
    editColorTile.querySelector('.edit-color-form').value = this.value
      .replace('#', '')
      .toUpperCase()
    value = this.value + value.substring(7)
    onchange(value)
  })
  $(editColorTile).on('blur', '.color-picker', () => onsubmit(value))
  $(editColorTile).on('focus', '.edit-color-form', function () {
    this.setSelectionRange(0, this.value.length)
  })
  $(editColorTile).on('blur', '.edit-color-form', function () {
    if (this.value.match(hexRegex)) {
      value =
        this.value.match(hexRegex).input.replace('#', '').substring(0, 6) +
        value.substring(7)
      editColorTile.querySelector('.color-picker').value = `#${value}`
      this.value = value.toUpperCase()
      onsubmit(`#${value}`)
    } else {
      this.value = value.replace('#', '').substring(0, 6).toUpperCase()
    }
  })
  $(editColorTile).on('blur', '.edit-opacity-form', function () {
    this.setSelectionRange(0, this.value.length)
  })
  $(editColorTile).on('blur', '.edit-opacity-form', function () {
    if (!isNaN(parseInt(this.value.replace('%', '')))) {
      onsubmit(
        value.substring(7) +
        Ultis.percentToHex(parseInt(this.value.replace('%', '')))
      )
    } else {
      this.value = Ultis.hexToPercent(value.replace('#', '').substring(6))
    }
  })
  if (ondelete) $(editColorTile).on('click', '.fa-minus', ondelete)
  else if (suffixAction)
    $(editColorTile).on('click', '.parameter-form + img', suffixAction)
  else editColorTile.querySelector('.fa-minus').style.display = 'none'
  //? </function>
  return editColorTile
}

function createButtonAction(src1, src2, action) {
  let changeIcon = false
  let button = document.createElement('button')
  button.className = 'action-button'

  let buttonIcon = document.createElement('img')
  buttonIcon.src = src1
  buttonIcon.style.pointerEvents = 'none'
  button.appendChild(buttonIcon)
  button.onclick = function (event) {
    if (event.target.className.includes(`${this.className}`)) {
      if (src2 != null) {
        changeIcon = !changeIcon
        buttonIcon.src = !changeIcon ? src1 : src2
      }
      setTimeout(action, 200)
    }
  }

  return button
}

function createDropdownTableSkin({ cate, offset, currentSkinID, cssText }) {
  let dropdown = document.createElement('div')
  dropdown.onclick = function (e) {
    e.stopPropagation()
    document
      .getElementById('body')
      .querySelector(':scope > .popupEditOrDelete')
      ?.remove()
  }
  dropdown.id = 'popup_table_skin'
  dropdown.className = 'wini_popup col popup_remove'
  dropdown.style.left = offset.x + 'px'
  dropdown.style.top = offset.y - 56 + 'px'
  switch (cate) {
    case EnumCate.color:
      var title = 'Color skin'
      break
    case EnumCate.typography:
      title = 'Typography skin'
      break
    case EnumCate.border:
      title = 'Border skin'
      break
    case EnumCate.effect:
      title = 'Effect skin'
      break
    default:
      return
  }
  dropdown.innerHTML = `<div class="col header_popup_skin">
  <div class="row title"><span>${title}</span><button class="action-button sort-btn"></button><button class="action-button add-skin-btn"></button></div>
  <div class="row search-skins"><i class="fa-solid fa-magnifying-glass fa-xs"></i><input placeholder="Search skins..."/></div>
  </div>`
  if (cssText) {
    $(dropdown).on('click', '.header_popup_skin .add-skin-btn', function () {
      setTimeout(function () {
        let popupAddSkin = document.getElementById('create_skin_popup')
        popupAddSkin.style.display = 'flex'
        popupAddSkin.querySelector('.popup-input').value = ''
        let prefixInput = popupAddSkin.querySelector(
          '.popup-body .box20.semibold4'
        )
        prefixInput.innerHTML = ''
        switch (cate) {
          case EnumCate.color:
            popupAddSkin.querySelector('.title_create_skin').innerHTML =
              'Create new color skin'
            prefixInput.style.backgroundColor = cssText
            break
          case EnumCate.typography:
            popupAddSkin.querySelector('.title_create_skin').innerHTML =
              'Create new typography skin'
            prefixInput.innerHTML = 'Ag'
            prefixInput.style.cssText = cssText
            prefixInput.style.fontSize = '14px'
            break
          case EnumCate.border:
            popupAddSkin.querySelector('.title_create_skin').innerHTML =
              'Create new border skin'
            prefixInput.style.backgroundColor = window.getComputedStyle(
              selected_list[0].value
            ).borderColor
            break
          case EnumCate.effect:
            popupAddSkin.querySelector('.title_create_skin').innerHTML =
              'Create new effect skin'
            prefixInput.style.backgroundImage =
              'url(https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/effect-settings.svg)'
            break
          default:
            break
        }
        $(popupAddSkin).on('click', '.confirm-button', () =>
          createNewSkin(cate, cssText)
        )
      }, 200)
    })
  } else {
    dropdown.querySelector('.header_popup_skin .add-skin-btn').remove()
  }
  $(dropdown).on('input', '.header_popup_skin input', function (e) {
    e.stopPropagation()
    searchSkins()
  })
  function searchSkins() {
    let searchContent = inputSearch.value.toLowerCase()
    if (searchContent.trim() == '') {
      let listTile = body.querySelectorAll('.cate-skin-tile, .skin_tile_option')
      listTile.forEach(tile => {
        tile.style.display = 'flex'
      })
    } else {
      body.querySelectorAll('.cate-skin-tile').forEach(cateSkTile => {
        let listSkinTile = cateSkTile.querySelectorAll('.skin_tile_option')
        let cateName = cateSkTile.querySelector(':scope > p')?.innerHTML
        if (cateName && cateName.toLowerCase().includes(searchContent)) {
          cateSkTile.style.display = 'flex'
        } else {
          let numberResult = 0
          listSkinTile.forEach(skinTile => {
            let skinName = skinTile.querySelector('.skin-name').innerHTML
            if (skinName.toLowerCase().includes(searchContent)) {
              skinTile.style.display = 'flex'
              numberResult++
            } else {
              skinTile.style.display = 'none'
            }
          })
          cateSkTile.style.display = numberResult ? 'flex' : 'none'
        }
      })
    }
  }
  document.getElementById('body').appendChild(dropdown)

  updateTableSkinBody(cate, currentSkinID)
  let dropdownRect = dropdown.getBoundingClientRect()
  if (dropdownRect.bottom > document.body.offsetHeight) {
    dropdown.style.top =
      offset.y -
      56 -
      (dropdownRect.bottom - document.body.offsetHeight) -
      2 +
      'px'
  }
}

function updateTableSkinBody(enumCate, currentSkinID) {
  let dropdown = document.getElementById('popup_table_skin')
  if (!dropdown) return
  let body = document.createElement('div')
  let noti_empty_skin = document.createElement('p')
  noti_empty_skin.style.margin = '8px 16px'
  noti_empty_skin.className = 'regular0 text-subtitle'

  switch (enumCate) {
    case EnumCate.color:
      if (StyleDA.listSkin.filter(e => e.Type === EnumCate.color).length == 0) {
        noti_empty_skin.innerHTML = 'No color skins.'
        body.replaceChildren(noti_empty_skin)
      } else {
        let list_color_cate = [
          { ID: EnumCate.color },
          ...CateDA.list_color_cate.sort((a, b) => a.Name - b.Name)
        ]
        body.replaceChildren(
          ...list_color_cate.map(cateItem =>
            createCateSkinHTML(cateItem, currentSkinID)
          )
        )
      }
      break
    case EnumCate.typography:
      if (
        StyleDA.listSkin.filter(e => e.Type === EnumCate.typography).length == 0
      ) {
        noti_empty_skin.innerHTML = 'No typography skins.'
        body.replaceChildren(noti_empty_skin)
      } else {
        let list_typo_cate = [
          { ID: EnumCate.typography },
          ...CateDA.list_typo_cate.sort((a, b) => a.Name - b.Name)
        ]
        body.replaceChildren(
          ...list_typo_cate.map(cateItem =>
            createCateSkinHTML(cateItem, currentSkinID)
          )
        )
      }

      break
    case EnumCate.border:
      if (
        StyleDA.listSkin.filter(e => e.Type === EnumCate.border).length == 0
      ) {
        noti_empty_skin.innerHTML = 'No border skins.'
        body.replaceChildren(noti_empty_skin)
      } else {
        let list_border_cate = [
          { ID: EnumCate.border },
          ...CateDA.list_border_cate.sort((a, b) => a.Name - b.Name)
        ]
        body.replaceChildren(
          ...list_border_cate.map(cateItem =>
            createCateSkinHTML(cateItem, currentSkinID)
          )
        )
      }

      break
    case EnumCate.effect:
      if (
        StyleDA.listSkin.filter(e => e.Type === EnumCate.effect).length == 0
      ) {
        noti_empty_skin.innerHTML = 'No effect skins.'
        body.replaceChildren(noti_empty_skin)
      } else {
        let list_effect_cate = [
          { ID: EnumCate.effect },
          ...CateDA.list_effect_cate.sort((a, b) => a.Name - b.Name)
        ]
        body.replaceChildren(
          ...list_effect_cate.map(cateItem =>
            createCateSkinHTML(cateItem, currentSkinID)
          )
        )
      }

      break
    default:
      break
  }
  let currentBody = dropdown.querySelector(':scope > .body_popup_skin')
  if (currentBody) {
    currentBody.replaceWith(body)
  } else {
    dropdown.appendChild(body)
  }
  body.className = 'body_popup_skin'
  if (currentSkinID) {
    let usingSkin = document.getElementById(`skinID:${currentSkinID}`)
    if (usingSkin) {
      usingSkin.style.background = '#E6F7FF'
      body.scrollTo({
        top: (usingSkin.offsetTop ?? 0) - 36,
        behavior: 'smooth'
      })
    }
  }
}

function createCateSkinHTML(cateItem, currentSkinID) {
  let cateContainer = document.createElement('div')
  cateContainer.className = `CateItemID:${cateItem.ID} col cate-skin-tile`
  cateContainer.style.width = '100%'
  let childrenHTML = []
  if (cateItem.ParentID || selected_list.length == 0) {
    let cate_title = document.createElement('p')
    cate_title.className = 'semibold1'
    cate_title.style.paddingLeft = '0.8rem'
    cate_title.style.color = '#b2b2b2'
    cate_title.innerHTML = `${cateItem.Name}`
    if (cateItem.ParentID && selected_list.length == 0) {
      let cateTitleTile = document.createElement('div')
      cateTitleTile.className = 'row'
      let prefixIcon = document.createElement('i')
      prefixIcon.className = 'fa-solid fa-caret-down fa-2xs'
      prefixIcon.style.color = '#b2b2b2'
      prefixIcon.style.marginLeft = '0.8rem'
      prefixIcon.style.padding = '1rem'
      let isShow = true
      prefixIcon.onclick = function (e) {
        e.stopPropagation()
        isShow = !isShow
        if (isShow) {
          prefixIcon.className = 'fa-solid fa-caret-down fa-2xs'
        } else {
          prefixIcon.className = 'fa-solid fa-caret-right fa-2xs'
        }
      }
      cateTitleTile.appendChild(prefixIcon)
      cate_title.style.margin = '0.6rem 0'
      cateTitleTile.appendChild(cate_title)
      childrenHTML.push(cateTitleTile)
    } else {
      cate_title.style.margin = '0.8rem'
      childrenHTML.push(cate_title)
    }
  }
  let enumCate = cateItem.ParentID ?? cateItem.ID
  let skin_list = StyleDA.listSkin.filter(
    e =>
      e.Type === enumCate &&
      e.CateID === cateItem.ID &&
      e.ProjectID === ProjectDA.obj.ID
  )
  childrenHTML.push(
    ...skin_list.map(skin => {
      let skin_tile = createSkinTileHTML(enumCate, skin)
      if (skin.GID == currentSkinID) {
        skin_tile.style.backgroundColor = '#E6F7FF'
      }
      return skin_tile
    })
  )
  if (
    cateContainer.querySelectorAll(':scope > .skin_tile_option').length &&
    [
      EnumCate.color,
      EnumCate.typography,
      EnumCate.border,
      EnumCate.effect
    ].every(ct => cateItem.ID !== ct)
  )
    return document.createElement('div')
  cateContainer.replaceChildren(...childrenHTML)
  return cateContainer
}

function createSkinTileHTML(enumCate, jsonSkin) {
  let skin_tile = document.createElement('button')
  skin_tile.id = `skinID:${jsonSkin.GID}`
  skin_tile.className = 'skin_tile_option'
  if (selected_list.length == 0 && jsonSkin.CateID != enumCate) {
    skin_tile.style.paddingLeft = '36px'
  }
  let action_edit = document.createElement('i')
  if (jsonSkin.ProjectID != ProjectDA.obj.ID) {
    action_edit.className = 'fa-regular fa-circle-question fa-lg'
    action_edit.style.display = 'flex'
    action_edit.style.color = '#1890ff'
    skin_tile.style.pointerEvents = 'none'
  } else {
    action_edit.className = 'fa-solid fa-sliders fa-lg'
    action_edit.onclick = showEditSkin
  }
  function showEditSkin(e) {
    e.stopPropagation()
    let popupEdit = popupEditSkin(enumCate, jsonSkin)
    popupEdit.style.top = e.pageY + 'px'
    popupEdit.style.left = e.pageX + 'px'
    document.getElementById('body').appendChild(popupEdit)
    if (
      popupEdit.getBoundingClientRect().bottom >= document.body.offsetHeight
    ) {
      popupEdit.style.top = `${document.body.offsetHeight - popupEdit.offsetHeight
        }px`
    }
  }
  skin_tile.onauxclick = function (e) {
    e.stopPropagation()
    let projectViewBody = document.getElementById('body')
    projectViewBody.querySelector('.popupEditOrDelete')?.remove()
    let popupEditOrDelete = document.createElement('div')
    popupEditOrDelete.className =
      'popupEditOrDelete col wini_popup popup_remove'
    popupEditOrDelete.style.top = e.pageY + 'px'
    popupEditOrDelete.style.left = e.pageX + 'px'
    popupEditOrDelete.style.zIndex = projectViewBody.childNodes.length
    let options = [
      {
        title: 'Edit',
        click: showEditSkin
      },
      {
        title: 'Delete',
        click: function (e) {
          e.stopPropagation()
          StyleDA.deleteStyleSheet(jsonSkin)
          skin_tile.remove()
        }
      }
    ]
    popupEditOrDelete.replaceChildren(
      ...options.map(option => {
        let optionTile = document.createElement('div')
        optionTile.innerHTML = option.title
        optionTile.onclick = function (e) {
          option.click(e)
          popupEditOrDelete.remove()
        }
        return optionTile
      })
    )
    projectViewBody.appendChild(popupEditOrDelete)
    if (
      popupEditOrDelete.getBoundingClientRect().right >
      document.body.offsetWidth
    ) {
      popupEditOrDelete.style.left = null
      popupEditOrDelete.style.right = '0px'
    }
  }
  switch (enumCate) {
    case EnumCate.color:
      skin_tile.onclick = function (e) {
        e.stopPropagation()
        if (selected_list.length > 0) {
          const editType = document
            .getElementById('popup_table_skin')
            .getAttribute('edit-type')
          switch (editType) {
            case 'typo':
              handleEditTypo({ colorSkin: jsonSkin })
              reloadEditTypoBlock()
              break
            default:
              if (editType) {
                handleEditIconColor({ prop: editType, colorSkin: jsonSkin })
                reloadEditIconColorBlock()
              } else {
                handleEditBackground({ colorSkin: jsonSkin })
                reloadEditBackgroundBlock()
              }
              break
          }
          document
            .querySelectorAll('.popup_remove')
            .forEach(popup => popup.remove())
        }
      }
      skin_tile.innerHTML = `<div class="prefix-tile" style="background-color: ${jsonSkin.Css}"></div><div class="skin-name">${jsonSkin.Name}</div>`
      break
    case EnumCate.typography:
      skin_tile.onclick = function (e) {
        e.stopPropagation()
        if (selected_list.length > 0) {
          handleEditTypo({ typoSkin: jsonSkin })
          document
            .querySelectorAll('.popup_remove')
            .forEach(popup => popup.remove())
          reloadEditTypoBlock()
        }
      }
      skin_tile.innerHTML = `<div class="prefix-tile"><p style="font: ${jsonSkin.Css}">Ag</p></div><div class="row"><p class="skin-name">${jsonSkin.Name}</p><p style="font-size: 11px; color: #bfbfbf"></p></div>`
      setTimeout(function () {
        let prefixSt = window.getComputedStyle(
          skin_tile.querySelector('.prefix-tile > p')
        )
        skin_tile.querySelector(
          '.skin-name + p'
        ).innerHTML = `&nbsp . ${prefixSt.fontSize}/${prefixSt.lineHeight}`
      }, 100)
      break
    case EnumCate.border:
      skin_tile.onclick = function (e) {
        e.stopPropagation()
        if (selected_list.length > 0) {
          handleEditBorder({ borderSkin: jsonSkin })
          document
            .querySelectorAll('.popup_remove')
            .forEach(popup => popup.remove())
          reloadEditBorderBlock()
        }
      }
      skin_tile.innerHTML = `<div class="prefix-tile" style="border: ${jsonSkin.Css};border-width: 5px !important"></div><div class="skin-name">${jsonSkin.Name}</div>`
      break
    case EnumCate.effect:
      skin_tile.onclick = function (e) {
        e.stopPropagation()
        if (selected_list.length > 0) {
          handleEditEffect({ effectSkin: jsonSkin })
          document
            .querySelectorAll('.popup_remove')
            .forEach(popup => popup.remove())
          reloadEditEffectBlock()
        }
      }
      skin_tile.innerHTML = `<div class="prefix-tile" style="background-image: url(https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/effect-settings.svg);border-color: transparent"></div><div class="skin-name">${jsonSkin.Name}</div>`
      break
    default:
      break
  }
  skin_tile.appendChild(action_edit)
  return skin_tile
}

function popupEditSkin(enumCate, jsonSkin) {
  let divEditSkin = document.createElement('div')
  divEditSkin.id = 'popup_edit_skin'
  divEditSkin.className = 'wini_popup col popup_remove'
  handlePopupDispose(divEditSkin, function () {
    if (jsonSkin.CateID != -1) {
      switch (enumCate) {
        case EnumCate.color:
          ColorDA.edit(jsonSkin)
          break
        case EnumCate.typography:
          TypoDA.edit(jsonSkin)
          break
        case EnumCate.border:
          BorderDA.edit(jsonSkin)
          break
        case EnumCate.effect:
          EffectDA.edit(jsonSkin)
          break
        default:
          break
      }
    }
  })
  divEditSkin.onkeydown = function (e) {
    if (e.key == 'Enter' && document.activeElement.localName == 'input') {
      document.activeElement.blur()
    }
  }
  divEditSkin.onclick = function () {
    document
      .getElementById('body')
      .querySelectorAll(':scope > .popup_select')
      .forEach(popupSelect => (popupSelect.style.display = 'none'))
  }
  let header = document.createElement('div')
  header.className = 'row header_popup_skin'
  divEditSkin.appendChild(header)
  let title = document.createElement('span')
  title.style.pointerEvents = 'none'
  title.style.flex = 1
  title.innerHTML = 'Edit skin'
  header.appendChild(title)
  let btn_close = document.createElement('i')
  btn_close.className = 'fa-solid fa-xmark'
  btn_close.style.padding = '12px'
  btn_close.onclick = function (e) {
    e.stopImmediatePropagation()
    divEditSkin.remove()
  }
  header.appendChild(btn_close)
  let body = document.createElement('div')
  body.style.width = '100%'
  body.style.height = '100%'
  body.style.flex = 1
  divEditSkin.appendChild(body)
  let editName = document.createElement('input')
  editName.value = jsonSkin.Name
  editName.className = 'edit_skin_name'
  editName.onfocus = function () {
    this.setSelectionRange(0, this.value.length)
  }
  body.appendChild(editName)
  let demoDiv = document.createElement('div')
  demoDiv.style.height = '122px'
  demoDiv.style.width = '100%'
  demoDiv.style.margin = '8px 0'
  demoDiv.style.boxSizing = 'border-box'
  demoDiv.style.overflow = 'hidden'
  demoDiv.style.position = 'relative'
  demoDiv.style.backgroundImage = `url(${SVGIcon.background_img_default})`
  body.appendChild(demoDiv)
  let property_text = document.createElement('p')
  property_text.innerHTML = 'Properties'
  property_text.style.fontSize = '12px'
  property_text.style.fontWeight = '600'
  property_text.style.margin = '4px 0 4px 8px'
  body.appendChild(property_text)
  switch (enumCate) {
    case EnumCate.color:
      editName.onblur = function () {
        if (this.value != jsonSkin.Name) {
          let nameValue = this.value
            .replace('\\', '/')
            .split('/')
            .filter(_string => _string.trim() != '')
          if (nameValue.length > 0) {
            editColorSkin({ Name: this.value }, jsonSkin)
            this.value = jsonSkin.Name
          } else {
            this.value = thisSkin.Name
          }
        }
      }
      demoDiv.style.backgroundImage = 'none'
      demoDiv.style.backgroundColor = `#${jsonSkin.Value}`
      function updateColorSkin(newColor, onSubmit = true) {
        let thisSkin = ColorDA.list.find(e => e.GID == jsonSkin.GID)
        editColorSkin({ Value: newColor }, thisSkin, onSubmit)
        demoDiv.style.backgroundColor = `#${thisSkin.Value}`
      }
      let editColorValue = createEditColorForm({
        value: `#${jsonSkin.Value}`,
        onchange: newColor => {
          updateColorSkin(newColor, false)
        },
        onsubmit: updateColorSkin
      })
      body.appendChild(editColorValue)
      break
    case EnumCate.typography:
      editName.onblur = function () {
        if (this.value != jsonSkin.Name) {
          let nameValue = this.value
            .replace('\\', '/')
            .split('/')
            .filter(_string => _string.trim() != '')
          if (nameValue.length > 0) {
            editTypoSkin({ Name: this.value }, jsonSkin)
            this.value = jsonSkin.Name
          } else {
            this.value = thisSkin.Name
          }
        }
      }
      let demoText = document.createElement('p')
      demoText.innerHTML = 'Ag 123'
      demoText.style.position = 'absolute'
      demoText.style.margin = '0'
      demoText.style.left = '50%'
      demoText.style.top = '50%'
      demoText.style.transform = 'translate(-50%,-50%)'
      demoText.style.fontSize = `${jsonSkin.FontSize}px`
      if (jsonSkin.Height) {
        demoText.style.lineHeight = `${jsonSkin.Height}px`
      }
      demoText.style.FontWeight = jsonSkin.FontWeight
      demoText.style.fontFamily = jsonSkin.FontFamily
      demoText.style.letterSpacing = jsonSkin.LetterSpacing + 'px'
      demoText.style.color = `#${jsonSkin.ColorValue}`
      demoDiv.appendChild(demoText)
      // edit skin color
      let inputTextColor = createEditColorForm({
        value: `#${jsonSkin.ColorValue}`,
        onchange: newColor => {
          let thisSkin = TypoDA.list.find(e => e.GID == jsonSkin.GID)
          editTypoSkin({ ColorValue: newColor }, thisSkin, false)
          demoText.style.color = `#${thisSkin.ColorValue}`
        },
        onsubmit: newColor => {
          let thisSkin = TypoDA.list.find(e => e.GID == jsonSkin.GID)
          editTypoSkin({ ColorValue: newColor }, thisSkin)
          demoText.style.color = `#${thisSkin.ColorValue}`
        }
      })
      body.appendChild(inputTextColor)
      // select font-family
      let btn_select_font_family = _btnInputSelect(
        list_font_family,
        function (options) {
          for (let i = 0; i < options.length; i++) {
            if (jsonSkin.FontFamily == options[i].getAttribute('value')) {
              options[i].firstChild.style.opacity = 1
            } else {
              options[i].firstChild.style.opacity = 0
            }
          }
        },
        function (option) {
          let newFontFamily = list_font_family.find(
            e => e.toLowerCase() == option.toLowerCase()
          )
          if (newFontFamily) {
            let thisSkin = TypoDA.list.find(e => e.GID == jsonSkin.GID)
            editTypoSkin({ FontFamily: newFontFamily }, thisSkin)
            demoText.style.fontFamily = newFontFamily
            btn_select_font_family.firstChild.value = newFontFamily
          }
        }
      )
      btn_select_font_family.style.marginTop = '8px'
      btn_select_font_family.style.marginBottom = '8px'
      btn_select_font_family.firstChild.value = jsonSkin.FontFamily
      body.appendChild(btn_select_font_family)
      //
      let div_font_size_weight = document.createElement('div')
      div_font_size_weight.className = 'row'
      div_font_size_weight.style.width = '100%'
      body.appendChild(div_font_size_weight)
      // select font-weight
      let btn_select_font_weight = _btnDropDownSelect(
        list_font_weight,
        function (options) {
          for (let i = 0; i < options.length; i++) {
            if (options[i].getAttribute('value') == jsonSkin.fontWeight) {
              options[i].firstChild.style.opacity = 1
            } else {
              options[i].firstChild.style.opacity = 0
            }
          }
        },
        function (value) {
          let thisSkin = TypoDA.list.find(e => e.GID == jsonSkin.GID)
          editTypoSkin({ FontWeight: value }, thisSkin)
          demoText.style.fontWeight = value
          btn_select_font_weight.firstChild.innerHTML = value
        }
      )
      btn_select_font_weight.firstChild.innerHTML = jsonSkin.FontWeight
      div_font_size_weight.appendChild(btn_select_font_weight)
      // select font-size
      let btn_select_font_size = _btnInputSelect(
        list_font_size,
        function (options) {
          for (let i = 0; i < options.length; i++) {
            if (jsonSkin.FontSize == options[i].getAttribute('value')) {
              options[i].firstChild.style.opacity = 1
            } else {
              options[i].firstChild.style.opacity = 0
            }
          }
        },
        function (option) {
          if (btn_select_font_size.firstChild.value != option) {
            let thisSkin = TypoDA.list.find(e => e.GID == jsonSkin.GID)
            editTypoSkin({ FontSize: option }, thisSkin)
            demoText.style.fontSize = option
            btn_select_font_size.firstChild.value = option
          }
        },
        true
      )
      btn_select_font_size.style.flex = 1
      btn_select_font_size.firstChild.value = jsonSkin.FontSize
      div_font_size_weight.appendChild(btn_select_font_size)
      // row contain edit line-height & letter spacing
      let div_height_spacing = document.createElement('div')
      div_height_spacing.className = 'row'
      div_height_spacing.style.width = '100%'
      div_height_spacing.style.padding = '8px 4px 0 0'
      body.appendChild(div_height_spacing)
      // input line-height
      let input_line_height = _textField(
        '100%',
        'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/line-height.svg',
        undefined,
        '0',
        '25px'
      )
      input_line_height.style.flex = 1
      input_line_height.style.marginRight = '8px'
      input_line_height.lastChild.value = jsonSkin.Height
        ? jsonSkin.Height
        : 'Auto'
      input_line_height.lastChild.onblur = function () {
        let thisSkin = TypoDA.list.find(e => e.GID == jsonSkin.GID)
        if (this.value.toLowerCase() == 'auto') {
          editTypoSkin({ Height: this.value }, thisSkin)
          demoText.style.lineHeight = 'normal'
        } else if (!isNaN(parseFloat(this.value))) {
          editTypoSkin({ Height: parseFloat(this.value) }, thisSkin)
          demoText.style.lineHeight = parseFloat(this.value) + 'px'
        } else {
          this.value = thisSkin.Height
        }
      }
      div_height_spacing.appendChild(input_line_height)
      // input letter spacing
      let input_letter_spacing = _textField(
        '100%',
        'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/letter-spacing.svg',
        undefined,
        '0',
        '28px'
      )
      input_letter_spacing.id = 'input_letter_spacing'
      input_letter_spacing.style.flex = 1
      input_letter_spacing.lastChild.value = jsonSkin.LetterSpacing
      input_letter_spacing.lastChild.onblur = function () {
        let thisSkin = TypoDA.list.find(e => e.GID == jsonSkin.GID)
        if (!isNaN(parseFloat(this.value))) {
          editTypoSkin({ LetterSpacing: parseFloat(this.value) }, thisSkin)
          demoText.style.letterSpacing = parseFloat(this.value) + 'px'
        } else {
          this.value = thisSkin.LetterSpacing
        }
      }
      div_height_spacing.appendChild(input_letter_spacing)
      break
    case EnumCate.border:
      editName.onblur = function () {
        if (this.value != jsonSkin.Name) {
          let nameValue = this.value
            .replace('\\', '/')
            .split('/')
            .filter(_string => _string.trim() != '')
          if (nameValue.length > 0) {
            editBorderSkin({ Name: this.value }, jsonSkin)
            this.value = jsonSkin.Name
          } else {
            this.value = thisSkin.Name
          }
        }
      }
      let list_width = jsonSkin.Width.split(' ')
      demoDiv.style.borderTopWidth = list_width[0] + 'px'
      demoDiv.style.borderRightWidth = list_width[1] + 'px'
      demoDiv.style.borderBottomWidth = list_width[2] + 'px'
      demoDiv.style.borderLeftWidth = list_width[3] + 'px'
      demoDiv.style.borderStyle = jsonSkin.BorderStyle
      demoDiv.style.borderColor = `#${jsonSkin.ColorValue}`
      let inputBorderColor = createEditColorForm({
        value: `#${jsonSkin.ColorValue}`,
        onchange: newColor => {
          let thisSkin = BorderDA.list.find(e => e.GID == jsonSkin.GID)
          editBorderSkin({ ColorValue: newColor }, thisSkin, false)
          demoDiv.style.borderColor = `#${thisSkin.ColorValue}`
        },
        ondelete: newColor => {
          let thisSkin = BorderDA.list.find(e => e.GID == jsonSkin.GID)
          editBorderSkin({ ColorValue: newColor }, thisSkin)
          demoDiv.style.borderColor = `#${thisSkin.ColorValue}`
        }
      })
      body.appendChild(inputBorderColor)

      let formEditLine = document.createElement('div')
      formEditLine.className = 'edit-color-tile'
      formEditLine.style.paddingLeft = '4px'
      body.appendChild(formEditLine)

      let btnSelectStyle = _btnDropDownSelect(
        list_border_style,
        function (options) {
          for (let i = 1; i < options.length; i++) {
            let style = options[i].getAttribute('value')
            options[i].firstChild.style.opacity =
              style == jsonSkin.BorderStyle ? 1 : 0
          }
        },
        function (value) {
          let thisSkin = BorderDA.list.find(e => e.GID == jsonSkin.GID)
          btnSelectStyle.firstChild.innerHTML = value
          editBorderSkin({ BorderStyle: value }, thisSkin)
          demoDiv.style.borderStyle = value
        }
      )
      btnSelectStyle.firstChild.innerHTML = jsonSkin.BorderStyle
      formEditLine.appendChild(btnSelectStyle)

      let edit_stroke_width = _textField(
        '60px',
        'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/stroke-width.svg',
        undefined,
        '0',
        '28px'
      )
      let listWidth = jsonSkin.Width.split(' ')
      switch (jsonSkin.BorderSide) {
        case BorderSide.top:
          edit_stroke_width.lastChild.value = listWidth[0]
          break
        case BorderSide.right:
          edit_stroke_width.lastChild.value = listWidth[1]
          break
        case BorderSide.bottom:
          edit_stroke_width.lastChild.value = listWidth[2]
          break
        case BorderSide.left:
          edit_stroke_width.lastChild.value = listWidth[3]
          break
        default:
          if (listWidth.every(value => value == listWidth[0])) {
            edit_stroke_width.lastChild.value = listWidth[0]
          } else {
            edit_stroke_width.lastChild.value = 'mixed'
          }
          break
      }
      edit_stroke_width.lastChild.onblur = function () {
        if (!isNaN(parseFloat(this.value))) {
          let thisSkin = BorderDA.list.find(e => e.GID == jsonSkin.GID)
          group_custom_border_side.style.display = 'none'
          editBorderSkin({ Width: parseFloat(this.value) }, thisSkin)
          demoDiv.style.borderTopWidth = thisSkin.Width.split(' ')[0] + 'px'
          demoDiv.style.borderRightWidth = thisSkin.Width.split(' ')[1] + 'px'
          demoDiv.style.borderBottomWidth = thisSkin.Width.split(' ')[2] + 'px'
          demoDiv.style.borderLeftWidth = thisSkin.Width.split(' ')[3] + 'px'
        } else {
          let listWidth = jsonSkin.Width.split(' ')
          switch (jsonSkin.BorderSide) {
            case BorderSide.top:
              this.value = listWidth[0]
              break
            case BorderSide.right:
              this.value = listWidth[1]
              break
            case BorderSide.bottom:
              this.value = listWidth[2]
              break
            case BorderSide.left:
              this.value = listWidth[3]
              break
            default:
              if (listWidth.every(value => value == listWidth[0])) {
                this.value = listWidth[0]
              } else {
                this.value = 'mixed'
              }
              break
          }
        }
      }
      formEditLine.appendChild(edit_stroke_width)

      let btnSelectBorderSide = selectBorderSide(
        jsonSkin.BorderSide,
        function (value) {
          let thisSkin = BorderDA.list.find(e => e.GID == jsonSkin.GID)
          if (value == BorderSide.custom) {
            group_custom_border_side.style.display = 'flex'
            edit_stroke_width.lastChild.value =
              thisSkin.BorderSide == BorderSide.all
                ? thisSkin.Width.split(' ')[0]
                : 'mixed'
            editBorderSkin({ BorderSide: BorderSide.custom }, thisSkin)
            input_border_top.lastChild.value = thisSkin.Width.split(' ')[0]
            input_border_right.lastChild.value = thisSkin.Width.split(' ')[1]
            input_border_bottom.lastChild.value = thisSkin.Width.split(' ')[2]
            input_border_left.lastChild.value = thisSkin.Width.split(' ')[3]
          } else {
            editBorderSkin({ BorderSide: value }, thisSkin)
            group_custom_border_side.style.display = 'none'
            demoDiv.style.borderTopWidth = thisSkin.Width.split(' ')[0] + 'px'
            demoDiv.style.borderRightWidth = thisSkin.Width.split(' ')[1] + 'px'
            demoDiv.style.borderBottomWidth =
              thisSkin.Width.split(' ')[2] + 'px'
            demoDiv.style.borderLeftWidth = thisSkin.Width.split(' ')[3] + 'px'
          }
        }
      )
      formEditLine.appendChild(btnSelectBorderSide)

      let group_custom_border_side = document.createElement('div')
      body.appendChild(group_custom_border_side)
      group_custom_border_side.className = 'group_input_border_side'
      group_custom_border_side.style.display =
        jsonSkin.BorderSide == BorderSide.custom ? 'flex' : 'none'
      let input_border_left = _textField(
        '88px',
        'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/border-left-black.svg',
        undefined,
        '0',
        '36px'
      )
      input_border_left.style.marginLeft = '8px'
      input_border_left.lastChild.value = jsonSkin.Width.split(' ')[3]
      input_border_left.lastChild.onblur = function () {
        let left_width_value = parseFloat(this.value)
        let thisSkin = BorderDA.list.find(e => e.GID == jsonSkin.GID)
        if (left_width_value) {
          editBorderSkin({ LeftWidth: left_width_value }, thisSkin)
          demoDiv.style.borderLeftWidth = left_width_value + 'px'
        } else {
          this.value = thisSkin.Width.split(' ')[3]
        }
      }
      group_custom_border_side.appendChild(input_border_left)
      let input_border_top = _textField(
        '88px',
        'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/border-top-black.svg',
        undefined,
        '0',
        '36px'
      )
      input_border_top.style.marginRight = '8px'
      input_border_top.lastChild.value = jsonSkin.Width.split(' ')[0]
      input_border_top.lastChild.onblur = function () {
        let top_width_value = parseFloat(this.value)
        if (top_width_value) {
          editBorderSkin({ TopWidth: top_width_value }, thisSkin)
          demoDiv.style.borderTopWidth = top_width_value + 'px'
        } else {
          this.value = thisSkin.Width.split(' ')[0]
        }
      }
      group_custom_border_side.appendChild(input_border_top)
      let input_border_right = _textField(
        '88px',
        'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/border-right-black.svg',
        undefined,
        '0',
        '36px'
      )
      input_border_right.style.marginLeft = '8px'
      input_border_right.lastChild.value = jsonSkin.Width.split(' ')[1]
      input_border_right.lastChild.onblur = function () {
        let right_width_value = parseFloat(this.value)
        if (right_width_value) {
          editBorderSkin({ RightWidth: right_width_value }, thisSkin)
          demoDiv.style.borderRightWidth = right_width_value + 'px'
        } else {
          this.value = thisSkin.Width.split(' ')[1]
        }
      }
      group_custom_border_side.appendChild(input_border_right)
      let input_border_bottom = _textField(
        '88px',
        'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/border-bottom-black.svg',
        undefined,
        '0',
        '36px'
      )
      input_border_bottom.style.marginRight = '8px'
      input_border_bottom.lastChild.value = jsonSkin.Width.split(' ')[2]
      input_border_bottom.lastChild.onblur = function () {
        let bottom_width_value = parseFloat(this.value)
        if (bottom_width_value) {
          editBorderSkin({ BottomWidth: bottom_width_value }, thisSkin)
          demoDiv.style.borderBottomWidth = bottom_width_value + 'px'
        } else {
          this.value = thisSkin.Width.split(' ')[2]
        }
      }
      group_custom_border_side.appendChild(input_border_bottom)
      break
    case EnumCate.effect:
      editName.onblur = function () {
        if (this.value != jsonSkin.Name) {
          let nameValue = this.value
            .replace('\\', '/')
            .split('/')
            .filter(_string => _string.trim() != '')
          if (nameValue.length > 0) {
            editEffectSkin({ Name: this.value }, jsonSkin)
            this.value = jsonSkin.Name
          } else {
            this.value = thisSkin.Name
          }
        }
      }
      let demoShadow = document.createElement('div')
      demoShadow.style.width = '80px'
      demoShadow.style.height = '80px'
      demoShadow.style.borderRadius = '50%'
      demoShadow.style.left = '50%'
      demoShadow.style.top = '50%'
      demoShadow.style.position = 'absolute'
      demoShadow.style.transform = 'translate(-50%,-50%)'
      demoShadow.style.backgroundColor = 'white'
      if (jsonSkin.Type == ShadowType.layer_blur) {
        demoShadow.style.filter = `blur(${jsonSkin.BlurRadius}px)`
      } else {
        let effect_color = jsonSkin.ColorValue
        /* offset-x | offset-y | blur-radius | spread-radius | color */
        demoShadow.style.boxShadow = `${jsonSkin.OffsetX}px ${jsonSkin.OffsetY
          }px ${jsonSkin.BlurRadius}px ${jsonSkin.SpreadRadius
          }px #${effect_color} 
          ${jsonSkin.Type == ShadowType.inner ? 'inset' : ''}`
      }
      demoDiv.appendChild(demoShadow)
      //
      //
      let div_select_eType = document.createElement('div')
      div_select_eType.style.width = 'calc(100% - 16px)'
      div_select_eType.style.display = 'flex'
      div_select_eType.style.marginLeft = '8px'
      div_select_eType.style.alignItems = 'center'
      body.appendChild(div_select_eType)
      // popup edit effect type attribute
      let effect_setting = createButtonAction(
        'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/effect-settings.svg',
        null,
        function () {
          let thisSkin = EffectDA.list.find(e => e.GID == jsonSkin.GID)
          let popupEditEffect = document.createElement('div')
          let offset = effect_setting.getBoundingClientRect()
          popupEditEffect.style.left = offset.x - 8 + 'px'
          popupEditEffect.style.top = offset.y + 'px'
          popupEditEffect.style.transform = 'translate(-100%,-80%)'
          popupEditEffect.className = 'popup-edit-effect wini_popup col'
          let popup_title = document.createElement('span')
          popup_title.innerHTML = thisSkin.Type
          popupEditEffect.appendChild(popup_title)
          let btn_close = document.createElement('i')
          btn_close.className = 'fa-solid fa-xmark'
          btn_close.style.padding = '6px'
          btn_close.style.float = 'right'
          btn_close.onclick = function () {
            popupEditEffect.remove()
          }
          popup_title.appendChild(btn_close)
          let div_attribute = document.createElement('div')
          popupEditEffect.appendChild(div_attribute)
          if (thisSkin.Type != ShadowType.layer_blur) {
            let input_offsetX = _textField({
              width: '84px',
              label: 'X',
              value: thisSkin.OffsetX,
              onBlur: function (ev) {
                let thisSkin = EffectDA.list.find(e => e.GID == jsonSkin.GID)
                if (!isNaN(parseFloat(ev.target.value))) {
                  editEffectSkin(
                    { OffsetX: parseFloat(ev.target.value) },
                    thisSkin
                  )
                  demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY
                    }px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius}px #${thisSkin.ColorValue
                    } 
                        ${thisSkin.Type == ShadowType.inner ? 'inset' : ''}`
                } else {
                  ev.target.value = thisSkin.OffsetX
                }
              }
            })
            div_attribute.appendChild(input_offsetX)
          }
          let input_blur = _textField({
            width: '84px',
            label: 'Blur',
            value: thisSkin.BlurRadius,
            onBlur: function (ev) {
              let thisSkin = EffectDA.list.find(e => e.GID == jsonSkin.GID)
              if (!isNaN(parseFloat(ev.target.value))) {
                editEffectSkin(
                  { BlurRadius: parseFloat(ev.target.value) },
                  thisSkin
                )
                if (thisSkin.Type == ShadowType.layer_blur) {
                  demoShadow.style.filter = `blur(${thisSkin.BlurRadius}px)`
                } else {
                  let effect_color = thisSkin.ColorValue
                  demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY
                    }px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius
                    }px #${effect_color} 
                      ${thisSkin.Type == ShadowType.inner ? 'inset' : ''}`
                }
              } else {
                ev.target.value = thisSkin.BlurRadius
              }
            }
          })
          div_attribute.appendChild(input_blur)
          if (thisSkin.Type != ShadowType.layer_blur) {
            let input_offsetY = _textField({
              width: '84px',
              label: 'Y',
              value: thisSkin.OffsetY,
              onBlur: function (ev) {
                let thisSkin = EffectDA.list.find(e => e.GID == jsonSkin.GID)
                if (!isNaN(parseFloat(ev.target.value))) {
                  editEffectSkin(
                    { OffsetY: parseFloat(ev.target.value) },
                    thisSkin
                  )
                  demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY
                    }px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius}px #${thisSkin.ColorValue
                    } 
                      ${thisSkin.Type == ShadowType.inner ? 'inset' : ''}`
                } else {
                  ev.target.value = thisSkin.OffsetY
                }
              }
            })
            let input_spread = _textField({
              width: '84px',
              label: 'Spread',
              value: thisSkin.SpreadRadius,
              onBlur: function (ev) {
                let thisSkin = EffectDA.list.find(e => e.GID == jsonSkin.GID)
                if (!isNaN(parseFloat(ev.target.value))) {
                  editEffectSkin(
                    { SpreadRadius: parseFloat(ev.target.value) },
                    thisSkin
                  )
                  demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY
                    }px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius}px #${thisSkin.ColorValue
                    } 
                      ${thisSkin.Type == ShadowType.inner ? 'inset' : ''}`
                } else {
                  ev.target.value = thisSkin.OffsetY
                }
              }
            })
            div_attribute.appendChild(input_offsetY)
            div_attribute.appendChild(input_spread)
            let inputEffectColor = createEditColorForm({
              value: `#${thisSkin.ColorValue}`,
              onchange: newColor => {
                let thisSkin = EffectDA.list.find(e => e.GID == jsonSkin.GID)
                editEffectSkin({ ColorValue: newColor }, thisSkin, false)
                demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY
                  }px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius
                  }px #${newColor} 
                    ${thisSkin.Type == ShadowType.inner ? 'inset' : ''}`
              },
              onsubmit: newColor => {
                let thisSkin = EffectDA.list.find(e => e.GID == jsonSkin.GID)
                editEffectSkin({ ColorValue: newColor }, thisSkin)
                demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY
                  }px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius
                  }px #${newColor} 
                    ${thisSkin.Type == ShadowType.inner ? 'inset' : ''}`
              }
            })
            inputEffectColor.style.margin = '4px'
            div_attribute.appendChild(inputEffectColor)
          }
          document.getElementById('body').appendChild(popupEditEffect)
          if (
            popupEditEffect.getBoundingClientRect().bottom >=
            document.body.offsetHeight
          ) {
            popupEditEffect.style.top = `${document.body.offsetHeight - popupEditEffect.offsetHeight
              }px`
          }
        }
      )
      effect_setting.className = 'action-button'
      div_select_eType.appendChild(effect_setting)
      // select effect type
      let btn_select_eType = _btnDropDownSelect(
        list_effect_type,
        function (options) {
          let thisSkin = EffectDA.list.find(e => e.GID == jsonSkin.GID)
          for (let i = 0; i < options.length; i++) {
            if (options[i].getAttribute('value') == thisSkin.Type) {
              options[i].firstChild.style.opacity = 1
            } else {
              options[i].firstChild.style.opacity = 0
            }
          }
        },
        function (option) {
          let popupEditEffect = [
            ...document.getElementById('body').childNodes
          ].find(e => e.className?.includes('popup-edit-effect'))
          if (popupEditEffect) {
            popupEditEffect.style.display = 'none'
          }
          let thisSkin = EffectDA.list.find(e => e.GID == jsonSkin.GID)
          editEffectSkin({ Type: option }, thisSkin)
          btn_select_eType.firstChild.innerHTML = option
          if (thisSkin.Type == ShadowType.layer_blur) {
            demoShadow.style.filter = `blur(${thisSkin.BlurRadius}px)`
          } else {
            let effect_color = thisSkin.ColorValue
            /* offset-x | offset-y | blur-radius | spread-radius | color */
            demoShadow.style.boxShadow = `${thisSkin.OffsetX}px ${thisSkin.OffsetY
              }px ${thisSkin.BlurRadius}px ${thisSkin.SpreadRadius
              }px #${effect_color} 
              ${thisSkin.Type == ShadowType.inner ? 'inset' : ''}`
          }
        }
      )
      btn_select_eType.firstChild.innerHTML = jsonSkin.Type
      div_select_eType.appendChild(btn_select_eType)

      let btn_isShow = createButtonAction(
        'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/eye-outline.svg',
        'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/eye-close.svg',
        function () { }
      )
      btn_isShow.className = 'action-button'
      div_select_eType.appendChild(btn_isShow)
      //
      //
      break
    default:
      break
  }
  return divEditSkin
}

function wbaseSkinTile({
  cate,
  onClick,
  onRemove,
  prefixValue,
  title,
  handleUnlinkSkin
}) {
  let wbase_skin_tile = document.createElement('div')
  wbase_skin_tile.className = 'wbase_skin_tile row'
  let btn_table_skin = document.createElement('div')
  btn_table_skin.onclick = function () {
    setTimeout(onClick, 200)
  }
  let btn_unLink = document.createElement('div')
  btn_unLink.className = 'unlink-skin-btn'
  switch (cate) {
    case EnumCate.color:
      btn_table_skin.innerHTML = `<div style="width: 15px;height: 15px;border-radius: 50%;border: 0.5px solid #c4c4c4; background-color: ${prefixValue}"></div><p style="margin: 0 8px; flex: 1; text-align: left">${title}</p>`
      if (handleUnlinkSkin) {
        btn_unLink.onclick = handleUnlinkSkin
      } else {
        btn_unLink.onclick = function () {
          unlinkColorSkin()
          reloadEditBackgroundBlock()
        }
      }
      break
    case EnumCate.typography:
      btn_table_skin.innerHTML = `<p style="font-size: 14px">Ag</p><div class="row" style="margin: 0 8px;flex: 1"><p>${title}</p><p style="color: #c4c4c4"> . ${prefixValue}</p></div>`
      btn_unLink.onclick = function () {
        unlinkTypoSkin()
        reloadEditTypoBlock()
      }
      break
    case EnumCate.border:
      btn_table_skin.innerHTML = `<div style="width: 15px;height: 15px;border-radius: 50%;border: 0.5px solid #c4c4c4; background-color: ${prefixValue}"></div><p style="margin: 0 8px; flex: 1; text-align: left">${title}</p>`
      btn_unLink.onclick = function () {
        unlinkBorderSkin()
        reloadEditBorderBlock()
      }
      break
    case EnumCate.effect:
      btn_table_skin.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/effect-settings.svg" style="width: 16px;height: 16px"/><p style="margin: 0 8px; flex: 1; text-align: left">${title}</p>`
      btn_unLink.onclick = function () {
        unlinkEffectSkin()
        reloadEditEffectBlock()
      }
      break
    default:
      break
  }
  wbase_skin_tile.replaceChildren(btn_table_skin, btn_unLink)
  if (onRemove) {
    let btnRemoveColor = document.createElement('i')
    btnRemoveColor.className = 'fa-solid fa-minus fa-xs'
    wbase_skin_tile.appendChild(btnRemoveColor)
    btnRemoveColor.onclick = onRemove
  }
  return wbase_skin_tile
}

function hidePopup(event) {
  let list_popup = document.getElementsByClassName('wini_popup')
  let actived_popup = [...list_popup].filter(
    e => window.getComputedStyle(e).display != 'none'
  )
  if (actived_popup.length > 0) {
    let isOpenImgDoc = false
    let pop_up = [...event.composedPath()].find(eHTML => {
      if (eHTML.id === 'popup_img_document') isOpenImgDoc = true
      return eHTML.classList?.contains('wini_popup')
    })
    if (!pop_up) {
      for (let i = 0; i < actived_popup.length; i++) {
        if (actived_popup[i].classList.contains('popup_remove')) {
          if (
            !isOpenImgDoc ||
            !actived_popup[i].classList.contains('fake-data-popup')
          )
            actived_popup[i].remove()
        } else {
          actived_popup[i].style.display = 'none'
        }
      }
    }
  }
}

function isHidden(elHTML) {
  let bouncingClient = elHTML?.getBoundingClientRect()
  if (bouncingClient) {
    let offsetTop = 0
    let offsetLeft = left_view.offsetWidth
    let offsetBottom = divMain.offsetHeight
    let offsetRight = divMain.offsetWidth - right_view.offsetWidth
    if (
      bouncingClient.right > offsetLeft &&
      bouncingClient.x < offsetRight &&
      bouncingClient.bottom > offsetTop &&
      bouncingClient.y < offsetBottom
    ) {
      return false
    } else if (
      bouncingClient.right < offsetLeft &&
      bouncingClient.right > offsetRight &&
      bouncingClient.bottom > offsetTop &&
      bouncingClient.y < offsetBottom
    ) {
      return false
    } else if (
      bouncingClient.right > offsetLeft &&
      bouncingClient.x < offsetRight &&
      bouncingClient.bottom < offsetTop &&
      bouncingClient.bottom > offsetBottom
    ) {
      return false
    } else if (
      bouncingClient.right < offsetLeft &&
      bouncingClient.right > offsetRight &&
      bouncingClient.bottom < offsetTop &&
      bouncingClient.bottom > offsetBottom
    ) {
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

//! variants
function createEditVariants() {
  let editContainer = document.createElement('div')
  editContainer.id = 'edit_variant'
  editContainer.style.padding = '8px 0'
  editContainer.className = 'edit-container col'

  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  editContainer.appendChild(header)

  let btnTitle = document.createElement('div')
  btnTitle.style.display = 'flex'
  btnTitle.style.alignItems = 'center'
  btnTitle.style.padding = '4px 4px 8px 4px'
  btnTitle.style.marginRight = '16px'
  header.appendChild(btnTitle)

  let action_add = document.createElement('i')
  action_add.className = 'fa-solid fa-plus fa-sm'
  action_add.style.padding = '12px 8px'
  action_add.style.marginRight = '8px'
  action_add.onclick = function () {
    let newProperty = PropertyDA.newProperty
    newProperty.GID = uuidv4()
    newProperty.BaseID = selected_list[0].GID
    PropertyDA.add(newProperty)
    newProperty.BasePropertyItems = []
    updateUIVariant()
  }
  header.appendChild(action_add)

  let div_list_property = document.createElement('div')
  div_list_property.id = 'list_property_div'

  // TH đang chọn obj là component có nhiều variants
  if (
    selected_list.length == 1 &&
    selected_list[0].CateID == EnumCate.variant
  ) {
    let titleInnerHTML = document.createElement('p')
    titleInnerHTML.style.margin = '4px 0 0 6px'
    titleInnerHTML.innerHTML = 'Property'
    btnTitle.style.pointerEvents = 'none'
    btnTitle.replaceChildren(titleInnerHTML)
    action_add.style.display = 'flex'
    editContainer.appendChild(div_list_property)
    let list_property_tile = []
    for (let propertyItem of selected_list[0].PropertyItems) {
      let property_tile = _editPropertyTile(propertyItem)
      list_property_tile.push(property_tile)
    }
    div_list_property.replaceChildren(...list_property_tile)
  }
  // TH đang chọn nhiều obj là component nhg ko có variants con nào
  else if (
    select_box_parentID != wbase_parentID &&
    document.getElementById(select_box_parentID).getAttribute('cateid') ==
    EnumCate.variant
  ) {
    btnTitle.style.pointerEvents = 'none'
    action_add.style.display = 'none'
    // TH các component này là những variant của 1 component cha
    let titleInnerHTML = document.createElement('p')
    titleInnerHTML.style.margin = '4px 0 0 6px'
    titleInnerHTML.innerHTML = 'Current variant'
    btnTitle.replaceChildren(titleInnerHTML)
    editContainer.appendChild(div_list_property)
    let list_property_tile = []
    let list_base_property = selected_list.map(e => e.BasePropertyItems)
    if (list_base_property.length === 0) {
      list_base_property = list_base_property[0]
    } else if (list_base_property.length > 1) {
      list_base_property = list_base_property.reduce((a, b) => a.concat(b))
    }
    let listProperty = PropertyDA.list.filter(
      e => e.BaseID == select_box_parentID
    )
    for (let property_item of listProperty) {
      let list_baseProperty_name = list_base_property
        .filter(e => e.PropertyID == property_item.GID)
        .filterAndMap(e => e.Name)
      let firstValue
      if (list_baseProperty_name.length == 0) {
        firstValue = '---'
      } else if (list_baseProperty_name.length == 1) {
        firstValue = list_baseProperty_name[0]
      } else {
        firstValue = 'mixed'
      }
      let property_tile = _selectPropertyVariant(
        property_item,
        firstValue,
        function (option, property) {
          let deleteBaseProperty =
            option.trim().replace('-', '') == '' || option.trim() == 'none'
          for (let wbaseItem of selected_list) {
            let base_property_item = property.BasePropertyItems.find(
              e => e.BaseID == wbaseItem.GID
            )
            if (base_property_item) {
              isChange = true
              if (deleteBaseProperty) {
                property.BasePropertyItems = property.BasePropertyItems.filter(
                  e => e.GID != base_property_item.GID
                )
                wbaseItem.BasePropertyItems =
                  wbaseItem.BasePropertyItems.filter(
                    e => e.GID != base_property_item.GID
                  )
              } else {
                base_property_item.Name = option
                wbaseItem.BasePropertyItems =
                  wbaseItem.BasePropertyItems.filter(
                    e => e.PropertyID !== property.GID
                  )
                wbaseItem.BasePropertyItems.push(base_property_item)
              }
            } else if (!deleteBaseProperty) {
              isChange = true
              let newBaseProperty = {
                GID: uuidv4(),
                Name: option,
                BaseID: wbaseItem.GID,
                PropertyID: property.GID
              }
              if (!wbaseItem.BasePropertyItems) {
                wbaseItem.BasePropertyItems = []
              }
              property.BasePropertyItems.push(newBaseProperty)
            }
            PropertyDA.edit(property)
          }
          updateUIVariant()
        }
      )
      list_property_tile.push(property_tile)
    }
    div_list_property.replaceChildren(...list_property_tile)
  } else if (
    selected_list.length > 1 &&
    selected_list.every(e => e.IsWini && e.CateID != EnumCate.variant)
  ) {
    btnTitle.style.pointerEvents = 'none'
    let titleInnerHTML = document.createElement('p')
    titleInnerHTML.style.margin = '4px 0 0 6px'
    titleInnerHTML.innerHTML = 'Components'
    btnTitle.replaceChildren(titleInnerHTML)
    let btn_combine_variant = document.createElement('div')
    btn_combine_variant.id = 'btn_combine_variant'
    btn_combine_variant.innerHTML = 'Combine as variant'
    editContainer.appendChild(btn_combine_variant)
    btn_combine_variant.onclick = function () {
      combineAsVariant()
      updateUIVariant()
    }
    action_add.style.display = 'none'
  } else {
    let listVariantID = selected_list.filterAndMap(e => e.ChildID) // filterSameValue loại bỏ các giá trị đã có trong list (trong file Utils)
    let listWBaseVariant = assets_list.filter(e =>
      listVariantID.includes(e.GID)
    )
    let listComponentID = listWBaseVariant.filterAndMap(e => e.ParentID)
    if (
      listComponentID.length == 1 &&
      selected_list.every(e => e.ChildID) &&
      listWBaseVariant.some(
        e => e.BasePropertyItems && e.BasePropertyItems.length > 0
      )
    ) {
      let wbaseComponent = assets_list.find(e => e.GID == listComponentID[0])
      btnTitle.style.border = '1.5px solid transparent'
      btnTitle.style.borderRadius = '2px'
      btnTitle.style.pointerEvents = 'auto'
      let title = document.createElement('p')
      title.innerHTML = wbaseComponent.Name
      title.style.margin = '4px 0 0 6px'
      let suffixIcon = document.createElement('i')
      suffixIcon.className = 'fa-solid fa-chevron-down fa-sm'
      suffixIcon.style.padding = '5px 6px 0 6px'
      btnTitle.replaceChildren(title, suffixIcon)
      btnTitle.addEventListener('mouseover', function () {
        this.style.borderColor = '#f1f1f1'
        this.style.justifyContent = 'space-between'
      })
      btnTitle.addEventListener('mouseout', function () {
        this.style.borderColor = 'transparent'
        this.style.justifyContent = 'start'
      })
      action_add.style.display = 'none'

      editContainer.appendChild(div_list_property)
      let list_property_tile = []
      let list_base_property = listWBaseVariant
        .map(e => e.BasePropertyItems)
        .reduce((a, b) => a.concat(b))
      let propertyItemList =
        wbaseComponent.PropertyItems ??
        PropertyDA.list.filter(prt => prt.BaseID === wbaseComponent.GID) ??
        []
      for (let property_item of propertyItemList) {
        let list_baseProperty_name = list_base_property
          .filter(e => e.PropertyID == property_item.GID)
          .map(e => e.Name)
        let firstValue = list_baseProperty_name[0]
        if (list_baseProperty_name.some(e => e != firstValue)) {
          firstValue = 'mixed'
        }
        let property_tile = _selectPropertyVariant(
          property_item,
          firstValue,
          function (option, property) {
            changeProperty(
              property.BasePropertyItems.find(e => e.Name == option)?.BaseID
            )
            updateUIVariant()
          },
          false
        )
        list_property_tile.push(property_tile)
      }
      div_list_property.replaceChildren(...list_property_tile)
    } else {
      return document.createElement('div')
    }
  }
  return editContainer
}

function updateUIVariant() {
  let newEditVariants = createEditVariants()
  document.getElementById('edit_variant').replaceWith(newEditVariants)
}

function _editPropertyTile(property_item) {
  let property_tile = document.createElement('div')
  property_tile.id = `propertyID:${property_item.GID}`
  property_tile.className = 'property_tile'
  let variant_icon = document.createElement('i')
  variant_icon.className = 'fa-solid fa-diamond fa-xs'
  property_tile.appendChild(variant_icon)
  let property_name = document.createElement('input')
  property_name.value = property_item.Name
  property_name.readOnly = true
  property_name.ondblclick = function (e) {
    e.stopPropagation()
    this.readOnly = false
    this.focus()
    this.style.borderRadius = '2px'
    this.style.border = '1.5px solid #1890ff'
    this.setSelectionRange(0, this.value.length)
    div_property_infor.style.display = 'none'
  }
  property_name.onblur = function () {
    window.getSelection().removeAllRanges()
    this.readOnly = true
    this.style.borderRadius = '2px'
    this.style.border = 'none'
    div_property_infor.style.display = 'flex'
    let thisProperty = PropertyDA.list.find(
      e => e.GID == property_tile.id.replace('propertyID:', '')
    )
    thisProperty.Name = this.value
    PropertyDA.edit(thisProperty)
  }
  property_tile.appendChild(property_name)
  let div_property_infor = document.createElement('div')
  div_property_infor.className = 'row'
  div_property_infor.style.width = '120px'
  property_tile.appendChild(div_property_infor)
  let baseProperty_name = document.createElement('p')
  let list_baseProperty_name = []
  for (let baseProperty of property_item.BasePropertyItems) {
    if (
      list_baseProperty_name.length == 0 ||
      !list_baseProperty_name.some(name => name == baseProperty.Name)
    ) {
      list_baseProperty_name.push(baseProperty.Name)
    }
  }
  baseProperty_name.innerHTML = list_baseProperty_name.join(',')
  div_property_infor.appendChild(baseProperty_name)
  let group_action_btn = document.createElement('div')
  group_action_btn.className = 'group_action_btn_property_tile'
  div_property_infor.appendChild(group_action_btn)
  let btn_infor = document.createElement('i')
  btn_infor.className = 'fa-solid fa-sliders fa-sm'
  group_action_btn.appendChild(btn_infor)
  let btn_remove = document.createElement('i')
  btn_remove.className = 'fa-solid fa-minus fa-sm'
  btn_remove.onclick = function () {
    let thisProperty = PropertyDA.list.find(
      e => e.GID == property_tile.id.replace('propertyID:', '')
    )
    if (
      PropertyDA.list.filter(e => e.BaseID == thisProperty.BaseID).length > 1
    ) {
      PropertyDA.delete(thisProperty)
      updateUIVariant()
    }
  }
  group_action_btn.appendChild(btn_remove)
  return property_tile
}

function _selectPropertyVariant(
  property_item,
  title,
  onSelect,
  enableInput = true
) {
  let property_tile = document.createElement('div')
  property_tile.id = property_item.GID
  property_tile.className = 'select_base_property_tile'
  let property_name = document.createElement('p')
  property_name.innerHTML = property_item.Name
  property_name.style.width = '68px'
  property_tile.appendChild(property_name)
  let select_variant = document.createElement('div')
  select_variant.className = 'select_property_variant'
  property_tile.appendChild(select_variant)
  let input_baseProperty_name = document.createElement('input')
  input_baseProperty_name.value = title
  input_baseProperty_name.readOnly = !enableInput
  input_baseProperty_name.onfocus = function () {
    this.setSelectionRange(0, this.value.length)
  }
  input_baseProperty_name.onblur = function () {
    window.getSelection().removeAllRanges()
    onSelect(this.value, property_item)
  }
  select_variant.appendChild(input_baseProperty_name)
  let btn_dropdown = document.createElement('i')
  btn_dropdown.className = 'fa-solid fa-chevron-down fa-xs'
  select_variant.appendChild(btn_dropdown)
  let dropdown = document.createElement('div')
  dropdown.className = 'dropdown_select_baseProperty wini_popup'
  select_variant.appendChild(dropdown)
  btn_dropdown.onclick = function () {
    setTimeout(function () {
      dropdown.style.display = 'flex'
      dropdown.style.zIndex = 2
      let list_baseProperty_name = []
      if (input_baseProperty_name.value == 'mixed') {
        list_baseProperty_name.push('mixed')
      }
      list_baseProperty_name.push(
        ...property_item.BasePropertyItems.filterAndMap(e => e.Name)
      )
      let list_option = []
      for (let i = 0; i < list_baseProperty_name.length; i++) {
        let option = document.createElement('div')
        option.className = 'row'
        option.setAttribute('value', list_baseProperty_name[i])
        if (list_baseProperty_name[i] == 'mixed') {
          option.style.borderBottom = '1px solid #c4c4c4'
          option.style.pointerEvents = 'none'
          option.style.opacity = 0.7
        }
        option.onclick = function () {
          let option_value = this.getAttribute('value')
          if (option_value != input_baseProperty_name.value) {
            onSelect(option_value, property_item)
          }
          dropdown.style.display = 'none'
        }
        // option.setAttribute("value", base_property_item.GID);
        let icon_check = document.createElement('i')
        icon_check.className = 'fa-solid fa-check fa-sm'
        icon_check.style.boxSizing = 'border-box'
        icon_check.style.marginRight = '8px'
        icon_check.style.pointerEvents = 'none'
        if (list_baseProperty_name[i] != input_baseProperty_name.value) {
          icon_check.style.opacity = 0
        }
        let title = document.createElement('span')
        title.innerHTML = list_baseProperty_name[i]
        title.style.pointerEvents = 'none'
        option.replaceChildren(icon_check, title)
        list_option.push(option)
      }
      dropdown.replaceChildren(...list_option)
    }, 200)
  }
  return property_tile
}

function createSelectionSkins() {
  let editContainer = document.createElement('div')
  editContainer.id = 'selection_skins'
  editContainer.className = 'edit-container col'

  let header = document.createElement('div')
  header.className = 'ds-block-header semibold1 row'
  header.innerHTML = `Local Skins <button type="button" class="action-button center box28" style="--icon: url(https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/read.svg)"></button>`

  $(header).on('click', '.action-button', StyleDA.getListMergeSkin)

  let body = document.createElement('div')
  let cateItems = [
    { ID: EnumCate.color, Name: 'Color skins' },
    ...CateDA.list_color_cate,
    { ID: EnumCate.typography, Name: 'Typography skins' },
    ...CateDA.list_typo_cate,
    { ID: EnumCate.border, Name: 'Border skins' },
    ...CateDA.list_border_cate,
    { ID: EnumCate.effect, Name: 'Effect skins' },
    ...CateDA.list_effect_cate
  ]
  body.replaceChildren(
    ...cateItems.map(cateItem => createCateSkinHTML(cateItem))
  )
  editContainer.replaceChildren(header, body)
  return editContainer
}

function updateUISelectionSkins() {
  let newSelectionSkins = createSelectionSkins()
  document.getElementById('selection_skins')?.replaceWith(newSelectionSkins)
}

function mergeSkinDialog() {
  document.getElementById('dialog_merge_skin')?.parentElement?.remove()
  let dialogBackground = document.createElement('div')
  dialogBackground.className = 'dialog-background'
  dialogBackground.style.paddingTop = '46px'
  document.getElementById('body').appendChild(dialogBackground)
  document.getElementById('body').querySelector('#header').style.pointerEvents =
    'none'
  //
  let dialog = document.createElement('div')
  dialog.id = 'dialog_merge_skin'
  dialogBackground.appendChild(dialog)
  //
  let header = document.createElement('div')
  header.className = 'header'
  dialog.appendChild(header)
  let title = document.createElement('p')
  title.innerHTML = 'Merge skins'
  header.appendChild(title)
  let closeBtn = document.createElement('i')
  closeBtn.className = 'fa-solid fa-xmark fa-lg'
  closeBtn.style.padding = '8px'
  closeBtn.onclick = function (e) {
    e.stopPropagation()
    dialogBackground.remove()
  }
  header.appendChild(closeBtn)
  //
  let content = document.createElement('div')
  content.id = 'merge_skins_dialog_content'
  content.setAttribute('listMergeSkin', JSON.stringify([]))
  content.className = 'col'
  dialog.appendChild(content)

  let contentTitle = document.createElement('div')
  contentTitle.style.padding = '4px 8px'
  contentTitle.className = 'row'
  let conflictSkinTitle = document.createElement('p')
  conflictSkinTitle.innerHTML = 'Foreign skins'
  let mergeSkinTitle = document.createElement('p')
  mergeSkinTitle.innerHTML = 'Local skins'
  contentTitle.replaceChildren(conflictSkinTitle, mergeSkinTitle)
  function getUndefinedSkin(skinList) {
    return skinList.filter(skinItem => {
      let thisProjectID = skinItem.ProjectID ?? ProjectDA.obj.ID
      if (thisProjectID == ProjectDA.obj.ID) return false
      return StyleDA.mergeSkins.ListItem.every(
        projectStyle => projectStyle.ID != thisProjectID
      )
    })
  }
  content.replaceChildren(
    contentTitle,
    ...[
      {
        ID: 0,
        Name: 'undefined projects',
        ColorItems: getUndefinedSkin(ColorDA.list),
        TextStyleItems: getUndefinedSkin(TypoDA.list),
        BorderItems: getUndefinedSkin(BorderDA.list),
        EffectItems: getUndefinedSkin(EffectDA.list)
      },
      ...StyleDA.mergeSkins.ListItem
    ].map(skinProjectItem => conflictSkinInProject(skinProjectItem))
  )

  let dialogBottom = document.createElement('div')
  dialogBottom.className = 'dialog_bottom'
  dialog.appendChild(dialogBottom)
  let submitButton = document.createElement('div')
  submitButton.innerHTML = 'Save change'
  submitButton.onclick = function (e) {
    e.stopPropagation()
    let listMergeSkin = JSON.parse(content.getAttribute('listMergeSkin'))
    console.log(listMergeSkin)
    let styleInitItem = {}
    let ColorItems = ColorDA.list.filter(skinItem => {
      let mergeSkin = listMergeSkin.find(e => e.GID == skinItem.GID)
      if (mergeSkin) {
        skinItem.ListID = mergeSkin.ListID
        return true
      } else return false
    })
    if (ColorItems.length > 0) {
      styleInitItem.ColorItems = ColorItems
    }
    let TextStyleItems = TypoDA.list.filter(skinItem => {
      let mergeSkin = listMergeSkin.find(e => e.GID == skinItem.GID)
      if (mergeSkin) {
        skinItem.ListID = mergeSkin.ListID
        return true
      } else return false
    })
    if (TextStyleItems.length > 0) {
      styleInitItem.TextStyleItems = TextStyleItems
    }
    let BorderItems = BorderDA.list.filter(skinItem => {
      let mergeSkin = listMergeSkin.find(e => e.GID == skinItem.GID)
      if (mergeSkin) {
        skinItem.ListID = mergeSkin.ListID
        return true
      } else return false
    })
    if (BorderItems.length > 0) {
      styleInitItem.BorderItems = BorderItems
    }
    let EffectItems = EffectDA.list.filter(skinItem => {
      let mergeSkin = listMergeSkin.find(e => e.GID == skinItem.GID)
      if (mergeSkin) {
        skinItem.ListID = mergeSkin.ListID
        return true
      } else return false
    })
    if (EffectItems.length > 0) {
      styleInitItem.EffectItems = EffectItems
    }
    console.log(styleInitItem)
    StyleDA.mergeSkin(styleInitItem)
    updateUISelectionSkins()
    dialogBackground.remove()
  }
  dialogBottom.replaceChildren(submitButton)
}

function conflictSkinInProject(skinProjectItem) {
  if (
    skinProjectItem.ColorItems.length == 0 &&
    skinProjectItem.TextStyleItems.length == 0 &&
    skinProjectItem.BorderItems.length == 0 &&
    skinProjectItem.EffectItems.length == 0
  )
    return document.createElement('div')
  let isShow = true
  let container = document.createElement('div')
  container.className = 'col'
  container.style.borderBottom = '1px solid #e5e5e5'
  let titleTile = document.createElement('div')
  titleTile.className = 'row'
  titleTile.style.padding = '0 8px'
  titleTile.style.color = '#8C8C8C'
  let prefixIcon = document.createElement('i')
  prefixIcon.className = 'fa-solid fa-caret-down'
  prefixIcon.style.padding = '8px'
  prefixIcon.onclick = function (e) {
    e.stopPropagation()
    isShow = !isShow
    if (isShow) {
      prefixIcon.className = 'fa-solid fa-caret-down'
      container
        .querySelectorAll(':scope > *')
        .forEach(childHTML => (childHTML.style.display = 'flex'))
    } else {
      prefixIcon.className = 'fa-solid fa-caret-right'
      container
        .querySelectorAll(':scope > *')
        .forEach(childHTML => (childHTML.style.display = 'none'))
      titleTile.style.display = 'flex'
    }
  }
  let title = document.createElement('p')
  title.className = 'semibold2'
  title.style.color = '#8C8C8C'
  title.style.margin = '0'
  title.style.marginLeft = '4px'
  titleTile.replaceChildren(prefixIcon, title)
  title.innerHTML = skinProjectItem.Name
  let conflictSkins = [
    {
      ID: EnumCate.color,
      Name: 'Color skins',
      listSkin: skinProjectItem.ColorItems
    },
    {
      ID: EnumCate.typography,
      Name: 'Typography skins',
      listSkin: skinProjectItem.TextStyleItems
    },
    {
      ID: EnumCate.border,
      Name: 'Border skins',
      listSkin: skinProjectItem.BorderItems
    },
    {
      ID: EnumCate.effect,
      Name: 'Effect skins',
      listSkin: skinProjectItem.EffectItems
    }
  ]
  container.replaceChildren(
    titleTile,
    ...conflictSkins.map(cateItem =>
      mergeSkinByCate(cateItem, cateItem.listSkin)
    )
  )
  return container
}

function mergeSkinByCate(cateItem, listSkin) {
  let enumCate = cateItem.ParentID ?? cateItem.ID
  let isShow = true
  let children = []
  let cateContainer = document.createElement('div')
  cateContainer.className = 'col'
  let titleContainer = document.createElement('div')
  titleContainer.className = 'cate-title'
  if (cateItem.ID != enumCate) {
    titleContainer.style.padding = '4px 8px 4px 36px'
  }
  children.push(titleContainer)
  let prefixIcon = document.createElement('i')
  prefixIcon.className = 'fa-solid fa-caret-down'
  prefixIcon.onclick = function (e) {
    e.stopPropagation()
    isShow = !isShow
    if (isShow) {
      prefixIcon.className = 'fa-solid fa-caret-down'
      cateContainer
        .querySelectorAll(':scope > *')
        .forEach(childHTML => (childHTML.style.display = 'flex'))
    } else {
      prefixIcon.className = 'fa-solid fa-caret-right'
      cateContainer
        .querySelectorAll(':scope > *')
        .forEach(childHTML => (childHTML.style.display = 'none'))
      titleContainer.style.display = 'flex'
    }
  }
  let title = document.createElement('p')
  title.innerHTML = cateItem.Name
  titleContainer.replaceChildren(prefixIcon, title)
  switch (enumCate) {
    case EnumCate.color:
      let colorSkins = listSkin
      let colorCateItems = []
      if (colorSkins.length > 0) {
        if (cateItem.ID == enumCate) {
          colorCateItems = colorSkins.filterAndMap(skinItem => skinItem.CateID)
          colorCateItems = StyleDA.mergeSkins.WCategoryItems.filter(
            cate_item => {
              let check =
                cate_item.ID != enumCate &&
                colorCateItems.some(id => cate_item.ID == id)
              if (check) cate_item.ParentID = enumCate
              return check
            }
          )
        }
        colorSkins = colorSkins.filter(
          skinItem => skinItem.CateID == cateItem.ID
        )
        children.push(
          ...colorSkins.map(skinItem => mergeSkinTile(enumCate, skinItem))
        )
        children.push(
          ...colorCateItems.map(cate_item =>
            mergeSkinByCate(cate_item, listSkin)
          )
        )
      }
      break
    case EnumCate.typography:
      let typoSkins = listSkin
      if (typoSkins.length > 0) {
        let typoCateItems = []
        if (cateItem.ID == enumCate) {
          typoCateItems = typoSkins.filterAndMap(skinItem => skinItem.CateID)
          typoCateItems = StyleDA.mergeSkins.WCategoryItems.filter(
            cate_item => {
              let check =
                cate_item.ID != enumCate &&
                typoCateItems.some(id => cate_item.ID == id)
              if (check) cate_item.ParentID = enumCate
              return check
            }
          )
        }
        typoSkins = typoSkins.filter(skinItem => skinItem.CateID == cateItem.ID)
        children.push(
          ...typoSkins.map(skinItem => mergeSkinTile(enumCate, skinItem))
        )
        children.push(
          ...typoCateItems.map(cate_item =>
            mergeSkinByCate(cate_item, listSkin)
          )
        )
      }
      break
    case EnumCate.border:
      let borderSkins = listSkin
      if (borderSkins.length > 0) {
        let borderCateItems = []
        if (cateItem.ID == enumCate) {
          borderCateItems = borderSkins.filterAndMap(
            skinItem => skinItem.CateID
          )
          borderCateItems = StyleDA.mergeSkins.WCategoryItems.filter(
            cate_item => {
              let check =
                cate_item.ID != enumCate &&
                borderCateItems.some(id => cate_item.ID == id)
              if (check) cate_item.ParentID = enumCate
              return check
            }
          )
        }
        borderSkins = borderSkins.filter(
          skinItem => skinItem.CateID == cateItem.ID
        )
        children.push(
          ...borderSkins.map(skinItem => mergeSkinTile(enumCate, skinItem))
        )
        children.push(
          ...borderCateItems.map(cate_item =>
            mergeSkinByCate(cate_item, listSkin)
          )
        )
      }
      break
    case EnumCate.effect:
      let effectSkins = listSkin
      if (effectSkins.length > 0) {
        let effectCateItems = []
        if (cateItem.ID == enumCate) {
          effectCateItems = effectSkins.filterAndMap(
            skinItem => skinItem.CateID
          )
          effectCateItems = StyleDA.mergeSkins.WCategoryItems.filter(
            cate_item => {
              let check =
                cate_item.ID != enumCate &&
                effectCateItems.some(id => cate_item.ID == id)
              if (check) cate_item.ParentID = enumCate
              return check
            }
          )
        }
        effectSkins = effectSkins.filter(
          skinItem => skinItem.CateID == cateItem.ID
        )
        children.push(
          ...effectSkins.map(skinItem => mergeSkinTile(enumCate, skinItem))
        )
        children.push(
          ...effectCateItems.map(cate_item =>
            mergeSkinByCate(cate_item, listSkin)
          )
        )
      }
      break
    default:
      break
  }
  if (children.length == 1) {
    return document.createElement('div')
  } else {
    cateContainer.replaceChildren(...children)
    return cateContainer
  }
}

function mergeSkinTile(enumCate, jsonSkin) {
  let mergeSkinTile = document.createElement('div')
  mergeSkinTile.className = 'merge-skin-tile'
  let conflictSkin = document.createElement('div')
  if (enumCate != jsonSkin.CateID) {
    conflictSkin.style.paddingLeft = '40px'
  }
  let localSkin = document.createElement('div')
  mergeSkinTile.replaceChildren(conflictSkin, localSkin)
  function onSelectLocalSkin(option) {
    let dialogContent = document.getElementById('merge_skins_dialog_content')
    let listMergeSkin = JSON.parse(dialogContent.getAttribute('listMergeSkin'))
    let localSkinItem = listMergeSkin.find(
      skin_item => skin_item.GID == option.GID
    )
    let oldLocalSkinItem = listMergeSkin.find(skin_item =>
      skin_item.ListID.includes(jsonSkin.GID)
    )
    if (oldLocalSkinItem) {
      let newListID = oldLocalSkinItem.ListID.split(',').filter(
        id => id != jsonSkin.GID
      )
      if (newListID.length == 0) {
        listMergeSkin = listMergeSkin.filter(
          skin_item => skin_item.GID != oldLocalSkinItem.GID
        )
      } else {
        oldLocalSkinItem.ListID = newListID.join(',')
      }
    }
    if (localSkinItem) {
      localSkinItem.ListID = localSkinItem.ListID + `,${jsonSkin.GID}`
    } else {
      listMergeSkin.push({ GID: option.GID, ListID: jsonSkin.GID })
    }
    dialogContent.setAttribute('listMergeSkin', JSON.stringify(listMergeSkin))
  }
  switch (enumCate) {
    case EnumCate.color:
      var demoDiv1 = document.createElement('div')
      demoDiv1.className = 'demo-div'
      demoDiv1.style.border = '1px solid #8c8c8c'
      demoDiv1.style.backgroundColor = `#${jsonSkin.Value}`
      var skinTitle = document.createElement('p')
      skinTitle.className = 'regular1'
      skinTitle.innerHTML = jsonSkin.Name
      conflictSkin.replaceChildren(demoDiv1, skinTitle)
      var arrowIcon = document.createElement('i')
      arrowIcon.className = 'fa-solid fa-arrow-right'
      var inputLocalSkin
      var iconSearch = document.createElement('i')
      iconSearch.className = 'fa-solid fa-magnifying-glass'
      inputLocalSkin = suggestInput(
        ColorDA.list.filter(
          skin => (skin.ProjectID ?? ProjectDA.obj.ID) == ProjectDA.obj.ID
        ),
        'color skins name',
        iconSearch,
        function (option) {
          let optionTile = document.createElement('div')
          optionTile.className = 'row'
          optionTile.style.padding = '2px 8px'
          let demoColor = document.createElement('div')
          demoColor.style.width = '20px'
          demoColor.style.height = '20px'
          demoColor.style.borderRadius = '50%'
          demoColor.style.border = '1px solid #8c8c8c'
          demoColor.style.backgroundColor = `#${option.Value}`
          let cateItem
          if (option.CateID !== EnumCate.color)
            cateItem = CateDA.list_color_cate.find(e => e.ID === option.CateID)
          let optionTitle = document.createElement('p')
          optionTitle.innerHTML = (cateItem?.Name ?? '') + '/' + option.Name
          optionTitle.className = 'regular1'
          optionTitle.style.color = '#ffffff'
          optionTitle.style.margin = '6px 8px'
          optionTile.replaceChildren(demoColor, optionTitle)
          return optionTile
        },
        function (option) {
          onSelectLocalSkin(option)
          let demoDiv = document.createElement('div')
          demoDiv.className = 'demo-div'
          demoDiv.style.background = `#${option.Value}`
          iconSearch.replaceWith(demoDiv)
        }
      )
      localSkin.replaceChildren(arrowIcon, inputLocalSkin)
      break
    case EnumCate.typography:
      var demoDiv1 = document.createElement('div')
      demoDiv1.className = 'demo-div'
      demoDiv1.innerHTML = 'Ag'
      demoDiv1.style.fontSize = '12px'
      demoDiv1.style.display = 'flex'
      demoDiv1.style.alignItems = 'center'
      demoDiv1.style.justifyContent = 'center'
      demoDiv1.style.fontWeight = jsonSkin.FontWeight
      var skinTitle = document.createElement('p')
      skinTitle.className = 'regular1'
      skinTitle.innerHTML =
        jsonSkin.Name +
        ' || ' +
        `${jsonSkin.FontSize}px/${jsonSkin.Height ? jsonSkin.Height + 'px' : 'Auto'
        }`
      conflictSkin.replaceChildren(demoDiv1, skinTitle)
      var arrowIcon = document.createElement('i')
      arrowIcon.className = 'fa-solid fa-arrow-right'
      var inputLocalSkin
      var iconSearch = document.createElement('i')
      iconSearch.className = 'fa-solid fa-magnifying-glass'
      inputLocalSkin = suggestInput(
        TypoDA.list.filter(
          skin => (skin.ProjectID ?? ProjectDA.obj.ID) == ProjectDA.obj.ID
        ),
        'typography skins name',
        iconSearch,
        function (option) {
          let optionTile = document.createElement('div')
          optionTile.className = 'row'
          optionTile.style.padding = '2px 8px'
          let demoText = document.createElement('div')
          demoText.style.width = '20px'
          demoText.style.height = '20px'
          demoText.innerHTML = 'Ag'
          demoText.style.fontSize = '12px'
          demoText.style.display = 'flex'
          demoText.style.alignItems = 'center'
          demoText.style.justifyContent = 'center'
          demoText.style.color = '#ffffff'
          demoText.style.fontWeight = option.FontWeight
          let cateItem
          if (option.CateID !== EnumCate.typography)
            cateItem = CateDA.list_typo_cate.find(e => e.ID === option.CateID)
          let optionTitle = document.createElement('p')
          optionTitle.innerHTML =
            (cateItem?.Name ?? '') +
            '/' +
            option.Name +
            ' || ' +
            `${option.FontSize}px/${option.Height ? option.Height + 'px' : 'Auto'
            }`
          optionTitle.className = 'regular1'
          optionTitle.style.color = '#ffffff'
          optionTitle.style.margin = '6px 8px'
          optionTile.replaceChildren(demoText, optionTitle)
          return optionTile
        },
        function (option) {
          onSelectLocalSkin(option)
          var demoDiv = document.createElement('div')
          demoDiv.className = 'demo-div'
          demoDiv.innerHTML = 'Ag'
          demoDiv.style.fontSize = '12px'
          demoDiv.style.display = 'flex'
          demoDiv.style.alignItems = 'center'
          demoDiv.style.justifyContent = 'center'
          demoDiv.style.fontWeight = option.FontWeight
          iconSearch.replaceWith(demoDiv)
        }
      )
      localSkin.replaceChildren(arrowIcon, inputLocalSkin)
      break
    case EnumCate.border:
      var demoDiv1 = document.createElement('div')
      demoDiv1.className = 'demo-div'
      demoDiv1.style.border = '1px solid #8c8c8c'
      demoDiv1.style.backgroundColor = `#${jsonSkin.ColorValue}`
      var skinTitle = document.createElement('p')
      skinTitle.className = 'regular1'
      skinTitle.innerHTML = jsonSkin.Name
      conflictSkin.replaceChildren(demoDiv1, skinTitle)
      var arrowIcon = document.createElement('i')
      arrowIcon.className = 'fa-solid fa-arrow-right'
      var inputLocalSkin
      var iconSearch = document.createElement('i')
      iconSearch.className = 'fa-solid fa-magnifying-glass'
      inputLocalSkin = suggestInput(
        BorderDA.list.filter(
          skin => (skin.ProjectID ?? ProjectDA.obj.ID) == ProjectDA.obj.ID
        ),
        'border skins name',
        iconSearch,
        function (option) {
          let optionTile = document.createElement('div')
          optionTile.className = 'row'
          optionTile.style.padding = '2px 8px'
          var demoDiv = document.createElement('div')
          demoDiv.style.width = '20px'
          demoDiv.style.height = '20px'
          demoDiv.style.borderRadius = '50%'
          demoDiv.style.border = '1px solid #8c8c8c'
          demoDiv.style.backgroundColor = `#${option.ColorValue}`
          let cateItem
          if (option.CateID !== EnumCate.border)
            cateItem = CateDA.list_border_cate.find(e => e.ID === option.CateID)
          let optionTitle = document.createElement('p')
          optionTitle.innerHTML = (cateItem?.Name ?? '') + '/' + option.Name
          optionTitle.className = 'regular1'
          optionTitle.style.color = '#ffffff'
          optionTitle.style.margin = '6px 8px'
          optionTile.replaceChildren(demoDiv, optionTitle)
          return optionTile
        },
        function (option) {
          onSelectLocalSkin(option)
          var demoDiv = document.createElement('div')
          demoDiv.className = 'demo-div'
          demoDiv.style.backgroundColor = `#${option.ColorValue}`
          iconSearch.replaceWith(demoDiv)
        }
      )
      localSkin.replaceChildren(arrowIcon, inputLocalSkin)
      break
    case EnumCate.effect:
      var demoDiv1 = document.createElement('div')
      demoDiv1.className = 'demo-div'
      demoDiv1.style.backgroundImage = `url(${'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/effect-settings.svg'})`
      demoDiv1.style.backgroundSize = `contain`
      var skinTitle = document.createElement('p')
      skinTitle.className = 'regular1'
      skinTitle.innerHTML = jsonSkin.Name
      conflictSkin.replaceChildren(demoDiv1, skinTitle)
      var arrowIcon = document.createElement('i')
      arrowIcon.className = 'fa-solid fa-arrow-right'
      var inputLocalSkin
      var iconSearch = document.createElement('i')
      iconSearch.className = 'fa-solid fa-magnifying-glass'
      inputLocalSkin = suggestInput(
        EffectDA.list.filter(
          skin => (skin.ProjectID ?? ProjectDA.obj.ID) == ProjectDA.obj.ID
        ),
        'effect skins name',
        iconSearch,
        function (option) {
          let optionTile = document.createElement('div')
          optionTile.className = 'row'
          optionTile.style.padding = '2px 8px'
          let demoDiv = document.createElement('div')
          demoDiv.style.width = '20px'
          demoDiv.style.height = '20px'
          demoDiv.style.borderRadius = '50%'
          demoDiv.style.backgroundColor = '#ffffff'
          demoDiv.style.backgroundImage = `url(${'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/effect-settings.svg'})`
          demoDiv.style.backgroundSize = `contain`
          let cateItem
          if (option.CateID !== EnumCate.effect)
            cateItem = CateDA.list_effect_cate.find(e => e.ID === option.CateID)
          let optionTitle = document.createElement('p')
          optionTitle.innerHTML = (cateItem?.Name ?? '') + '/' + option.Name
          optionTitle.className = 'regular1'
          optionTitle.style.color = '#ffffff'
          optionTitle.style.margin = '6px 8px'
          optionTile.replaceChildren(demoDiv, optionTitle)
          return optionTile
        },
        function (option) {
          onSelectLocalSkin(option)
          var demoDiv = document.createElement('div')
          demoDiv.className = 'demo-div'
          demoDiv.style.backgroundImage = `url(${'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/effect-settings.svg'})`
          demoDiv.style.backgroundSize = `contain`
          iconSearch.replaceWith(demoDiv)
        }
      )
      localSkin.replaceChildren(arrowIcon, inputLocalSkin)
      break
    default:
      break
  }
  return mergeSkinTile
}

function suggestInput(listValue, placeholder, prefixIcon, builder, onSelect) {
  let listSearch = []
  let inputContainer = document.createElement('div')
  inputContainer.className = 'suggetion-input'
  let input = document.createElement('input')
  input.placeholder = placeholder
  if (prefixIcon) {
    inputContainer.appendChild(prefixIcon)
  }
  inputContainer.appendChild(input)
  input.onfocus = function (e) {
    e.stopPropagation()
    showPopupOptions()
    search()
  }
  let focusIndex = -1
  input.onkeydown = function (e) {
    e.stopPropagation()
    let check = e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'Enter'
    if (!check) return
    let popupListOption = document
      .getElementById('body')
      .querySelector(':scope > .popup-options')
    let optionList = [...popupListOption.querySelectorAll(':scope > *')]
    optionList.forEach(option => (option.style.backgroundColor = 'transparent'))
    switch (e.key) {
      case 'ArrowUp':
        if (focusIndex > 0) {
          optionList[focusIndex - 1].style.backgroundColor = '#1890ff'
          popupListOption.scrollTo({
            top: optionList[focusIndex - 1].offsetTop,
            behavior: 'smooth'
          })
        }
        break
      case 'ArrowDown':
        focusIndex++
        if (focusIndex >= optionList.length) focusIndex = optionList.length - 1
        optionList[focusIndex].style.backgroundColor = '#1890ff'
        popupListOption.scrollTo({
          top: optionList[focusIndex].offsetTop,
          behavior: 'smooth'
        })
        break
      case 'Enter':
        focusIndex = focusIndex == -1 ? 0 : focusIndex
        let option = listValue.find(
          value => value.GID == optionList[focusIndex].id
        )
        if (onSelect) onSelect(option)
        this.value = typeof option == 'string' ? option : option.Name
        focusIndex = -1
        this.blur()
        break
      default:
        return
    }
  }
  input.oninput = function () {
    search(this.value)
  }
  input.onblur = function (e) {
    if (focusIndex < 0) {
      document
        .getElementById('body')
        .querySelector(':scope > .popup-options')
        ?.remove()
    }
  }
  function showPopupOptions() {
    let parentRect = inputContainer.getBoundingClientRect()
    document
      .getElementById('body')
      .querySelector(':scope > .popup-options')
      ?.remove()
    let popupOptionValues = document.createElement('div')
    popupOptionValues.className = 'popup-options'
    popupOptionValues.style.left = parentRect.x + 'px'
    popupOptionValues.style.top = parentRect.y + 'px'
    popupOptionValues.style.width = parentRect.width + 'px'
    document.getElementById('body').appendChild(popupOptionValues)
  }

  function search(textValue = '') {
    let popupOptionValues = document
      .getElementById('body')
      .querySelector(':scope > .popup-options')
    if (textValue == '') {
      listSearch = listValue
    } else {
      listSearch = listValue.filter(value => {
        if (typeof value == 'string') {
          return value
            .toLowerCase()
            .trim()
            .includes(textValue.toLowerCase().trim())
        } else {
          return value.Name.toLowerCase()
            .trim()
            .includes(textValue.toLowerCase().trim())
        }
      })
    }
    if (builder) {
      popupOptionValues.replaceChildren(
        ...listSearch.map(option => {
          let optionTile = builder(option)
          optionTile.id = option.GID ?? option.Name
          optionTile.onclick = function (e) {
            e.stopPropagation()
            if (onSelect) {
              onSelect(option)
            }
            input.value = option.Name
            focusIndex = -1
            popupOptionValues.remove()
          }
          optionTile.onmouseover = function (e) {
            e.stopPropagation()
            focusIndex = listSearch.indexOf(option)
            optionTile.style.backgroundColor = '#1890ff'
          }
          optionTile.onmouseout = function (e) {
            e.stopPropagation()
            focusIndex = -1
            optionTile.style.backgroundColor = 'transparent'
          }
          return optionTile
        })
      )
    } else {
      popupOptionValues.replaceChildren(
        ...listSearch.map(option => {
          let optionTile = document.createElement('p')
          optionTile.innerHTML =
            typeof option == 'string' ? option : option.Name
          optionTile.onclick = function (e) {
            e.stopPropagation()
            if (onSelect) {
              onSelect(option)
            }
            input.value = optionTile.innerHTML
            focusIndex = -1
            popupOptionValues.remove()
          }
          optionTile.onmouseover = function (e) {
            e.stopPropagation()
            focusIndex = listSearch.indexOf(option)
            optionTile.style.backgroundColor = '#1890ff'
          }
          optionTile.onmouseout = function (e) {
            e.stopPropagation()
            focusIndex = -1
            optionTile.style.backgroundColor = 'transparent'
          }
          return optionTile
        })
      )
    }
  }
  return inputContainer
}

// ! Breakpoint
function createBreakpoint() {
  ProjectDA.obj.ResponsiveJson ??= JSON.parse(JSON.stringify(ProjectDA.responsiveJson))
  let localBrpoint = ProjectDA.obj.ResponsiveJson
  localBrpoint.BreakPoint = localBrpoint.BreakPoint.sort((a, b) => a.Width - b.Width)
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-breakpoint'
  editContainer.className = 'edit-container col'

  let header = document.createElement('div')
  header.className = 'ds-block-header semibold1 row'
  header.innerHTML = `Breakpoint <button type="button" class="action-button center box28" style="--icon: url(https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/filter.svg)"></button>`

  $(header).on('click', '.action-button', function () {
    let brpPopup = document.createElement('div')
    let offsetPopup = editContainer.getBoundingClientRect()
    brpPopup.className = 'breakpoint-popup col wini_popup popup_remove'
    brpPopup.style.top = offsetPopup.y + 'px'
    brpPopup.style.left = offsetPopup.x + 'px'
    let header = document.createElement('div')
    header.className = 'popup-header'
    let title = document.createElement('p')
    title.innerHTML = 'Breakpoint'
    title.className = 'semibold1'
    let historyBtn = document.createElement('i')
    historyBtn.className = 'fa-solid fa-clock-rotate-left fa-xs'
    historyBtn.onclick = function (e) {
      e.stopPropagation()
      ProjectDA.obj.ResponsiveJson = JSON.parse(
        JSON.stringify(ProjectDA.responsiveJson)
      )
      ProjectDA.edit(ProjectDA.obj)
    }
    let closeBtn = document.createElement('i')
    closeBtn.className = 'fa-solid fa-xmark fa-xs'
    closeBtn.onclick = function (e) {
      e.stopPropagation()
      brpPopup.remove()
      updateUIBreakpoint()
    }
    header.replaceChildren(title, historyBtn, closeBtn)
    let body = document.createElement('div')
    body.className = 'popup-body'
    function listBrpTile() {
      body.replaceChildren(
        ...localBrpoint.BreakPoint.map(brp => {
          let editBrp = document.createElement('div')
          editBrp.className = 'row edit-breakpoint-tile'
          let title = document.createElement('input')
          title.readOnly = true
          title.value = brp.Key
          title.className = 'regular2'
          title.ondblclick = function (e) {
            e.stopPropagation()
            this.readOnly = false
            this.focus()
            this.select()
          }
          title.onblur = function (e) {
            e.stopPropagation()
            let selection = window.getSelection()
            selection.removeAllRanges()
            this.readOnly = true
            this.value = this.value.trim()
            if (this.value === '') {
              if (brp.Key == '') editBrp.remove()
              else this.value = brp.Key
            } else if (this.value != brp.Key) {
              if (!this.value.match(brpRegex)) {
                this.value = this.value.replace(/[()]/g, '')
                let listValue = this.value.split(/[\s-]/)
                if (listValue.length === 1) {
                  this.value =
                    this.value +
                    ' ' +
                    `(${this.value.substring(
                      0,
                      this.value.length > 2 ? 2 : this.value.length
                    )})`.toLowerCase()
                } else {
                  this.value =
                    this.value +
                    ' ' +
                    `(${listValue.reduce(
                      (a, b) =>
                        a.substring(0, listValue.indexOf(a) + 1) +
                        b.substring(0, 1)
                    )})`.toLowerCase()
                }
              }
              brp.Key = this.value
              ProjectDA.obj.ResponsiveJson = localBrpoint
              ProjectDA.edit(ProjectDA.obj)
            }
          }
          let inputBrpContainer = document.createElement('div')
          let input = document.createElement('input')
          input.value = `${brp.Width}`
          input.onfocus = function (e) {
            e.stopPropagation()
            this.select()
          }
          input.onblur = function (e) {
            e.stopPropagation()
            let selection = window.getSelection()
            selection.removeAllRanges()
            if (isNaN(this.value)) {
              this.value = `${brp.Width}`
            } else if (brp.Width != parseInt(this.value)) {
              brp.Width = parseInt(this.value)
              this.value = `${brp.Width}`
              ProjectDA.obj.ResponsiveJson = localBrpoint
              ProjectDA.edit(ProjectDA.obj)
            }
          }
          let px = document.createElement('p')
          px.innerHTML = 'px'
          px.className = 'regular1'
          px.style.color = '#6E87AA'
          px.style.margin = '4px 0'
          inputBrpContainer.replaceChildren(input, px)
          let deleteBtn = document.createElement('i')
          deleteBtn.className = 'fa-solid fa-trash fa-xs'
          if (brp.Key === 'Small (sm)') {
            deleteBtn.style.visibility = 'hidden'
            title.style.pointerEvents = 'none'
            input.readOnly = true
            input.style.pointerEvents = 'none'
          } else {
            deleteBtn.style.color = '#6E87AA'
            deleteBtn.onclick = function (e) {
              e.stopPropagation()
              editBrp.remove()
              localBrpoint.BreakPoint = localBrpoint.BreakPoint.filter(
                br => br != brp
              )
              ProjectDA.obj.ResponsiveJson = localBrpoint
              ProjectDA.edit(ProjectDA.obj)
            }
          }
          editBrp.replaceChildren(title, inputBrpContainer, deleteBtn)
          return editBrp
        })
      )
    }
    listBrpTile()
    let bottom = document.createElement('div')
    bottom.className = 'popup-bottom'
    let addIcon = document.createElement('i')
    addIcon.className = 'fa-solid fa-plus fa-xs'
    let addTitle = document.createElement('p')
    addTitle.className = 'regular2'
    addTitle.innerHTML = 'Add breakpoint'
    bottom.replaceChildren(addIcon, addTitle)
    bottom.onclick = function (e) {
      e.stopPropagation()
      localBrpoint.BreakPoint.push({
        Key: '',
        Width:
          localBrpoint.BreakPoint[localBrpoint.BreakPoint.length - 1].Width
      })
      listBrpTile()
      let inputTitle = body.lastChild.querySelector(':scope > input')
      body.scrollTo({
        top: inputTitle.offsetTop,
        behavior: 'smooth'
      })
      inputTitle.readOnly = false
      inputTitle.focus()
    }
    brpPopup.replaceChildren(header, body, bottom)
    document.getElementById('body').appendChild(brpPopup)
  })
  let body = document.createElement('div')
  body.className = 'col'
  editContainer.replaceChildren(header, body)
  let allDevice = listDevice.reduce((a, b) => a.concat(b))
  body.replaceChildren(
    ...[
      {
        Key: 'Auto',
        Width: localBrpoint.BreakPoint[0].Width
      },
      ...localBrpoint.BreakPoint
    ].map(brp => {
      const brpIndex = localBrpoint.BreakPoint.indexOf(brp)
      const availableDevices = allDevice.filter(dv => {
        if (brp.Key === 'Auto') {
          return dv.Width < brp.Width
        } else {
          return (
            dv.Width >= brp.Width &&
            (brpIndex === localBrpoint.BreakPoint.length - 1 ||
              dv.Width < localBrpoint.BreakPoint[brpIndex + 1].Width)
          )
        }
      })
      let deviceTree = document.createElement('div')
      deviceTree.className = 'col'
      deviceTree.style.padding = '0 1.2rem'
      deviceTree.innerHTML = `<div class="row" style="gap:0.2rem; height: 3.6rem;">
        <i class="fa-solid fa-caret-right on-off-details box16 center" style="display: flex; font-size: 1.2rem"></i>
        <p class="semibold1">${brp.Key}</p>
        <p class="regular11" style="color: #bfbfbf">${brp.Key === 'Auto' ? '<' : '>='}${brp.Width}px</p>
      </div>
      ${availableDevices.map(device => `<div class="regular1 device-tile" style="padding: 0.4rem 1.6rem;display: none">${device.Name}</div>`).join('')}`
      let isShowDevices = false
      $(deviceTree).on('click', '.on-off-details', function () {
        isShowDevices = !isShowDevices
        if (isShowDevices) {
          deviceTree.querySelectorAll(':scope > .device-tile').forEach(deviceTile => {
            deviceTile.style.display = 'block'
          })
          this.className = this.className.replace('caret-right', 'caret-down')
        } else {
          deviceTree.querySelectorAll(':scope > .device-tile').forEach(deviceTile => {
            deviceTile.style.display = 'none'
          })
          this.className = this.className.replace('caret-down', 'caret-right')
        }
      })
      return deviceTree
    })
  )

  return editContainer
}

function updateUIBreakpoint() {
  let newBreakpoint = createBreakpoint()
  document.getElementById('edit-breakpoint')?.replaceWith(newBreakpoint)
}

// !Responsive
function winiResponsive() {
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-wini-res'
  editContainer.className = 'edit-container col'
  editContainer.style.padding = '0.8rem 0'
  editContainer.innerHTML = `<div class="ds-block-header semibold1 row">Wini responsive</div>
  <div class="row" style="gap: 0.6rem; padding: 0.4rem 1.2rem">
    <img class="box16 prefix-icon" />
    <p class="regular1" style="flex: 1; color: #595959;">Default</p>
    <p class="regular1">24 col</p>
  </img>`
  return editContainer
}

// ! select number col
let copyBrpColSettings
function colNumberByBrp(enable = true) {
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-col-number'
  editContainer.className = 'edit-container col'

  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  editContainer.appendChild(header)

  let title = document.createElement('p')
  title.innerHTML = 'Column count on breakpoints'
  header.appendChild(title)
  if (
    selected_list.every(
      wb => wb.ListClassName && wb.ListClassName.includes('col-')
    )
  ) {
    let icon_remove = document.createElement('i')
    header.appendChild(icon_remove)
    icon_remove.className = 'fa-solid fa-minus fa-sm'
    icon_remove.onclick = function () {
      for (let wb of selected_list) {
        let newClassList = [...wb.value.classList].filter(
          cls => !cls.includes('col-') && !cls.match(/col[0-9]{1,2}/g)
        )
        wb.ListClassName = newClassList.join(' ')
      }
      WBaseDA.edit(selected_list)
      reloadEditOffsetBlock()
      updateUIColNumber()
      updateUISelectBox()
    }

    let body = document.createElement('div')
    body.className = 'col'
    editContainer.appendChild(body)

    let localBrpoint = ProjectDA.obj.ResponsiveJson
    let totalCol = ['none', 1, 2, 3, 4, 6, 8, 12, 24]
    let pageParent = $(selected_list[0].value).parents('.wbaseItem-value')
    let framePage = pageParent[pageParent.length - 1]
    if (framePage?.classList?.contains('w-variant'))
      framePage = pageParent[pageParent.length - 2]
    let currentBrp = localBrpoint.BreakPoint.filter(
      brp => framePage.offsetWidth >= brp.Width
    )
    let currentBrpKey = currentBrp.length > 0 ? currentBrp.pop().Key : 'Auto'
    body.replaceChildren(
      ...[
        {
          Key: 'Auto',
          Width: localBrpoint.BreakPoint[0].Width
        },
        ...localBrpoint.BreakPoint
      ].map(brp => {
        let brpTile = document.createElement('div')
        brpTile.className = 'row breakpoint-column-tile'
        if (currentBrpKey === brp.Key) {
          brpTile.style.backgroundColor = 'rgba(0, 53, 128, 0.08)'
          setTimeout(function () {
            if (!isNaN(parseInt(selectNumberInput.firstChild.value))) {
              let editSizeContainer = document.getElementById(
                'edit_size_position_div'
              )
              editSizeContainer
                .querySelectorAll(
                  '.uneditable-instance:not(*:has(input[type="checkbox"]))'
                )
                .forEach(e => {
                  e.style.pointerEvents = 'none'
                  e.querySelectorAll('input').forEach(
                    eInput => (eInput.disabled = true)
                  )
                })
            }
          }, 100)
        }
        let brpTitle = document.createElement('div')
        brpTitle.className = 'row'
        let brpName = document.createElement('p')
        brpName.className = 'regular1'
        brpName.innerHTML = brp.Key
        let brpWidth = document.createElement('p')
        brpWidth.className = 'regular11'
        brpWidth.style.color = '#BFBFBF'
        brpWidth.innerHTML = `${brp.Key === 'Auto' ? '<' : '>='}${brp.Width}px`
        brpTitle.replaceChildren(brpName, brpWidth)
        let brpColValues = []
        if (brp.Key === 'Auto') {
          brpColValues = selected_list.filterAndMap(wbaseItem => {
            let brpCol = wbaseItem.ListClassName.split(' ').filter(
              colClass => !colClass.includes('-')
            )
            if (brpCol && brpCol.length > 0)
              return brpCol.shift().replace('col', '')
            else return 'none'
          })
        } else {
          let shortName = brp.Key.match(brpRegex).pop().replace(/[()]/g, '')
          brpColValues = selected_list.filterAndMap(wbaseItem => {
            let brpCol = wbaseItem.ListClassName.split(' ').filter(colClass =>
              colClass.includes(`-${shortName}`)
            )
            if (brpCol.length > 0) {
              return brpCol
                .shift()
                .replace('col', '')
                .replace(`-${shortName}`, '')
            } else return 'none'
          })
        }
        let selectNumberInput = _btnInputSelect({
          initvalue: brpColValues.length == 1 ? brpColValues[0] : 'mixed',
          listvalue:
            brpColValues.length == 1 ? totalCol : ['mixed', ...totalCol],
          onselect: function (option) {
            let shortName = ''
            if (brp.Key != 'Auto') {
              shortName = `-${brp.Key.match(brpRegex)
                .pop()
                .replace(/[()]/g, '')}`
            }
            if (option === 'none') {
              for (let wbaseItem of selected_list) {
                let listColClass = wbaseItem.ListClassName.split(' ').filter(
                  colClasss => {
                    colClasss = colClasss.trim()
                    if (brp.Key === 'Auto') {
                      return colClasss.includes('-')
                    } else {
                      return !colClasss.includes(shortName)
                    }
                  }
                )
                wbaseItem.ListClassName = listColClass.join(' ')
                listColClass.forEach(clName =>
                  $(wbaseItem.value).addClass(clName)
                )
              }
            } else {
              for (let wbaseItem of selected_list) {
                let listColClass = wbaseItem.ListClassName.split(' ').filter(
                  colClasss => {
                    colClasss = colClasss.trim()
                    if (brp.Key === 'Auto') {
                      return colClasss.includes('-')
                    } else {
                      return !colClasss.includes(shortName)
                    }
                  }
                )
                listColClass.push(`col${option}${shortName}`)
                wbaseItem.ListClassName = listColClass.join(' ')
                let oldClassList = [...wbaseItem.value.classList]
                oldClassList.forEach(clName => {
                  if (
                    clName.match(/col[0-9]{1,2}/g) ||
                    clName.includes('col-')
                  ) {
                    $(wbaseItem.value).removeClass(clName)
                  }
                })
                listColClass.forEach(clName =>
                  $(wbaseItem.value).addClass(clName)
                )
              }
            }
            WBaseDA.edit(selected_list)
            reloadEditOffsetBlock()
            updateUIColNumber()
            updateUISelectBox()
          }
        })
        brpTile.replaceChildren(brpTitle, selectNumberInput)
        return brpTile
      })
    )
  } else {
    let icon_add = document.createElement('i')
    header.appendChild(icon_add)
    icon_add.className = 'fa-solid fa-plus fa-sm'
    if (enable) {
      icon_add.onclick = function () {
        let pWbHTML = document.getElementById(select_box_parentID)
        let listUpdate = []
        for (let wb of selected_list) {
          wb.value.classList.add('col-')
          wb.value.classList.remove('xxl', 'xl', 'lg', 'md', 'sm', 'min-brp')
          wb.ListClassName = wb.value.className
          wb.value.style.setProperty(
            '--gutter',
            pWbHTML.style.getPropertyValue('--child-space')
          )
        }
        if (
          pWbHTML.classList.contains('w-row') &&
          pWbHTML.getAttribute('width-type') === 'fit'
        ) {
          let pWb = wbase_list.find(e => e.GID === select_box_parentID)
          pWbHTML.style.width = pWbHTML.offsetWidth + 'px'
          pWb.Css = pWb.value.style.cssText
          listUpdate.push(pWb)
        }
        listUpdate.push(...selected_list)
        WBaseDA.edit(listUpdate, EnumObj.wBase)
        reloadEditOffsetBlock()
        updateUIColNumber()
        updateUISelectBox()
      }
    } else {
      $(header).addClass('disable')
    }
  }
  editContainer.onauxclick = function (ev) {
    if (ev.button === 2)
      setTimeout(function () {
        let copyPastePopup = document.createElement('div')
        copyPastePopup.className = 'wini_popup popup_remove'
        copyPastePopup.style.left = ev.pageX + 'px'
        copyPastePopup.style.top = ev.pageY + 'px'
        copyPastePopup.replaceChildren(
          ...['copy', 'paste'].map(op => {
            let option = document.createElement('div')
            option.className = 'regular1 row'
            option.style.padding = '4px 8px'
            option.innerHTML = op
            if (
              (op === 'copy' && header.querySelector(':scope > .fa-minus')) ||
              copyBrpColSettings
            ) {
              option.style.color = 'white'
            } else {
              option.style.color = '#8c8c8c'
              option.style.pointerEvents = 'none'
            }
            option.onclick = function (e) {
              e.stopPropagation()
              if (op === 'copy') {
                copyBrpColSettings = [...selected_list[0].value.classList]
                  .filter(
                    clsN =>
                      clsN.includes('col-') || clsN.match(/col[0-9]{1,2}/g)
                  )
                  .join(' ')
              } else {
                let parentHTML = document.getElementById(select_box_parentID)
                for (let wbaseItem of selected_list) {
                  wbaseItem.ListClassName = copyBrpColSettings
                  wbaseItem.value.className = `wbaseItem-value ${copyBrpColSettings}`
                  wbaseItem.value.style.setProperty(
                    '--gutter',
                    parentHTML.style.getPropertyValue('--child-space')
                  )
                }
                WBaseDA.edit(selected_list)
                reloadEditOffsetBlock()
                updateUIColNumber()
                updateUISelectBox()
              }
              copyPastePopup.remove()
            }
            return option
          })
        )
        document.getElementById('body').appendChild(copyPastePopup)
      }, 150)
  }
  return editContainer
}

function updateUIColNumber() {
  let newSelectCol = colNumberByBrp()
  document.getElementById('edit-col-number')?.replaceWith(newSelectCol)
}

function selectionClass() {
  let listStyleClass = selected_list
    .map(wb => wb.ListClassName?.split(' ') ?? [])
    .reduce((a, b) => a.concat(b))
    .filter(clName => clName.startsWith('w-st-cls'))
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-create-class'
  editContainer.className = 'edit-container col'

  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  editContainer.appendChild(header)

  let title = document.createElement('p')
  title.innerHTML = 'Style class'

  let iconAdd = document.createElement('i')
  iconAdd.className = 'fa-solid fa-plus fa-sm'

  // let btnSelectSkin = createButtonAction(
  //   'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/buttonStyle.svg',
  //   null,
  //   function () {
  //     // let offset = header.getBoundingClientRect();
  //     // createDropdownTableSkin(EnumCate.typography, offset);
  //   }
  // )

  header.replaceChildren(title, iconAdd) // ,btnSelectSkin)

  let body = document.createElement('div')
  body.className = 'col'
  editContainer.appendChild(body)

  body.replaceChildren(
    ...listStyleClass.map(clName => {
      let classTile = document.createElement('div')
      classTile.className = 'row style-class-tile'
      classTile.innerHTML = `<p class="regular1">${clName}</p>
      <img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/unlink-skin.svg"/>
      <img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/target.svg"/>`
      return classTile
    })
  )
  return editContainer
}

function createVariables() {
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-variables'
  editContainer.className = 'edit-container col'
  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  let title = document.createElement('p')
  title.innerHTML = 'Variables'
  let addBtn = document.createElement('i')
  addBtn.className = 'fa-solid fa-plus fa-sm'
  header.replaceChildren(title, addBtn)
  let body = document.createElement('div')
  body.className = 'col'
  if (selected_list[0].VariablesData) {
    for (const prop in selected_list[0].VariablesData) {
      body.appendChild(createVariableTile(prop))
    }
  }
  function createVariableTile(propN) {
    let tile = document.createElement('div')
    tile.className = 'row'
    let propEditName = document.createElement('input')
    propEditName.defaultValue = propN ?? ''
    propEditName.placeholder = 'variable name'
    propEditName.onblur = function () {
      if (propEditName.value.trim() === '') {
        delete selected_list[0].VariablesData[prop]
        if (propN) selected_list[0].value.removeAttribute(propN)
        if (JSON.stringify(selected_list[0].VariablesData) === '{}') {
          selected_list[0].VariablesData = null
          selected_list[0].AttributesItem.Content = ''
        }
      } else {
        let varName = Ultis.toSlug(
          propEditName.value.toLowerCase().trim()
        ).split('-')
        varName.forEach(
          elName => elName.substring(0, 1).toUpperCase() + elName.substring(1)
        )
        varName = varName.join('')
        selected_list[0].VariablesData[varName] = ''
        selected_list[0].value.setAttribute('varName', '')
        propN = varName
      }
      if (propN) WBaseDA.edit(selected_list, EnumObj.attribute)
    }
    let propEditValue = document.createElement('input')
    propEditValue.defaultValue = selected_list[0].VariablesData[propN] ?? ''
    propEditValue.placeholder = 'variable value'
    let removeBtn = document.createElement('i')
    addBtn.className = 'fa-solid fa-minus fa-sm'
    removeBtn.onclick = function () {
      delete selected_list[0].VariablesData[prop]
      if (JSON.stringify(selected_list[0].VariablesData) === '{}') {
        selected_list[0].VariablesData = null
        selected_list[0].AttributesItem.Content = ''
      }
      if (propN) {
        selected_list[0].value.removeAttribute(propN)
        WBaseDA.edit(selected_list, EnumObj.attribute)
      }
    }
    tile.replaceChildren(propEditName, propEditValue, removeBtn)
    return tile
  }
  addBtn.onclick = function () {
    selected_list[0].VariablesData ??= {}
    let newVar = createVariableTile()
    body.appendChild(newVar)
    newVar.firstChild.focus()
  }
  editContainer.replaceChildren(header, body)
  return editContainer
}

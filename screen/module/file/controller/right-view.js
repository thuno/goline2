console.log('right-view')
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
  let editContainer = document.createElement('div')
  editContainer.id = 'edit_align_div'
  editContainer.className = 'edit-container row'
  let isEnable = selected_list.every(
    wb =>
      ((selected_list.length > 1 || wb.Level > 1) && window.getComputedStyle(wb.value).position === 'absolute') ||
      wb.value.classList.contains('w-block') ||
      wb.value.querySelector(':scope > .fixed-position')
  )
  editContainer.setAttribute('enable', isEnable)
  editContainer.replaceChildren(
    ...[
      'align left',
      'align horizontal center',
      'align right',
      'align top',
      'align vertical center',
      'align bottom'
    ].map(alignType => {
      let btnAlign = document.createElement('button')
      btnAlign.className = 'box24 row'
      btnAlign.type = 'button'
      if (isEnable)
        btnAlign.onclick = function () {
          handleEditAlign(alignType)
          reloadEditOffsetBlock()
          reloadEditConstraintsBlock()
        }
      return btnAlign
    })
  )
  return editContainer
}

function reloadEditAlignBlock() {
  let newEditAlign = EditAlignBlock()
  document.getElementById('edit_align_div').replaceWith(newEditAlign)
}

// edit position UI
function EditOffsetBlock() {
  let editContainer = document.createElement('div')
  editContainer.id = 'edit_size_position_div'
  editContainer.className = 'edit-container col'
  if (select_box_parentID === wbase_parentID && selected_list.every(e => !e.IsInstance && e.value.classList.contains('w-container'))) {
    const listSize = selected_list.filter(wb => wb.value.classList.contains('w-container')).filterAndMap(wb => `${parseInt(wb.value.offsetWidth)}x${parseInt(wb.value.offsetHeight)}`)
    const deviceValue = listSize[0]
    var selectWHDevice = `<div class="row" style="width: 20.4rem">
      ${Select1({
      returnType: 'string',
      value: deviceValue,
      placeholder: '<div class="semibold1">Device name</div>',
      style: 'width: 12.4rem',
      className: 'right-view-input semibold1',
      dropdownStyle: 'width: fit-content; background-color: #000000',
      options: listDevice.map((item, i) => {
        return item.map((device, j) => {
          return {
            ...device,
            id: `${device.Width}x${device.Height}`,
            name: `${device.Name} - ${device.Width}x${device.Height}`,
            style: `color: #ffffff;${j === (item.length - 1) && i !== (listDevice.length - 1) ? 'border-bottom: 1px inset #ffffff' : ''}`
          }
        })
      }).reduce((a, b) => a.concat(b)),
      onChange: device => {
        handleEditOffset({ width: device.Width, height: device.Height })
        reloadEditOffsetBlock()
      }
    })}
    </div>`
  }
  const parentHTML = divSection.querySelector(`.wbaseItem-value.w-container[id="${select_box_parentID}"]`)
  if (parentHTML && window.getComputedStyle(parentHTML).display.match('flex')) {
    const isFixPos = selected_list.every(e => e.value.classList.contains('fixed-position'))
    var iconFixPos = `<button type="button" class="toogle-fix-position box24 action-button center row ${isFixPos ? 'toggle' : ''} ${selected_list.some(wb => !wb.value.classList.contains('w-variant') && wb.value.closest('.wbaseItem-value[iswini]')) ? ' disabled' : ''}" style="padding: 0.6rem">${IconFixPosition()}</button>`
    $(editContainer).on('click', '.toogle-fix-position', function () {
      handleEditOffset({ fixPosition: !isFixPos })
      updateUIDesignView()
    })
  }

  const list_offsetX = selected_list.filterAndMap(wb => `${getWBaseOffset(wb).x}`.replace('.00', ''))
  const editX = TextField({
    returnType: 'string',
    className: 'right-view-input regular1',
    prefix: `<div class="label-5" style="color: #b5b5b5">X</div>`,
    disabled: iconFixPos != null,
    value: list_offsetX.length == 1 ? list_offsetX[0] : 'mixed',
    onBlur: function (ev) {
      let newValue = parseFloat(ev.target.value)
      if (!isNaN(newValue)) handleEditOffset({ x: newValue })
    }
  })
  const list_offsetY = selected_list.filterAndMap(wb => `${getWBaseOffset(wb).y}`.replace('.00', ''))
  const editY = TextField({
    returnType: 'string',
    className: 'right-view-input regular1',
    prefix: `<div class="label-5" style="color: #b5b5b5">Y</div>`,
    disabled: iconFixPos != null,
    value: list_offsetY.length == 1 ? list_offsetY[0] : 'mixed',
    onBlur: function (ev) {
      let newValue = parseFloat(ev.target.value)
      if (!isNaN(newValue)) handleEditOffset({ y: newValue })
    }
  })
  const isFlexBox = selected_list.every(wb => {
    let computeSt = window.getComputedStyle(wb.value)
    return WbClass.scale.every(e => !wb.value.classList.contains(e)) &&
      (computeSt.display.match(/(flex|table)/g) || computeSt.position !== 'absolute')
  })
  const isRatio = selected_list.some(wb => window.getComputedStyle(wb.value).aspectRatio !== 'auto')
  let iconRatioWH = `<button type="button" class="toggle-ratioWH box24 action-button center row ${isRatio ? 'toggle' : ''}" style="padding: 0.5rem">${IconRatioWH({ toggle: isRatio })}</button>`
  $(editContainer).on('click', '.toggle-ratioWH', function () {
    handleEditOffset({ ratioWH: !isRatio })
    reloadEditOffsetBlock()
  })
  if (isFlexBox) {
    var disabledInputW = false
    var disabledInputH = false
    const wValue = (() => {
      let vl = selected_list.filterAndMap(wb => wb.value.getAttribute('width-type') ?? 'fixed')
      vl = vl.length > 1 ? 'mixed' : vl[0]
      if (vl !== 'fixed') {
        disabledInputW = true
        iconRatioWH = null
      }
      return vl
    })()
    var selectTypeW = Select1({
      returnType: 'string',
      value: wValue,
      style: 'width: 9.8rem; padding: 0.8rem',
      dropdownStyle: 'background-color: #000000; width: fit-content; padding: 0',
      options: [
        { id: 'mixed', title: '<div class="box14 row center" style="margin-right: 0.6rem"></div>mixed', name: 'mixed', prefix: `<div class="box14 row center"></div>`, style: `color: #ffffff;pointer-events: none;border-bottom: 1px inset #ffffff;${wValue === 'mixed' ? '' : 'display: none'}` },
        { id: 'fit', title: 'hug-content', name: `<div class="box14 row center" style="margin-right: 0.6rem">${IconHugContent()}</div>hug`, prefix: `<div class="box14 row center">${IconHugContent({ color: '#ffffff' })}</div>`, style: `color: #ffffff;${checkActiveFillHug({ type: 'fit' }) ? '' : 'display: none'}` },
        { id: 'fixed', title: 'fixed-size', name: `<div class="box14 row center" style="margin-right: 0.6rem">${IconFixedSize()}</div>fixed`, prefix: `<div class="box14 row center">${IconFixedSize({ color: '#ffffff' })}</div>`, style: 'color: #ffffff' },
        { id: 'fill', title: 'fill-container', name: `<div class="box14 row center" style="margin-right: 0.6rem">${IconFillContainer()}</div>fill`, prefix: `<div class="box14 row center">${IconFillContainer({ color: '#ffffff' })}</div>`, style: `color: #ffffff;${checkActiveFillHug({ type: 'fill' }) ? '' : 'display: none'}` },
      ],
      onChange: (value) => {
        handleEditOffset({ width: value.id === 'fit' ? null : value.id === 'fill' ? -1 : value.id })
        updateUIDesignView()
      }
    })
    const hValue = (() => {
      let vl = selected_list.filterAndMap(wb => wb.value.getAttribute('height-type') ?? 'fixed')
      vl = vl.length > 1 ? 'mixed' : vl[0]
      if (vl !== 'fixed') {
        disabledInputH = true
        iconRatioWH = null
      }
      return vl
    })()
    var selectTypeH = Select1({
      returnType: 'string',
      value: hValue,
      style: 'width: 9.8rem; padding: 0.8rem',
      dropdownStyle: 'background-color: #000000; width: fit-content; padding: 0',
      options: [
        { id: 'mixed', title: 'mixed', name: '<div class="box14 row center" style="margin-right: 0.6rem"></div>mixed', prefix: `<div class="box14 row center"></div>`, style: `color: #ffffff;pointer-events: none;border-bottom: 1px inset #ffffff;${hValue === 'mixed' ? '' : 'display: none'}` },
        { id: 'fit', title: 'hug-content', name: `<div class="box14 row center" style="transform: rotate(90deg);margin-right: 0.6rem">${IconHugContent()}</div>hug`, prefix: `<div class="box14 row center" style="transform: rotate(90deg);">${IconHugContent({ color: '#ffffff' })}</div>`, style: `color: #ffffff;${checkActiveFillHug({ type: 'fit' }) ? '' : 'display: none'}` },
        { id: 'fixed', title: 'fixed-size', name: `<div class="box14 row center" style="transform: rotate(90deg);margin-right: 0.6rem">${IconFixedSize()}</div>fixed`, prefix: `<div class="box14 row center" style="transform: rotate(90deg);">${IconFixedSize({ color: '#ffffff' })}</div>`, style: `color: #ffffff;` },
        { id: 'fill', title: 'fill-container', name: `<div class="box14 row center" style="transform: rotate(90deg);margin-right: 0.6rem">${IconFillContainer()}</div>fill`, prefix: `<div class="box14 row center" style="transform: rotate(90deg);">${IconFillContainer({ color: '#ffffff' })}</div>`, style: `color: #ffffff;${checkActiveFillHug({ type: 'fill' }) ? '' : 'display: none'}` },
      ],
      onChange: (value) => {
        handleEditOffset({ height: value.id === 'fit' ? null : value.id === 'fill' ? -1 : value.id })
        updateUIDesignView()
      }
    })
  }
  const list_width = selected_list.filterAndMap(e => e.value.offsetWidth)
  const editW = TextField({
    returnType: 'string',
    className: 'right-view-input regular1',
    disabled: disabledInputW,
    prefix: `<div class="label-5" style="color: #b5b5b5">W</div>`,
    value: list_width.length === 1 ? list_width[0] : 'mixed',
    onBlur: function (ev) {
      let newValue = parseFloat(ev.target.value)
      if (!isNaN(newValue)) handleEditOffset({ width: newValue, ratioWH: isRatio ? null : false })
    }
  })
  const list_height = selected_list.filterAndMap(e => e.value.offsetHeight)
  const editH = TextField({
    returnType: 'string',
    className: 'right-view-input regular1',
    disabled: disabledInputH,
    prefix: `<div class="label-5" style="color: #b5b5b5">H</div>`,
    value: list_height.length == 1 ? list_height[0] : 'mixed',
    onBlur: function (ev) {
      let newValue = parseFloat(ev.target.value)
      if (!isNaN(newValue)) handleEditOffset({ height: newValue, ratioWH: isRatio ? null : false })
    }
  })
  const edit_rotate = TextField({
    returnType: 'string',
    className: 'right-view-input regular1',
    prefix: '<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/rotate_rect.svg"/>',
    value: 0
  })

  const allowRadius = ['w-container', 'w-button', 'w-rect', 'w-textformfield']
  const showInputRadius = selected_list.filter(wb => allowRadius.some(cls => wb.value.classList.contains(cls)))
  if (showInputRadius.length > 0) {
    const isRadiusDetails = design_view.querySelector('.radius-details.toggle') != null
    let list_radius_value = showInputRadius.map(e => window.getComputedStyle(e.value).borderRadius.split(' ').map(brvl => parseFloat(brvl.replace('px'))))
    list_radius_value = [].concat(...list_radius_value).filterAndMap()
    const edit_radius = TextField({
      returnType: 'string',
      className: 'right-view-input regular1 radius-all',
      style: isRadiusDetails ? 'visibility: hidden' : '',
      prefix: '<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/radius_rect.svg"/>',
      value: list_radius_value.length == 1 ? list_radius_value[0] : 'mixed',
      onBlur: function (ev) {
        let newValue = parseFloat(ev.target.value)
        if (isNaN(newValue)) {
          ev.target.value = list_radius_value.length == 1 ? list_radius_value[0] : 'mixed'
        } else {
          handleEditOffset({ radius: newValue })
          reloadEditOffsetBlock()
        }
      }
    })
    const iconRadiusDetails = `<button type="button" class="radius-details box24 action-button row ${isRadiusDetails ? 'toggle' : ''}" style="padding: 0.4rem">${IconRadiusDetails()}</button>`
    $(editContainer).on('click', '.radius-details', function (ev) {
      if (isRadiusDetails)
        ev.target.closest('.radius-details').classList.remove('toggle')
      else
        ev.target.closest('.radius-details').classList.add('toggle')
      reloadEditOffsetBlock()
    })

    if (isRadiusDetails) {
      $(editContainer).on('focus', '.radius-details-input > input', function (ev) {
        ev.target.select()
      })
      let brtlValue = showInputRadius.filterAndMap(e => window.getComputedStyle(e.value).borderTopLeftRadius.replace('px', ''))
      brtlValue = brtlValue.length === 1 ? brtlValue[0] : 'mixed'
      $(editContainer).on('blur', '.radius-details-input > .br-tl', function () {
        let newValue = parseFloat(this.value)
        if (isNaN(newValue)) {
          this.value = brtlValue
        } else {
          handleEditOffset({ radiusTL: newValue })
          reloadEditOffsetBlock()
        }
      })
      let brtrValue = showInputRadius.filterAndMap(e => window.getComputedStyle(e.value).borderTopRightRadius.replace('px', ''))
      brtrValue = brtrValue.length === 1 ? brtrValue[0] : 'mixed'
      $(editContainer).on('blur', '.radius-details-input > .br-tr', function () {
        let newValue = parseFloat(this.value)
        if (isNaN(newValue)) {
          this.value = brtrValue
        } else {
          handleEditOffset({ radiusTR: newValue })
          reloadEditOffsetBlock()
        }
      })
      let brblValue = showInputRadius.filterAndMap(e => window.getComputedStyle(e.value).borderBottomLeftRadius.replace('px', ''))
      brblValue = brblValue.length === 1 ? brblValue[0] : 'mixed'
      $(editContainer).on('blur', '.radius-details-input > .br-bl', function () {
        let newValue = parseFloat(this.value)
        if (isNaN(newValue)) {
          this.value = brblValue
        } else {
          handleEditOffset({ radiusBL: newValue })
          reloadEditOffsetBlock()
        }
      })
      let brbrValue = showInputRadius.filterAndMap(e => window.getComputedStyle(e.value).borderBottomRightRadius.replace('px', ''))
      brbrValue = brbrValue.length === 1 ? brbrValue[0] : 'mixed'
      $(editContainer).on('blur', '.radius-details-input > .br-br', function () {
        let newValue = parseFloat(this.value)
        if (isNaN(newValue)) {
          this.value = brbrValue
        } else {
          handleEditOffset({ radiusBR: newValue })
          reloadEditOffsetBlock()
        }
      })
      var editRadiusDetails = `<div class="row radius-details-input" style="gap: 0.4rem">
      <img class="box12" src ='https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/radius_rect.svg' />
      <input class="regular1 br-tl" value="${brtlValue}"/>
      <input class="regular1 br-tr" value="${brtrValue}"/>
      <input class="regular1 br-bl" value="${brblValue}"/>
      <input class="regular1 br-br" value="${brbrValue}"/>
    </div>`
    }
    var editR = edit_radius + iconRadiusDetails + (editRadiusDetails ?? '')
  }

  const enableClipContentList = ['w-container', 'w-button', 'w-textformfield', 'w-variant']
  if (selected_list.filter(wb => enableClipContentList.some(e => wb.value.classList.contains(e))).length > 0) {
    // sixth line is btn checkboc clip content (overflow)
    var btn_clip_content = `<div class="row regular1" style="gap: 0.4rem; padding: 0.2rem 0.8rem">${Checkbox({
      returnType: 'string',
      size: '1.6rem',
      value: selected_list.filter(wb => enableClipContentList.some(e => wb.value.classList.contains(e))).every(wb => window.getComputedStyle(wb.value).overflow.includes('hidden')),
      onChange: (ev) => {
        handleEditOffset({ isClip: ev.target.checked })
      }
    })} Clip content</div>`
  }
  editContainer.innerHTML = `<div class="row" style="gap: 1.2rem 0.8rem; flex-wrap: wrap">${selectWHDevice ?? ''}${editX}${editY}${iconFixPos ?? ''}${editW}${editH}${iconRatioWH ?? ''}${selectTypeW ?? ''}${selectTypeH ?? ''}${edit_rotate}${editR ?? ''}${btn_clip_content ?? ''}</div>`
  return editContainer
}

// update style HTML edit position UI
function reloadEditOffsetBlock() {
  let newEditSizePositionForm = EditOffsetBlock()
  document.getElementById('edit_size_position_div').replaceWith(newEditSizePositionForm)
}

// edit auto layout
function EditLayoutBlock() {
  let wbList = selected_list.filter(wb => WbClass.parent.some(e => wb.value.classList.contains(e)))
  const isDisabled = selected_list.every(wb => wb.value.closest('.wbaseItem-value[iswini]:not(.w-variant)'))
  let isEditTable = wbList.length > 0 && wbList.every(wb => wb.value.classList.contains('w-table'))
  let editContainer = document.createElement('div')
  editContainer.id = 'edit_auto_layout_div'
  editContainer.className = 'edit-container col'
  let header = document.createElement('div')
  header.className = `ds-block-header row`
  header.innerHTML = `<p class="semibold1" style="flex: 1">${isEditTable ? 'Table layout' : 'Auto layout'}</p>
  <i class="fa-solid fa-minus center box24 ${isDisabled ? 'disabled' : ''}" style="font-size: 1.4rem"></i>
  <i class="fa-solid fa-plus center box24 ${isDisabled ? 'disabled' : ''}" style="font-size: 1.4rem"></i>`
  editContainer.appendChild(header)
  const showDetails = selected_list.every(wb => window.getComputedStyle(wb.value).display.match(/(flex|table)/g))
  if (showDetails) {
    header.querySelector('.fa-plus').remove()
    if (wbList.every(wb => ['w-textformfield', 'w-table'].every(e => !wb.value.classList.contains(e)) && !wb.IsInstance && !wb.value.closest('.wbaseItem-value[iswini]'))) {
      $(header).on('click', '.fa-minus', function () {
        removeLayout()
        reloadEditOffsetBlock()
        reloadEditLayoutBlock()
      })
    } else {
      header.querySelector('.fa-minus').remove()
    }
    let editLayoutBody = document.createElement('div')
    editLayoutBody.className = 'col'
    editLayoutBody.style.gap = '0.8rem'
    editContainer.appendChild(editLayoutBody)
    const isVertical = wbList.every(wb => ['w-col', 'w-table'].some(e => wb.value.classList.contains(e)))
    const selectDirection = GroupButtonOptions({
      returnType: 'string',
      value: isVertical ? 'Vertical' : 'Horizontal',
      style: 'padding: 0 0.8rem',
      options: [
        { id: 'Vertical', icon: `<i class="fa-solid fa-arrow-down" style="font-size: 1.2rem"></i>`, style: 'padding: 0.2rem' },
        { id: 'Horizontal', icon: `<i class="fa-solid fa-arrow-right" style="font-size: 1.2rem"></i>`, style: 'padding: 0.2rem' },
      ],
      onselect: (vl) => {
        handleEditLayout({ direction: vl.id })
        reloadEditOffsetBlock()
        reloadEditLayoutBlock()
      }
    })
    let alignValue = mainAxisToAlign(
      wbList[0].value.style.justifyContent ?? StyleDA.docStyleSheets.find(cssRule => [...divSection.querySelectorAll(cssRule.selectorText)].includes(wbList[0].value))?.style?.justifyContent,
      !isVertical) +
      crossAxisToAlign(wbList[0].value.style.alignItems ?? StyleDA.docStyleSheets.find(cssRule => [...divSection.querySelectorAll(cssRule.selectorText)].includes(wbList[0].value))?.style?.alignItems,
        !isVertical)
    alignValue = alignValue === 'CenterCenter' ? 'Center' : alignValue
    //
    $(editLayoutBody).on('click', '.alignment-container .align-option', function (ev) {
      $('.alignment-container .align-option').removeClass('selected')
      ev.target.closest('.align-option').classList.add('selected')
      alignValue = ev.target.getAttribute('alignvl')
      handleEditLayout({ alignment: ev.target.getAttribute('alignvl') })
    })
    const alignmentTable = `<div class="alignment-container box64" ${isVertical ? 'oy' : ''} >${listFlexAlignment.map(e => `<div class='align-option box16 ${e === alignValue ? 'selected' : ''}' alignvl="${e}"></div>`).join('')}</div>`

    // input edit child space
    if (!isEditTable) {
      const childSpaceValues = wbList.filterAndMap(wb => parseFloat(window.getComputedStyle(wb.value)[wb.value.classList.contains('w-col') ? 'row-gap' : 'column-gap'].replace('px', '')))
      var inputChildSpace = TextField({
        returnType: 'string',
        className: 'right-view-input regular1',
        style: 'position: absolute; left: 0.4rem; bottom: 0',
        prefix: `<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/${isVertical ? 'vertical' : 'horizontal'} child spacing.svg"/>`,
        value: childSpaceValues.length == 1 ? childSpaceValues[0] : 'mixed',
        onBlur: function (ev) {
          let newValue = parseFloat(ev.target.value)
          if (!isNaN(newValue)) {
            handleEditLayout({ childSpace: newValue })
            reloadEditOffsetBlock()
            reloadEditLayoutBlock()
          } else {
            ev.target.value =
              childSpaceValues.length == 1 ? childSpaceValues[0] : 'mixed'
          }
        }
      })
      if (wbList.every(wb => !wb.value.classList.contains('w-textformfield'))) {
        const checkFlexWrap = `<div class="row regular1 col12" style="gap: 0.4rem; padding: 0.2rem 0.8rem; width: 9.8rem">${Checkbox({
          returnType: 'string',
          size: '1.6rem',
          value: wbList.filterAndMap(wb => window.getComputedStyle(wb.value).flexWrap).every(e => e === 'wrap'),
          onChange: (ev) => {
            reloadEditOffsetBlock()
            handleEditLayout({ isWrap: ev.target.checked })
          }
        })} Wrap content</div>`
        const runSpaceValues = wbList.filterAndMap(wb => parseFloat((wb.value.style.getPropertyValue('--run-space') ?? StyleDA.docStyleSheets.find(cssRule => [...divSection.querySelectorAll(cssRule.selectorText)].includes(wbList[0].value))?.style?.getPropertyValue('--run-space')).replace('px', '')))
        const inputRunSpace = TextField({
          returnType: 'string',
          className: 'right-view-input regular1',
          prefix: `<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/${isVertical ? 'horizontal' : 'vertical'} child spacing.svg"/>`,
          value: runSpaceValues.length == 1 ? runSpaceValues[0] : 'mixed',
          onBlur: function (ev) {
            let newValue = parseFloat(ev.target.value)
            if (!isNaN(newValue)) {
              handleEditLayout({ runSpace: newValue })
              reloadEditOffsetBlock()
              reloadEditLayoutBlock()
            } else {
              ev.target.value =
                runSpaceValues.length == 1 ? runSpaceValues[0] : 'mixed'
            }
          }
        })
        const checkScroll = `<div class="row regular1 col12" style="gap: 0.4rem; padding: 0.2rem 0.8rem; width: 9.8rem">${Checkbox({
          returnType: 'string',
          size: '1.6rem',
          disabled: wbList.some(wb => (wb.value.classList.contains('w-col') && wb.value.getAttribute('height-type') === 'fit') || (wb.value.classList.contains('w-row') && wb.value.getAttribute('width-type') === 'fit')),
          value: wbList.filterAndMap(wb => window.getComputedStyle(wb.value).overflow).every(e => e.includes('scroll')),
          onChange: (ev) => {
            reloadEditOffsetBlock()
            handleEditLayout({ isScroll: ev.target.checked })
          }
        })} Scroll content</div>`
        var layoutOption = `<div class="row" style="flex-wrap: wrap; gap: 0.8rem 1.2rem">${checkFlexWrap}${inputRunSpace}${checkScroll}</div>`
      }
    }
    const isShowPadDetails = design_view.querySelector('.padding-details.toggle') != null
    $(editLayoutBody).on('click', '.padding-details', function (ev) {
      if (isShowPadDetails) {
        ev.target.closest('.padding-details').classList.remove('toggle')
      } else {
        ev.target.closest('.padding-details').classList.add('toggle')
      }
      reloadEditLayoutBlock()
    })
    let paddingLefts = wbList.filterAndMap(e => window.getComputedStyle(e.value).paddingLeft.replace('px', ''))
    let padLeftValue = paddingLefts.length == 1 ? paddingLefts[0] : 'mixed'
    let paddingTops = wbList.filterAndMap(e => window.getComputedStyle(e.value).paddingTop.replace('px', ''))
    let padTopValue = paddingTops.length == 1 ? paddingTops[0] : 'mixed'
    let paddingRights = wbList.filterAndMap(e => window.getComputedStyle(e.value).paddingRight.replace('px', ''))
    let padRightValue = paddingRights.length == 1 ? paddingRights[0] : 'mixed'
    let paddingBots = wbList.filterAndMap(e => window.getComputedStyle(e.value).paddingBottom.replace('px', ''))
    let padBotValue = paddingBots.length == 1 ? paddingBots[0] : 'mixed'
    if (isShowPadDetails) {
      var inputPadLeft = TextField({
        returnType: 'string',
        className: 'right-view-input regular1',
        prefix: `<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding left.svg" />`,
        value: padLeftValue,
        onBlur: function (ev) {
          let newValue = parseFloat(ev.target.value)
          if (!isNaN(newValue)) {
            padLeftValue = newValue
            handleEditPadding({ left: newValue })
            reloadEditOffsetBlock()
          } else {
            ev.target.value = padLeftValue
          }
        }
      })
      var inputPadTop = TextField({
        returnType: 'string',
        className: 'right-view-input regular1',
        prefix: `<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding top.svg" />`,
        value: padTopValue,
        onBlur: function (ev) {
          let newValue = parseFloat(ev.target.value)
          if (!isNaN(newValue)) {
            padTopValue = newValue
            handleEditPadding({ top: newValue })
            reloadEditOffsetBlock()
          } else {
            ev.target.value = padTopValue
          }
        }
      })
      var inputPadRight = TextField({
        returnType: 'string',
        className: 'right-view-input regular1',
        style: isShowPadDetails ? '' : 'display: none',
        prefix: `<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding right.svg" />`,
        value: padRightValue,
        onBlur: function (ev) {
          let newValue = parseFloat(ev.target.value)
          if (!isNaN(newValue)) {
            padRightValue = newValue
            handleEditPadding({ right: newValue })
            reloadEditOffsetBlock()
          } else {
            ev.target.value = padRightValue
          }
        }
      })
      var inputPadBot = TextField({
        returnType: 'string',
        className: 'right-view-input regular1',
        style: isShowPadDetails ? '' : 'display: none',
        prefix: `<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding bottom.svg" />`,
        value: padBotValue,
        onBlur: function (ev) {
          let newValue = parseFloat(ev.target.value)
          if (!isNaN(newValue)) {
            padBotValue = newValue
            handleEditPadding({ bottom: newValue })
            reloadEditOffsetBlock()
          } else {
            ev.target.value = padBotValue
          }
        }
      })
    } else {
      var inputPadX = TextField({
        returnType: 'string',
        className: 'right-view-input regular1',
        prefix: `<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding horizontal.svg" />`,
        value: padLeftValue == padRightValue ? padLeftValue : 'mixed',
        onBlur: function (ev) {
          let newValue = parseFloat(ev.target.value)
          if (isNaN(newValue)) {
            ev.target.value = padLeftValue == padRightValue ? padLeftValue : 'mixed'
          } else {
            padLeftValue = newValue
            padRightValue = newValue
            handleEditPadding({ left: newValue, right: newValue })
            reloadEditOffsetBlock()
          }
        }
      })
      var inputPadY = TextField({
        returnType: 'string',
        className: 'right-view-input regular1',
        prefix: `<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/padding vertical.svg" />`,
        value: padTopValue == padBotValue ? padTopValue : 'mixed',
        onBlur: function (ev) {
          let newValue = parseFloat(ev.target.value)
          if (isNaN(newValue)) {
            ev.target.value = padTopValue == padBotValue ? padTopValue : 'mixed'
          } else {
            padTopValue = newValue
            padBotValue = newValue
            handleEditPadding({ top: newValue, bottom: newValue })
            reloadEditOffsetBlock()
          }
        }
      })
    }
    editLayoutBody.innerHTML = `<div class="row" style="position: relative; justify-content: space-between; align-items: start">
      ${selectDirection}
      <div class="row" style="gap: 2.4rem; align-items: start">${alignmentTable}<i class="fa-solid fa-ellipsis box24 center" style="display: flex; font-size: 1.4rem"></i></div>
      ${inputChildSpace ?? ''}
      </div>
      ${layoutOption ?? ''}
      <div class="row edit-padding-container" style="gap: 0.8rem 1.2rem; flex-wrap: wrap">
      ${inputPadX ?? ''}${inputPadY ?? ''}${inputPadTop ?? ''}${inputPadRight ?? ''}
      <button type="button" class="padding-details action-button box24 row ${isShowPadDetails ? 'toggle' : ''}" style="padding: 0.5rem">${IconPaddingDetails()}</button>
      ${inputPadBot ?? ''}${inputPadLeft ?? ''}
      </div>`
  } else {
    header.querySelector('.fa-minus').remove()
    if (!isDisabled) {
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

// ! Constraints
function EditConstraintsBlock() {
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-constraints'
  editContainer.className = 'edit-container col'

  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  header.innerHTML = `<p class="semibold1" style="flex: 1">Constraints</p>`
  editContainer.appendChild(header)

  let bodyContainer = document.createElement('div')
  bodyContainer.className = 'col'
  editContainer.appendChild(bodyContainer)

  //
  let editConstContainer = document.createElement('div')
  editConstContainer.className = 'row'
  editConstContainer.style.cssText = 'justify-content: space-between;padding: 0.2rem 0.8rem'
  bodyContainer.appendChild(editConstContainer)
  const constraintsXValues = selected_list.filterAndMap(e => e.value.getAttribute('constx'))
  const constraintsX = constraintsXValues.length === 1 ? constraintsXValues[0] : 'mixed'
  const constraintsYValues = selected_list.filterAndMap(e => e.value.getAttribute('consty'))
  const constraintsY = constraintsYValues.length === 1 ? constraintsYValues[0] : 'mixed'

  let constraintsRect = document.createElement('div')
  constraintsRect.className = 'connstraints-rect box66'
  let selectConstraintsCol = document.createElement('div')
  selectConstraintsCol.className = 'col'
  selectConstraintsCol.style.cssText = 'width: 100%;flex: 1;gap:0.8rem;padding: 0 1.6rem'
  editConstContainer.replaceChildren(constraintsRect, selectConstraintsCol)

  if (selected_list.every(wb => WbClass.scale.every(e => !wb.value.classList.contains(e)))) {
    if (selected_list.every(wb => wb.value.getAttribute('width-type') !== 'fit')) {
      var extendConstX = [...listContraintsX, Constraints.left_right, Constraints.scale]
    }
    if (selected_list.every(wb => wb.value.getAttribute('height-type') !== 'fit')) {
      var extendConstY = [...listContraintsY, Constraints.top_bottom, Constraints.scale]
    }
  }

  let smallConstRect = document.createElement('div')
  constraintsRect.appendChild(smallConstRect)

  for (let constY of listContraintsY.slice(0, 3)) {
    let selectBtn = document.createElement('div')
    selectBtn.className = 'constraint-selector-outerVertical row'
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
        selectBtn.style.padding = '0.2rem'
        selectBtn.style.transform = 'translate(-50%, -50%)'
        typeLine.style.height = '1.2rem'
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
    selectBtn.className = 'constraint-selector-outerHorizontal row'
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
        selectBtn.style.padding = '0.2rem'
        selectBtn.style.transform = 'translate(-50%, -50%)'
        typeLine.style.width = '1.2rem'
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

  let dropdownConstX = Select1({
    value: constraintsX,
    className: 'right-view-input regular1',
    style: 'width: 100%',
    dropdownStyle: 'background-color: #000000',
    options: [
      { id: 'mixed', name: 'mixed', style: `pointer-events: none;border-bottom: 1px inset #ffffff;${constraintsX === 'mixed' ? '' : 'display: none'}` },
      ...(extendConstX ?? listContraintsX).map(e => {
        return {
          id: e,
          name: e,
          style: 'color: #ffffff'
        }
      })
    ],
    onChange: vl => {
      handleEditConstraints({ constX: vl.id })
      reloadEditConstraintsBlock()
    }
  })

  let dropdownConstY = Select1({
    value: constraintsY,
    className: 'right-view-input regular1',
    style: 'width: 100%',
    dropdownStyle: 'background-color: #000000',
    options: [
      { id: 'mixed', name: 'mixed', style: `pointer-events: none;border-bottom: 1px inset #ffffff;${constraintsY === 'mixed' ? '' : 'display: none'}` },
      ...(extendConstY ?? listContraintsY).map(e => {
        return {
          id: e,
          name: e,
          style: 'color: #ffffff'
        }
      })
    ],
    onselect: vl => {
      handleEditConstraints({ constY: vl.id })
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

//! background-color || img
function EditBackgroundBlock() {
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-background'
  editContainer.className = 'edit-container col'
  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  let scaleWb = selected_list.every(wb => WbClass.scale.some(e => wb.value.classList.contains(e)))
  header.innerHTML = `<p class="semibold1" style="flex: 1">${scaleWb ? 'Checked primary color' : 'Background'}</p>
  <button type='button' class="row action-button box24 action-button" style="padding: 0.7rem">${IconMoreSkins()}</button>
  <i class="fa-regular fa-image center box24" style="font-size: 1.2rem"></i>
  <i class="fa-solid fa-plus center box24" style="font-size: 1.4rem"></i>`
  editContainer.appendChild(header)

  let wbBg = selected_list.filterAndMap(wb => window.getComputedStyle(wb.value).backgroundImage)
  if (wbBg.length === 1) {
    if (wbBg[0] === 'none') {
      wbBg = selected_list.filterAndMap(wb => {
        let bgColor = wb.value.style?.backgroundColor?.length > 0
          ? wb.value.style.backgroundColor
          : StyleDA.docStyleSheets.find(cssRule => [...divSection.querySelectorAll(cssRule.selectorText)].includes(wb.value))?.style?.backgroundColor
        if (bgColor?.match(uuid4Regex)) return bgColor?.match(uuid4Regex)[0]
        else return bgColor?.length === 0 ? null : bgColor
      })
      if (wbBg.length === 1 && wbBg[0]?.length > 0) {
        if (wbBg[0].length === 36) {
          let colorSkin = StyleDA.listSkin.find(skin => wbBg[0] === skin.GID)
          let cateItem
          if (colorSkin) {
            header.querySelector('.fa-plus').remove()
            header.querySelector('.action-button').remove()
            if (colorSkin.CateID !== EnumCate.color) {
              cateItem = CateDA.list_color_cate.find(e => e.ID === colorSkin.CateID)
            }
            let skin_tile = wbaseSkinTile({
              cate: EnumCate.color,
              prefixValue: colorSkin.Css,
              title: (cateItem ? `${cateItem.Name}/` : '') + colorSkin.Name,
              onClick: function () {
                let offset = header.getBoundingClientRect()
                showTableSkin({ cate: EnumCate.color, offset: offset, cssText: colorSkin.Css, selectedSkinId: colorSkin.GID })
              },
              onRemove: scaleWb ? null : function () {
                handleEditBackground({ hexCode: null })
                reloadEditBackgroundBlock()
              }
            })
            editContainer.appendChild(skin_tile)
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
              bgColor = vl
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
      editImgTile.className = 'row'
      editImgTile.style.justifyContent = "space-between"
      editImgTile.innerHTML = `<div class="row parameter-form img-value-tile">
      <div class="box24" style="background: url(${window.getComputedStyle(selected_list[0].value).backgroundImage.replace(/(url\("|"\))/g, '')}) 0 0 / contain no-repeat; background-position: center"></div>
        <p class="regular1 input-color-value">Image</p><input class="regular1 input-opacity-value" value="100%" />
      </div>
      <i class="fa-solid fa-minus box24 center" style="font-size: 1.4rem; display: flex"></i>`
      editContainer.appendChild(editImgTile)

      $(editImgTile).on('click', '.img-value-tile .box24', function (ev) {
        if (!document.getElementById('popup_img_document')) FileDA.init().then(res => {
          if (res.Code === 200) showImgDocument({ pageX: ev.pageX - 400, pageY: ev.pageY })
        })
      })
      $(editImgTile).on('click', '.fa-minus', function () {
        handleEditBackground({ hexCode: null })
        reloadEditBackgroundBlock()
      })
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
  $(header).on('click', '.action-button', function () {
    const offset = header.getBoundingClientRect()
    showTableSkin({ cate: EnumCate.color, offset: offset, cssText: bgColor ? `#${bgColor}` : null })
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
                  document.body.querySelector('.tb-skins-popup-body').setAttribute('edit-type', wbStyle[i])
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
                document.body.querySelector('.tb-skins-popup-body').setAttribute('edit-type', wbStyle[i])
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
  let listTextStyle = selected_list.filter(wb => ['w-text', 'w-textformfield'].some(e => wb.value.classList.contains(e)))
  let editContainer = document.createElement('div')
  editContainer.id = 'edit_text_style'
  editContainer.className = 'edit-container col'
  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  header.innerHTML = `<p class="semibold1" style="flex: 1">Font</p><button type='button' class="row action-button box24 action-button" style="padding: 0.7rem">${IconMoreSkins()}</button>`
  editContainer.appendChild(header)

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
          var cateItem = CateDA.list_color_cate.find(e => e.ID === colorSkin.CateID)
        }
        var editColor = wbaseSkinTile({
          cate: EnumCate.color,
          prefixValue: colorSkin.Css,
          title: (cateItem ? `${cateItem.Name}/` : '') + colorSkin.Name,
          onClick: function () {
            let offset = header.getBoundingClientRect()
            showTableSkin({ cate: EnumCate.color, offset: offset, cssText: colorSkin.Css, selectedSkinId: colorSkin.GID })
            document.body.querySelector('.tb-skins-popup-body').setAttribute('edit-type', 'typo')
          },
          handleUnlinkSkin: function () {
            handleEditTypo({ hexCode: Ultis.rgbToHex(window.getComputedStyle(listTextStyle[0].value).color) })
            reloadEditTypoBlock()
          }
        })
      }
    } else {
      editColor = createEditColorForm({
        value: Ultis.rgbToHex(window.getComputedStyle(listTextStyle[0].value).color),
        onchange: params => {
          handleEditTypo({ color: params, onSubmit: false })
        },
        onsubmit: params => {
          handleEditTypo({ color: params })
          reloadEditTypoBlock()
        },
        suffixAction: function () {
          let offset = editColor.getBoundingClientRect()
          showTableSkin({ cate: EnumCate.color, offset: offset, cssText: Ultis.rgbToHex(window.getComputedStyle(listTextStyle[0].value).color) })
          document.body.querySelector('.tb-skins-popup-body').setAttribute('edit-type', 'typo')
        }
      })
    }
  }

  if (listTypoSkin.length === 1 && listTypoSkin[0]?.length === 36) {
    let typoSkin = StyleDA.listSkin.find(skin => listTypoSkin[0] == skin.GID)
    let cateItem = CateDA.list_typo_cate.find(e => e.ID == typoSkin.CateID)
    const wbComputeSt = window.getComputedStyle(listTextStyle[0].value)
    let skin_tile = wbaseSkinTile({
      cate: EnumCate.typography,
      prefixValue: `${wbComputeSt.fontSize}/${wbComputeSt.lineHeight}`,
      title: (cateItem ? `${cateItem.Name}/` : '') + typoSkin.Name,
      onClick: function () {
        let offset = header.getBoundingClientRect()
        showTableSkin({ cate: EnumCate.typography, offset: offset, cssText: typoSkin.Css, selectedSkinId: typoSkin.GID })
      }
    })
    if (editColor) editContainer.appendChild(editColor)
    skin_tile.style.margin = '0.6rem 0'
    editContainer.appendChild(skin_tile)
  } else if (listTypoSkin.some(vl => vl.length === 36)) {
    header.appendChild(btnSelectSkin)
    let notiText = document.createElement('p')
    notiText.className = 'regular1'
    notiText.style.margin = '0.4rem 0.8rem'
    notiText.innerHTML = 'choose a typogrphy skin to replace mixed content'
    editContainer.appendChild(notiText)
  } else {
    let text_style_attribute = document.createElement('div')
    text_style_attribute.className = 'row'
    text_style_attribute.style.cssText = 'flex-wrap: wrap; width: 100%; padding: 0.4rem 1.2rem; gap: 0.6rem'
    const fontFamilyValues = listTextStyle.filterAndMap(wb => window.getComputedStyle(wb.value).fontFamily)
    const familyValue = fontFamilyValues.length === 1 ? fontFamilyValues[0] : 'mixed'
    const selectFontFamily = TextField({
      returnType: 'string',
      className: 'col24 right-view-input regular1',
      value: familyValue,
      style: '--gutter: 0.6rem',
      suffix: Select1({
        returnType: 'string',
        value: familyValue,
        iconOnly: true,
        style: 'border: none',
        className: 'box24 action-button center',
        dropdownStyle: 'background-color: #000000; width: 24rem !important',
        options: [
          { id: 'mixed', name: 'mixed', style: `pointer-events: none;border-bottom: 1px inset #ffffff;${familyValue === 'mixed' ? '' : 'display: none'}` },
          ...list_font_family.map(e => {
            return {
              id: e,
              name: e,
              style: 'color: #ffffff'
            }
          })
        ],
        onChange: (vl) => {
          handleEditTypo({ fontFamily: vl.id })
        }
      }),
      onBlur: ev => {
        const newValue = list_font_family.find(e => e.toLowerCase() === ev.target.value.trim().toLowerCase())
        if (newValue) {
          handleEditTypo({ fontFamily: newValue })
        } else {
          ev.target.value = familyValue
        }
      }
    })

    const fWeightValues = listTextStyle.filterAndMap(wb => window.getComputedStyle(wb.value).fontWeight)
    const weightValue = fWeightValues.length === 1 ? fWeightValues[0] : 'mixed'
    const selectFontWeight = Select1({
      returnType: 'string',
      className: 'col12 right-view-input regular1',
      style: '--gutter: 0.6rem; text-align: start',
      value: weightValue,
      dropdownStyle: 'background-color: #000000',
      options: [
        { id: 'mixed', name: 'mixed', style: `pointer-events: none;border-bottom: 1px inset #ffffff;${weightValue === 'mixed' ? '' : 'display: none'}` },
        ...list_font_weight.map(e => {
          return {
            id: e,
            name: e,
            style: 'color: #ffffff'
          }
        })
      ],
      onChange: (vl) => {
        handleEditTypo({ fontWeight: vl.id })
      }
    })
    const fSizeValues = listTextStyle.filterAndMap(wb => parseFloat(window.getComputedStyle(wb.value).fontSize.replace('px', '')))
    const sizeValue = fSizeValues.length === 1 ? fSizeValues[0] : 'mixed'
    const selectFontSize = TextField({
      returnType: 'string',
      style: '--gutter: 0.6rem',
      className: 'col12 right-view-input regular1',
      type: 'number',
      value: sizeValue,
      suffix: Select1({
        returnType: 'string',
        iconOnly: true,
        value: sizeValue,
        style: 'border: none',
        className: 'box24 action-button center',
        dropdownStyle: 'background-color: #000000; width: 8rem !important',
        options: [
          { id: 'mixed', name: 'mixed', style: `pointer-events: none;border-bottom: 1px inset #ffffff;${sizeValue === 'mixed' ? '' : 'display: none'}` },
          ...list_font_size.map(e => {
            return {
              id: e,
              name: e,
              style: 'color: #ffffff'
            }
          })
        ],
        onChange: (vl) => {
          handleEditTypo({ fontSize: vl.id })
        }
      }),
      onBlur: ev => {
        const newValue = ev.target.value.trim()
        if (!isNaN(parseFloat(newValue))) {
          handleEditTypo({ fontSize: parseFloat(newValue) })
        } else {
          ev.target.value = sizeValue
        }
      }
    })
    const lineHeightValues = listTextStyle.filterAndMap(wb => window.getComputedStyle(wb.value).lineHeight.replace('px', ''))
    const heightValue = lineHeightValues.length === 1 ? lineHeightValues[0] : 'mixed'
    const inputlHeight = TextField({
      returnType: 'string',
      style: '--gutter: 0.6rem',
      className: 'col12 right-view-input regular1',
      prefix: '<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/line-height.svg"/>',
      value: heightValue,
      onBlur: function (ev) {
        if (ev.target.value.toLowerCase() === 'auto' || ev.target.value.toLowerCase() === 'normal') {
          handleEditTypo({ height: null })
        } else if (!isNaN(parseFloat(ev.target.value))) {
          handleEditTypo({ height: parseFloat(ev.target.value) })
        }
      }
    })
    const lSpacingValues = listTextStyle.filterAndMap(wb => window.getComputedStyle(wb.value).letterSpacing.replace('px', ''))
    const spacingValue = lSpacingValues.length === 1 ? lSpacingValues[0] : 'mixed'
    const inputlSpacing = TextField({
      returnType: 'string',
      style: '--gutter: 0.6rem',
      className: 'col12 right-view-input regular1',
      prefix: '<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/letter-spacing.svg"/>',
      value: spacingValue,
      onBlur: function (ev) {
        if (ev.target.value.toLowerCase() === 'auto' || ev.target.value.toLowerCase() === 'normal') {
          handleEditTypo({ letterSpacing: null })
        } else if (!isNaN(parseFloat(ev.target.value))) {
          handleEditTypo({ letterSpacing: parseFloat(ev.target.value) })
        }
      }
    })
    var fontCssText = `${fWeightValues[0]} ${fSizeValues[0]}px/${isNaN(lineHeightValues[0]) ? 'normal' : `${lineHeightValues[0]}px`} ${fontFamilyValues[0]}`

    text_style_attribute.innerHTML = `${selectFontFamily}${selectFontWeight}${selectFontSize}${inputlHeight}${inputlSpacing}`
    editContainer.appendChild(text_style_attribute)
  }
  // if (listTextStyle.some(e => e.CateID !== EnumCate.chart)) {
  // group btn select text auto size
  const autoSizeValues = listTextStyle.filterAndMap(wb => {
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
  const group_btn_auto_size = GroupButtonOptions({
    value: autoSizeValues.length > 1 ? 'mixed' : autoSizeValues[0],
    style: 'padding: 0 0.8rem',
    options: [
      {
        id: TextAutoSize.autoWidth,
        icon: IconAutoWidth(),
        style: 'padding: 0.2rem'
      },
      {
        id: TextAutoSize.autoHeight,
        icon: IconAutoHeight()
      },
      {
        id: TextAutoSize.fixedSize,
        icon: IconFixedSize(),
        style: 'padding: 0.2rem'
      }
    ],
    onselect: (vl) => {
      switch (vl.id) {
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
  editContainer.appendChild(group_btn_auto_size)
  let _row = document.createElement('div')
  _row.className = 'row'
  _row.style.cssText = 'padding: 0.8rem; width: 100%'
  editContainer.appendChild(_row)
  // group btn select text align
  const textAlignValues = listTextStyle.filterAndMap(wb => window.getComputedStyle(wb.value).textAlign)
  const group_btn_text_align = GroupButtonOptions({
    value: textAlignValues.length > 1 ? 'mixed' : textAlignValues[0],
    style: 'flex: 1; width: 100%',
    options: [
      {
        id: TextAlign.left,
        img: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text-align-left.svg'
      },
      {
        id: TextAlign.center,
        img: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text-align-center.svg'
      },
      {
        id: TextAlign.right,
        img: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text-align-right.svg'
      }
    ],
    onselect: vl => {
      handleEditTypo({ textAlign: vl.id })
      reloadEditTypoBlock()
    }
  })
  // group btn select text align vertical
  const alignVerticalValues = listTextStyle.filterAndMap(wb => window.getComputedStyle(wb.value).alignItems)
  const group_btn_text_align_vertical = GroupButtonOptions({
    value: alignVerticalValues.length > 1 ? 'mixed' : alignVerticalValues[0],
    options: [
      {
        id: TextAlignVertical.top,
        img: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text-align-vertical-top.svg',
      },
      {
        id: TextAlignVertical.middle,
        img: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text-align-vertical-center.svg'
      },
      {
        id: TextAlignVertical.bottom,
        img: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text-align-vertical-bottom.svg'
      }
    ],
    onselect: vl => {
      handleEditTypo({ alignVertical: vl.id })
      reloadEditTypoBlock()
    }
  })
  _row.replaceChildren(group_btn_text_align, group_btn_text_align_vertical)
  $(header).on('click', '.action-button', function () {
    const offset = header.getBoundingClientRect()
    showTableSkin({ cate: EnumCate.typography, offset: offset, cssText: fontCssText })
  })

  return editContainer
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
  let listBorder = selected_list.filter(wb => ['w-checkbox', ...WbClass.borderEffect].some(e => wb.value.classList.contains(e)))
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-border'
  editContainer.className = 'edit-container col'

  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  header.innerHTML = `<p class="semibold1" style="flex: 1">Border</p>
  <button type='button' class="row action-button box24 action-button" style="padding: 0.7rem">${IconMoreSkins()}</button>
  <i class="fa-solid fa-plus center box24" style="font-size: 1.4rem"></i>`
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
    header.querySelector('.action-button').remove()
    let borderItem = StyleDA.listSkin.find(skin => listBorderSkin[0] === skin.GID)
    let cateItem = CateDA.list_border_cate.find(e => e.ID === borderItem.CateID)
    let skin_tile = wbaseSkinTile({
      cate: EnumCate.border,
      prefixValue: borderItem.Css,
      title: (cateItem ? `${cateItem.Name}/` : '') + borderItem.Name,
      onClick: function () {
        let offset = header.getBoundingClientRect()
        showTableSkin({
          cate: EnumCate.border,
          offset: offset,
          selectedSkinId: borderItem.GID,
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
    notiText.style.margin = '0.4rem 0.8rem'
    notiText.innerHTML = 'Choose a border skin to replace mixed content'
    editContainer.appendChild(notiText)
  } else {
    listBorderSkin = listBorderSkin.filter(e => e !== null)
    //
    if (listBorderSkin.length > 0) {
      header.querySelector('.fa-plus').remove()
      let borderColorValues = listBorder.filterAndMap(wb => Ultis.rgbToHex(window.getComputedStyle(wb.value).borderColor))
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
      formEditLine.className = 'row'
      formEditLine.style.cssText = 'gap: 0.8rem'
      const borderStyles = listBorder.filterAndMap(wb => window.getComputedStyle(wb.value).borderStyle.split(' ').filter(e => e !== 'none')[0])
      const bStyleValue = borderStyles.length > 1 ? 'mixed' : borderStyles[0]
      const selectBStyle = Select1({
        returnType: 'string',
        className: 'right-view-input regular1',
        style: '--gutter: 0.6rem',
        value: bStyleValue,
        dropdownStyle: 'background-color: #000000; width: fit-content',
        options: [
          { id: 'mixed', name: 'mixed', style: `pointer-events: none;border-bottom: 1px inset #ffffff;${bStyleValue === 'mixed' ? '' : 'display: none'}` },
          ...list_border_style.map(e => {
            return {
              id: e,
              name: e,
              style: 'color: #ffffff'
            }
          })
        ],
        onChange: vl => {
          handleEditBorder({ style: vl.id })
          reloadEditBorderBlock()
        }
      })
      const widthValues = listBorderSkin.filterAndMap(cssValue => parseFloat(cssValue.split(' ')[0].replace('px')))
      const bWidthValue = widthValues.length > 1 ? 'mixed' : widthValues[0]
      const editStrokeWidth = TextField({
        returnType: 'string',
        style: '--gutter: 0.6rem',
        className: 'col12 right-view-input regular1',
        prefix: `<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/stroke-width.svg"/>`,
        value: bWidthValue,
        onBlur: function (ev) {
          let newValue = parseFloat(ev.target.value)
          if (!isNaN(newValue)) {
            handleEditBorder({ width: ev.target.value })
          }
        }
      })
      const sideValues = listBorder.filterAndMap(wb => {
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
      const sideValue = sideValues.length === 1 ? sideValues[0] : 'mixed'
      const getIconBorderSide = (side, color) => {
        switch (side) {
          case BorderSide.top:
            return IconBorderTop({ color: color });
          case BorderSide.bottom:
            return IconBorderBottom({ color: color });
          case BorderSide.top_bottom:
            return IconBorderTopBottom({ color: color });
          case BorderSide.left:
            return IconBorderLeft({ color: color });
          case BorderSide.right:
            return IconBorderRight({ color: color });
          case BorderSide.left_right:
            return IconBorderLeftRight({ color: color });
          default:
            return IconBorderAll({ color: color });
        }
      }
      const selectBSide = Select1({
        returnType: 'string',
        iconOnly: true,
        icon: getIconBorderSide(sideValue),
        style: 'border: none; padding: 0.4rem',
        className: 'box24 action-button center',
        dropdownStyle: 'background-color: #000000; width: fit-content',
        options: [
          { id: 'mixed', name: 'mixed', style: `pointer-events: none;border-bottom: 1px inset #ffffff;${sideValue === 'mixed' ? '' : 'display: none'}` },
          ...listBorderSide.map(e => {
            return {
              id: e,
              name: `<div class="box20">${getIconBorderSide(e, '#ffffff')}</div>`,
            }
          })],
        onChange: (vl) => {
          handleEditBorder({ side: vl.id })
        }
      })
      formEditLine.innerHTML = `${selectBStyle}${editStrokeWidth}${selectBSide}`
      editContainer.appendChild(formEditLine)
    }
  }
  $(header).on('click', '.action-button', function () {
    let offset = header.getBoundingClientRect()
    showTableSkin({
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
  let listEffect = selected_list.filter(wb => WbClass.borderEffect.some(e => wb.value.classList.contains(e)))
  let editContainer = document.createElement('div')
  editContainer.id = 'edit-effect'
  editContainer.className = 'edit-container col'

  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  header.innerHTML = `<p class="semibold1" style="flex: 1">Effect</p>
  <button type='button' class="row action-button box24 action-button" style="padding: 0.7rem">${IconMoreSkins()}</button>
  <i class="fa-solid fa-plus center box24" style="font-size: 1.4rem"></i>`
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
    header.querySelector('.action-button').remove()
    let effectItem = StyleDA.listSkin.find(skin => listEffectSkin[0] === skin.GID)
    let cateItem = CateDA.list_effect_cate.find(e => e.ID === effectItem.CateID)
    let skin_tile = wbaseSkinTile({
      cate: EnumCate.effect,
      title: (cateItem ? `${cateItem.Name}/` : '') + effectItem.Name,
      onClick: function () {
        let offset = header.getBoundingClientRect()
        showTableSkin({
          cate: EnumCate.effect,
          offset: offset,
          selectedSkinId: effectItem.GID,
          cssText: effectItem.Css
        })
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
    notiText.style.margin = '0.4rem 0.8rem'
    notiText.innerHTML = 'Choose a border skin to replace mixed content'
    editContainer.appendChild(notiText)
  } else {
    listEffectSkin = listEffectSkin.filter(e => e !== null)
    if (listEffectSkin.length > 0) {
      header.querySelector('.fa-plus').remove()
      let div_select_eType = document.createElement('div')
      div_select_eType.className = 'row dropdown-effect-tile'
      div_select_eType.style.gap = '0.8rem'
      editContainer.appendChild(div_select_eType)
      // popup edit effect type attribute
      const showEditSettings = `<button type="button" class="box24 row center action-button" style="padding: 0.4rem">${IconEffectSettings()}</button>`
      const eTypeValues = listEffect.filterAndMap(wb => window.getComputedStyle(wb.value).filter === 'none' ? 'box-shadow' : 'filter')
      const eTypeValue = eTypeValues.length > 1 ? 'mixed' : eTypeValues[0]
      const selectEType = Select1({
        returnType: 'string',
        style: 'flex: 1; width: 100%; border-width: 0.2rem; border-radius: 0.15rem; padding: 0.6rem 1rem; height: fit-content',
        value: eTypeValue,
        className: 'regular1',
        dropdownStyle: 'background-color: #000000',
        options: [
          { id: 'mixed', name: 'mixed', style: `pointer-events: none;border-bottom: 1px inset #ffffff;${eTypeValue === 'mixed' ? '' : 'display: none'}` },
          { id: 'box-shadow', name: 'box-shadow', style: 'color: #ffffff' },
          { id: 'filter', name: 'filter', style: 'color: #ffffff' }
        ],
        onChange: (vl) => {
          handleEditEffect({ type: vl.id })
          reloadEditEffectBlock()
        }
      })
      div_select_eType.innerHTML = `${showEditSettings}${selectEType}<i class="fa-solid fa-minus box24 row center" style="font-size: 1.4rem; display: flex"></i>`
      if (eTypeValue === 'filter') {
        const blurValues = listEffect
          .filter(wb => window.getComputedStyle(wb.value).filter !== 'none')
          .filterAndMap(wb =>
            window.getComputedStyle(wb.value).filter.replace(/(blur\(|px\))/g, '')
          )
        const blurValue = blurValues.length > 1 ? 'mixed' : blurValues[0]
        var inputBlur = `<div class="row" style="justify-content: space-between">
          <div class="label-5">Blur</div>
          ${TextField({
          returnType: 'string',
          style: 'width: 6.8rem',
          className: 'regular1 right-view-input',
          value: blurValue,
          onChange: (ev) => {
            if (!isNaN(parseFloat(ev.target.value))) {
              handleEditEffect({ blurRadius: parseFloat(ev.target.value) })
            } else {
              ev.target.value = blurValue
            }
          }
        })}
        </div>`
      } else {
        const boxShadowList = listEffect
          .filter(wb => window.getComputedStyle(wb.value).boxShadow !== 'none')
          .map(wb => {
            let wbShadow = window.getComputedStyle(wb.value).boxShadow
            let color = wbShadow.match(rgbRegex)[0]
            wbShadow = wbShadow.replace(color, '').trim().split(' ')
            return {
              x: parseFloat(wbShadow[0].replace('px')),
              y: parseFloat(wbShadow[1].replace('px')),
              blur: parseFloat(wbShadow[2].replace('px')),
              spread: parseFloat(wbShadow[3].replace('px')),
              color: Ultis.rgbToHex(color)
            }
          })
        const offXValues = boxShadowList.filterAndMap(vl => vl.x)
        const xValue = offXValues.length > 1 ? 'mixed' : offXValues[0]
        var inputX = `<div class="row" style="justify-content: space-between">
          <div class="label-5">X</div>
          ${TextField({
          returnType: 'string',
          style: 'width: 6.8rem',
          className: 'regular1 right-view-input',
          value: xValue,
          onChange: (ev) => {
            if (!isNaN(parseFloat(ev.target.value))) {
              handleEditEffect({ blurRadius: parseFloat(ev.target.value) })
            } else {
              ev.target.value = xValue
            }
          }
        })}
        </div>`
        const offYValues = boxShadowList.filterAndMap(vl => vl.y)
        const yValue = offYValues.length > 1 ? 'mixed' : offYValues[0]
        var inputY = `<div class="row" style="justify-content: space-between">
          <div class="label-5">Y</div>
          ${TextField({
          returnType: 'string',
          style: 'width: 6.8rem',
          className: 'regular1 right-view-input',
          value: yValue,
          onChange: (ev) => {
            if (!isNaN(parseFloat(ev.target.value))) {
              handleEditEffect({ offY: parseFloat(ev.target.value) })
            } else {
              ev.target.value = yValue
            }
          }
        })}
        </div>`
        const blurValues = boxShadowList.filterAndMap(vl => vl.blur)
        const blurValue = blurValues.length > 1 ? 'mixed' : blurValues[0]
        var inputBlur = `<div class="row" style="justify-content: space-between">
          <div class="label-5">Blur</div>
          ${TextField({
          returnType: 'string',
          style: 'width: 6.8rem',
          className: 'regular1 right-view-input',
          value: blurValue,
          onChange: (ev) => {
            if (!isNaN(parseFloat(ev.target.value))) {
              handleEditEffect({ blurRadius: parseFloat(ev.target.value) })
            } else {
              ev.target.value = blurValue
            }
          }
        })}
        </div>`
        const spreadValues = boxShadowList.filterAndMap(vl => vl.spread)
        const spreadValue = spreadValues.length > 1 ? 'mixed' : spreadValues[0]
        var inputSpread = `<div class="row" style="justify-content: space-between">
          <div class="label-5">Spread</div>
          ${TextField({
          returnType: 'string',
          style: 'width: 6.8rem',
          className: 'regular1 right-view-input',
          value: spreadValue,
          onChange: (ev) => {
            if (!isNaN(parseFloat(ev.target.value))) {
              handleEditEffect({ spreadRadius: parseFloat(ev.target.value) })
            } else {
              ev.target.value = spreadValue
            }
          }
        })}
        </div>`
        const colorValues = boxShadowList.filterAndMap(vl => vl.color)
        if (colorValues.length === 1) {
          var inputColor = createEditColorForm({
            returnType: 'string',
            value: colorValues[0],
            onchange: params => {
              handleEditEffect({ color: params, onSubmit: false })
            },
            onsubmit: params => {
              handleEditEffect({ color: params })
            }
          })
        }
      }
      $(div_select_eType).on('click', '.action-button', function (ev) {
        const offset = ev.target.closest('.action-button').getBoundingClientRect()
        showPopup({
          hiddenOverlay: true,
          style: `width: 22.8rem; transform: translateX(-100%); left: ${offset.x}px; top: ${offset.y}px`,
          children: `<div class="popup-body row" style="flex-wrap: wrap; gap: 0.8rem 1.2rem; width: 100%; padding: 0.8rem 1.2rem">
            ${inputX ?? ''}${inputBlur ?? ''}${inputY ?? ''}${inputSpread ?? ''}${inputColor ?? ''}
          </div>`
        })
      })
      $(div_select_eType).on('click', '.fa-minus', function () {
        deleteEffect()
        reloadEditEffectBlock()
      })
    }
  }
  $(header).on('click', '.action-button', function () {
    let offset = header.getBoundingClientRect()
    showTableSkin({
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

function createEditColorForm({ id, value = '#000000ff', onchange, onsubmit, ondelete, suffixAction, returnType = 'object' }) {
  const children = `<div class="parameter-form row">
    <input type="color" value=${value.substring(0, 7)} class="color-picker box20"/>
    <input value="${value.replace('#', '').substring(0, 6).toUpperCase()}" class="input-color-value regular1"/><input value="${Ultis.hexToPercent(value.replace('#', '').substring(6))}%" class="input-opacity-value regular1"/>
  </div>
  ${suffixAction ? `<button type='button' class="row action-button box24" style="padding: 0.4rem">${IconMoreSkins()}</button>` : `<i class="fa-solid fa-minus box24 center" style="font-size: 1.4rem;${!ondelete && !suffixAction ? 'display: none' : ''}"></i>`}`
  if (returnType === 'string') {
    const dataId = uuidv4()
    $('body').on('input', `.edit-color-tile[data-id="${dataId}"] .color-picker`, function (ev) {
      document.body.querySelector(`.edit-color-tile[data-id="${dataId}"] .input-color-value`).value = ev.target.value.replace('#', '').toUpperCase()
      value = ev.target.value + value.substring(7)
      onchange(value)
    })
    $('body').on('blur', `.edit-color-tile[data-id="${dataId}"] .color-picker`, () => onsubmit(value))
    $('body').on('focus', `.edit-color-tile[data-id="${dataId}"] .input-color-value`, function () {
      this.setSelectionRange(0, this.value.length)
    })
    $('body').on('blur', `.edit-color-tile[data-id="${dataId}"] .input-color-value`, function (ev) {
      if (ev.target.value.match(hexRegex)) {
        value = ev.target.value.match(hexRegex).input.replace('#', '').substring(0, 6) + value.substring(7)
        document.body.querySelector(`.edit-color-tile[data-id="${dataId}"] .color-picker`).value = `#${value}`
        ev.target.value = value.toUpperCase()
        onsubmit(`#${value}`)
      } else {
        ev.target.value = value.replace('#', '').substring(0, 6).toUpperCase()
      }
    })
    $('body').on('blur', `.edit-color-tile[data-id="${dataId}"] .input-opacity-value`, function () {
      this.setSelectionRange(0, this.value.length)
    })
    $('body').on('blur', `.edit-color-tile[data-id="${dataId}"] .input-opacity-value`, function (ev) {
      if (!isNaN(parseInt(ev.target.value.replace('%', '')))) {
        onsubmit(value.substring(7) + Ultis.percentToHex(parseInt(ev.target.value.replace('%', ''))))
      } else {
        ev.target.value = Ultis.hexToPercent(value.replace('#', '').substring(6))
      }
    })
    if (ondelete) $('body').on('click', `.edit-color-tile[data-id="${dataId}"] .fa-minus`, ondelete)
    else if (suffixAction)
      $('body').on('click', `.edit-color-tile[data-id="${dataId}"] .parameter-form + button`, suffixAction)
    //
    return `<div ${id?.length ? `id=${id}` : ''} data-id="${dataId}" class="row edit-color-tile">${children}</div>`
  } else {
    let editColorTile = document.createElement('div')
    editColorTile.className = 'row edit-color-tile'
    if (id?.length) editColorTile.id = id
    editColorTile.innerHTML = children
    $(editColorTile).on('input', '.color-picker', function (ev) {
      editColorTile.querySelector('.input-color-value').value = ev.target.value.replace('#', '').toUpperCase()
      value = ev.target.value + value.substring(7)
      onchange(value)
    })
    $(editColorTile).on('blur', '.color-picker', () => onsubmit(value))
    $(editColorTile).on('focus', '.input-color-value', function () {
      this.setSelectionRange(0, this.value.length)
    })
    $(editColorTile).on('blur', '.input-color-value', function () {
      if (this.value.match(hexRegex)) {
        value = this.value.match(hexRegex).input.replace('#', '').substring(0, 6) + value.substring(7)
        editColorTile.querySelector('.color-picker').value = `#${value}`
        this.value = value.toUpperCase()
        onsubmit(`#${value}`)
      } else {
        this.value = value.replace('#', '').substring(0, 6).toUpperCase()
      }
    })
    $(editColorTile).on('blur', '.input-opacity-value', function () {
      this.setSelectionRange(0, this.value.length)
    })
    $(editColorTile).on('blur', '.input-opacity-value', function () {
      if (!isNaN(parseInt(this.value.replace('%', '')))) {
        onsubmit(value.substring(7) + Ultis.percentToHex(parseInt(this.value.replace('%', ''))))
      } else {
        this.value = Ultis.hexToPercent(value.replace('#', '').substring(6))
      }
    })
    if (ondelete) $(editColorTile).on('click', '.fa-minus', ondelete)
    else if (suffixAction)
      $(editColorTile).on('click', '.parameter-form + button', suffixAction)
    //
    return editColorTile
  }
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

function showTableSkin({ cate, offset, selectedSkinId, cssText }) {
  switch (cate) {
    case EnumCate.color:
      var title = 'Color skin'
      var titleAddSkin = 'Create new color skin'
      var prefix = `<div class="box24" style="border-radius: 50%; background-color: ${cssText}"></div>`
      break
    case EnumCate.typography:
      title = 'Typography skin'
      titleAddSkin = 'Create new typography skin'
      prefix = `<div style="${cssText};font-size: 1.6rem; line-height: normal">Ag</div>`
      break
    case EnumCate.border:
      title = 'Border skin'
      titleAddSkin = 'Create new border skin'
      prefix = `<div class="box24" style="border-radius: 50%; background-color: #f1f1f1;border: min(0.6rem, ${cssText.split(' ')[0]}) ${cssText.split(' ').slice(1).join(' ')}"></div>`
      break
    case EnumCate.effect:
      title = 'Effect skin'
      titleAddSkin = 'Create new effect skin'
      prefix = `<div class="box24">${IconEffectSettings()}</div>`
      break
    default:
      return
  }
  let popupTbSkins = showPopup({
    hiddenOverlay: true,
    style: `left: ${offset.x}px; top: ${offset.y}px; max-height: 32rem`,
    children: `<div class="popup-header col" style="padding: 0.8rem 1.2rem; gap: 0.8rem">
      <div class="heading-9 row" style="width: 100%; justify-content: space-between">${title}<i class="fa-solid fa-plus center box24" style="font-size: 1.2rem"></i></div>
      ${TextField({ returnType: 'string', placeholder: 'Search skins...', className: 'search-skins regular11', style: 'width:100%; height: fit-content', prefix: `<i class="fa-solid fa-magnifying-glass" style="font-size: 1rem; color: #bfbfbf"></i>`, onChange: () => { } })}
    </div>
    <div class="col tb-skins-popup-body" style="padding: 0.8rem 0"></div>`
  })
  if (cssText) {
    $(popupTbSkins).on('click', '.popup-header .fa-plus', function () {
      let popupAddSkin = showPopup({
        style: 'width: 40%',
        children: `<div class="popup-header row heading-8">${titleAddSkin}</div>
        <div class="popup-body row" style="gap: 1.6rem; padding: 0.8rem 1.6rem;">
        ${prefix}
        ${TextField({ returnType: 'string', placeholder: 'New skin name', className: 'regular1 input-skin-name', style: 'width:100%; flex: 1', onChange: () => { } })}
        </div>
        <div class="popup-footer row">
          <button type='button' class='popup-action close-popup row button-text-3'>Cancel</button>
          <button type='button' class='popup-action popup-submit row button-text-3'>Create skin</button>
        </div>`
      })
      $(popupAddSkin).on('click', '.popup-footer > .close-popup', function () { popupAddSkin.remove() })
      $(popupAddSkin).on('click', '.popup-footer > .popup-submit', async function () {
        const res = await createNewSkin({ cate: cate, name: popupAddSkin.querySelector('.input-skin-name input').value.trim(), cssText: cssText })
        if (res) {
          popupAddSkin.remove()
          popupTbSkins.remove()
        }
      })
      popupAddSkin.querySelector('.popup-close-btn').remove()
    })
  } else {
    popupTbSkins.querySelector('.popup-header .fa-plus').remove()
  }
  updateTableSkinBody(cate, selectedSkinId)
}

async function createNewSkin({ cate, cssText, name }) {
  let skin = await CateDA.createSkin({
    GID: uuidv4(),
    ProjectID: ProjectDA.obj.ID,
    Css: cssText.length === 7 ? `${cssText}ff` : cssText,
    Type: cate
  },
    name.replace('\\', '/').split('/'),
    cate
  )
  if (skin) {
    document.documentElement.style.setProperty(`--${skin.GID}`, skin.Css)
    switch (cate) {
      case EnumCate.color:
        const editType = document.body.querySelector('.tb-skins-popup-body').getAttribute('edit-type')
        switch (editType) {
          case 'typo':
            handleEditTypo({ colorSkin: skin })
            reloadEditTypoBlock()
            break
          default:
            if (editType) {
              handleEditIconColor({ prop: editType, colorSkin: skin })
              reloadEditIconColorBlock()
            } else {
              handleEditBackground({ colorSkin: skin })
              reloadEditBackgroundBlock()
            }
            break
        }
        break
      case EnumCate.typography:
        handleEditTypo({ typoSkin: skin })
        reloadEditTypoBlock()
        break
      case EnumCate.border:
        handleEditBorder({ borderSkin: skin })
        reloadEditBorderBlock()
        break
      case EnumCate.effect:
        handleEditEffect({ effectSkin: skin })
        reloadEditEffectBlock()
        break
      default:
        break
    }
  }
  return skin
}

function updateTableSkinBody(enumCate, currentSkinID) {
  let dropdown = document.body.querySelector('.tb-skins-popup-body')
  if (!dropdown) return
  let noti_empty_skin = document.createElement('p')
  noti_empty_skin.style.margin = '0.8rem 1.6rem'
  noti_empty_skin.className = 'regular0 text-subtitle'

  switch (enumCate) {
    case EnumCate.color:
      if (StyleDA.listSkin.filter(e => e.Type === EnumCate.color).length == 0) {
        noti_empty_skin.innerHTML = 'No color skins.'
        dropdown.replaceChildren(noti_empty_skin)
      } else {
        dropdown.replaceChildren(createCateSkinHTML({ ID: EnumCate.color }, currentSkinID))
      }
      break
    case EnumCate.typography:
      if (StyleDA.listSkin.filter(e => e.Type === EnumCate.typography).length == 0) {
        noti_empty_skin.innerHTML = 'No typography skins.'
        dropdown.replaceChildren(noti_empty_skin)
      } else {
        dropdown.replaceChildren(createCateSkinHTML({ ID: EnumCate.typography }, currentSkinID))
      }

      break
    case EnumCate.border:
      if (StyleDA.listSkin.filter(e => e.Type === EnumCate.border).length == 0) {
        noti_empty_skin.innerHTML = 'No border skins.'
        dropdown.replaceChildren(noti_empty_skin)
      } else {
        dropdown.replaceChildren(createCateSkinHTML({ ID: EnumCate.border }, currentSkinID))
      }

      break
    case EnumCate.effect:
      if (StyleDA.listSkin.filter(e => e.Type === EnumCate.effect).length == 0) {
        noti_empty_skin.innerHTML = 'No effect skins.'
        dropdown.replaceChildren(noti_empty_skin)
      } else {
        dropdown.replaceChildren(createCateSkinHTML({ ID: EnumCate.effect }, currentSkinID))
      }

      break
    default:
      break
  }
  if (currentSkinID) {
    let usingSkin = document.getElementById(`skinID:${currentSkinID}`)
    if (usingSkin) {
      usingSkin.style.background = '#E6F7FF'
      dropdown.scrollTo({
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
  cateContainer.innerHTML = `${cateItem.Name ? `<div class="row semibold1 cate-title" style="color: #b2b2b2; gap: 0.4rem; padding: 0.6rem 0.8rem${cateItem.ParentID ? ' 0.6rem 2.4rem' : ''}"><i class="fa-solid fa-caret-right box24 center" style="display: flex; font-size: 1.2rem"></i>${cateItem.Name}</div>` : ''}<div class="list-skin-tile"></div>`
  let childrenHTML = []
  let enumCate = cateItem.ParentID ?? cateItem.ID
  let skin_list = StyleDA.listSkin.filter(e => e.Type === enumCate && e.CateID === cateItem.ID && e.ProjectID === ProjectDA.obj.ID)
  childrenHTML.push(
    ...skin_list.map(skin => {
      let skin_tile = createSkinTileHTML(enumCate, skin)
      if (skin.GID === currentSkinID) {
        skin_tile.style.backgroundColor = '#E6F7FF'
      }
      return skin_tile
    })
  )
  if (!cateItem.ParentID) {
    switch (enumCate) {
      case EnumCate.color:
        var listCateChildren = CateDA.list_color_cate
        break;
      case EnumCate.typography:
        var listCateChildren = CateDA.list_typo_cate
        break;
      case EnumCate.border:
        var listCateChildren = CateDA.list_border_cate
        break;
      case EnumCate.effect:
        var listCateChildren = CateDA.list_effect_cate
        break;
      default:
        break;
    }
  }
  cateContainer.querySelector('.list-skin-tile').replaceWith(...childrenHTML, ...(listCateChildren ?? []).sort((a, b) => a.Name - b.Name).map(e => createCateSkinHTML(e, currentSkinID)))
  if (!childrenHTML.length && [EnumCate.color, EnumCate.typography, EnumCate.border, EnumCate.effect].every(ct => cateItem.ID !== ct))
    return document.createElement('div')
  return cateContainer
}

$('body').on('click', '.cate-skin-tile .cate-title > .box24.center', function (ev) {
  let prefixIcon = ev.target.closest('.box24.center')
  if (prefixIcon.classList.contains('fa-caret-right')) {
    prefixIcon.classList.remove('fa-caret-right')
    prefixIcon.classList.add('fa-caret-down')
  } else {
    prefixIcon.classList.remove('fa-caret-down')
    prefixIcon.classList.add('fa-caret-right')
  }
})

function createSkinTileHTML(enumCate, jsonSkin) {
  let skin_tile = document.createElement('button')
  skin_tile.id = `skinID:${jsonSkin.GID}`
  skin_tile.className = 'skin_tile_option row'
  if (selected_list.length == 0 && jsonSkin.CateID != enumCate) {
    skin_tile.style.paddingLeft = '3.6rem'
  }
  if (jsonSkin.ProjectID != ProjectDA.obj.ID) {
    var action_edit = `<i class="fa-regular fa-circle-question box24 center" style="display: flex; font-size: 1.2rem; color: var(--primary-color); pointer-events: none"></i>`
  } else {
    action_edit = `<i class="fa-solid fa-sliders box24 center"></i>`
  }
  $(skin_tile).on('click', '.fa-sliders', function (ev) {
    ev.stopPropagation()
    ev.preventDefault()
    popupEditSkin({ enumCate: enumCate, jsonSkin: jsonSkin, offset: ev })
  })

  skin_tile.onauxclick = function (e) {
    e.stopPropagation()
    let edit_delete_popup = showPopup({
      hiddenOverlay: true,
      children: `<div class="edit-skin default-option semibold1 row">Edit</div><div class="delete-skin default-option semibold1 row">Delete</div>`,
      style: `left: ${e.pageX}px; top: ${e.pageY}px; background-color: #000000; width: fit-content; height: fit-content; padding: 0.2rem;border-radius: 0.2rem !important`
    })
    $(edit_delete_popup).on('click', '.edit-skin', function (ev) {
      ev.stopPropagation()
      ev.preventDefault()
      popupEditSkin({ enumCate: enumCate, jsonSkin: jsonSkin, offset: ev })
      edit_delete_popup.remove()
    })
    $(edit_delete_popup).on('click', '.delete-skin', function (ev) {
      ev.stopPropagation()
      StyleDA.deleteStyleSheet(jsonSkin)
      skin_tile.remove()
      edit_delete_popup.remove()
    })
  }
  switch (enumCate) {
    case EnumCate.color:
      skin_tile.onclick = function () {
        if (selected_list.length > 0) {
          const editType = document.body.querySelector('.tb-skins-popup-body').getAttribute('edit-type')
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
          document.querySelector('.popup-overlay:has(.tb-skins-popup-body)').remove()
        }
      }
      skin_tile.innerHTML = `<div class="prefix-tile box20" style="border-radius: 50%; background-color: ${jsonSkin.Css}"></div><div class="skin-name regular1">${jsonSkin.Name}</div>${action_edit}`
      break
    case EnumCate.typography:
      skin_tile.onclick = function () {
        if (selected_list.length > 0) {
          handleEditTypo({ typoSkin: jsonSkin })
          document.querySelector('.popup-overlay:has(.tb-skins-popup-body)').remove()
          reloadEditTypoBlock()
        }
      }
      const splitCss = jsonSkin.Css.split(';')
      skin_tile.innerHTML = `<div style="${jsonSkin.Css};font-size: 1.6rem; line-height: normal">Ag</div><div class="skin-name regular1 comp-text">${jsonSkin.Name}</div><p style="font-size: 1.1rem; color: #bfbfbf">${jsonSkin.Css.split(' ')[1]}</p>${action_edit}`
      break
    case EnumCate.border:
      skin_tile.onclick = function () {
        if (selected_list.length > 0) {
          handleEditBorder({ borderSkin: jsonSkin })
          document.querySelector('.popup-overlay:has(.tb-skins-popup-body)').remove()
          reloadEditBorderBlock()
        }
      }
      skin_tile.innerHTML = `<div class="box20" style="border-radius: 50%; background-color: #f1f1f1;border: min(0.6rem, ${jsonSkin.Css.split(' ')[0]}) ${jsonSkin.Css.split(' ').slice(1).join(' ')}"></div><div class="skin-name regular1">${jsonSkin.Name}</div>${action_edit}`
      break
    case EnumCate.effect:
      skin_tile.onclick = function () {
        if (selected_list.length > 0) {
          handleEditEffect({ effectSkin: jsonSkin })
          document.querySelector('.popup-overlay:has(.tb-skins-popup-body)').remove()
          reloadEditEffectBlock()
        }
      }
      skin_tile.innerHTML = `<div class="box20">${IconEffectSettings()}</div><div class="skin-name regular1">${jsonSkin.Name}</div>${action_edit}`
      break
    default:
      break
  }
  return skin_tile
}

function popupEditSkin({ enumCate, jsonSkin, offset }) {
  let newName = ''
  switch (enumCate) {
    case EnumCate.color:
      const colorCate = jsonSkin.CateID !== EnumCate.color ? CateDA.list_color_cate.find(e => e.ID === jsonSkin.CateID) : null
      var headingTitle = 'Edit color skin'
      const initColorName = `${colorCate ? `${colorCate.Name}/` : ''}${jsonSkin.Name}`
      var editBody = `<div class="row semibold1" style="width: 100%; gap: 0.8rem">Skin name ${TextField({
        returnType: 'string',
        style: 'flex: 1; width: 100%',
        className: 'regular1',
        value: initColorName,
        onBlur: function (ev) {
          ev.target.value = ev.target.value.trim()
          if (ev.target.value !== initColorName) {
            newName = ev.target.value
          } else {
            newName = ''
          }
        }
      })}</div>
      ${createEditColorForm({
        returnType: 'string',
        value: jsonSkin.Css,
        onchange: newColor => {
          editColorSkin(newColor, false)
        },
        onsubmit: editColorSkin,
      })}`
      break
    case EnumCate.typography:
      const typoCate = jsonSkin.CateID !== EnumCate.typography ? CateDA.list_typo_cate.find(e => e.ID === jsonSkin.CateID) : null
      headingTitle = 'Edit typography skin'
      const initTypoName = `${typoCate ? `${typoCate.Name}/` : ''}${jsonSkin.Name}`
      const splitCssTypoValue = jsonSkin.Css.split(' ')
      let weightValue = splitCssTypoValue.shift()
      let familyValue = splitCssTypoValue.pop()
      let sizeValue = splitCssTypoValue[0].split('/')[0]
      let heightValue = splitCssTypoValue[0].split('/')[1]
      var editBody = `<div class="row semibold1" style="width: 100%; gap: 0.8rem">Skin name ${TextField({
        returnType: 'string',
        style: 'flex: 1; width: 100%',
        className: 'regular1',
        value: initTypoName,
        onBlur: function (ev) {
          ev.target.value = ev.target.value.trim()
          if (ev.target.value !== initTypoName) {
            newName = ev.target.value
          } else {
            newName = ''
          }
        }
      })}</div>
      <div class="row" style="flex-wrap: wrap; width: 100%; gap: 0.6rem">
        ${TextField({
        returnType: 'string',
        className: 'col12 right-view-input regular1',
        value: familyValue,
        style: '--gutter: 0.6rem',
        suffix: Select1({
          returnType: 'string',
          value: familyValue,
          iconOnly: true,
          style: 'border: none',
          className: 'box24 action-button center',
          dropdownStyle: 'background-color: #000000; width: 10rem !important',
          options: list_font_family.map(e => {
            return { id: e, name: e, style: 'color: #ffffff' }
          }),
          onChange: (vl) => {
            editTypoSkin({ fontFamily: vl.id })
          }
        }),
        onBlur: ev => {
          const newValue = list_font_family.find(e => e.toLowerCase() === ev.target.value.trim().toLowerCase())
          if (newValue) {
            handleEditTypo({ fontFamily: newValue })
          } else {
            ev.target.value = familyValue
          }
        }
      })}
      ${Select1({
        returnType: 'string',
        className: 'col12 right-view-input regular1',
        style: '--gutter: 0.6rem; text-align: start',
        value: weightValue,
        dropdownStyle: 'background-color: #000000',
        options: list_font_weight.map(e => {
          return { id: e, name: e, style: 'color: #ffffff' }
        }),
        onChange: (vl) => {
          editTypoSkin({ fontWeight: vl.id })
        }
      })}
      ${TextField({
        returnType: 'string',
        style: '--gutter: 0.6rem',
        className: 'col12 right-view-input regular1',
        type: 'number',
        value: sizeValue,
        suffix: Select1({
          returnType: 'string',
          iconOnly: true,
          value: sizeValue,
          style: 'border: none',
          className: 'box24 action-button center',
          dropdownStyle: 'background-color: #000000; width: 8rem !important',
          options: list_font_size.map(e => {
            return { id: e, name: e, style: 'color: #ffffff' }
          }),
          onChange: (vl) => {
            editTypoSkin({ fontSize: vl.id })
          }
        }),
        onBlur: ev => {
          const newValue = ev.target.value.trim()
          if (!isNaN(parseFloat(newValue))) {
            editTypoSkin({ fontSize: parseFloat(newValue) })
          } else {
            ev.target.value = sizeValue
          }
        }
      })}
      ${TextField({
        returnType: 'string',
        style: '--gutter: 0.6rem',
        className: 'col12 right-view-input regular1',
        prefix: '<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/line-height.svg"/>',
        value: heightValue,
        onBlur: function (ev) {
          if (ev.target.value.toLowerCase() === 'auto' || ev.target.value.toLowerCase() === 'normal') {
            editTypoSkin({ height: null })
          } else if (!isNaN(parseFloat(ev.target.value))) {
            editTypoSkin({ height: parseFloat(ev.target.value) })
          }
        }
      })}
      </div>`
      break
    case EnumCate.border:
      const borderCate = jsonSkin.CateID !== EnumCate.border ? CateDA.list_border_cate.find(e => e.ID === jsonSkin.CateID) : null
      headingTitle = 'Edit border skin'
      const initBorderName = `${borderCate ? `${borderCate.Name}/` : ''}${jsonSkin.Name}`
      let borderColorValue = jsonSkin.Css.match(rgbRegex)?.[0] ?? jsonSkin.Css.match(hexRegex)?.[0]
      let borderWidthValue = jsonSkin.Css.replace(borderColorValue, '').trim().split(' ')[0].replace('px', '')
      let borderStyleValue = jsonSkin.Css.replace(borderColorValue, '').trim().split(' ')[1]
      var editBody = `<div class="row semibold1" style="width: 100%; gap: 0.8rem">Skin name ${TextField({
        returnType: 'string',
        style: 'flex: 1; width: 100%',
        className: 'regular1',
        value: initBorderName,
        onBlur: function (ev) {
          ev.target.value = ev.target.value.trim()
          if (ev.target.value !== initBorderName) {
            newName = ev.target.value
          } else {
            newName = ''
          }
        }
      })}</div>
      <div class="row" style="flex-wrap: wrap; width: 100%; gap: 0.6rem">
      ${createEditColorForm({
        returnType: 'string',
        value: borderColorValue.startsWith('#') ? borderColorValue : Ultis.rgbToHex(borderColorValue),
        onchange: params => {
          editBorderSkin({ color: params, onSubmit: false })
        },
        onsubmit: params => {
          editBorderSkin({ color: params })
        },
      })}
      ${Select1({
        returnType: 'string',
        className: 'right-view-input regular1 col12',
        style: '--gutter: 0.6rem',
        value: borderStyleValue,
        dropdownStyle: 'background-color: #000000; width: fit-content',
        options: list_border_style.map(e => {
          return { id: e, name: e, style: 'color: #ffffff' }
        }),
        onChange: vl => {
          editBorderSkin({ style: vl.id })
        }
      })}
      ${TextField({
        returnType: 'string',
        style: '--gutter: 0.6rem',
        className: 'col12 right-view-input regular1 col12',
        prefix: `<img class="box12" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/stroke-width.svg"/>`,
        value: borderWidthValue,
        onBlur: function (ev) {
          let newValue = parseFloat(ev.target.value)
          if (!isNaN(newValue)) {
            editBorderSkin({ width: ev.target.value })
          }
        }
      })}
      </div>`
      break
    case EnumCate.effect:
      const effectCate = jsonSkin.CateID !== EnumCate.effect ? CateDA.list_effect_cate.find(e => e.ID === jsonSkin.CateID) : null
      headingTitle = 'Edit effect skin'
      const initEffectName = `${effectCate ? `${effectCate.Name}/` : ''}${jsonSkin.Name}`
      if (jsonSkin.Css.includes('blur')) {
        let blurValue = jsonSkin.Css.replace('blur(', '').replace(')', '')
        var inputBlur = `<div class="row" style="gap: 0.4rem">
          <div class="label-5">Blur</div>
          ${TextField({
          returnType: 'string',
          style: '--gutter: 0.6rem',
          className: 'regular1 right-view-input col12',
          value: blurValue,
          onChange: (ev) => {
            if (!isNaN(parseFloat(ev.target.value))) {
              editTypoSkin({ blurRadius: parseFloat(ev.target.value) })
            } else {
              ev.target.value = blurValue
            }
          }
        })}
        </div>`
      } else {
        let effectColorValue = jsonSkin.Css.match(rgbRegex)?.[0] ?? jsonSkin.Css.match(hexRegex)?.[0]
        let xValue = jsonSkin.Css.replace(effectColorValue, '').trim().split(' ')[0].replace('px', '')
        let yValue = jsonSkin.Css.replace(effectColorValue, '').trim().split(' ')[1].replace('px', '')
        let blurValue = jsonSkin.Css.replace(effectColorValue, '').trim().split(' ')[2].replace('px', '')
        let spreadValue = jsonSkin.Css.replace(effectColorValue, '').trim().split(' ')[3].replace('px', '')
        var inputX = `<div class="row" style="justify-content: space-between; width: 8.8rem">
          <div class="label-5">X</div>
          ${TextField({
          returnType: 'string',
          style: 'width: 6.8rem',
          className: 'regular1 right-view-input',
          value: xValue,
          onChange: (ev) => {
            if (!isNaN(parseFloat(ev.target.value))) {
              handleEditEffect({ blurRadius: parseFloat(ev.target.value) })
            } else {
              ev.target.value = xValue
            }
          }
        })}
        </div>`
        var inputY = `<div class="row" style="justify-content: space-between; width: 8.8rem">
          <div class="label-5">Y</div>
          ${TextField({
          returnType: 'string',
          style: 'width: 6.8rem',
          className: 'regular1 right-view-input',
          value: yValue,
          onChange: (ev) => {
            if (!isNaN(parseFloat(ev.target.value))) {
              handleEditEffect({ offY: parseFloat(ev.target.value) })
            } else {
              ev.target.value = yValue
            }
          }
        })}
        </div>`
        var inputBlur = `<div class="row" style="justify-content: space-between; width: 12rem">
          <div class="label-5">Blur</div>
          ${TextField({
          returnType: 'string',
          style: 'width: 6.8rem',
          className: 'regular1 right-view-input',
          value: blurValue,
          onChange: (ev) => {
            if (!isNaN(parseFloat(ev.target.value))) {
              handleEditEffect({ blurRadius: parseFloat(ev.target.value) })
            } else {
              ev.target.value = blurValue
            }
          }
        })}
        </div>`
        var inputSpread = `<div class="row" style="justify-content: space-between; width: 12rem">
          <div class="label-5">Spread</div>
          ${TextField({
          returnType: 'string',
          style: 'width: 6.8rem',
          className: 'regular1 right-view-input',
          value: spreadValue,
          onChange: (ev) => {
            if (!isNaN(parseFloat(ev.target.value))) {
              handleEditEffect({ spreadRadius: parseFloat(ev.target.value) })
            } else {
              ev.target.value = spreadValue
            }
          }
        })}
        </div>`
        var inputColor = createEditColorForm({
          returnType: 'string',
          value: effectColorValue.startsWith('#') ? effectColorValue : Ultis.rgbToHex(effectColorValue),
          onchange: params => {
            editEffectSkin({ color: params, onSubmit: false })
          },
          onsubmit: params => {
            editEffectSkin({ color: params })
          }
        })
      }
      var editBody = `<div class="row semibold1" style="width: 100%; gap: 0.8rem">Skin name ${TextField({
        returnType: 'string',
        style: 'flex: 1; width: 100%',
        className: 'regular1',
        value: initEffectName,
        onBlur: function (ev) {
          ev.target.value = ev.target.value.trim()
          if (ev.target.value !== initEffectName) {
            newName = ev.target.value
          } else {
            newName = ''
          }
        }
      })}</div>
      <div class="row" style="flex-wrap: wrap; width: 100%; gap: 0.6rem; justify-content: space-between; padding: 0.4rem 0.8rem">
      ${inputX ?? ''}${inputBlur ?? ''}${inputY ?? ''}${inputSpread ?? ''}${inputColor ?? ''}
      </div>`
      break
    default:
      break
  }
  let popupSkinDetails = showPopup({
    hiddenOverlay: true,
    style: `left: ${offset.pageX}px; top: ${offset.pageY}px; width: 26rem; transform: translateX(-180%)`,
    children: `<div class="popup-header heading-9 row" style="justify-content: space-between; padding: 0.8rem 0.8rem 0.8rem 1.6rem;">${headingTitle} <i class="fa-solid fa-xmark box24 center" style="display: flex; font-size: 1.4rem"></i></div>
    <div class="popup-body col" style="padding: 0.8rem 1.2rem; gap: 0.8rem">${editBody}</div>`,
    onDispose: async function () {
      if (newName.length) {
        let listName = newName.replaceAll('\\', '/').split('/').filter(_string => _string.trim() != '')
        if (listName.length <= 1) {
          if (listName.length == 1 && listName[0].trim() != '') {
            jsonSkin.Name = listName[0]
          } else {
            switch (enumCate) {
              case EnumCate.color:
                jsonSkin.Name = `#${jsonSkin.Css}`
                break;
              case EnumCate.typography:
                jsonSkin.Name = jsonSkin.Css.split(' ')[1]
                break;
              case EnumCate.border:
                jsonSkin.Name = jsonSkin.Css.split(' ').slice(0, 2).join(' ')
                break;
              case EnumCate.effect:
                jsonSkin.Name = jsonSkin.Css.includes('blur') ? jsonSkin.Css.replace('(', " ").replace(')', '') : ('shadow ' + (jsonSkin.Css.match(rgbRegex)?.[0] ?? jsonSkin.Css.match(hexRegex)?.[0]))
                break;
              default:
                break;
            }
          }
        } else {
          jsonSkin.Name = listName.pop()
          let nameCate = listName.join(' ')
          let cateItem = CateDA.list_color_cate.find(e => e.Name.toLowerCase() == nameCate.toLowerCase())
          if (cateItem) {
            jsonSkin.CateID = cateItem.ID
          } else {
            let newCate = {
              ID: 0,
              Name: nameCate,
              ParentID: enumCate
            }
            const newCateRes = await CateDA.add(newCate)
            switch (enumCate) {
              case EnumCate.color:
                CateDA.list_color_cate.push(newCateRes.Data)
                break;
              case EnumCate.typography:
                CateDA.list_typo_cate.push(newCateRes.Data)
                break;
              case EnumCate.border:
                CateDA.list_border_cate.push(newCateRes.Data)
                break;
              case EnumCate.effect:
                CateDA.list_effect_cate.push(newCateRes.Data)
                break;
              default:
                break;
            }
            jsonSkin.CateID = newCateRes.ID
          }
        }
        StyleDA.editStyleSheet(jsonSkin)
        updateTableSkinBody(enumCate, jsonSkin.GID)
      }
    }
  })
  $(popupSkinDetails).on('click', '.popup-header .fa-xmark', function () {
    popupSkinDetails.remove()
  })
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
  let htmlText = ''
  switch (cate) {
    case EnumCate.color:
      htmlText += `<div class="prefix-tile box20" style="border-radius: 50%; background-color: ${prefixValue}"></div><div class="regular1">${title}</div>`
      if (handleUnlinkSkin)
        $(wbase_skin_tile).on('click', '.unlink-action', handleUnlinkSkin)
      else
        $(wbase_skin_tile).on('click', '.unlink-action', function () {
          unlinkColorSkin()
          reloadEditBackgroundBlock()
        })
      break
    case EnumCate.typography:
      htmlText += `<div style="font-size: 1.6rem; line-height: normal">Ag</div><div class="regular1">${title}</div><div style="color: #c4c4c4"> . ${prefixValue}</div>`
      if (handleUnlinkSkin)
        $(wbase_skin_tile).on('click', '.unlink-action', handleUnlinkSkin)
      else
        $(wbase_skin_tile).on('click', '.unlink-action', function () {
          unlinkTypoSkin()
          reloadEditTypoBlock()
        })
      break
    case EnumCate.border:
      htmlText += `<div class="box20" style="border-radius: 50%; background-color: #f1f1f1;border: min(0.6rem, ${prefixValue.split(' ')[0]}) ${prefixValue.split(' ').slice(1).join(' ')}"></div><div class="skin-name regular1">${title}</div>`
      if (handleUnlinkSkin)
        $(wbase_skin_tile).on('click', '.unlink-action', handleUnlinkSkin)
      else
        $(wbase_skin_tile).on('click', '.unlink-action', function () {
          unlinkBorderSkin()
          reloadEditBorderBlock()
        })
      break
    case EnumCate.effect:
      htmlText += `<div class="box20">${IconEffectSettings()}</div><div class="skin-name regular1">${title}</div>`
      if (handleUnlinkSkin)
        $(wbase_skin_tile).on('click', '.unlink-action', handleUnlinkSkin)
      else
        $(wbase_skin_tile).on('click', '.unlink-action', function () {
          unlinkEffectSkin()
          reloadEditEffectBlock()
        })
      break
    default:
      break
  }
  wbase_skin_tile.innerHTML = `<div class="row skin-details">${htmlText}</div><button type="button" class="box24 center row action-button unlink-action">${IconUnlinkSkin()}</button>${onRemove ? `<i class="fa-solid fa-minus box24 center" style="display: flex; font-size: 1.2rem"></i>` : ''}`
  $(wbase_skin_tile).on('click', '.skin-details', onClick)
  if (onRemove)
    $(wbase_skin_tile).on('click', '.fa-minus', onRemove)
  return wbase_skin_tile
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
    { ID: EnumCate.typography, Name: 'Typography skins' },
    { ID: EnumCate.border, Name: 'Border skins' },
    { ID: EnumCate.effect, Name: 'Effect skins' },
  ]
  body.replaceChildren(
    ...cateItems.map(cateItem => createCateSkinHTML(cateItem))
  )
  editContainer.replaceChildren(header, body)
  return editContainer
}

function updateUISelectionSkins() {
  const oldUI = document.getElementById('selection_skins')
  if (oldUI) {
    let newSelectionSkins = createSelectionSkins()
    oldUI.replaceWith(newSelectionSkins)
  }
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
          title.ondblclick = function (ev) {
            ev.stopPropagation()
            ev.target.readOnly = false
            ev.target.focus()
            ev.target.select()
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
          input.onfocus = function (ev) {
            ev.stopPropagation()
            ev.target.select()
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

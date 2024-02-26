// header
let pHeader = document.body.querySelector('#file-header > .screen-header')
pHeader.onkeydown = function (e) {
  if (e.key === 'Enter' && (document.activeElement.localName == 'input' || document.activeElement.localName == 'p')) {
    document.activeElement.blur()
  }
}

// let create_skin_popup = document.getElementById('create_skin_popup')
// $(create_skin_popup).on('click', '.popup-close', function closePopupSkin() {
//   create_skin_popup.style.display = 'none'
// })
function createNewSkin(skinType, skinValue) {
  let input_new_skin_name = document.getElementById('input_new_skin_name')
  let input_value = input_new_skin_name.querySelector('input').value
  CateDA.createSkin(
    {
      GID: uuidv4(),
      ProjectID: ProjectDA.obj.ID,
      Css: skinValue.length === 7 ? `${skinValue}ff` : skinValue,
      Type: skinType
    },
    input_value.replace('\\', '/').split('/'),
    skinType
  ).then(skin => {
    if (skin) {
      document.documentElement.style.setProperty(`--${skin.GID}`, skin.Css)
      switch (skinType) {
        case EnumCate.color:
          const editType = document
            .getElementById('popup_table_skin')
            .getAttribute('edit-type')
          switch (editType) {
            case 'typo':
              handleEditTypo({ colorSkin: skin })
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
      document.querySelectorAll('.popup_remove').forEach(e => e.remove())
      create_skin_popup.style.display = 'none'
    }
  })
}
// setup create obj tool
let create_obj_tool = document.getElementById('create_tool')
let list_tool = [
  {
    message: ToolState.move,
    expand: function () {
      console.log('move')
    },
    src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/move.svg'
  },
  {
    message: ToolState.container,
    expand: function () {
      console.log('frame')
    },
    src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/frame.svg'
  },
  {
    message: ToolState.rectangle,
    expand: function () {
      setTimeout(function () {
        let popup = document.createElement('div')
        popup.className = 'wini_popup popup_remove col select-rect-type'
        for (let i = 0; i < 2; i++) {
          let rectTile = document.createElement('div')
          rectTile.className = 'row regular1'
          let preIcon = document.createElement('i')
          preIcon.className = `fa-regular fa-${i === 0 ? 'square' : 'circle'} fa-sm`
          let t = document.createElement('p')
          t = i === 0 ? 'Rectangle' : 'Ellipse'
          rectTile.replaceChildren(preIcon, t)
          popup.appendChild(rectTile)
          rectTile.onclick = function (e) {
            e.stopPropagation()
            popup.remove()
            toolStateChange(i === 0 ? ToolState.rectangle : ToolState.circle)
          }
        }
        let rectBtn = create_obj_tool.querySelector('#Rectangle')
        let popup_offset = rectBtn.getBoundingClientRect()
        popup.style.top = popup_offset.top + 52 + 'px'
        popup.style.left = popup_offset.left + 'px'
        popup.style.zIndex = 10
        $('body').append(popup)
      }, 200)
    },
    src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/rectangle.svg'
  },
  {
    message: ToolState.base_component,
    expand: function () {
      console.log('base component')
      let component_button = create_obj_tool.querySelector('#BaseComponent')
      let popup_offset = component_button.getBoundingClientRect()
      // set display and position for popup
      $('#choose-component-popup').css({
        top: popup_offset.top + 52,
        left: popup_offset.left
      })
      $('#choose-component-popup').css('display', 'flex')
      $('#choose-component-popup').removeAttr('cateid')
    },
    src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/base_component.svg'
  },
  {
    message: ToolState.text,
    src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text.svg'
  },
  {
    message: ToolState.hand_tool,
    src: 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/hand.svg'
  }
]

function update_UI_owner(owner_item) {
  $('.wmember-container').css('pointer-events', 'none')
  $('.wmember-container').find('.fa-chevron-down').show()
  $('.wmember-container[data-customer="' + owner_item.CustomerID + '"]').css(
    'pointer-events',
    'none'
  )
  $('.wmember-container[data-customer="' + owner_item.CustomerID + '"]')
    .find('.fa-chevron-down')
    .hide()
}

// setup share tool
let share_tool = document.getElementById('share_tool')
$(share_tool).on('click', '.btn-share', function () {
  let list_customer = '<div class="col">'
  let p_user = PageDA.customerList.find(e => e.CustomerID == userItem.ID)
  let owner_item = PageDA.customerList.find(
    e => e.Permission == EnumPermission.owner
  )
  for (let customer of PageDA.customerList) {
    list_customer +=
      '<div data-id="' +
      customer.ID +
      '" data-customer="' +
      customer.CustomerID +
      '" class="wmember-container row">' +
      '    <div class="center box32"><i class="fa-solid fa-user-circle text-body"></i></div>' +
      '    <span class="regular11 text-title space">' +
      '        <span>' +
      `${customer?.CustomerName ?? 'Anonymus'}` +
      '</span > ' +
      '        <span class="indentify regular11 text-subtitle ' +
      `${userItem.ID == customer.CustomerID ? '' : ' hide'}` +
      '">(You)</span>' +
      '    </span>' +
      '    <button class="edit-member-permission wbutton-permission button-transparent overlay" type="button" >' +
      '        <span>' +
      '            <span class="user_permission regular1">' +
      EnumPermission.get_namePermission(customer.Permission) +
      '</span>' +
      '            <i class="fa-solid fa-chevron-down fa-xs"></i>' +
      '        </span>' +
      '    </button>' +
      '    <div class="wpopup-edit-permisson permission_popup">' +
      '        <div class="owner ' +
      `${p_user.Permission == EnumPermission.owner ? '' : 'hide '}` +
      'permission-option regular11 text-white">Owner</div>' +
      '        <div class="edit ' +
      `${p_user.Permission != EnumPermission.viewer &&
        (customer.CustomerID == userItem.ID ||
          p_user.Permission < customer.Permission)
        ? ''
        : 'hide '
      }` +
      'permission-option regular11 text-white">Can edit</div>' +
      '        <div class="view permission-option regular11 text-white">Can view</div>' +
      '        <div class="remove ' +
      `${p_user.Permission == EnumPermission.owner ? '' : 'hide '}` +
      'permission-option regular11 text-white border-top-light">remove</div>' +
      '        <div class="leave ' +
      `${p_user.Permission != EnumPermission.owner &&
        customer.CustomerID == userItem.ID
        ? ''
        : 'hide '
      }` +
      'permission-option regular11 text-white border-top-light">Leave</div>' +
      '    </div>' +
      '</div>'
  }
  list_customer += '</div>'
  $('body').append(
    `<div class="center wpopup-background">
            <div class="wpopup-container elevation7">

                <div class="popup-block border-bottom row">
                    <div class="heading-9 space">Invite member</div>
                    <button type="button" class="close_popup button-transparent box24"><i style="pointer-events:none" class="fa-solid fa-close fa-lg"></i></button>
                </div>

                <form id="invite_container" class="popup-block invite-block row">
                    <div class="invite-container row">
                        <input class="invite-email-input" type="email" name="Email" placeholder="Enter email" />
                        <button class="select-inviter-permission button-transparent semibold11 center background-disable" type="button">
                            <span class="selected_permission text-body">Can view</span>
                        </button>
                        <div class="wpopup-select-permission permission_popup">
                            <div data-permission="1" class="permission-option regular0 text-white">Can edit</div>
                            <div data-permission="2" class="permission-option regular0 text-white">Can view</div>
                        </div>
                    </div>
                    <button class="wbutton-send-invite semibold11" type="submit" class="button-transparent box24">Send invite</button>
                </form>

                <div class="popup-block col">
                    <div class="semibold11 member-title">Members</div> ${list_customer}
                </div>
            </div>
        </div>`
  )
  // if (p_user.Permission == EnumPermission.owner) {
  $('.wmember-container[data-customer="' + owner_item.CustomerID + '"]').css(
    'pointer-events',
    'none'
  )
  $('.wmember-container[data-customer="' + owner_item.CustomerID + '"]')
    .find('.fa-chevron-down')
    .hide()
  // }

  $('#invite_container').validate({
    rules: {
      Email: {
        required: true,
        email: true,
        minlength: 8
      }
    },
    messages: {
      Email: {
        required: 'Trường này là bắt buộc.',
        email: 'Vui lòng nhập một địa chỉ email hợp lệ.',
        minlength: 'Vui lòng nhập ít nhất 3 ký tự.'
      }
    },
    submitHandler: function (ev) {
      PermissionDA.getCustomerItem($('.invite-email-input').val())
    }
  })

  $('body').on('click', '.select-inviter-permission', function (ev) {
    ev.stopPropagation()
    $('.permission_popup').hide()
    $(this).next('.wpopup-select-permission').show()
  })
  $('body').on(
    'click',
    '.wpopup-select-permission .permission-option',
    function (ev) {
      $('.selected_permission').text($(this).text())
      ProjectDA.permission = $(this).data('permission')
    }
  )

  $('body').on('click', '.edit-member-permission', function (ev) {
    ev.stopPropagation()
    $('.permission_popup').hide()
    $(this).next('.wpopup-edit-permisson').show()
  })
  $('body').on(
    'click',
    '.wpopup-edit-permisson .permission-option',
    function (ev) {
      if ($(this).hasClass('owner')) {
        let selected_cus = PageDA.customerList.find(
          e => e.ID == $(this).parents('.wmember-container').data('id')
        )
        // TODO: show popup warning
        // then:
        $(this)
          .parents('.wmember-container')
          .find('.user_permission')
          .text($(this).text())
        selected_cus.Permission = EnumPermission.owner

        $('.wmember-container[data-customer="' + userItem.ID + '"]')
          .find('.user_permission')
          .text('Can edit')
        // let tmp = PageDA.customerList.find(e => e.CustomerID == userItem.ID).Permission = EnumPermission.editer;

        PageDA.editCustomerPermission(selected_cus, selected_cus.CustomerType)
        // PageDA.editCustomerPermission(tmp, tmp.CustomerType);

        $('.wmember-container[data-customer="' + p_user.CustomerID + '"]').css(
          'pointer-events',
          'visible'
        )
        $('.wmember-container[data-customer="' + p_user.CustomerID + '"]')
          .find('.fa-chevron-down')
          .show()

        $(
          '.wmember-container[data-customer="' + selected_cus.CustomerID + '"]'
        ).css('pointer-events', 'none')
        $('.wmember-container[data-customer="' + selected_cus.CustomerID + '"]')
          .find('.fa-chevron-down')
          .hide()
      } else if (!$(this).hasClass('remove')) {
        $(this)
          .parents('.wmember-container')
          .find('.user_permission')
          .text($(this).text())
      } else {
        $(this).parents('.wmember-container').remove()
        let selected_cus = PageDA.customerList.find(
          e => e.ID == $(this).parents('.wmember-container').data('id')
        )
        PageDA.deleteCustomerPermission(
          selected_cus.ID,
          selected_cus.CustomerType
        )
      }
      if ($(this).hasClass('edit')) {
        let selected_cus = PageDA.customerList.find(
          e => e.ID == $(this).parents('.wmember-container').data('id')
        )
        if (selected_cus.Permission != EnumPermission.editer) {
          selected_cus.Permission = EnumPermission.editer
          PageDA.editCustomerPermission(selected_cus, selected_cus.CustomerType)
        }
      } else if ($(this).hasClass('view')) {
        let selected_cus = PageDA.customerList.find(
          e => e.ID == $(this).parents('.wmember-container').data('id')
        )
        if (selected_cus.Permission != EnumPermission.viewer) {
          selected_cus.Permission = EnumPermission.viewer
          PageDA.editCustomerPermission(selected_cus, selected_cus.CustomerType)
        }
      } else if ($(this).hasClass('leave')) {
        let selected_cus = PageDA.customerList.find(
          e => e.ID == $(this).parents('.wmember-container').data('id')
        )
        PageDA.deleteCustomerPermission(
          selected_cus.ID,
          selected_cus.CustomerType
        )

        TitleBarDA.list.splice(TitleBarDA.list.indexOf(ProjectDA.obj), 1)
        Ultis.setStorage('list-project-tab', JSON.stringify(TitleBarDA.list))

        location.href = '/View/home-srceen.html?tab=recent'
      }
    }
  )

  $('body').on('click', function (ev) {
    if (!$('.permission_popup').is(ev.target)) {
      $('.permission_popup').hide()
    }
    if (
      $('.close_popup').is(ev.target) ||
      $('.wpopup-background').is(ev.target)
    ) {
      $('.wpopup-background').remove()
    }
  })
})

//
function customerList() {
  const customer_circle = share_tool.querySelector('.customer-circle-list')
  let user = UserService.user()
  ProjectDA.obj.CustomerProjectItems.forEach(e => {
    e.CustomerType = EnumObj.customerProject
    if (PageDA.customerList.length === 0 || PageDA.customerList.every(el => el.CustomerID !== e.CustomerID)) {
      PageDA.customerList.push(e)
    }
  })
  ProjectDA.obj.CustomerTeamItems.forEach(e => {
    e.CustomerType = EnumObj.customerTeam
    let el = PageDA.customerList.find(el => el.CustomerID === e.CustomerID)
    if (el) {
      ProjectDA.obj.CustomerTeamItems.indexOf[e] = el
    } else {
      PageDA.customerList.push(e)
    }
  })
  ProjectDA.obj.CustomerTeamPItems.forEach(e => {
    e.CustomerType = EnumObj.customerTeam
    let el = PageDA.customerList.find(el => el.CustomerID === e.CustomerID)
    if (el) {
      ProjectDA.obj.CustomerTeamPItems.indexOf[e] = el
    } else {
      PageDA.customerList.push(e)
    }
  })
  customer_circle.style.width = `${2.4 * PageDA.customerList.length}rem`
  customer_circle.replaceChildren(
    ...PageDA.customerList.slice(0, 3).map((customerItem, index) => {
      let itemCircle = document.createElement('div')
      const randomColor = Ultis.generateRandomColor()
      customerItem.color = randomColor
      itemCircle.className = 'center semibold1 row user-join box24'
      if (!customerItem.CustomerName && customerItem.CustomerID === user.ID)
        customerItem.CustomerName = user.Email
      itemCircle.style.backgroundColor = randomColor
      itemCircle.style.left = `${1.4 * index}rem`
      itemCircle.innerHTML = (customerItem.CustomerName ?? 'Anonymous')
        .substring(0, 1)
        .toUpperCase()
      let tooltip = document.createElement('span')
      tooltip.innerHTML = customerItem.CustomerName ?? 'Anonymous'
      itemCircle.appendChild(tooltip)
      return itemCircle
    })
  )
  if (PageDA.customerList.length > 3) {
    let itemCircle = document.createElement('div')
    const randomColor = Ultis.generateRandomColor()
    itemCircle.className = 'center semibold1 row user-join box24'
    itemCircle.style.backgroundColor = randomColor
    itemCircle.innerHTML = PageDA.customerList.length - 3 > 10 ? '9+' : `${PageDA.customerList.length - 3}`
    let tooltip = document.createElement('span')
    tooltip.innerText = PageDA.customerList
      .slice(3)
      .map(customerItem => {
        if (!customerItem.CustomerName && customerItem.CustomerID === user.ID)
          customerItem.CustomerName = user.Email
        const randomColor = Ultis.generateRandomColor()
        customerItem.color = randomColor
        return customerItem.CustomerName
      })
      .join('\n')
    itemCircle.appendChild(tooltip)
    customer_circle.appendChild(itemCircle)
  }
}
//

function permissionTool() {
  let projectTitle = document.getElementById('project_name')
  projectTitle.innerHTML = ProjectDA.obj.Name ?? 'Untitled'
  create_obj_tool.replaceChildren(
    ...list_tool.map(wTool => {
      let new_tool = document.createElement('button')
      new_tool.id = wTool.message
      new_tool.className = 'row btn-tool-state box48'
      if (wTool.message === tool_state) {
        $(new_tool).addClass('on-select')
      }
      new_tool.innerHTML = `<span class="comp-text">${wTool.message.replace('ToolState.', '')}</span><img src="${wTool.src}"/>`
      if (wTool.expand != null) {
        new_tool.innerHTML += `<i class="fa-solid fa-chevron-down"></i>`
        $(new_tool).on('click', ".fa-chevron-down", function (e) {
          e.stopPropagation()
          wTool.expand()
        })
      }
      new_tool.onclick = function (e) {
        e.stopPropagation()
        toolStateChange(this.id)
        if (wTool.message === ToolState.base_component) {
          wTool.expand()
        }
      }
      return new_tool
    })
  )
  if (PageDA.enableEdit) {
    projectTitle.onclick = function (e) {
      e.stopPropagation()
      this.contentEditable = true
      this.style.outline = 'none'
      var range = document.createRange()
      range.selectNodeContents(this)
      var sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }

    projectTitle.onblur = function () {
      if (this.innerHTML.length) {
        this.contentEditable = false
        ProjectDA.obj.Name = this.innerHTML
        let titleBarList = TitleBarDA.list()
        titleBarList[titleBarList.findIndex(e => e.ID === ProjectDA.obj.ID)].Name = this.innerHTML
        TitleBarDA.setList(titleBarList)
        document.body.querySelector(`.nav-tab[data-id="${e.ID}"]`).innerHTML = `${this.innerHTML ?? 'Untitled'}<i class="fa-solid fa-close row box20 center"></i>`
        ProjectDA.edit(ProjectDA.obj)
      } else {
        this.value = ProjectDA.obj.Name
      }
    }
  }
}

$('body').on('click', '.btn-history', function () {
  let historyView = document.createElement('div')
  historyView.id = 'history-view'
  historyView.className = 'edit-container  col'
  let header = document.createElement('div')
  header.className = 'ds-block-header row'
  header.style.justifyContent = 'space-between'
  let title = document.createElement('p')
  title.innerHTML = 'Version history'
  let comboAction = document.createElement('div')
  comboAction.className = 'row'
  comboAction.style.gap = '6px'
  let addBtn = document.createElement('i')
  addBtn.className = 'fa-solid fa-plus fa-sm'
  let closeBtn = document.createElement('i')
  closeBtn.className = 'fa-solid fa-xmark fa-sm'
  closeBtn.onclick = function () {
    historyView.replaceWith(right_view)
    PageDA.enableEdit = permission
    document.body.setAttribute('enable', PageDA.enableEdit)
    toolStateChange(ToolState.move)
  }
  comboAction.replaceChildren(addBtn, closeBtn)
  header.replaceChildren(title, comboAction)
  let body = document.createElement('div')
  body.className = 'col'
  historyView.replaceChildren(header, body)
  toolStateChange(ToolState.hand_tool)
  right_view.replaceWith(historyView)
  let permission = PageDA.enableEdit
  PageDA.enableEdit = false
  document.body.setAttribute('enable', 'false')
})

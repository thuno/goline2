// const { data } = require("jquery");

// const urlImg = "http://10.15.138.23:86/";
// const socket = io("ws://10.15.138.23:4000"
const socket = io(ConfigApi.socketWini, {
  //reconnectionDelayMax: 1000,
  auth: {
    token: '123'
  },
  query: {
    'my-key': 'my-value'
  }
})
socket.on('connect', () => {
  // WIndexedDB.initDB();
  console.log('socketID:' + socket.id) // "G5p5..."
  console.log('socket connect' + socket.connected) // true
  // PageDA.obj = undefined
  // PageDA.list = []
  // if (socket.connected) {
  //   PageDA.pageLoadingView(function () {
  //     clearActionListFrom()
  //     WiniIO.emitRefreshToken()
  //     const queryString = window.location.search
  //     const urlParams = new URLSearchParams(queryString)
  //     const projectID = urlParams.get('id')
  //     ProjectDA.openingList =
  //       JSON.parse(Ultis.getStorage('list-project-tab')) ?? []
  //     ProjectDA.obj = ProjectDA.openingList.find(e => e.ID === projectID)
  //     if (!ProjectDA.obj) {
  //       ProjectDA.obj = { ID: projectID }
  //     }
  //     ProjectDA.getProjectInfor()
  //     ProjectDA.getByID()
  //     ProjectDA.getPermission()
  //     ProjectDA.init()
  //   })
  // }
})
//socket.io.on("error", (error) => {
//	// ...
//	socket.io.on("reconnect_attempt", (attempt) => {
//		// ...
//	});
//});
socket.io.on('ping', () => {
  //console.log("ping_connect");
})

socket.on('server-log', data => {
  console.log('server-log')
  console.log(data)
  switch (data.Code) {
    case StatusApi.refreshToken:
      toastr['error'](
        'Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại!!!'
      )
      window.location.href = '/View/login-view.html'
      break
    default:
      toastr['error'](data.Message)
    // window.location.href = "/View/home-screen.html";
  }
})
// socket.on('server-init-style', (data) => {
//     console.log("init style");
//     let result = data.data;
//     console.log(result);
//     ColorDA.list = result.ColorItems;
//     TypoDA.list = result.TextStyleItems;
//     EffectDA.list = result.EffectItems;
//     BorderDA.list = result.BorderItems;
//     PropertyDA.list = result.WPropertyItems;
//     [...ColorDA.list, ...TypoDA.list, ...EffectDA.list, ...BorderDA.list].forEach(skinData => {
//         WIndexedDB.add_dataRequestStore(skinData, WIndexedDB.skinStore);
//     })
//     WiniIO.emitInit(EnumObj.wBase);
// });
// //thay hàm init cũ
// socket.on('server-init-base', (data) => {
//     console.log('server-init-wbase', data.data);
//     let result = data.data;
//     wbase_list = result;
//     wbase_list.forEach(wbaseData => {
//         WIndexedDB.add_dataRequestStore(wbaseData, WIndexedDB.skinStore);
//     })
//     parent = divSection;
//     selected_list = [];
//     updateHoverWbase();
//     arrange();
//     replaceAllLyerItemHTML();
//     assets_list = wbase_list.filter(wbaseItem => wbaseItem.IsWini);
//     PageDA.selectPage(PageDA.obj);
// });
// socket.on('server-init-wbase', (data) => {
//     console.log('server-init-base-component', data);
//     base_component_list = data.data;
//     base_component_list.forEach(e => {
//         if (e.CateID === EnumCate.radio_button && e.Level === 1) {
//             e.StyleItem.DecorationItem.BorderItem.ColorValue = "FFccd7e6";
//         } else if (e.CateID === EnumCate.textfield) {
//             e.IsShow = false;
//         }
//     })
// });
socket.on('server-property', data => {
  var obj = data['data']
  switch (data['enumEvent']) {
    case EnumEvent.add:
      PropertyDA.list.push(obj)
      break
    case EnumEvent.edit:
      PropertyDA.list[PropertyDA.list.findIndex(e => e.id == obj.id)] = obj
      break
    case EnumEvent.delete:
      PropertyDA.list = PropertyDA.list.filter(e => e.id != obj.id)
      break
    case EnumEvent.unDelete:
      PropertyDA.list.push(obj)
      break
  }
})
socket.on('server-page', data => {
  console.log('server-page')
  console.log(data)
  if (data.pid == ProjectDA.obj.ID) {
    switch (data.enumEvent) {
      case EnumEvent.delete:
        var obj = data.data
        let deleteIndex = PageDA.list.findIndex(e => e.ID == obj.ID) - 1
        if (deleteIndex < 0) {
          deleteIndex = 0
        }
        PageDA.list = PageDA.list.filter(e => e.ID != obj.ID)
        if (PageDA.obj.ID == obj.ID) {
          PageDA.selectPage(PageDA.list[deleteIndex])
        }
        break
      case EnumEvent.unDelete:
        var obj = data['data']
        PageDA.list.push(obj)
        break
      case EnumEvent.sort:
        break
      default:
        var obj = data.data
        let editIndex = PageDA.list.findIndex(e => e.ID == obj.ID)
        if (editIndex > 0) {
          PageDA.list[editIndex] = obj
        } else {
          PageDA.list.push(obj)
          PageDA.selectPage(obj)
        }
        break
    }
  }
})
socket.on('server-get', data => {
  console.log('server-get')
  console.log(data)
  switch (data.enumObj) {
    case EnumObj.apiOutput:
      OutputDA.list = data.data
      break
    case EnumObj.apiInput:
      InputDA.list = data.data
      break
    //! GET router .....................
    // case EnumObj.router:
    //     switch (data.enumEvent) {
    //         case EnumEvent.init:
    //             RouterDA.list = data.data;
    //             // update_popupSelectRouter();
    //             break;
    //     }
    //     break;
    case EnumObj.request:
      switch (data.enumEvent) {
        case EnumEvent.init:
          RequestDA.list = data.data
          // update_ListApiDropdown();
          f12_update_selectWbase()
          $('.f12-container').css('display', 'flex')
          break
        case EnumEvent.getByID:
          switch ($($('.f12-container .tab.selected')).data('tab')) {
            case 1:
              RequestDA.selected = data.data
              f12_update_listOutputRow()
              break
            case 2:
              F12Container.api_input = data.data
              f12_update_listInputRow()
              break
            default:
              update_UI_dataView()
          }
          // if (F12View.tab_index == 1) {
          //     RequestDA.selected = data.data;
          //     update_F12OutputRow();
          //     update_SelectOutputDropdown(RequestDA.selected.outputApiItem);
          // } else if (F12View.tab_index == 2) {
          //     F12View.api_input = data.data;
          //     update_F12InputRow();
          // } else {
          //     F12View.api_br = data.data;
          //     update_F12BrRow();
          //     update_BrSelectOutputDropdown(F12View.api_br.outputApiItem);
          // }

          //TODO: Prototype router select popup
          // add_inputContainer(data.data);
          // add_outputContainer(data.data);
          break
        default:
      }
      break
    case EnumObj.cate:
      switch (data.enumEvent) {
        case EnumEvent.init:
          if (data.headers.pid == ProjectDA.obj.ID) {
            CateDA.convertData(data.data)
            updateUISelectionSkins()
            CateDA.needInit = false
          } else {
            StyleDA.listCate = data.data
            StyleDA.init()
          }
          break
        default:
          break
      }
      break
    case EnumObj.page:
      if (PageDA.list.isNotEmpty) {
        PageDA.obj = data['data']
        PageDA.list[
          PageDA.list.findIndex(element => element.ID == PageDA.obj.ID)
        ] = PageDA.obj
        inviteMemberProject(EnumWg.context)
      }
      break
    case EnumObj.wBase:
      switch (data.enumEvent) {
        case EnumEvent.get:
          let listAssets = data.data
          listAssets = initDOM(listAssets)
          if (listAssets.length > 0) {
            assets_list = assets_list.filter(
              wb => wb.PageID !== listAssets[0].PageID
            )
            if (listAssets[0].PageID === PageDA.obj.ID) {
              listAssets = listAssets.map(e => {
                if (e.CateID !== EnumCate.variant) {
                  e.value = divSection
                    .querySelector(`.wbaseItem-value[id="${e.GID}"]`)
                    .cloneNode(true)
                  e.value.style = null
                }
                return e
              })
            }
            assets_list.push(...listAssets)
          }
          let listTileLoader = assets_view.querySelector(
            '.list_tile:has(> .data-loader)'
          )
          $(listTileLoader).trigger('click')
          break
        default:
          break
      }
      break
    // !GET Style
    case EnumObj.style:
      switch (data.enumEvent) {
        case EnumEvent.init:
          StyleDA.convertInitData(data.data)
          linkSkinView(ProjectDA.list.find(e => e.ID == data.headers.pid))
          StyleDA.skinProjectID = null
          break
        case EnumEvent.merge:
          StyleDA.mergeSkins = data.data
          mergeSkinDialog()
          break
        default:
          break
      }
      break
    // !GET project
    case EnumObj.project:
      //
      switch (data.enumEvent) {
        case EnumEvent.getProjectByID:
          ProjectDA.obj = data.data
          if (ProjectDA.obj.ResponsiveJson)
            ProjectDA.obj.ResponsiveJson = JSON.parse(
              ProjectDA.obj.ResponsiveJson
            )
          // ProjectDA.initLayoutResponsive();
          let projectTitle = document.getElementById('project_name')
          if (projectTitle) {
            projectTitle.innerHTML = ProjectDA.obj?.Name
          }
          try {
            updateUIBreakpoint()
            customerList()
          } catch (error) {
            setTimeout(function () {
              updateUIBreakpoint()
              customerList()
            }, 250)
          }
          if (data.data.RouterJson) {
            RouterDA.list = JSON.parse(data.data.RouterJson)
          } else {
            RouterDA.list = []
          }
          break
        case EnumEvent.init:
          ProjectDA.list = data.data.sort((a, b) => b.DateUpdate - a.DateUpdate)
          loadding_P_success = true;
          check_loadingSuccess();
          TitleBarDA.initDataStorage()
          break
        case EnumEvent.init:
          TeamDA.list = data.data.sort((a, b) => b.DateUpdate - a.DateUpdate)
          loadding_T_success = true
          check_loadingSuccess()
          break
        case EnumEvent.permission:
          try {
            for (let wpageItem of data.data.WPageItems) {
              if (wpageItem.Name == undefined) {
                wpageItem.Name = `Page ${i + 1}`
              }
            }
            PageDA.list.push(...data.data.WPageItems)
            if (PageDA.list.length > 0) {
              PageDA.obj = Ultis.getStorage('opening-page')
              if (checkTypeof(PageDA.obj) === 'string')
                PageDA.obj = JSON.parse(PageDA.obj)
              if (
                PageDA.obj == undefined ||
                PageDA.obj.ProjectID != ProjectDA.obj.ID
              ) {
                PageDA.obj =
                  PageDA.list.find(e => e.ID == ProjectDA.obj.PageDefaultID) ??
                  PageDA.list[0]
              }
              PageDA.obj.Permission = data.data.Permission
              if (PageDA.obj?.scale == undefined) {
                PageDA.obj.scale = scale
                PageDA.obj.topx = topx
                PageDA.obj.leftx = leftx
              }
              PageDA.checkEditPermission(PageDA.obj)
            }
            WiniIO.emitInit()
            permissionTool()
            initData()
            // TODO: next vesion code blow
            // InputDA.init();
            // OutputDA.init();
          } catch (error) {
            toastr['error']['Bạn không có quyền truy cập dự án này!']
          }
          break
        default:
          break
      }
      //
      break
    // !GET collection
    case EnumObj.collection:
      switch (data.enumEvent) {
        case EnumEvent.init:
          CollectionDA.list = data['data']
          CollectionDA.documentList = CollectionDA.list.filter(e => e.Type == ApiSelection.document)
          if (CollectionDA.documentList.length == 0) {
            let defaultFolder = {
              ID: 0,
              Name: 'default folder',
              Type: ApiSelection.document
            }
            CollectionDA.addDocument(defaultFolder)
          }
          break
        default:
          break
      }
      break
    // !GET file
    case EnumObj.file:
      console.log('get file')
      switch (data.enumEvent) {
        case EnumEvent.init:
          FileDA.list = data.data
          showImgDocument()
          selectFolder(CollectionDA.documentList[1])
          break
        default:
          break
      }
      break
    // !GET customer
    case EnumObj.customer:
      switch (data.enumEvent) {
        case EnumEvent.get:
          if (data.data) {
            // nếu đã tồn tại
            if (
              ProjectDA.obj.CustomerProjectItems.some(
                e => e.CustomerID == data.data.ID
              )
            ) {
              toastr['warning']('Người dùng đã là thành viên của dự án!')
            } else {
              let customerInviteItem = {
                ID: 0,
                Permission: ProjectDA.permission,
                CustomerID: data.data.ID,
                CustomerName: data.data.Email,
                ProjectID: ProjectDA.obj.ID
              }
              ProjectDA.addCustomerProject(customerInviteItem)
              $('.wpopup-background').remove()
            }
          } else {
            toastr['warning']('Người dùng chưa đăng ký tài khoản Wini!')
          }
          break
      }
    default:
      break
  }
})
socket.on('server-google', data => {
  UserService.setToken(data['data']['Token'], data['data']['RefreshToken'])
  UserDA.setToStore(data['data'])
  moveProject({ ID: 0 })
})

socket.on('server-post', data => {
  console.log('server post')
  console.log(data)
  switch (data.enumObj) {
    case EnumObj.project:
      switch (data.enumEvent) {
        case EnumEvent.add:
          var pro = data.data
          ProjectDA.list.push(pro)
          ProjectDA.obj = pro
          // add project tab
          TitleBarDA.list.push(pro)
          Ultis.setStorage('project-tab-selected', pro.ID)
          Ultis.setStorage('list-project-tab', JSON.stringify(TitleBarDA.list))
          TitleBarDA.updateTitleBar()
          //
          window.location.href = '/View/project-design-view.html?id=' + pro.ID
          break
        default:
          if (TitleBarDA.list.some(e => e.ID == data.data.ID)) {
            TitleBarDA.list.find(e => e.ID == data.data.ID).Name =
              data.data.Name
            Ultis.setStorage(
              'list-project-tab',
              JSON.stringify(TitleBarDA.list)
            )
            TitleBarDA.initDataStorage()
          }
          if (ProjectDA.obj.EditListID) {
            document
              .getElementById('dialog_link_component_skin')
              .parentElement.remove()
            ProjectDA.obj.EditListID = null
            // $.get(WBaseDA.skin_url + `?pid=${ProjectDA.obj.ID}`).then(res => {
            //   ColorDA.list = res.Data.ColorItems
            //   TypoDA.list = res.Data.TextStyleItems
            //   EffectDA.list = res.Data.EffectItems
            //   BorderDA.list = res.Data.BorderItems
            //   PropertyDA.list = res.Data.WPropertyItems
            //   CateDA.initCate()
            // })
            initUIAssetView()
          }
          break
      }
      break
    // !POST Style
    case EnumObj.style:
      switch (data.enumEvent) {
        case EnumEvent.copy:
          StyleDA.copySkinToProject(data.data)
          break
        case EnumEvent.merge:
          // StyleDA.mergeSkinSuccess(data.data);
          break
        default:
          break
      }
      break
    // !POST cate
    case EnumObj.cate:
      let newId = data.data
      CateDA.list[CateDA.list.length - 1].ID = newId
      StyleDA.newSkin.CateID = newId
      StyleDA.addStyleSheet(StyleDA.newSkin).then(() => {
        CateDA.convertData(CateDA.list)
        switch (StyleDA.newSkin.Type) {
          case EnumCate.color:
            const editType = document.body.querySelector('.tb-skins-popup-body').getAttribute('edit-type')
            switch (editType) {
              case 'typo':
                handleEditTypo({ colorSkin: StyleDA.newSkin })
                reloadEditTypoBlock()
                break
              default:
                handleEditBackground({ colorSkin: StyleDA.newSkin })
                reloadEditBackgroundBlock()
                break
            }

            break
          case EnumCate.typography:
            handleEditTypo({ typoSkin: StyleDA.newSkin })
            reloadEditTypoBlock()
            break
          case EnumCate.border:
            handleEditBorder({ borderSkin: StyleDA.newSkin })
            reloadEditBorderBlock()
            break
          case EnumCate.effect:
            handleEditEffect({ effectSkin: StyleDA.newSkin })
            reloadEditEffectBlock()
            break
          default:
            break
        }
        document.documentElement.style.setProperty(`--${StyleDA.newSkin.GID}`, StyleDA.newSkin.Css)
        StyleDA.newSkin = null
        document.querySelectorAll('.popup-overlay').forEach(e => e.remove())
      })
      break
    // !POST collection
    case EnumObj.collection:
      switch (data.enumEvent) {
        case EnumEvent.add:
          CollectionDA.documentList.push(data.data)
          let listFolder = document.getElementById('list_folder_container')
          if (listFolder) {
            let newFolderTile = createFolderTile(data.data)
            listFolder.appendChild(newFolderTile)
            selectFolder(data.data)
          }
          break
        case EnumEvent.edit:
          break
        case EnumEvent.delete:
          break
        default:
          break
      }
      break
    // !POST customerProject
    case EnumObj.customerProject:
      switch (data.enumEvent) {
        case EnumEvent.add:
          ProjectDA.obj.CustomerProjectItems.push(data.data)
          toastr['success']('Thêm thành viên vào dự án thành công')
          customerList()
          break
        case EnumEvent.delete:
          // ProjectDA.objOneClick.ListCustomerProject = ProjectDA.objOneClick.ListCustomerProject.filter((e) => e.CustomerID != data.data);
          break
      }
    default:
      break
  }
})
// Nhận Wbase từ các máy khác
socket.on('server-main', async data => {
  console.log('server-main')
  console.log(data)
  if (!document.body.querySelector('.loading-view') && data.pageid === PageDA.obj.ID) {
    if (data.enumEvent === EnumEvent.delete) {
      WbaseIO.delete(data.data)
    } else {
      WbaseIO.addOrUpdate(data.data)
      if (data.enumEvent !== EnumEvent.edit) initObserver()
      replaceAllLyerItemHTML()
      wdraw()
      if (data.enumEvent === EnumEvent.copy && data.userItem.ID === JSON.parse(localStorage.getItem('customer')).ID) {
        divSection
          .querySelectorAll('.wbaseItem-value[loading="true"]')
          .forEach(e => e.remove())
        tmpAltHTML = []
        alt_list = []
        var selectedId = data.data.filter(e => e.ParentID === data.parentid).map(e => e.GID)
      } else {
        selectedId = selected_list.map(e => e.GID)
      }
      handleWbSelectedList(wbase_list.filter(e => selectedId.some(id => e.GID === id)))
    }
  }
})
socket.on('server-mouse', data => {
  if (data.data.ID !== UserService.user().id) {
    listRect = listRect.filter(e => e.ID !== data.data.ID)
    listRect.push(data.data)
    // wdraw();
  }
})

socket.on('server-css', data => { })

socket.on('server-refresh', data => {
  const href = window.location.href
  if (data != null && data.data.Code == 200) {
    UserService.setToken(data.data.Data.Token, UserService.getRefreshToken())
  } else {
    if (!href.includes('login-success.html')) {
      window.location.href = '/View/login-view.html'
    } else {
      window.location.href = '/View/login-web-success.html'
    }
    toastr['error'](
      'Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại!!!'
    )
  }
})

class WiniIO {
  static emitMain(obj) {
    obj.userItem = UserService.user()
    obj.token = UserService.token()
    obj.pid = parseInt(obj.pid ?? ProjectDA.obj.ID)
    obj.pageid = obj.pageid ?? PageDA.obj.ID
    arrange(obj.data)
    obj.data = obj.data.reverse()
    console.log(Date.now(), ' : ', obj)
    obj.data = [
      ...obj.data.map(e => {
        let dtItem = JSON.parse(JSON.stringify(e))
        delete dtItem.ListID
        delete dtItem.Level
        delete dtItem.tmpW
        delete dtItem.tmpH
        delete dtItem.tmpX
        delete dtItem.tmpY
        return dtItem
      })
    ]
    // if (obj.enumEvent !== EnumEvent.add)
    //   obj.data = obj.data.filter(e => e.CateID !== EnumCate.textfield)
    // if (
    //   obj.pageid === PageDA.obj.ID &&
    //   action_index >= 0 &&
    //   action_index === action_list.length - 1
    // ) {
    //   action_list[action_index].enumObj = obj.enumObj
    //   action_list[action_index].enumEvent = obj.enumEvent
    // }
    // if (
    //   obj.data.some(
    //     wbaseItem =>
    //       wbaseItem.VariablesData ||
    //       wbaseItem.JsonItem ||
    //       wbaseItem.JsonEventItem ||
    //       wbaseItem.TableRows ||
    //       wbaseItem.TreeData
    //   )
    // ) {
    //   for (let wbaseItem of obj.data) {
    //     if (wbaseItem.JsonItem) {
    //       wbaseItem.AttributesItem.Json = JSON.stringify(wbaseItem.JsonItem)
    //     }
    //     if (wbaseItem.JsonEventItem) {
    //       wbaseItem.AttributesItem.JsonEvent = JSON.stringify(
    //         wbaseItem.JsonEventItem
    //       )
    //     }
    //     if (wbaseItem.VariablesData) {
    //       wbaseItem.AttributesItem.Variables = JSON.stringify(
    //         wbaseItem.VariablesData
    //       )
    //     }
    //     if (wbaseItem.TableRows) {
    //       wbaseItem.AttributesItem.Content = JSON.stringify(wbaseItem.TableRows)
    //     } else if (wbaseItem.TreeData) {
    //       wbaseItem.AttributesItem.Content = JSON.stringify(wbaseItem.TreeData)
    //     } else if (wbaseItem.ChartData) {
    //       wbaseItem.AttributesItem.Content = JSON.stringify(wbaseItem.ChartData)
    //     } else if (wbaseItem.CarouselData) {
    //       wbaseItem.AttributesItem.Content = JSON.stringify(
    //         wbaseItem.CarouselData
    //       )
    //     }
    //   }
    // }
    // if (obj.enumEvent < 0) {
    //   let updateList = obj.data.filter(e => !e.IsDeleted)
    //   let deleteList = obj.data.filter(e => e.IsDeleted)
    //   obj.enumEvent = EnumEvent.edit
    //   obj.data = updateList
    //   socket.emit('client-main', obj)
    //   if (deleteList.length > 0) {
    //     obj.enumEvent = EnumEvent.delete
    //     obj.enumObj = EnumObj.wBase
    //     obj.data = deleteList
    //     socket.emit('client-main', obj)
    //   }
    //   return
    // }
    socket.emit('client-main', obj)
  }

  static async emitProperty(item, enumEvent) {
    var jsonData = item
    socket.emit('client-property', {
      headers: await UserService.socketHeaders(),
      data: jsonData,
      pid: PageDA.obj.ProjectID,
      enumEvent: enumEvent
    })
  }

  static async emitColor(color, enumEvent) {
    console.log('emit-color')
    let jsonData = color
    console.log(jsonData)
    socket.emit('client-color', {
      headers: await UserService.socketHeaders(),
      data: jsonData,
      enumEvent: enumEvent,
      pid: PageDA.obj.ProjectID,
      pageid: PageDA.obj.ID,
      enumObj: EnumObj.color
    })
  }

  static async emitTypo(typo, enumEvent) {
    var jsonData = typo
    socket.emit('client-typo', {
      headers: await UserService.socketHeaders(),
      data: jsonData,
      enumEvent: enumEvent,
      pid: PageDA.obj.ProjectID,
      pageid: PageDA.obj.ID,
      enumObj: EnumObj.textStyle
    })
  }

  static async emitEffect(effect, enumEvent) {
    var jsonData = effect
    socket.emit('client-effect', {
      headers: await UserService.socketHeaders(),
      data: jsonData,
      enumEvent: enumEvent,
      pid: PageDA.obj.ProjectID,
      pageid: PageDA.obj.ID,
      enumObj: EnumObj.effect
    })
  }

  static async emitBorder(borderItem, enumEvent) {
    var jsonData = borderItem
    socket.emit('client-border', {
      headers: await UserService.socketHeaders(),
      data: jsonData,
      enumEvent: enumEvent,
      pid: PageDA.obj.ProjectID,
      pageid: PageDA.obj.ID,
      enumObj: EnumObj.border
    })
  }

  static async emitInit() {
    socket.emit('client-init', { pageid: PageDA.obj.ID })
  }

  static async emitPage(listPage, enumEvent) {
    console.log('client-page')
    let jsonData
    if (enumEvent != EnumEvent.sort) {
      jsonData = listPage[0]
    } else {
      jsonData = listPage
    }
    socket.emit('client-page', {
      pid: ProjectDA.obj.ID,
      data: jsonData,
      enumEvent: enumEvent,
      headers: await UserService.socketHeaders()
    })
  }

  static kc = { xMouse: 0, yMouse: 0 }
  static async emitMouse(mouseItem) {
    if (
      (!this.kc.w && mouseItem.w !== undefined) ||
      Math.sqrt(
        Math.pow(this.kc.xMouse - mouseItem.xMouse, 2) +
        Math.pow(this.kc.yMouse - mouseItem.yMouse, 2)
      ) >=
      20 / scale
    ) {
      let mouseData = JSON.parse(JSON.stringify(mouseItem))
      this.kc = mouseData
      mouseData.ID = UserService.user().id
      if (PageDA.obj?.ProjectID) {
        socket.emit('client-mouse', {
          headers: await UserService.socketHeaders(),
          pid: PageDA.obj.ProjectID,
          data: mouseData
        })
      }
    }
  }

  static emitCss(cssItem, enumEvent) {
    socket.emit('client-css', {
      pid: PageDA.obj.ProjectID,
      data: cssItem,
      enumEvent: enumEvent
    })
  }

  static async emitGet(json, url, enumObj, enumEvent) {
    var header = await UserService.socketHeaders()
    socket.emit('client-get', {
      headers: header,
      body: json,
      url: url,
      data: [],
      enumObj: enumObj,
      enumEvent: enumEvent,
      userId: UserService.user().id
    })
  }

  static async emitPort(json, url, enumObj, enumEvent) {
    socket.emit('client-post', {
      headers: await UserService.socketHeaders(),
      body: json,
      url: url,
      data: [],
      enumEvent: enumEvent,
      enumObj: enumObj,
      userId: UserService.user().id
    })
  }

  static emitRefreshToken() {
    socket.emit('client-refresh', {
      headers: UserService.headerRefreshSocket(),
      data: []
    })
  }
}
class WbaseIO {
  static delete(list) {
    if (list.some(e => e.GID == hover_wbase?.GID)) {
      updateHoverWbase()
    }
    selected_list = selected_list.filter(e =>
      list.every(deleteItem => deleteItem.GID !== e.GID)
    )
    updateUISelectBox()
    updateUIDesignView()
    let reBuildParent = false
    if (list[0].ParentID !== wbase_parentID) {
      let parentWbase = wbase_list.find(
        wbaseItem => wbaseItem.GID === list[0].ParentID
      )
      if (parentWbase) {
        let oldParentHTML = parentWbase.value
        if (
          parentWbase.CountChild === 0 &&
          parentWbase.WAutolayoutItem &&
          (oldParentHTML.style.width == 'fit-content' ||
            oldParentHTML.style.height == 'fit-content')
        ) {
          if (oldParentHTML.style.width == 'fit-content') {
            oldParentHTML.style.width = oldParentHTML.offsetWidth + 'px'
            parentWbase.StyleItem.FrameItem.Width = oldParentHTML.offsetWidth
          }
          if (oldParentHTML.style.height == 'fit-content') {
            oldParentHTML.style.height = oldParentHTML.offsetHeight + 'px'
            parentWbase.StyleItem.FrameItem.Height = oldParentHTML.offsetHeight
          }
        }
        if (parentWbase.CateID === EnumCate.table) {
          parentWbase.TableRows.reduce((a, b) => a.concat(b))
            .filter(cell =>
              list.some(deleteItem => cell.contentid.includes(deleteItem.GID))
            )
            .forEach(cell => {
              let newListContentID = cell.contentid
                .split(',')
                .filter(id => list.every(deleteItem => deleteItem.GID !== id))
              cell.contentid = newListContentID.join(',')
            })
        }
      }
    }
    for (let wbaseItem of list) {
      if (wbaseItem.CateID == EnumCate.variant) {
        PropertyDA.list = PropertyDA.list.filter(e => e.BaseID != wbaseItem.GID)
      }
      if (
        wbaseItem.BasePropertyItems &&
        wbaseItem.BasePropertyItems.length > 0
      ) {
        for (let baseProperty of wbaseItem.BasePropertyItems) {
          let propertyItem = PropertyDA.list.find(
            e => e.GID == baseProperty.PropertyID
          )
          propertyItem.BasePropertyItems =
            propertyItem.BasePropertyItems.filter(
              e => e.GID != baseProperty.GID
            )
        }
      }
      let eHTML = document.getElementById(wbaseItem.GID)
      if (eHTML) {
        if ($(eHTML).parents('.w-tree'))
          reBuildParent = $(eHTML).parents('.w-tree')
        eHTML.remove()
      }
    }
    wbase_list = wbase_list.filter(
      e =>
        !list.some(
          delete_item =>
            delete_item.GID == e.GID || e.ListID.includes(delete_item.GID)
        )
    )
    arrange()
    if (reBuildParent.length) {
      switch (parseInt(reBuildParent[0].getAttribute('cateid'))) {
        case EnumCate.tree:
          reBuildParent = reBuildParent[0]
          createTree(
            wbase_list.find(e => e.GID === reBuildParent.id),
            wbase_list.filter(e => e.ParentID === reBuildParent.id)
          )
          break
        default:
          break
      }
    }
  }

  static addOrUpdate(list) {
    list = initDOM(list)
    arrange(list)
    wbase_list = [
      ...wbase_list.filter(wb => list.every(e => wb.GID !== e.GID)),
      ...list
    ]
    arrange()
    for (let wb of list) {
      wb.value = null
      initComponents(wb)
    }
    let pWbList = list.filter(wb => wb.Level === 1 || !wb.value.closest(`.wbaseItem-value[level="${wb.Level - 1}"]`))
    for (let wb of pWbList) {
      let oldWbHTML = divSection.querySelector(`.wbaseItem-value[id="${wb.GID}"]`)
      if (oldWbHTML) {
        oldWbHTML.replaceWith(wb.value)
      } else {
        if (wb.Level > 1) var pWb = wbase_list.find(e => e.GID === wb.ParentID)
        if (pWb) {
          pWb.value.replaceChildren(
            ...wbase_list.filter(e => e.ParentID === pWb.GID).map(e => e.value)
          )
        }
      }
    }
    if (!pWb)
      divSection.replaceChildren(
        ...wbase_list
          .filter(e => e.ParentID === wbase_parentID)
          .map(e => e.value)
      )
    StyleDA.docStyleSheets.forEach(cssRuleItem => {
      if (cssRuleItem.style.length > 0) {
        divSection
          .querySelectorAll(cssRuleItem.selectorText)
          .forEach(wbHTML => {
            if (list.some(wb => wb.value === wbHTML)) {
              {
                setAttributeByStyle(wbHTML, cssRuleItem.style)
              }
            }
          })
      }
    })
  }
}

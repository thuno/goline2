var wbase_list = []
var base_component_list = []
var cssStyleSheets = []
var assets_list = []
var selected_list = []
var alt_list = []
var copy_item = []
var drag_start_list = []
var action_list = []
var action_index = -1
var select_box
var hover_wbase
var hover_box
var select_box_parentID = '019cc638-18b3-434d-8c4a-973537cde698'
var tool_state = ToolState.move


class WbClass {
  static scale = ['w-checkbox', 'w-switch', 'w-radio']
  static parent = [
    'w-container',
    'w-form',
    'w-textformfield',
    'w-button',
    'w-table',
    'w-variant'
  ]
  static borderEffect = [
    'w-container',
    'w-rect',
    'w-variant',
    'w-table',
    'w-textformfield'
  ]

  static rectangle = {
    ListID: wbase_parentID,
    ParentID: wbase_parentID,
    ListClassName: 'wbaseItem-value w-rect',
    IsWini: false,
    Css: 'background-color: #C4C4C4FF;',
    BasePropertyItems: [],
    AttributesItem: {
      Name: 'Rectangle'
    },
    Name: 'Rectangle'
  }

  static imgSvg = {
    ListID: wbase_parentID,
    ParentID: wbase_parentID,
    ListClassName: 'wbaseItem-value w-svg',
    IsWini: false,
    Css: '',
    BasePropertyItems: [],
    AttributesItem: {
      Name: 'Svg Picture',
      Content: ''
    },
    Name: 'Svg Picture'
  }

  static text = {
    ListID: wbase_parentID,
    ParentID: wbase_parentID,
    ListClassName: 'wbaseItem-value w-text',
    IsWini: false,
    Css: 'font-size: 24px;font-weight: 400;font-family: Roboto;text-align: start;align-items: center;color: #000000FF;',
    BasePropertyItems: [],
    AttributesItem: {
      Content: '',
      Name: 'Text'
    },
    Name: 'Text'
  }

  static container = {
    ListID: wbase_parentID,
    ParentID: wbase_parentID,
    ListClassName: 'wbaseItem-value w-container w-block',
    IsWini: false,
    Css: 'background-color: #FFFFFFFF;',
    BasePropertyItems: [],
    AttributesItem: {
      Name: 'Container'
    },
    Name: 'Container'
  }

  static variant = {
    ListID: wbase_parentID,
    ParentID: wbase_parentID,
    IsWini: true,
    ListClassName: 'wbaseItem-value w-variant w-block',
    Css: 'border-width: 2px;border-color: #7b61ffff;border-style: dotted;overflow: hidden;',
    StyleItem: {
      DecorationItem: {
        BorderItem: {
          Name: 'new border',
          BorderStyle: BorderStyle.dotted,
          IsStyle: false,
          ColorValue: '',
          BorderSide: BorderSide.all,
          Width: '2 2 2 2'
        }
      }
    },
    BasePropertyItems: [],
    AttributesItem: {
      NameField: '',
      Name: 'Variant'
    },
    Name: 'Variant'
  }

  static button = {
    ListID: wbase_parentID,
    ParentID: wbase_parentID,
    IsWini: false,
    ListClassName: 'wbaseItem-value w-button w-row',
    Css: 'background-color: #366AE2FF;border-radius: 8px;--padding: 12px 20px;justify-content: center;align-items: center;--child-space: 4px;--run-space: 0px;',
    BasePropertyItems: [],
    AttributesItem: {
      Name: 'Button'
    },
    Name: 'Button',
    JsonEventItem: []
  }

  static switch = {
    Name: 'Switch',
    ListID: wbase_parentID,
    ParentID: wbase_parentID,
    ListClassName: 'wbaseItem-value w-switch',
    IsWini: false,
    Css: '--dot-color: #ffffffff;--unchecked-bg: #f2f5f8ff;--checked-color: #1890ffff;width: 60px;height: 40px;',
    BasePropertyItems: [],
    AttributesItem: {
      Name: 'Switch',
      Content: 'true'
    },
    JsonItem: {}
  }

  static checkbox = {
    Name: 'Checkbox',
    ParentID: wbase_parentID,
    ListID: wbase_parentID,
    ListClassName: 'wbaseItem-value w-checkbox',
    IsWini: false,
    Css: '--check-color: #ffffffff;--unchecked-bg: #9e9e9eff;--checked-color: #366ae2ff;width: 20px;height: 20px;border-width: 2px;border-color: #e5eaf0ff;border-style: solid;',
    AttributesItem: {
      Name: 'Checkbox',
      Content: 'true'
    },
    JsonItem: {}
  }

  static radio_button = {
    Name: 'RadioButton',
    ParentID: wbase_parentID,
    ListID: wbase_parentID,
    ListClassName: 'wbaseItem-value w-radio',
    IsWini: false,
    Css: '--checked-color: #1890ffff;width: 20px;height: 20px;border-width: 2px;border-color: #2196f3ff;border-style: solid;',
    AttributesItem: {
      Name: 'Radio button',
      Content: ''
    },
    JsonItem: {}
  }

  static textformfield = {
    Name: 'Textformfield',
    ParentID: wbase_parentID,
    ListID: wbase_parentID,
    ListClassName: 'wbaseItem-value w-textformfield w-row',
    IsWini: false,
    Css: 'width: 382px;background-color: #ffffffff;border-radius: 8px;--padding: 10px 16px;justify-content: flex-start;align-items: center;--child-space: 4px;--run-space: 0px;border-width: 1px;border-color: #e5eaf0ff;border-style: solid;font-size: 16px;line-height: 24px;font-weight: 400;color: #394960ff;font-family: Roboto;',
    AttributesItem: {
      Name: 'Textformfield',
      Content: ''
    },
    JsonEventItem: []
  }

  static textfield = {
    ParentID: this.textformfield.GID,
    Name: 'Textfield',
    ListClassName: 'wbaseItem-value w-textfield',
    IsWini: false,
    Css: 'background-color: #00000000;--suffix-size: 16px;--suffix-icon-color: #00204D',
    AttributesItem: {
      Name: 'Textfield',
      Content: ''
    },
    JsonItem: {
      Label: 'Label',
      AutoFocus: false,
      IsImportant: false,
      Enabled: true,
      ReadOnly: false,
      Type: WTextFormFieldType.text,
      // ObscuringCharacter: '*',
      HintText: 'Placeholder'
    }
  }

  static table = {
    Name: 'Table',
    ParentID: wbase_parentID,
    Level: 1,
    ListID: wbase_parentID,
    IsWini: false,
    CountChild: 0,
    StyleItem: {
      PositionItem: {
        Right: 0,
        Bottom: 0
      },
      FrameItem: {
        Height: 112,
        Width: 360,
        IsClip: true,
        TopLeft: 8,
        TopRight: 8,
        BottomLeft: 8,
        BottomRight: 8
      },
      DecorationItem: {
        ColorValue: 'FFFFFFFF',
        BorderItem: {
          Width: '1 1 1 1',
          BorderStyle: BorderStyle.solid,
          ColorValue: 'E5EAF0FF',
          IsStyle: false,
          BorderSide: BorderSide.all
        }
      },
      PaddingItem: {
        Top: 8,
        Left: 8,
        Bottom: 8,
        Right: 8
      }
    },
    WAutolayoutItem: {
      Alignment: 'Center',
      Direction: 'Vertical',
      ChildSpace: 0.0,
      IsScroll: false,
      IsWrap: false,
      RunSpace: 0.0,
      CountItem: 1
    },
    AttributesItem: {
      Name: 'Table',
      NameField: 'Table',
      Content: ''
    },
    JsonItem: {
      ColBorderWidth: 1,
      RowBorderWidth: 1
    },
    JsonEventItem: [],
    TableRows: [
      [
        {
          ID: '1x1',
          contentid: '',
          RowSpan: 1,
          ColSpan: 1
        },
        {
          ID: '1x2',
          contentid: '',
          RowSpan: 1,
          ColSpan: 1
        }
      ],
      [
        {
          ID: '2x1',
          contentid: '',
          RowSpan: 1,
          ColSpan: 1
        },
        {
          ID: '2x2',
          contentid: '',
          RowSpan: 1,
          ColSpan: 1
        }
      ]
    ]
  }
}

class WBaseDA {
  static base_item_url = ConfigApi.domainApi + '/WBase/listBaseitem'
  static enumEvent
  static listData = []
  static isCtrlZ = false

  static async apiGetInitWbase() {
    const attribute_url = ConfigApi.domainApi + `Attribute/ListItemByPid?pageid=${PageDA.obj.ID}`
    const wbase_url = ConfigApi.domainApi + `WBase/ListItem?pageid=${PageDA.obj.ID}`
    let attributeData = await getData(attribute_url)
    attributeData = attributeData.Data
    let WbData = await getData(wbase_url)
    let cssData = await StyleDA.initStyleSheets()
    StyleDA.cssStyleSheets = cssData.Data
    StyleDA.cssStyleSheets.forEach(cssItem => {
      let styleTag = document.createElement('style')
      styleTag.id = `w-st-comp${cssItem.GID}`
      styleTag.innerHTML = cssItem.Css
      document.head.appendChild(styleTag)
      StyleDA.docStyleSheets.push(...styleTag.sheet.cssRules)
    })
    WbData = WbData.Data
    WbData.forEach(wb => (wb.AttributesItem = attributeData.find(e => e.GID === wb.AttributeID)))
    return WbData
  }

  static add({
    listWb,
    pageid,
    parentid,
    enumEvent = EnumEvent.add,
    enumObj = EnumObj.wBase
  }) {
    let data = {
      enumObj: enumObj,
      data: listWb,
      enumEvent: enumEvent,
      pageid: pageid,
      parentid: parentid ?? select_box_parentID
    }
    WiniIO.emitMain(data)
  }

  static edit(list_wbase_item, enumObj, isEditText = false) {
    // if (!WBaseDA.isCtrlZ && !isEditText) {
    //   addAction()
    // }
    let data = {
      enumObj: enumObj ?? EnumObj.wBase,
      data: list_wbase_item,
      enumEvent: EnumEvent.edit,
      parentid: select_box_parentID
    }
    WiniIO.emitMain(data)
  }

  static editBaseComponent(list_wbase_item, enumObj) {
    let data = {
      enumObj: enumObj ?? EnumObj.wBase,
      data: list_wbase_item,
      enumEvent: EnumEvent.edit,
      pageid: 0
    }
    WiniIO.emitMain(data)
  }

  static unDelete(list_wbase_item) {
    let data = {
      enumObj: EnumObj.wBase,
      data: list_wbase_item,
      enumEvent: EnumEvent.unDelete
    }
    WiniIO.emitMain(data)
  }

  static delete(delete_list) {
    // delete_list = delete_list.filter(
    //   e =>
    //     e.IsWini ||
    //     !e.value.closest(
    //       `.wbaseItem-value[iswini], .wbaseItem-value[isinstance][level="${
    //         e.Level - 1
    //       }"]`
    //     )
    // )
    if (delete_list.length > 0) {
      for (let wb of delete_list) {
        let layerCotainer = left_view.querySelector(
          `.col:has(> .layer_wbase_tile[id="wbaseID:${wb.GID}"])`
        )
        layerCotainer.remove()
        wb.value.remove()
      }
      wbase_list = wbase_list.filter(wb =>
        delete_list.every(e => e.GID !== wb.GID)
      )
      let data = {
        enumObj: EnumObj.wBase,
        data: delete_list,
        enumEvent: EnumEvent.delete,
        parentid: select_box_parentID
      }
      handleWbSelectedList()
      updateHoverWbase()
      WiniIO.emitMain(data)
    }
  }

  static async deleteWb({ listWb = [] }) {
    if (listWb.length > 0) {
      $.post(
        '/view/delete-wbase',
        {
          headers: await UserService.headerProject(),
          body: { data: listWb.map(e => e.GID) }
        },
        function (response) {
          const listid = response.data.Data
          if (listid.length > 0) {
            for (let id of listid) {
              let layerCotainer = left_view.querySelector(
                `.col:has(> .layer_wbase_tile[id="wbaseID:${id}"])`
              )
              layerCotainer.remove()
            }
            wbase_list = wbase_list.filter(wb => {
              const check = listid.every(id => id !== wb.GID)
              if (!check) wb.value.remove()
              return check
            })
          }
        }
      )
    }
  }

  static parent(list_wbase_item) {
    // if (!WBaseDA.isCtrlZ) {
    //   clearActionListFrom(action_index)
    //   addAction()
    // }
    let data = {
      enumObj: EnumObj.wBase,
      data: list_wbase_item,
      enumEvent: EnumEvent.parent,
      parentid: select_box_parentID
    }
    WiniIO.emitMain(data)
  }

  static copy(list_wbase_item) {
    let data = {
      enumObj: EnumObj.wBase,
      enumEvent: EnumEvent.copy
    }
    let minLevel = Math.min(...list_wbase_item.map(e => e.Level))
    let minLevelWbase = list_wbase_item.find(e => e.Level === minLevel)
    if (minLevelWbase.IsCopy) {
      data.parentid =
        minLevelWbase.ParentID === wbase_parentID
          ? null
          : minLevelWbase.ParentID
      data.data = list_wbase_item.map(e => {
        return {
          GID: e.IsCopy ? e.ChildID : e.GID,
          IsCopy: e.IsCopy ?? false,
          IsWini: e.IsWini,
          ListClassName: e.ListClassName,
          Sort: e.Sort,
          Css: e.Css,
          AttributesItem:
            e.value.classList.contains('w-table') && e.IsCopy
              ? e.AttributesItem
              : null
        }
      })
    } else {
      data.parentid = minLevelWbase.GID
      data.data = list_wbase_item.map(e => {
        let attrItem
        if (
          e.value.classList.contains('w-table') &&
          (minLevelWbase === e || e.IsCopy)
        ) {
          if (!e.IsCopy) {
            attrItem = JSON.parse(JSON.stringify(e.AttributesItem))
            for (let altWb of list_wbase_item.filter(wb => wb.IsCopy)) {
              attrItem.Content = attrItem.Content.replace(
                altWb.GID,
                `iscopy-${altWb.ChildID}`
              )
            }
          } else {
            attrItem = e.AttributesItem
          }
        }
        return {
          GID: e.IsCopy ? e.ChildID : e.GID,
          IsCopy: e.IsCopy ?? false,
          IsWini: e.IsWini,
          ListClassName: e.ListClassName,
          Sort: e.Sort,
          Css: e.Css,
          AttributesItem: attrItem
        }
      })
    }
    WiniIO.emitMain(data)
  }

  static editAndDelete(list_wbase_item, enumObj = EnumObj.attribute) {
    let deleteList = list_wbase_item.filter(e => e.IsDeleted)
    wbase_list = wbase_list.filter(e =>
      deleteList.every(
        deleteItem =>
          deleteItem.GID !== e.GID && !e.ListID.includes(deleteItem.GID)
      )
    )
    arrange()
    if (!WBaseDA.isCtrlZ && !list_wbase_item[0].isEditting) {
      clearActionListFrom(action_index)
      addAction()
    }
    let data = {
      enumObj: enumObj,
      data: list_wbase_item,
      enumEvent: EnumEvent.edit_delete
    }
    WiniIO.emitMain(data)
  }

  static addStyle(list_wbase_item, enumObj) {
    if (!WBaseDA.isCtrlZ) {
      clearActionListFrom(action_index)
      addAction()
    }
    let data = {
      enumObj: enumObj ?? EnumObj.style,
      data: list_wbase_item,
      enumEvent: EnumEvent.add
    }
    WiniIO.emitMain(data)
  }

  static changeProperty(list_wbase_item) {
    let data = {
      enumObj: EnumObj.wBase,
      data: list_wbase_item,
      enumEvent: EnumEvent.propertyBase
    }
    WiniIO.emitMain(data)
  }

  static assetsLoading = false
  static getAssetsList(listId, keySearch = '') {
    var url = `WBase/ListAssetsItem?listid=${listId}&keySearch=${keySearch}`
    WiniIO.emitGet(null, url, EnumObj.wBase, EnumEvent.get)
  }

  static reloadAssetsList() {
    assets_list = assets_list.filter(
      e => e.ProjectID && e.PageID !== PageDA.obj.ID
    )
    let localAssets = wbase_list
      .filter(e => e.IsWini)
      .map(e => {
        let jsonE = JSON.parse(JSON.stringify(e))
        jsonE.ProjectID = ProjectDA.obj.ID
        jsonE.PageID = PageDA.obj.ID
        if (jsonE.CateID !== EnumCate.variant) {
          jsonE.value = e.value.cloneNode(true)
          jsonE.value.style = null
        }
        return jsonE
      })
    assets_list.push(...localAssets)
  }

  static async getAssetChildren(parentid) {
    let url = `WBase/GetListChild?listid=${parentid}`
    let result = await $.get(ConfigApi.domainApi + url)
    return result.Data
  }
}

function addAction(enumEvent = EnumEvent.select, enumObj = EnumObj.wBase) {
  clearActionListFrom(action_index)
  let oldData = []
  if (select_box_parentID == wbase_parentID) {
    oldData.push({
      GID: wbase_parentID,
      ListChildID: wbase_list
        .filter(e => e.ParentID === wbase_parentID)
        .map(e => e.GID),
      Level: 0
    })
  }
  oldData.push(
    ...wbase_list
      .filter(
        wbaseItem =>
          wbaseItem.GID === select_box_parentID ||
          selected_list.some(selectItem =>
            wbaseItem.ListID.includes(selectItem.GID)
          )
      )
      .map(wbaseItem => JSON.parse(JSON.stringify(wbaseItem)))
  )
  action_index++
  action_list.push({
    oldData: oldData,
    selected: selected_list.map(wbaseItem =>
      JSON.parse(JSON.stringify(wbaseItem))
    ),
    enumObj: enumObj,
    enumEvent: enumEvent
  })
  if (action_list.length > 50) {
    action_list.shift()
    action_index = action_list.length - 1
  }
  console.log('actionList: ', action_index, action_list)
}

function clearActionListFrom(index = -1) {
  action_index = index
  if (index < 0) action_list = []
  else action_list = action_list.slice(0, index + 1)
}

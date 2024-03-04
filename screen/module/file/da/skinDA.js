class EnumCate {
  static color = 2
  static style = 3
  static typography = 17
  static border = 361
  static effect = 360
  static style_class = 69
}

class StyleDA {
  static cssStyleSheets = []
  static docStyleSheets = []
  static urlCtr = 'Style/'
  static skinProjectID
  static mergeSkins = []
  static objDefault = {
    ID: 0,
    ColorIDs: [],
    TypoIDs: [],
    BorderIDs: [],
    EffectIDs: []
  }
  static listCate = []
  static listColor = []
  static listTypo = []
  static listBorder = []
  static listEffect = []
  static listSkin = []
  static newSkin

  static init(projectItem) {
    if (projectItem) {
      StyleDA.skinProjectID = projectItem.ID
      CateDA.initCate()
    } else {
      let url = StyleDA.urlCtr + 'ListItem'
      WiniIO.emitGet(null, url, EnumObj.style, EnumEvent.init)
    }
  }

  static async initSkin(pid) {
    let result = await getData(ConfigApi.domainApi + `Css/ListSkinItem?pid=${pid}`)
    return result.Data
  }

  static async getById(id) {
    let result = await getData(ConfigApi.domainApi + 'Css/GetListByID' + `?id=${id}`)
    return result.Data
  }

  static async initStyleSheets() {
    let result = await getData(ConfigApi.domainApi + `Css/ListItem?pid=${ProjectDA.obj.ID}`)
    return result
  }

  static async addStyleSheet(cssItem) {
    const res = await postData('/view/add-stylesheet', { data: cssItem })
    if (res.Code === 200) {
      StyleDA.listSkin.push(cssItem)
    }
    return res
  }

  static async editStyleSheet(cssItem) {
    const res = await postData('/view/edit-stylesheet', { data: cssItem })
    if (res.Code === 200) {
      StyleDA.listSkin[StyleDA.listSkin.findIndex(e => e.GID === cssItem.GID)] = cssItem
    }
    return res
  }

  static async deleteStyleSheet(cssItem) {
    const res = await postData('/view/delete-stylesheet', { data: cssItem })
    if (res.Code === 200) {
      StyleDA.listSkin = StyleDA.listSkin.filter(e => e.GID !== cssItem.GID)
    }
    return res
  }

  static getSkinsByListId(listId) {
    let url = StyleDA.urlCtr + `ListByListPid?lid=${listId}`
    WiniIO.emitGet(null, url, EnumObj.style, EnumEvent.get)
  }

  static copySkin(styleCopyItem) {
    let url = StyleDA.urlCtr + 'CopyStyle'
    WiniIO.emitPort(styleCopyItem, url, EnumObj.style, EnumEvent.copy)
  }

  static getListMergeSkin() {
    let url = StyleDA.urlCtr + 'ListMergeItem'
    WiniIO.emitGet(null, url, EnumObj.style, EnumEvent.merge)
  }

  static mergeSkin(styleInitItem) {
    if (styleInitItem.ColorItems?.length > 0) {
      let listMergeColorID = styleInitItem.ColorItems.map(skinItem =>
        skinItem.ListID.split(',')
      ).reduce((a, b) => a.concat(b))
      ColorDA.list = ColorDA.list.filter(skinItem =>
        listMergeColorID.every(id => id != skinItem.GID)
      )
      wbase_list
        .filter(wbaseItem =>
          listMergeColorID.some(
            id => wbaseItem.StyleItem.DecorationItem?.ColorID == id
          )
        )
        .forEach(wbaseItem => {
          let mergeColorSkin = styleInitItem.ColorItems.find(skinItem =>
            skinItem.ListID.includes(wbaseItem.StyleItem.DecorationItem.ColorID)
          )
          wbaseItem.StyleItem.DecorationItem.ColorID = mergeColorSkin.GID
          wbaseItem.StyleItem.DecorationItem.ColorValue = mergeColorSkin.Value
          wbaseItem.value.style.backgroundColor = `#${mergeColorSkin.Value}`
        })
    }
    if (styleInitItem.TextStyleItems?.length > 0) {
      let listMergeTypoID = styleInitItem.TextStyleItems.map(skinItem =>
        skinItem.ListID.split(',')
      ).reduce((a, b) => a.concat(b))
      TypoDA.list = TypoDA.list.filter(skinItem =>
        listMergeTypoID.every(id => id != skinItem.GID)
      )
      wbase_list
        .filter(wbaseItem =>
          listMergeTypoID.some(id => wbaseItem.StyleItem.TextStyleID == id)
        )
        .forEach(wbaseItem => {
          let mergeTypoSkin = styleInitItem.TextStyleItems.find(skinItem =>
            skinItem.ListID.includes(wbaseItem.StyleItem.TextStyleID)
          )
          wbaseItem.StyleItem.TextStyleID = mergeTypoSkin.GID
          wbaseItem.StyleItem.TextStyleItem = mergeTypoSkin
          initWbaseStyle(wbaseItem)
        })
    }
    if (styleInitItem.BorderItems?.length > 0) {
      let listMergeBorderID = styleInitItem.BorderItems.map(skinItem =>
        skinItem.ListID.split(',')
      ).reduce((a, b) => a.concat(b))
      BorderDA.list = BorderDA.list.filter(skinItem =>
        listMergeBorderID.every(id => id != skinItem.GID)
      )
      wbase_list
        .filter(wbaseItem =>
          listMergeBorderID.some(
            id => wbaseItem.StyleItem.DecorationItem?.BorderID == id
          )
        )
        .forEach(wbaseItem => {
          let mergeBorderSkin = styleInitItem.BorderItems.find(skinItem =>
            skinItem.ListID.includes(
              wbaseItem.StyleItem.DecorationItem.BorderID
            )
          )
          wbaseItem.StyleItem.DecorationItem.BorderID = mergeBorderSkin.GID
          wbaseItem.StyleItem.DecorationItem.BorderItem = mergeBorderSkin
          initWbaseStyle(wbaseItem)
        })
    }
    if (styleInitItem.EffectItems?.length > 0) {
      let listMergeEffectID = styleInitItem.EffectItems.map(skinItem =>
        skinItem.ListID.split(',')
      ).reduce((a, b) => a.concat(b))
      EffectDA.list = EffectDA.list.filter(skinItem =>
        listMergeEffectID.every(id => id != skinItem.GID)
      )
      wbase_list
        .filter(wbaseItem =>
          listMergeEffectID.some(
            id => wbaseItem.StyleItem.DecorationItem?.EffectID == id
          )
        )
        .forEach(wbaseItem => {
          let mergeEffectSkin = styleInitItem.EffectItems.find(skinItem =>
            skinItem.ListID.includes(
              wbaseItem.StyleItem.DecorationItem.EffectID
            )
          )
          wbaseItem.StyleItem.DecorationItem.EffectID = mergeEffectSkin.GID
          wbaseItem.StyleItem.DecorationItem.EffectItem = mergeEffectSkin
          initWbaseStyle(wbaseItem)
        })
    }
    let url = StyleDA.urlCtr + 'MergeStyle'
    WiniIO.emitPort(styleInitItem, url, EnumObj.style, EnumEvent.merge)
  }

  static convertInitData(json) {
    StyleDA.listColor = json.ColorItems
    StyleDA.listTypo = json.TextStyleItems
    StyleDA.listBorder = json.BorderItems
    StyleDA.listEffect = json.EffectItems
  }

  static copySkinToProject(json) {
    let newColor = json.ColorItems
    ColorDA.list.push(...newColor)
    let newTypo = json.TextStyleItems
    TypoDA.list.push(...newTypo)
    let newEffect = json.EffectItems
    EffectDA.list.push(...newEffect)
    let newBorder = json.BorderItems
    BorderDA.list.push(...newBorder)
    if (
      newColor.length > 0 ||
      newTypo.length > 0 ||
      newEffect.length > 0 ||
      newBorder.length > 0
    )
      CateDA.convertData(CateDA.list)
    if (selected_list.length == 0) {
      updateUISelectionSkins()
    }
  }
}

class PropertyDA {
  static list = []
  static newProperty = {
    GID: null,
    Name: 'new property',
    BasePropertyItems: null,
    BaseID: null
  }

  static add(propertyItem) {
    if (propertyItem) {
      this.list.push(propertyItem)
      assets_list
        .find(e => e.GID == propertyItem.BaseID)
        .PropertyItems.push(propertyItem)
      WiniIO.emitProperty(propertyItem, EnumEvent.add)
    }
  }

  static edit(propertyItem) {
    if (propertyItem) {
      WiniIO.emitProperty(propertyItem, EnumEvent.edit)
    }
  }

  static delete(propertyItem) {
    if (propertyItem) {
      this.list = this.list.filter(e => e.GID != propertyItem.GID)
      let thisComponent = assets_list.find(e => e.GID == propertyItem.BaseID)
      thisComponent.PropertyItems = thisComponent.PropertyItems.filter(
        e => e.GID != propertyItem.GID
      )
      WiniIO.emitProperty(propertyItem.GID, EnumEvent.delete)
    }
  }
}

class CateDA {
  static list = []
  static parentCateID
  static urlCtr = 'WCategory/'
  static list_color_cate = []
  static list_typo_cate = []
  static list_border_cate = []
  static list_effect_cate = []
  static needInit = false

  static async getAll() {
    const res = await getData('/view/category-getall')
    if (res.Code === 200) {
      CateDA.convertData(res.Data)
    } else {
      toastr["error"](res.Message);
    }
    return res
  }

  static updateUISkin(enumCate, skinID) {
    if (selected_list.length > 0) {
      updateTableSkinBody(enumCate, skinID)
    } else {
      updateUIDesignView()
    }
  }

  static convertData(jsonData) {
    if (jsonData != null) {
      this.list = jsonData
      //
      this.list_color_cate = StyleDA.listSkin.filter(e => e.Type === EnumCate.color && e.CateID != EnumCate.color).filterAndMap(e => e.CateID)
      this.list_color_cate = this.list.filter(e =>
        this.list_color_cate.some(id => {
          if (e.ID == id) {
            e.ParentID = EnumCate.color
            return true
          }
          return false
        })
      )
      //
      this.list_typo_cate = StyleDA.listSkin.filter(e => e.Type === EnumCate.typography && e.CateID != EnumCate.typography).filterAndMap(e => e.CateID)
      this.list_typo_cate = this.list.filter(e =>
        this.list_typo_cate.some(id => {
          if (e.ID == id) {
            e.ParentID = EnumCate.typography
            return true
          }
          return false
        })
      )
      //
      this.list_border_cate = StyleDA.listSkin.filter(e => e.Type === EnumCate.border && e.CateID != EnumCate.border).filterAndMap(e => e.CateID)
      this.list_border_cate = this.list.filter(e =>
        this.list_border_cate.some(id => {
          if (e.ID == id) {
            e.ParentID = EnumCate.border
            return true
          }
          return false
        })
      )
      //
      this.list_effect_cate = StyleDA.listSkin.filter(e => e.Type === EnumCate.effect && e.CateID != EnumCate.effect).filterAndMap(e => e.CateID)
      this.list_effect_cate = this.list.filter(e =>
        this.list_effect_cate.some(id => {
          if (e.ID == id) {
            e.ParentID = EnumCate.effect
            return true
          }
          return false
        })
      )
    }
  }

  static async createSkin(jsonSkin, listName, enumCate) {
    if (listName.length <= 1) {
      if (listName.length == 1 && listName[0].trim() != '') {
        jsonSkin.Name = listName[0]
      } else {
        switch (enumCate) {
          case EnumCate.color:
            jsonSkin.Name = jsonSkin.Css
            break
          case EnumCate.typography:
            jsonSkin.Name = jsonSkin.Css
            break
          case EnumCate.border:
            jsonSkin.Name = jsonSkin.Css
            break
          case EnumCate.effect:
            jsonSkin.Name = jsonSkin.Css
            break
          default:
            break
        }
      }
      jsonSkin.CateID = enumCate
      await StyleDA.addStyleSheet(jsonSkin)
      return jsonSkin
    } else {
      jsonSkin.Name = listName.pop()
      let nameCate = listName.join(' ')
      let cateItem = this.list.find(e => e.ParentID === enumCate && e.Name.toLowerCase() == nameCate.toLowerCase())
      if (cateItem) {
        jsonSkin.CateID = cateItem.ID
        await StyleDA.addStyleSheet(jsonSkin)
        return jsonSkin
      } else {
        StyleDA.newSkin = jsonSkin
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
        jsonSkin.CateID = newCateRes.Data.ID
        await StyleDA.addStyleSheet(jsonSkin)
        return jsonSkin
      }
    }
  }

  static async add(cateItem) {
    const res = await postData('/view/add-category', { data: cateItem })
    debugger
    if (res.Code === 200) {
      this.list.push(res.Data)
    } else {
      toastr["error"](res.Message);
    }
    return res
  }

  static async edit(cateItem) {
    const res = await postData('/view/edit-category', { data: cateItem })
    debugger
    if (res.Code === 200) {
      CateDA.list[CateDA.list.findIndex(e => e.ID === cateItem.ID)] = cateItem
    } else {
      toastr["error"](res.Message);
    }
    return res
  }

  static async delete(cateItem) {
    const res = await postData('/view/delete-project', { data: cateItem })
    debugger
    if (res.Code === 200) {
      CateDA.list = CateDA.list.filter(e => e.ID !== cateItem.ID)
    } else {
      toastr["error"](res.Message);
    }
    return res
  }
}

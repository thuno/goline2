function setupLeftView() {
  document.querySelector('#btn_select_page > .comp-text').innerHTML = PageDA.obj.Name
  $('body').on('click', '#btn_select_page', function (ev) {
    let suffixIcon = ev.target.querySelector('i')
    if (div_list_page.style.display === 'none') {
      suffixIcon.className = suffixIcon.className.replace('fa-chevron-down', 'fa-chevron-up')
      div_list_page.style.display = 'flex'
      if (assets_view.offsetWidth > 0) leftTabChange('Layer')
    } else {
      suffixIcon.className = suffixIcon.className.replace('fa-chevron-up', 'fa-chevron-down')
      div_list_page.style.display = 'none'
    }
  })
  let div_list_page = document.getElementById('div_list_page')
  $(div_list_page).on('click', '.header > .fa-plus', function () {
    let newName = `Module ${PageDA.list.length + 1}`
    PageDA.list.forEach(e => {
      if (e.Name === newName) {
        newName = `Module ${PageDA.list.length + 2}`
      }
    })
    let newPage = {
      ID: 0,
      Name: newName,
      ProjectID: ProjectDA.obj.ID
    }
    PageDA.add(newPage)
  })
  div_list_page
    .querySelector(':scope > .col')
    .replaceChildren(...PageDA.list.map(pageItem => createPageTile(pageItem)))
  // add event unfocus when click white space
  layer_view.onclick = function (event) {
    if (event.target.readOnly) event.target.blur()
    else if (event.target.id === 'Layer') handleWbSelectedList()
  }
  document.getElementById('layer-search').onclick = showSearchResult
  // div contain all wbase_item as list tile
  replaceAllLyerItemHTML()
  observer_listPage.observe(div_list_page)
  $('body').on('click', '.tab_left', function () {
    leftTabChange(this.innerHTML)
  })
}

function showSearchResult() {
  leftTabChange('Layer')
  let searchFilter = 0
  let filterBy = [
    0, // all
    -1, //base component
    -2, // search by text content
    -3, // local component
    'w-text',
    'w-rect',
    'w-container',
    'w-variant'
  ]
  let searchContainer = document.createElement('div')
  searchContainer.className = 'col'
  searchContainer.style.background = 'white'
  let searchHeader = document.createElement('div')
  searchHeader.className = 'row search-header'
  let glassIcon = document.createElement('i')
  glassIcon.className = 'fa-solid fa-magnifying-glass fa-xs'
  let inputBar = document.createElement('input')
  inputBar.oninput = function (e) {
    e.stopPropagation()
    let filterList = []
    switch (searchFilter) {
      case 0:
        filterList = wbase_list.filter(wb =>
          Ultis.toSlug(wb.Name.toLowerCase()).includes(
            Ultis.toSlug(this.value.toLowerCase())
          )
        )
        break
      case -1:
        filterList = wbase_list.filter(wb => Ultis.toSlug(wb.Name.toLowerCase()).includes(Ultis.toSlug(this.value.toLowerCase())))
        break
      case -2:
        filterList = wbase_list.filter(
          wb =>
            wb.value.classList.contains('w-text') &&
            wb.AttributesItem.Content.toLowerCase().includes(Ultis.toSlug(this.value.toLowerCase()))
        )
        break
      case -3:
        filterList = wbase_list.filter(wb => wb.IsWini)
        break
      default:
        filterList = wbase_list.filter(
          wb => wb.value.classList.contains(searchFilter) &&
            Ultis.toSlug(wb.Name.toLowerCase()).includes(Ultis.toSlug(this.value.toLowerCase()))
        )
        break
    }
    searchBody.replaceChildren(
      ...filterList.reverse().map(wb => {
        let result = document.createElement('div')
        result.className = 'layer-search-result row'
        let cateImg = document.createElement('img')
        if (wb.IsWini && !wb.value.classList.contains('w-variant')) {
          cateImg.src = 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/component.svg'
        } else if (wb.value.classList.contains('w-container')) {
          cateImg.src = 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/frame_black.svg'
        } else if (wb.value.classList.contains('w-rect')) {
          cateImg.src = 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/rectangle_black.svg'
        } else if (wb.value.classList.contains('w-text')) {
          cateImg.src = 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/text_black.svg'
        } else if (wb.value.classList.contains('w-variant')) {
          cateImg.src = 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/multiple_component.svg'
        } else {
          cateImg.src = 'https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/base_component_black.svg'
        }
        cateImg.style.width = '16px'
        cateImg.style.height = '16px'
        cateImg.ondblclick = function (ev) {
          ev.stopPropagation()
          let objCenter = document.getElementById(wb.GID)
          let centerRect = objCenter.getBoundingClientRect()
          centerRect = offsetScale(
            centerRect.x + centerRect.width / 2,
            centerRect.y + centerRect.height / 2
          )
          divSection.style.transition = '1s'
          scrollbdClick(
            centerRect.x,
            centerRect.y,
            objCenter.offsetWidth,
            objCenter.offsetHeight
          )
          divSection.style.transition = 'none'
          updateHoverWbase()
          PageDA.saveSettingsPage()
          if (wb.value.classList.contains('w-textfield')) {
            handleWbSelectedList([wbase_list.find(ele => ele.GID === wb.ParentID)])
          } else {
            handleWbSelectedList([wb])
          }
          searchBody
            .querySelectorAll('.layer-search-result')
            .forEach(searchR => {
              searchR.style.backgroundColor = 'transparent'
            })
          result.style.backgroundColor = '#e6f7ff'
        }
        let titleCol = document.createElement('div')
        titleCol.className = 'col'
        let wbName = document.createElement('p')
        wbName.className = 'regular1'
        wbName.innerHTML = wb.Name
        titleCol.appendChild(wbName)
        if (wb.Level > 1) {
          let wbPName = document.createElement('p')
          wbPName.className = 'regular11'
          wbPName.innerHTML = document.getElementById('inputName:' + wb.ListID.split(',')[1]).value
          titleCol.appendChild(wbPName)
        }
        result.replaceChildren(cateImg, titleCol)
        result.ondblclick = function () {
          $(cateImg).trigger('dblclick')
          searchContainer.remove()
        }
        if (selected_list.some(ele => ele.GID === wb.GID))
          result.style.backgroundColor = '#e6f7ff'
        return result
      })
    )
  }
  inputBar.className = 'search-input regular1'
  inputBar.placeholder = 'Find...'
  let filterIcon = document.createElement('i')
  filterIcon.className = 'fa-solid fa-sliders fa-xs'
  filterIcon.onclick = function () {
    setTimeout(function () {
      let filterPopup = document.createElement('div')
      filterPopup.className = 'wini_popup popup_remove col search-filter-popup'
      let offset = filterIcon.getBoundingClientRect()
      filterPopup.style.left = offset.x + 'px'
      filterPopup.style.top = offset.y + offset.height + 'px'
      filterPopup.replaceChildren(
        ...filterBy.map(num => {
          let option = document.createElement('div')
          option.className = 'row'
          let checkMark = document.createElement('i')
          checkMark.className = 'fa-solid fa-check fa-xs'
          let type = document.createElement('p')
          type.className = 'regular1'
          switch (num) {
            case 0:
              type.innerHTML = 'All'
              break
            case -1:
              type.innerHTML = 'Base component'
              break
            case -2:
              type.innerHTML = 'Text content'
              break
            case -3:
              type.innerHTML = 'Local component'
              break
            case 'w-text':
              type.innerHTML = 'Text'
              break
            case 'w-rect':
              type.innerHTML = 'Rectangle'
              break
            case 'w-container':
              type.innerHTML = 'Frame'
              break
            case 'w-variant':
              type.innerHTML = 'Variant'
              break
            default:
              break
          }
          if (num !== searchFilter) checkMark.style.visibility = 'hidden'
          option.replaceChildren(checkMark, type)
          option.onclick = function (evt) {
            evt.stopPropagation()
            searchFilter = num
            filterPopup.remove()
            $(inputBar).trigger('input')
          }
          return option
        })
      )
      document.getElementById('body').appendChild(filterPopup)
    }, 150)
  }
  let xIcon = document.createElement('i')
  xIcon.className = 'fa-solid fa-xmark fa-sm'
  xIcon.onclick = function () {
    searchContainer.remove()
  }
  searchHeader.replaceChildren(glassIcon, inputBar, filterIcon, xIcon)
  let searchBody = document.createElement('div')
  searchBody.className = 'col search-body'
  searchContainer.replaceChildren(searchHeader, searchBody)
  left_view.appendChild(searchContainer)
  inputBar.focus()
}

function replaceAllLyerItemHTML() {
  let show_list_tile = document.getElementById(`parentID:${wbase_parentID}`)
  let list_level1 = wbase_list
    .filter(e => e.ParentID === wbase_parentID)
    .sort((a, b) => $(b.value).index() - $(a.value).index())
  let isReplace = show_list_tile.childElementCount > 0
  let fragment = document.createDocumentFragment()
  fragment.replaceChildren(
    ...list_level1.map(wb => {
      let isShowChildren = false
      if (isReplace) {
        isShowChildren = document.getElementById(`pefixAction:${wb.GID}`)
        if (isShowChildren) {
          isShowChildren = isShowChildren.className.includes('fa-caret-down')
        }
      }
      return createLayerTile(wb, isShowChildren)
    })
  )
  show_list_tile.replaceChildren(fragment)
}

// handle tab change
function leftTabChange(tabName) {
  tabName = tabName.trim()
  let x = document.getElementsByClassName('left_tab_view')
  for (let i = 0; i < x.length; i++) {
    x[i].style.display = 'none'
  }
  document.getElementById(tabName).style.display = 'block'
  let list_tab_view = document.getElementsByClassName('tab_left')
  for (let tab of list_tab_view) {
    tab.style.opacity = tab.innerHTML == tabName ? 1 : 0.7
  }
  if (tabName === 'Layer') {
    document.querySelectorAll(`style[export="true"]`).forEach(e => e.remove())
  } else {
    assets_view.style.display = 'flex'
    let btn_select_page = document.getElementById('btn_select_page')
    let btnIcon = btn_select_page.querySelector(':scope > i')
    btnIcon.className = btnIcon.className.replace('fa-chevron-up', 'fa-chevron-down')
    document.getElementById('div_list_page').style.display = 'none'
    select_component = null
    initUIAssetView()
  }
}

function createPageTile(pageItem) {
  let pageTile = document.createElement('div')
  pageTile.id = `pageID:${pageItem.ID}`
  pageTile.className = 'page_item_tile row'
  let prefixIcon = document.createElement('i')
  prefixIcon.className = 'fa-solid fa-check fa-sm'
  if (pageItem.ID !== PageDA.obj.ID) {
    prefixIcon.style.visibility = 'hidden'
  }
  pageTile.appendChild(prefixIcon)
  let inputPageName = document.createElement('input')
  inputPageName.className = 'inputPageName regular1'
  pageTile.appendChild(inputPageName)
  inputPageName.readOnly = true
  inputPageName.value = pageItem.Name
  if (PageDA.enableEdit) {
    inputPageName.ondblclick = function () {
      this.style.cursor = 'text'
      this.style.outline = '0.2rem solid #1890FF'
      this.readOnly = false
      this.setSelectionRange(0, this.value.length)
      this.focus()
    }
    inputPageName.onblur = function () {
      this.style.cursor = 'context-menu'
      this.readOnly = true
      this.style.outline = 'none'
      this.setSelectionRange(0, 0)
      let thisPage = PageDA.list.find(
        e => e.ID == pageTile.id.replace('pageID:', '')
      )
      if (thisPage && thisPage.Name != this.value.trim()) {
        thisPage.Name = this.value.trim()
        PageDA.edit(thisPage)
      }
    }
    pageTile.onauxclick = function (e) {
      e.stopPropagation()
      hidePopup(e)
      let popupPage = document.createElement('div')
      popupPage.className = 'popupEditOrDelete col wini_popup popup_remove'
      popupPage.style.left = e.pageX + 'px'
      popupPage.style.top = e.pageY + 'px'
      let optionEdit = document.createElement('div')
      optionEdit.innerHTML = 'Edit'
      optionEdit.onclick = function (e) {
        e.stopPropagation()
        popupPage.remove()
        inputPageName.style.cursor = 'text'
        inputPageName.style.outline = '2px solid #1890FF'
        inputPageName.readOnly = false
        inputPageName.setSelectionRange(0, inputPageName.value.length)
        inputPageName.focus()
      }
      popupPage.appendChild(optionEdit)
      if (PageDA.list.length > 1) {
        let optionDelete = document.createElement('div')
        optionDelete.innerHTML = 'Delete'
        optionDelete.onclick = function (e) {
          e.stopPropagation()
          popupPage.remove()
          let pageItem = PageDA.list.find(
            e => e.ID == pageTile.id.replace('pageID:', '')
          )
          if (pageItem) {
            PageDA.delete(pageItem)
          }
        }
        popupPage.appendChild(optionDelete)
      }
      document.getElementById('body').appendChild(popupPage)
    }
  }
  pageTile.onclick = function (e) {
    e.stopPropagation()
    PageDA.selectPage(
      PageDA.list.find(e => e.ID == this.id.replace('pageID:', ''))
    )
  }
  return pageTile
}

// create layer tile depend wbaseItem
function createLayerTile(wb, isShowChildren = false) {
  let layerContainer = document.createElement('div')
  layerContainer.className = 'col'
  let wbase_tile = document.createElement('div')
  wbase_tile.id = `wbaseID:${wb.GID}`
  wbase_tile.className = 'layer_wbase_tile ' + wb.ListClassName.split(' ')[1]
  wbase_tile.style.setProperty('--spacing', `${(wb.Level - 1) * 16}px`)
  if (wb.IsWini) {
    wbase_tile.setAttribute('iswini', wb.IsWini)
  } else if (wb.IsInstance) {
    wbase_tile.setAttribute('isinstance', wb.IsInstance)
  }
  let isShowListChid = isShowChildren
  wbase_tile.innerHTML = `<i class="fa-solid fa-caret-${isShowListChid ? 'down' : 'right'
    } fa-xs prefix-btn" style="margin-left: ${(wb.Level - 1) * 16}px"></i>
  <img/><input id="inputName:${wb.GID}" readonly value="${wb.Name
    }"/><i class="fa-solid fa-lock fa-xs is-lock"></i>`
  layerContainer.appendChild(wbase_tile)

  $(wbase_tile).on('click', '.prefix-btn', function () {
    isShowListChid = !this.className.includes('down')
    if (isShowListChid) {
      this.className = this.className.replace('right', 'down')
    } else {
      this.className = this.className.replace('down', 'right')
    }
  })

  $(wbase_tile).on('dblclick', 'img', function (e) {
    e.stopPropagation()
    let objCenter = document.getElementById(wb.GID)
    let centerRect = objCenter.getBoundingClientRect()
    centerRect = offsetScale(
      centerRect.x + centerRect.width / 2,
      centerRect.y + centerRect.height / 2
    )
    divSection.style.transition = '1s'
    scrollbdClick(
      centerRect.x,
      centerRect.y,
      objCenter.offsetWidth,
      objCenter.offsetHeight
    )
    divSection.style.transition = null
    updateHoverWbase()
    PageDA.saveSettingsPage()
    if (!wbase_tile.classList.contains('w-textfield'))
      handleWbSelectedList([wb])
  })
  //

  if (WbClass.parent.some(e => wbase_tile.classList.contains(e))) {
    let wbChildren = wbase_list.filter(e => e.ParentID === wb.GID)
    if (wbChildren.length > 0) {
      let childrenLayer = document.createElement('div')
      layerContainer.appendChild(childrenLayer)
      childrenLayer.id = `parentID:${wb.GID}`
      childrenLayer.className = 'col'
      if (wb.value.classList.contains('w-block')) {
        wbChildren = wbChildren.sort(
          (a, b) =>
            window.getComputedStyle(a.value).zIndex -
            window.getComputedStyle(b.value).zIndex
        )
        wb.value.replaceChildren(...wbChildren.map(e => e.value))
        wbChildren = wbChildren.reverse()
      } else {
        wbChildren = wbChildren.sort(
          (a, b) =>
            window.getComputedStyle(a.value).order -
            window.getComputedStyle(b.value).order
        )
        wbChildren[0].value.parentElement.replaceChildren(
          ...wbChildren.map(e => e.value)
        )
      }
      let fragment = document.createDocumentFragment()
      fragment.replaceChildren(...wbChildren.map(cWb => createLayerTile(cWb)))
      childrenLayer.replaceChildren(fragment)
    }
  }
  wbase_tile.onmouseover = function () {
    if (!sortLayer && !left_view.resizing) updateHoverWbase(wb)
  }
  wbase_tile.onmouseout = function () {
    if (!sortLayer && !left_view.resizing) updateHoverWbase()
  }
  if (!wbase_tile.classList.contains('w-textfield')) {
    if (wb.IsShow) {
      wbase_tile.querySelector('.is-lock').className =
        'fa-solid fa-lock-open fa-xs is-lock'
    } else {
      layerContainer.querySelectorAll('.is-lock').forEach(lockBtn => {
        if (lockBtn !== wbase_tile.querySelector('.is-lock')) {
          lockBtn.className = 'fa-solid fa-lock fa-xs is-lock'
        }
      })
    }
    wbase_tile.onclick = function () {
      if (!sortLayer && !left_view.resizing) handleWbSelectedList([wb])
    }
    // $(wbase_tile).on('click', '.is-lock', function () {
    //   if (!sortLayer && !left_view.resizing) {
    //     let listUpdate = []
    //     wb.IsShow = !wb.IsShow
    //     if (wb.IsShow) {
    //       wb.value.removeAttribute('lock')
    //       this.className = 'fa-solid fa-lock-open fa-xs is-lock'
    //       layerContainer.querySelectorAll('.is-lock').forEach(lockBtn => {
    //         let tile = lockBtn.closest('.layer_wbase_tile:not(.w-textfield)')
    //         if (tile) {
    //           lockBtn.className = 'fa-solid fa-lock-open fa-xs is-lock'
    //           lockBtn.style.pointerEvents = 'auto'
    //           listUpdate.push(tile.id.replace('wbaseID:', ''))
    //         }
    //       })
    //       listUpdate = wbase_list.filter(e => {
    //         if (listUpdate.some(id => e.GID === id)) {
    //           e.value.removeAttribute('lock')
    //           e.IsShow = true
    //           return true
    //         } else {
    //           return false
    //         }
    //       })
    //     } else {
    //       wb.value.setAttribute('lock', 'true')
    //       this.className = 'fa-solid fa-lock fa-xs is-lock'
    //       layerContainer.querySelectorAll('.is-lock').forEach(lockBtn => {
    //         if (lockBtn !== this) {
    //           lockBtn.className = 'fa-solid fa-lock fa-xs is-lock'
    //           lockBtn.style.pointerEvents = 'none'
    //         }
    //       })
    //     }
    //     listUpdate.push(wb)
    //     WBaseDA.edit(listUpdate, EnumObj.wBase)
    //   }
    // })
  }
  $(wbase_tile).on('dblclick', 'input', function () {
    if (PageDA.enableEdit) {
      this.style.cursor = 'text'
      this.style.outline = `1.5px solid ${wb.IsWini ||
        wb.IsInstance ||
        $(wbase_tile).parents(
          `.col:has(> .layer_wbase_tile[iswini], layer_wbase_tile[isinstance])`
        ).length
        ? '#7B61FF'
        : '#1890FF'
        }`
      this.readOnly = false
      this.setSelectionRange(0, this.value.length)
      this.focus()
    } else return
  })
  $(wbase_tile).on('blur', 'input', function () {
    if (!sortLayer && !this.readOnly) {
      this.style.cursor = 'auto'
      this.style.outline = 'none'
      this.readOnly = true
      window.getSelection().removeAllRanges()
      if (wb.Name != this.value) {
        wb.Name = this.value
        WBaseDA.edit([wb], EnumObj.wBase)
      }
    }
  })

  return layerContainer
}

var select_component
async function initUIAssetView() {
  let scrollView = assets_view.querySelector(':scope > .col > .col')
  let scrollY = scrollView?.scrollTop ?? 0
  let comContainer = document.createElement('div')
  comContainer.className = 'col'
  comContainer.innerHTML = `<div class="row" style="width: 100%">
      <input class="search-assets semibold1" placeholder="Search assets..."/>
      <i class="fa-solid fa-list-ul row center box16" style="font-size: 1.2rem; color: #262626"></i>
      <i class="fa-brands fa-readme row center box16" style="font-size: 1.2rem; color: #262626"></i>
    </div><div class="col" style="flex: 1; overflowY: scroll"></div>`
  let instContainer = document.createElement('div')
  instContainer.className = 'instance-container'

  // create list component tile assets view
  let onSearch = 0
  $(comContainer).on('input', '.search-assets', function (ev) {
    ev.stopPropagation()
    onSearch = 0
    setTimeout(function () {
      if (onSearch === 1) {
        onSearch++
        let content = search_input.value
          .split(' ')
          .filter(text => text != '')
          .join(' ')
        content = Ultis.toSlug(content)
        let isContainLocal = false
        updateListComponentByProject(ProjectDA.obj)
        let componentTileList = [
          ...document
            .getElementById(`component projectID:${ProjectDA.obj.ID}`)
            .querySelectorAll('.assets-component-tile')
        ].reverse()
        componentTileList.forEach(comTile => {
          let thisComponent = assets_list.find(com => com.GID === comTile.id.replace('Component:', ''))
          if (content.split('-').some(key => thisComponent.Name.toLowerCase().includes(key))) {
            let listTiles = [...$(comTile).parents('.list_tile')]
            listTiles.forEach(parentTile => {
              let pre = parentTile.querySelector(':scope > .fa-caret-right')
              if (pre) pre.className = 'fa-solid fa-caret-down fa-xs'
            })
            isContainLocal = true
            comTile
              .querySelectorAll('.assets-component-tile')
              .forEach(childComTile => {
                let parentTiles = [...$(childComTile).parents('.list_tile')]
                parentTiles.forEach(pTile => {
                  let pre = pTile.querySelector(':scope > .fa-caret-right')
                  if (pre) pre.className = 'fa-solid fa-caret-down fa-xs'
                })
              })
          }
        })
        if (!isContainLocal) updateListComponentByProject(ProjectDA.obj, false)
        if (content.length > 3) {
          if (ProjectDA.obj.ListID && ProjectDA.obj.ListID.trim() != '') {
            let _listID = ProjectDA.obj.ListID
            if (PageDA.list.length > 1) _listID += `,${ProjectDA.obj.ID}`
            WBaseDA.getAssetsList(_listID, content)
          }
        } else if (content.length == 0) {
          assets_view
            .querySelectorAll('.list_tile > i')
            .forEach(
              prefixIcon =>
              (prefixIcon.className = prefixIcon.className.replace(
                'fa-caret-down',
                'fa-caret-right'
              ))
            )
          initUIAssetView()
          document.getElementById('search_input_assets').focus()
        }
      }
    }, 200)
    onSearch++
  })
  $(comContainer).on('click', '.fa-readme', function () {
    if (WBaseDA.assetsLoading) {
      WBaseDA.getAssetsList()
    } else {
      linkComptAndSkinDialog()
    }
  })
  let fragment = document.createDocumentFragment()
  fragment.replaceChildren(
    ...[
      { ID: 0 },
      ...ProjectDA.list.filter(
        e =>
          e.ID === ProjectDA.obj.ID ||
          ProjectDA.obj.ListID?.split(',')?.includes(`${e.ID}`)
      )
    ].map(projectItem => createListComponent(projectItem))
  )
  comContainer.querySelector(':scope > .col').replaceChildren(fragment)
  assets_view.replaceChildren(comContainer, instContainer)
  comContainer.querySelector(':scope > .col').scrollTo({
    top: scrollY,
    behavior: 'smooth'
  })
}

// create list component depend on projectId
function createListComponent(projectItem, isShowContent) {
  let currentListTile = document.getElementById(
    `component projectID:${projectItem.ID}`
  )
  let isShow = false
  if (isShowContent != null) {
    isShow = isShowContent
  } else if (currentListTile) {
    isShow =
      currentListTile.querySelector('.list_tile > .fa-caret-down') != undefined
  }
  let container = document.createElement('div')
  container.id = `component projectID:${projectItem.ID}`
  container.className = 'col'
  let list_tile = document.createElement('div')
  list_tile.className = 'list_tile row semibold1'
  list_tile.innerHTML = `<i class="fa-solid fa-caret-${isShow ? 'down' : 'right'
    }"></i><p class="title">${projectItem.ID === 0
      ? 'Selected objects'
      : projectItem.ID === ProjectDA.obj.ID
        ? 'Local components'
        : projectItem.Name
    }</p>`
  let prefix_action = list_tile.querySelector('i')
  let container_child = document.createElement('div')
  container_child.className = 'col'
  container.replaceChildren(list_tile, container_child)
  let listParentComp = []
  if (projectItem.ID === 0 || isShow) {
    if (projectItem.ID === 0) {
      listParentComp = selected_list
        .filter(
          e => e.IsWini ||
            !e.value.closest(`.wbaseItem-value[iswini], .wbaseItem-value[isinstance][level="${e.Level - 1}"]`)
        )
        .map(e => {
          let jsonE = JSON.parse(JSON.stringify(e))
          jsonE.ProjectID = 0
          jsonE.value = e.value.cloneNode(true)
          return jsonE
        })
      container_child.replaceChildren(
        ...listParentComp.map(comItem => createComponentTile(comItem))
      )
    }
  }
  list_tile.onclick = function () {
    if (prefix_action.classList.contains('fa-caret-down')) {
      prefix_action.className = 'fa-solid fa-caret-right fa-xs'
    } else if (projectItem.ID === 0) {
      prefix_action.className = 'fa-solid fa-caret-down fa-xs'
    } else if (list_tile.querySelector(':scope > .data-loader')) {
      prefix_action.className = 'fa-solid fa-caret-down fa-xs'
      list_tile
        .querySelector(':scope > .data-loader')
        .replaceWith(prefix_action)
      if (projectItem.ID === ProjectDA.obj.ID) {
        container_child.replaceChildren(
          ...PageDA.list.map(page => {
            let listPageComp = assets_list.filter(e => e.PageID === page.ID)
            let showPageCom = isShowContent || listPageComp.some(e => e.GID === select_component?.GID)
            let pageTileContainer = document.createElement('div')
            pageTileContainer.className = 'col page-comp-container'
            let pageTile = document.createElement('div')
            pageTile.className = 'row list_tile'
            pageTile.innerHTML = `<i class="fa-solid fa-caret-${showPageCom ? 'down' : 'right'} fa-xs"></i><p class="semibold1 title">${page.Name}</p>`
            let listComp = document.createElement('div')
            listComp.className = 'col'
            if (showPageCom) {
              listComp.replaceChildren(...listPageComp.map(comItem => createComponentTile(comItem)))
            }
            pageTileContainer.replaceChildren(pageTile, listComp)
            pageTile.onclick = function () {
              showPageCom = !showPageCom
              if (showPageCom) {
                pageTile.querySelector('i').className = 'fa-solid fa-caret-down fa-xs'
                listComp.replaceChildren(...listPageComp.map(comItem => createComponentTile(comItem)))
              } else {
                pageTile.querySelector('i').className = 'fa-solid fa-caret-right fa-xs'
              }
            }
            return pageTileContainer
          })
        )
      } else {
        listParentComp = assets_list.filter(e => e.ProjectID === projectItem.ID && e.IsWini)
        listParentComp = listParentComp.filter(
          e => e.ListClassName.includes('w-variant') || listParentComp.every(i => i.GID !== e.ParentID)
        )
        container_child.replaceChildren(...listParentComp.map(comItem => createComponentTile(comItem)))
      }
    } else {
      WBaseDA.assetsLoading = true
      let loader = document.createElement('div')
      loader.style.setProperty('--border-width', '3px')
      loader.style.width = '10px'
      loader.style.margin = '0 4px'
      loader.className = 'data-loader'
      prefix_action.replaceWith(loader)
      StyleDA.initSkin(projectItem.ID).then(skinRes => {
        let instContainer = assets_view.querySelector('.instance-container')
        instContainer.style = null
        skinRes.forEach(e => instContainer.style.setProperty(`--${e.GID}`, e.Css))
      })
      WBaseDA.getAssetsList(projectItem.ID)
    }
  }
  return container
}

function updateListComponentByProject(projectItem, isShow = true) {
  let newListComponent = createListComponent(projectItem, isShow)
  document
    .getElementById(`component projectID:${projectItem.ID}`)
    .replaceWith(newListComponent)
  WBaseDA.assetsLoading = false
}

// create component tile
function createComponentTile(item, space = 0) {
  let container = document.createElement('div')
  container.id = `Component:${item.GID}`
  container.className = 'col assets-component-tile'
  let select_tile = document.createElement('div')
  select_tile.className = 'row list_tile'
  select_tile.style.paddingLeft = `${16 + (space ? space : 24)}px`
  container.appendChild(select_tile)
  let prefix_action = document.createElement('i')
  prefix_action.className = 'fa-solid fa-caret-right fa-xs'
  select_tile.appendChild(prefix_action)
  let title = document.createElement('p')
  title.innerHTML = `${item.Name}`
  title.className = 'title'
  select_tile.appendChild(title)
  if (item.ListClassName.includes('w-variant')) {
    let currentTile = document.getElementById(`Component:${item.GID}`)
    let isShow = false
    if (currentTile) {
      isShow = currentTile.querySelector(':scope > .list_tile > .fa-caret-right') != null
    }
    if (isShow) {
      prefix_action.className = 'fa-solid fa-caret-down fa-xs'
    }
    let container_child = document.createElement('div')
    container_child.className = 'col'
    container.appendChild(container_child)
    if (item.ProjectID === 0) {
      var children = wbase_list.filter(e => e.ParentID === item.GID)
    } else {
      children = assets_list.filter(e => e.ParentID === item.GID)
    }
    for (let i = 0; i < children.length; i++) {
      let result = createComponentTile(children[i], 8)
      container_child.appendChild(result)
    }
    select_tile.onclick = function () {
      isShow = !isShow
      if (isShow) {
        prefix_action.className = 'fa-solid fa-caret-down fa-xs'
      } else {
        prefix_action.className = 'fa-solid fa-caret-right fa-xs'
      }
    }
  } else {
    select_tile.onclick = function () {
      if (!select_tile.classList.contains('comp-selected'))
        assets_view.querySelectorAll('.list_tile').forEach(e => {
          if (e === select_tile) {
            e.classList.add('comp-selected')
          } else {
            e.classList.remove('comp-selected')
          }
        })
      if (item.ProjectID === 0) {
        showInstanceDemo({ wb: item })
        select_component = item
      } else {
        if (item.PageID === PageDA.obj.ID) {
          showInstanceDemo({
            wb: { ...item, value: divSection.querySelector(`.wbaseItem-value[id="${item.GID}"]`).cloneNode(true) }
          })
          select_component = item
        } else {
          let loader = document.createElement('div')
          loader.style.setProperty('--border-width', '3px')
          loader.style.width = '10px'
          loader.style.margin = '0 4px'
          loader.className = 'data-loader'
          prefix_action.replaceWith(loader)
          WBaseDA.getAssetChildren(item.GID).then(async result => {
            let cloneItem = JSON.parse(JSON.stringify(item))
            if (cloneItem.ProjectID !== ProjectDA.obj.ID) {
              let cssRule = await StyleDA.getById(cloneItem.GID)
              var relativeList = initDOM([...result, cloneItem]).map(e => {
                let eClassList = e.ListClassName.split(' ')
                const clsName = eClassList.find(vl => vl.startsWith('w-st'))
                if (clsName) {
                  const ruleRegex = new RegExp(`.${clsName}[^}]+`, 'g')
                  if (e.Css) {
                    e.Css = e.Css.split(';').filter(vl => !vl.match(/(width:|height:|flex:)/g)).join(';')
                    e.Css += cssRule.Css.match(ruleRegex)[0].replace(`.${clsName} {`, '').trim()
                  } else {
                    e.Css = cssRule.Css.match(ruleRegex)[0].replace(`.${clsName} {`, '').trim()
                  }
                  e.ListClassName = eClassList.filter(vl => vl !== clsName).join(' ')
                }
                delete e.value
                return e
              })
            } else {
              relativeList = initDOM([...result, cloneItem]).map(e => {
                delete e.value
                return e
              })
            }
            arrange(relativeList)
            showInstanceDemo({ wb: cloneItem, children: relativeList })
            select_component = cloneItem
            relativeList.pop()
            select_component.children = relativeList
            loader.replaceWith(prefix_action)
          })
        }
      }
    }
  }
  return container
}

function showInstanceDemo({ wb, children }) {
  let instContainer = assets_view.querySelector('.instance-container')
  let instance_demo = document.createElement('div')
  instance_demo.className = 'instance_demo'
  if (children) {
    for (let wbItem of [...children, wb]) {
      initComponents(wbItem, children.filter(e => e.ParentID === wbItem.GID))
    }
    var demoValue = wb.value
  } else {
    demoValue = wb.value
  }
  demoValue.id = uuidv4()
  demoValue.removeAttribute('parentid')
  demoValue.querySelectorAll('.wbaseItem-value').forEach(e => {
    e.id = uuidv4()
    e.removeAttribute('parentid')
  })
  demoValue.style.left = null
  demoValue.style.top = null
  demoValue.style.right = null
  demoValue.style.bottom = null
  demoValue.style.transform = null
  demoValue.setAttribute('projectid', wb.ProjectID)
  instance_demo.appendChild(demoValue)
  instContainer.replaceChildren(instance_demo)
  observer_instance.observe(instance_demo)
}

const observer_instance = new ResizeObserver(entries => {
  entries.forEach(entry => {
    let instance_demo = entry.target
    let instance_value = instance_demo.firstChild
    if (instance_value) {
      let scale =
        instance_value.offsetHeight > instance_value.offsetWidth
          ? (entry.contentRect.width - 16) / instance_value.offsetHeight
          : (entry.contentRect.width - 16) / instance_value.offsetWidth
      instance_value.style.transform = `scale(${scale}) translate(calc(-50% / ${scale}),calc(-50% / ${scale}))`
      instance_value.style.position = 'absolute'
      instance_demo.style.height = entry.contentRect.width + 'px'
    }
  })
})

const observer_listPage = new ResizeObserver(entries => {
  entries.forEach(entry => {
    let listPageHTML = entry.target
    let listLayerHTML = document.getElementById(`parentID:${wbase_parentID}`)
    listLayerHTML.style.height = `calc(100% - ${listPageHTML.offsetHeight}px)`
  })
})

function ondragSortLayer(event) {
  console.log('drag sort layer update')
  let wb = selected_list[0]
  let wbLayer = document.getElementById(`wbaseID:${wb.GID}`)
  const sortComInstance = wb.value.closest(
    `.wbaseItem-value[iswini][level="${wb.Level - 1}"], .wbaseItem-value[isinstance][level="${wb.Level - 1}"]`
  )
  const layerP = sortComInstance ? document.getElementById(`parentID:${select_box_parentID}`) : left_view
  let listLayer = [...layerP.querySelectorAll('.layer_wbase_tile')].filter(e => {
    const check = e.offsetHeight > 0 && !wbLayer.nextSibling?.contains(e) && wbLayer !== e
    e.classList.remove('onsort')
    e.removeAttribute('sort-position')
    return check
  }
  )
  if (listLayer.length > 1) {
    let closestLayer = listLayer.sort((a, b) => {
      let rectA = a.getBoundingClientRect()
      let distanceA = Math.abs(event.pageY - (rectA.y + rectA.height / 2))
      let rectB = b.getBoundingClientRect()
      let distanceB = Math.abs(event.pageY - (rectB.y + rectB.height / 2))
      return distanceA - distanceB
    })[0]
    let openedLayer = left_view.querySelector('.layer_wbase_tile.opened')
    if (openedLayer && openedLayer !== closestLayer &&
      !openedLayer.nextSibling?.contains(closestLayer)
    ) {
      openedLayer.classList.remove('opened')
    }
    let layerRect = closestLayer.getBoundingClientRect()
    if (WbClass.parent.some(cl => closestLayer.classList.contains(cl)) &&
      closestLayer.nextSibling &&
      Math.abs(event.pageY - (layerRect.y + layerRect.height / 2)) < 5
    ) {
      closestLayer.classList.add('onsort')
      closestLayer.setAttribute('sort-position', 'inside')
      setTimeout(function () {
        let prefixIcon = closestLayer.querySelector('.fa-caret-right')
        if (sortLayer === closestLayer && prefixIcon &&
          sortLayer.getAttribute('sort-position') === 'inside') {
          closestLayer.classList.add('opened')
        }
      }, 800)
    } else if (Math.abs(event.pageY - layerRect.y) < Math.abs(event.pageY - layerRect.bottom)) {
      closestLayer.classList.add('onsort')
      closestLayer.setAttribute('sort-position', 'top')
    } else if (event.pageY <= layerRect.bottom || sortComInstance) {
      if (closestLayer.querySelector('.fa-caret-down')) {
        closestLayer =
          closestLayer.nextSibling.querySelector('.layer_wbase_tile')
        closestLayer.classList.add('onsort')
        closestLayer.setAttribute('sort-position', 'top')
      } else {
        closestLayer.classList.add('onsort')
        closestLayer.setAttribute('sort-position', 'bot')
      }
    } else if (wb.ParentID === closestLayer.id.replace('wbaseID:', '')) {
      closestLayer = closestLayer.nextSibling.querySelector('.layer_wbase_tile')
      closestLayer.classList.add('onsort')
      closestLayer.setAttribute('sort-position', 'top')
    } else {
      closestLayer.classList.add('onsort')
      closestLayer.setAttribute('sort-position', 'outside')
    }
    sortLayer = closestLayer
  }
}

function endDragSortLayer() {
  let wb = selected_list[0]
  if (sortLayer && sortLayer.id.replace('wbaseID:', '') !== wb.GID) {
    let listUpdate = []
    let wbHTML = document.getElementById(sortLayer.id.replace('wbaseID:', ''))
    let new_parentID = wbHTML.getAttribute('parentid')
    switch (sortLayer.getAttribute('sort-position')) {
      case 'top':
        if (new_parentID !== wbase_parentID) {
          var pWb = wbase_list.find(e => e.GID === new_parentID)
        }
        var zIndex = pWb.value.classList.contains('w-block')
          ? $(wbHTML).index()
          : $(wbHTML).index() - 1
        break
      case 'bot':
        if (new_parentID !== wbase_parentID) {
          pWb = wbase_list.find(e => e.GID === new_parentID)
        }
        zIndex = pWb.value.classList.contains('w-block')
          ? $(wbHTML).index() + 1
          : $(wbHTML).index()
        break
      case 'inside':
        new_parentID = sortLayer.id.replace('wbaseID:', '')
        zIndex = wbHTML.childElementCount - 1
        pWb = wbase_list.find(e => e.GID === new_parentID)
        break
      case 'outside':
        if (new_parentID !== wbase_parentID) {
          pWb = wbase_list.find(e => e.GID === new_parentID)
        }
        zIndex =
          !pWb || pWb.value.classList.contains('w-block')
            ? $(wbHTML).index() + 1
            : $(wbHTML).index() - 1
        break
      default:
        break
    }
    let newPWbHTML = pWb?.value ?? divSection
    if (wb.ParentID !== new_parentID) {
      if (wb.ParentID !== wbase_parentID) {
        let oldPWb = wbase_list.find(e => e.GID === wb.ParentID)
        if (oldPWb.value.classList.contains('w-table')) {
          let listCell = oldPWb.TableRows.reduce((a, b) => a.concat(b));
          [...oldPWb.value.querySelectorAll(':scope > .table-row > .table-cell')].forEach(cell => {
            listCell.find(e => e.id === cell.id).contentid = [
              ...cell.childNodes
            ]
              .map(e => e.id)
              .join(',')
          })
          let wbaseChildren = [
            ...oldPWb.value.querySelectorAll(
              `.wbaseItem-value[level="${oldPWb.Level + 1}"]`
            )
          ]
          for (let i = 0; i < wbaseChildren.length; i++) {
            wbaseChildren[i].style.zIndex = i
          }
          WBaseDA.listData.push(oldPWb)
        }
        if (oldPWb.value.classList.contains('w-variant')) {
          let listProperty = PropertyDA.list.filter(
            e => e.BaseID === oldPWb.GID
          )
          for (let propertyItem of listProperty) {
            propertyItem.BasePropertyItems =
              propertyItem.BasePropertyItems.filter(e => e.BaseID != wb.GID)
          }
        }
        listUpdate.push(oldPWb)
      }
      if (newPWbHTML.classList.contains('w-table')) {
      } else if (
        window.getComputedStyle(newPWbHTML).display.match('flex') &&
        !wb.value.classList.contains('fixed-position')
      ) {
        if (wb.value.style.width === 'auto')
          wb.value.style.width = wb.value.offsetWidth + 'px'
        if (wb.value.style.height === 'auto')
          wb.value.style.height = wb.value.offsetHeight + 'px'
        wb.value.style.position = null
        wb.value.style.left = null
        wb.value.style.top = null
        wb.value.style.right = null
        wb.value.style.bottom = null
        wb.value.style.transform = null
        wb.value.setAttribute('parentid', new_parentID)
        wb.Level = pWb.Level + 1
        wb.value.setAttribute('level', wb.Level)
        wb.ParentID = new_parentID
      } else {
        let wbRect = wb.value.getBoundingClientRect()
        if (new_parentID !== wbase_parentID) {
          var newPWbRect = newPWbHTML.getBoundingClientRect()
        }
        if (wb.value.getAttribute('width-type') === 'fill')
          wb.value.style.width = wb.value.offsetWidth + 'px'
        if (wb.value.getAttribute('height-type') === 'fill')
          wb.value.style.height = wb.value.offsetHeight + 'px'
        wb.value.style.left = `${(
          (wbRect.x - (newPWbRect?.x ?? 0)) /
          scale
        ).toFixed(2)}px`
        wb.value.style.top = `${(
          (wbRect.y - (newPWbRect?.y ?? 0)) /
          scale
        ).toFixed(2)}px`
        wb.value.style.flex = null
        wb.value.style.right = 'unset'
        wb.value.style.bottom = 'unset'
        wb.value.style.transform = 'none'
        wb.value.setAttribute('parentid', new_parentID)
        wb.Level = pWb.Level + 1
        wb.value.setAttribute('level', wb.Level)
        wb.ParentID = new_parentID
        if (!wb.value.getAttribute('constx'))
          wb.value.setAttribute('constx', Constraints.left)
        if (!wb.value.getAttribute('consty'))
          wb.value.setAttribute('consty', Constraints.top)
        var updateConstXY = true
      }
    }
    let children = [
      ...newPWbHTML.querySelectorAll(
        `.wbaseItem-value[level="${parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1
        }"]`
      )
    ].filter(e => wb.GID !== e.id)
    newPWbHTML.replaceChildren(
      ...children.slice(0, zIndex + 1),
      wb.value,
      ...children.slice(zIndex + 1)
    )
    if (updateConstXY) updateConstraints(wb.value)
    if (pWb) listUpdate.push(pWb)
    wb.Css = wb.value.style.cssText
    listUpdate.push(wb)
    replaceAllLyerItemHTML()
    handleWbSelectedList([wb])
    sortLayer = null
    WBaseDA.parent(listUpdate)
  }
}

function linkComptAndSkinDialog() {
  let dialogBackground = document.createElement('div')
  dialogBackground.className = 'dialog-background'
  dialogBackground.style.paddingTop = '46px'
  document.getElementById('body').appendChild(dialogBackground)
  document.getElementById('body').querySelector('#header').style.pointerEvents =
    'none'
  //
  let dialog = document.createElement('div')
  dialog.id = 'dialog_link_component_skin'
  dialogBackground.appendChild(dialog)
  //
  let header = document.createElement('div')
  header.className = 'header'
  dialog.appendChild(header)
  let libTab = document.createElement('p')
  libTab.innerHTML = 'Library'
  header.appendChild(libTab)
  let closeBtn = document.createElement('i')
  closeBtn.className = 'fa-solid fa-xmark fa-lg'
  closeBtn.style.padding = '8px'
  closeBtn.onclick = function () {
    dialogBackground.remove()
  }
  header.appendChild(closeBtn)
  //
  let libContent = document.createElement('div')
  libContent.id = 'lib_dialog_content'
  dialog.appendChild(libContent)
  let searchContainer = document.createElement('div')
  let searchPrefixIcon = document.createElement('i')
  searchPrefixIcon.className = 'fa-solid fa-magnifying-glass fa-sm'
  searchPrefixIcon.style.padding = '8px 0 8px 16px'
  searchPrefixIcon.style.color = '#8C8C8C'
  searchContainer.appendChild(searchPrefixIcon)
  let searchInput = document.createElement('input')
  searchInput.placeholder = 'Search...'
  searchInput.oninput = function () {
    if (libContentDetails.querySelector('.project_tile')) {
      libContentDetails
        .querySelectorAll(':scope > .project_tile')
        .forEach(proTile => {
          let proName = proTile.querySelector(':scope > label + p').innerHTML
          if (
            this.value.trim() === '' ||
            Ultis.toSlug(proName).includes(Ultis.toSlug(this.value.trim()))
          ) {
            proTile.style.display = 'flex'
          } else {
            proTile.style.display = 'none'
          }
        })
    } else {
      libContentDetails
        .querySelectorAll(
          ':is(.link_skin_cate_form > div:first-child, .checkbox_skin_tile)'
        )
        .forEach(skinTile => {
          let skinName = skinTile.querySelector(':scope > p').innerHTML
          if (this.value.trim() === '') {
            skinTile.removeAttribute('style')
            if (
              skinTile.parentElement.classList.contains('link_skin_cate_form')
            ) {
              let prefixAction = skinTile.querySelector(
                ':scope > .fa-caret-down'
              )
              if (prefixAction)
                prefixAction.className = prefixAction.className.replace(
                  'fa-caret-down',
                  'fa-caret-right'
                )
            }
          } else if (
            Ultis.toSlug(skinName).includes(Ultis.toSlug(this.value.trim()))
          ) {
            skinTile.removeAttribute('style')
            let parentList = $(skinTile).parents('.link_skin_cate_form')
            if (parentList)
              [...parentList].forEach(parentTile => {
                let prefixAction = parentTile.firstChild.querySelector(
                  ':scope > .fa-caret-right'
                )
                if (prefixAction)
                  prefixAction.className = prefixAction.className.replace(
                    'fa-caret-right',
                    'fa-caret-down'
                  )
              })
          } else {
            skinTile.style.display = 'none'
          }
        })
    }
  }
  searchContainer.appendChild(searchInput)
  let libContentDetails = document.createElement('div')
  libContentDetails.className = 'lib_content_details'
  libContent.replaceChildren(searchContainer, libContentDetails)

  //
  let dialogBottom = document.createElement('div')
  dialogBottom.className = 'dialog_bottom'
  dialog.appendChild(dialogBottom)
  linkComponentView()
}

function linkComponentView() {
  let dialog = document.getElementById('dialog_link_component_skin')
  let libContentDetails = dialog.querySelector('.lib_content_details')
  libContentDetails.replaceChildren(
    ...ProjectDA.list
      .filter(e => e.ID != ProjectDA.obj.ID)
      .map(projectItem =>
        createProjectTile(projectItem, function (project) {
          StyleDA.init(project)
        })
      )
  )
  let dialogBottom = dialog.querySelector('.dialog_bottom')
  let submitButton = document.createElement('div')
  submitButton.innerHTML = 'Submit'
  submitButton.onclick = function (e) {
    e.stopPropagation()
    if (!StyleDA.skinProjectID && !ProjectDA.obj.EditListID) {
      let listLinkID = [...document.getElementsByClassName('project_tile')]
        .filter(
          tileHTML =>
            tileHTML.querySelector('.toggle_ptoject_tile > input').checked
        )
        .map(tileHTML => tileHTML.id.replace('projectID:', ''))
      ProjectDA.obj.ListID = listLinkID.join(',')
      ProjectDA.obj.EditListID = true
      ProjectDA.edit(ProjectDA.obj)
    }
  }
  dialogBottom.replaceChildren(submitButton)
}

function createProjectTile(projectItem, suffixOnclick) {
  let projectTile = document.createElement('div')
  projectTile.id = `projectID:${projectItem.ID}`
  projectTile.className = 'project_tile'
  projectTile.innerHTML = `<label class="w-switch toggle_ptoject_tile" style="--checked-color: #1890ff;--unchecked-bg: #ccc;scale: 0.75;${projectItem.Permission === EnumPermission.view ? 'pointer-events: none' : ''
    }"><input type="checkbox" ${ProjectDA.obj.ListID?.split(',')?.includes(projectItem.ID.toString())
      ? 'checked'
      : ''
    }/><span class="slider"></span></label>
  <p>${projectItem.Name}</p>
  <p>${projectItem.CountComponent} components</p>
  <i class="fa-solid fa-chevron-right fa-sm" style="color: #262626;padding: 10px;"></i>`
  if (suffixOnclick) {
    $(projectTile).on('click', '.fa-chevron-right', function (ev) {
      if (!StyleDA.skinProjectID) {
        let loader = document.createElement('div')
        loader.style.setProperty('--border-width', '4px')
        loader.style.width = '16px'
        loader.style.margin = '0 3px'
        loader.className = 'data-loader'
        ev.target.replaceWith(loader)
        suffixOnclick(
          ProjectDA.list.find(
            e => e.ID == projectTile.id.replace('projectID:', '')
          )
        )
      }
    })
  }
  return projectTile
}

function linkSkinView(project) {
  let dialog = document.getElementById('dialog_link_component_skin')
  let libContentDetails = dialog.querySelector('.lib_content_details')
  let titleBar = document.createElement('div')
  titleBar.style.display = 'flex'
  titleBar.style.gap = '12px'
  titleBar.style.alignItems = 'center'
  titleBar.style.borderBottom = '1px solid #e5e5e5'
  titleBar.style.padding = '8px 0'
  let prefixIcon = document.createElement('i')
  prefixIcon.className = 'fa-solid fa-chevron-left fa-lg'
  prefixIcon.style.padding = '12px 0 12px 8px'
  prefixIcon.onclick = function (e) {
    e.stopPropagation()
    linkComponentView()
  }
  let projectTitle = document.createElement('p')
  projectTitle.innerHTML = project.Name
  projectTitle.style.fontSize = '14px'
  projectTitle.style.lineHeight = '22px'
  projectTitle.style.fontWeight = '600'
  projectTitle.style.margin = 0
  titleBar.replaceChildren(prefixIcon, projectTitle)
  let listCateParent = [
    {
      ID: EnumCate.color,
      Name: 'Color',
      ParentID: 1
    },
    {
      ID: EnumCate.typography,
      Name: 'Typography',
      ParentID: 1
    },
    {
      ID: EnumCate.border,
      Name: 'Border',
      ParentID: 1
    },
    {
      ID: EnumCate.effect,
      Name: 'Effect',
      ParentID: 1
    }
  ]
  libContentDetails.replaceChildren(
    titleBar,
    ...listCateParent.map(cateItem => checkboxLinkSkin(cateItem))
  )
  let dialogBottom = dialog.querySelector('.dialog_bottom')
  let insertButton = document.createElement('div')
  insertButton.innerHTML = 'Insert to project'
  insertButton.onclick = function (e) {
    e.stopPropagation()
    let listColorID = [
      ...libContentDetails
        .querySelector(`.EnumCate${EnumCate.color}`)
        .querySelectorAll('.checkbox_skin_tile')
    ].filter(tileHTML => tileHTML.querySelector('input').checked)
    if (listColorID.length > 0) {
      let colorCates = listColorID.map(tileHTML =>
        tileHTML.getAttribute('cateid')
      )
      CateDA.list.push(
        ...StyleDA.listCate.filter(cateItem =>
          colorCates.includes(cateItem.ID.toString())
        )
      )
      listColorID = listColorID.map(tileHTML => tileHTML.getAttribute('skinid'))
    }
    let listTypoID = [
      ...libContentDetails
        .querySelector(`.EnumCate${EnumCate.typography}`)
        .querySelectorAll('.checkbox_skin_tile')
    ].filter(tileHTML => tileHTML.querySelector('input').checked)
    if (listTypoID.length > 0) {
      let typoCates = listTypoID.map(tileHTML =>
        tileHTML.getAttribute('cateid')
      )
      CateDA.list.push(
        ...StyleDA.listCate.filter(cateItem =>
          typoCates.includes(cateItem.ID.toString())
        )
      )
      listTypoID = listTypoID.map(tileHTML => tileHTML.getAttribute('skinid'))
    }
    let listBorderID = [
      ...libContentDetails
        .querySelector(`.EnumCate${EnumCate.border}`)
        .querySelectorAll('.checkbox_skin_tile')
    ].filter(tileHTML => tileHTML.querySelector('input').checked)
    if (listBorderID.length > 0) {
      let borderCates = listBorderID.map(tileHTML =>
        tileHTML.getAttribute('cateid')
      )
      CateDA.list.push(
        ...StyleDA.listCate.filter(cateItem =>
          borderCates.includes(cateItem.ID.toString())
        )
      )
      listBorderID = listBorderID.map(tileHTML =>
        tileHTML.getAttribute('skinid')
      )
    }
    let listEffectID = [
      ...libContentDetails
        .querySelector(`.EnumCate${EnumCate.effect}`)
        .querySelectorAll('.checkbox_skin_tile')
    ].filter(tileHTML => tileHTML.querySelector('input').checked)
    if (listEffectID.length > 0) {
      let effectCates = listEffectID.map(tileHTML =>
        tileHTML.getAttribute('cateid')
      )
      CateDA.list.push(
        ...StyleDA.listCate.filter(cateItem =>
          effectCates.includes(cateItem.ID.toString())
        )
      )
      listEffectID = listEffectID.map(tileHTML =>
        tileHTML.getAttribute('skinid')
      )
    }
    let styleCopySkin = {
      ID: 0,
      ColorIDs: listColorID.join(','),
      TypoIDs: listTypoID.join(','),
      BorderIDs: listBorderID.join(','),
      EffectIDs: listEffectID.join(',')
    }
    StyleDA.copySkin(styleCopySkin, project.ID)
    dialog.parentElement.remove()
  }
  dialogBottom.replaceChildren(insertButton)
}

function checkboxLinkSkin(cateItem) {
  let enumCate = cateItem.ParentID != 1 ? cateItem.ParentID : cateItem.ID
  let cateForm = document.createElement('div')
  cateForm.className = 'link_skin_cate_form'
  if (cateItem.ParentID == 1) {
    cateForm.style.borderBottom = '1px solid #e5e5e5'
    cateForm.className += ` EnumCate${enumCate}`
  }
  let titleBar = document.createElement('div')
  cateForm.appendChild(titleBar)
  let title = document.createElement('p')
  title.innerHTML = cateItem.Name
  let suffixAction = document.createElement('i')
  suffixAction.className = 'fa-solid fa-caret-right fa-lg'
  suffixAction.onclick = function (e) {
    e.stopPropagation()
    if (this.className.includes('down')) {
      this.className = this.className.replace('down', 'right')
    } else {
      this.className = this.className.replace('right', 'down')
    }
  }
  titleBar.replaceChildren(suffixAction, title)
  function onChangeCheckbox(isSingleCheck = true) {
    if (isSingleCheck) {
      if (
        [...cateForm.querySelectorAll('input')]
          .splice(1)
          .every(inputHTML => inputHTML.checked)
      ) {
        cateForm.querySelector('input').checked = true
      } else {
        cateForm.querySelector('input').checked = false
      }
    } else {
      cateForm
        .querySelectorAll('input')
        .forEach(
          inputHTML =>
            (inputHTML.checked = cateForm.querySelector('input').checked)
        )
    }
  }
  switch (enumCate) {
    case EnumCate.color:
      var listSkin = StyleDA.listColor.filter(e => e.CateID == cateItem.ID)
      for (let skinItem of listSkin) {
        let checkboxSkinTile = document.createElement('div')
        checkboxSkinTile.className = 'checkbox_skin_tile'
        checkboxSkinTile.setAttribute('skinid', skinItem.GID)
        checkboxSkinTile.setAttribute('cateid', skinItem.CateID)
        cateForm.appendChild(checkboxSkinTile)
        let checkbox = document.createElement('input')
        checkbox.onchange = function () {
          onChangeCheckbox()
        }
        checkbox.type = 'checkbox'
        let skinName = document.createElement('p')
        skinName.innerHTML = skinItem.Name
        checkboxSkinTile.replaceChildren(checkbox, skinName)
      }
      let listColorCate = []
      if (cateItem.ParentID == 1) {
        listColorCate = StyleDA.listColor
          .filter(e => e.CateID != EnumCate.color)
          .filterAndMap(e => e.CateID)
        listColorCate = StyleDA.listCate.filter(e => {
          let check = listColorCate.some(id => e.ID == id)
          if (check) e.ParentID = EnumCate.color
          return check
        })
      }
      if (listColorCate.length > 0 || listSkin.length > 0) {
        let checkbox = document.createElement('input')
        checkbox.onchange = function () {
          onChangeCheckbox(false)
        }
        checkbox.type = 'checkbox'
        titleBar.replaceChildren(suffixAction, checkbox, title)
        for (let cateChild of listColorCate) {
          let cateFormChild = checkboxLinkSkin(cateChild)
          cateForm.appendChild(cateFormChild)
        }
      }
      break
    case EnumCate.typography:
      var listSkin = StyleDA.listTypo.filter(e => e.CateID == cateItem.ID)
      for (let skinItem of listSkin) {
        let checkboxSkinTile = document.createElement('div')
        checkboxSkinTile.className = 'checkbox_skin_tile'
        checkboxSkinTile.setAttribute('skinid', skinItem.GID)
        checkboxSkinTile.setAttribute('cateid', skinItem.CateID)
        cateForm.appendChild(checkboxSkinTile)
        let checkbox = document.createElement('input')
        checkbox.onchange = function () {
          onChangeCheckbox()
        }
        checkbox.type = 'checkbox'
        let skinName = document.createElement('p')
        skinName.innerHTML = skinItem.Name
        checkboxSkinTile.replaceChildren(checkbox, skinName)
      }
      let listTypoCate = []
      if (cateItem.ParentID == 1) {
        listTypoCate = StyleDA.listTypo
          .filter(e => e.CateID != EnumCate.typography)
          .filterAndMap(e => e.CateID)
        listTypoCate = StyleDA.listCate.filter(e => {
          let check = listTypoCate.some(id => e.ID == id)
          if (check) e.ParentID = EnumCate.typography
          return check
        })
      }
      if (listTypoCate.length > 0 || listSkin.length > 0) {
        let checkbox = document.createElement('input')
        checkbox.onchange = function () {
          onChangeCheckbox(false)
        }
        checkbox.type = 'checkbox'
        titleBar.replaceChildren(suffixAction, checkbox, title)
        for (let cateChild of listTypoCate) {
          let cateFormChild = checkboxLinkSkin(cateChild)
          cateForm.appendChild(cateFormChild)
        }
      }
      break
    case EnumCate.border:
      var listSkin = StyleDA.listBorder.filter(e => e.CateID == cateItem.ID)
      for (let skinItem of listSkin) {
        let checkboxSkinTile = document.createElement('div')
        checkboxSkinTile.className = 'checkbox_skin_tile'
        checkboxSkinTile.setAttribute('skinid', skinItem.GID)
        checkboxSkinTile.setAttribute('cateid', skinItem.CateID)
        cateForm.appendChild(checkboxSkinTile)
        let checkbox = document.createElement('input')
        checkbox.onchange = function () {
          onChangeCheckbox()
        }
        checkbox.type = 'checkbox'
        let skinName = document.createElement('p')
        skinName.innerHTML = skinItem.Name
        checkboxSkinTile.replaceChildren(checkbox, skinName)
      }
      let listBorderCate = []
      if (cateItem.ParentID == 1) {
        listBorderCate = StyleDA.listBorder
          .filter(e => e.CateID != EnumCate.border)
          .filterAndMap(e => e.CateID)
        listBorderCate = StyleDA.listCate.filter(e => {
          let check = listBorderCate.some(id => e.ID == id)
          if (check) e.ParentID = EnumCate.border
          return check
        })
      }
      if (listBorderCate.length > 0 || listSkin.length > 0) {
        let checkbox = document.createElement('input')
        checkbox.onchange = function () {
          onChangeCheckbox(false)
        }
        checkbox.type = 'checkbox'
        titleBar.replaceChildren(suffixAction, checkbox, title)
        for (let cateChild of listBorderCate) {
          let cateFormChild = checkboxLinkSkin(cateChild)
          cateForm.appendChild(cateFormChild)
        }
      }
      break
    case EnumCate.effect:
      var listSkin = StyleDA.listEffect.filter(e => e.CateID == cateItem.ID)
      for (let skinItem of listSkin) {
        let checkboxSkinTile = document.createElement('div')
        checkboxSkinTile.className = 'checkbox_skin_tile'
        checkboxSkinTile.setAttribute('skinid', skinItem.GID)
        checkboxSkinTile.setAttribute('cateid', skinItem.CateID)
        cateForm.appendChild(checkboxSkinTile)
        let checkbox = document.createElement('input')
        checkbox.onchange = function () {
          onChangeCheckbox()
        }
        checkbox.type = 'checkbox'
        let skinName = document.createElement('p')
        skinName.innerHTML = skinItem.Name
        checkboxSkinTile.replaceChildren(checkbox, skinName)
      }
      let listEffectCate = []
      if (cateItem.ParentID == 1) {
        listEffectCate = StyleDA.listEffect
          .filter(e => e.CateID != EnumCate.effect)
          .filterAndMap(e => e.CateID)
        listEffectCate = StyleDA.listCate.filter(e => {
          let check = listEffectCate.some(id => e.ID == id)
          if (check) e.ParentID = EnumCate.effect
          return check
        })
      }
      if (listEffectCate.length > 0 || listSkin.length > 0) {
        let checkbox = document.createElement('input')
        checkbox.onchange = function () {
          onChangeCheckbox(false)
        }
        checkbox.type = 'checkbox'
        titleBar.replaceChildren(suffixAction, checkbox, title)
        for (let cateChild of listEffectCate) {
          let cateFormChild = checkboxLinkSkin(cateChild)
          cateForm.appendChild(cateFormChild)
        }
      }
      break
    default:
      break
  }
  return cateForm
}

function dragInstanceUpdate(event) {
  console.log('drag instance update')
  selectParent(event)
  instance_drag.style.left = (instance_drag.style.left ? parseFloat(instance_drag.style.left.replace('px', '')) : instance_drag.offsetLeft) +
    event.pageX -
    previousX + 'px'
  instance_drag.style.top = (instance_drag.style.top ? parseFloat(instance_drag.style.top.replace('px', '')) : instance_drag.offsetTop) +
    event.pageY -
    previousY + 'px'
  previousX = event.pageX
  previousY = event.pageY
  let newPWbHTML = parent
  if (newPWbHTML.classList.contains('w-table')) {
    console.log('table')
    let availableCell = findCell(newPWbHTML, event)
    if (availableCell) {
      let distance = 0
      let cellChildren = [...availableCell.childNodes]
      if (cellChildren.length > 0) {
        cellChildren.sort((aHTML, bHTML) => {
          let aRect = aHTML.getBoundingClientRect()
          let bRect = bHTML.getBoundingClientRect()
          let a_center_oy = Math.abs(event.pageY - (aRect.y + aRect.height / 2))
          let b_center_oy = Math.abs(event.pageY - (bRect.y + bRect.height / 2))
          return a_center_oy - b_center_oy
        })
        let closestHTML = cellChildren[0]
        let htmlRect = closestHTML.getBoundingClientRect()
        distance = event.pageY - (htmlRect.y + htmlRect.height / 2)
      }
      $(instance_drag).addClass('drag-hide')
      let demo = document.createElement('div')
      demo.id = 'demo_auto_layout'
      demo.style.backgroundColor = '#1890FF'
      demo.style.height = `${2.4 / scale}px`
      demo.style.width = `${instance_drag.firstChild.offsetWidth * 0.8}px`
      if (distance < 0) {
        demo.style.zIndex = 0
        demo.style.zIndex =
          Math.max(...cellChildren.map(e => parseInt(e.style.zIndex))) + 1
        availableCell.replaceChildren(demo, ...cellChildren)
      } else {
        demo.style.zIndex =
          Math.max(...cellChildren.map(e => parseInt(e.style.zIndex))) + 1
        availableCell.replaceChildren(...cellChildren, demo)
      }
    }
  } else if (window.getComputedStyle(newPWbHTML).display === 'flex' && !instance_drag.classList.contains('fixed-position')) {
    console.log('flex')
    let children = [...newPWbHTML.querySelectorAll(`.wbaseItem-value[level="${parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1}"]`)]
    let isGrid = window.getComputedStyle(newPWbHTML).flexWrap == 'wrap'
    if (newPWbHTML.classList.contains('w-col')) {
      let zIndex = 0
      let distance = 0
      if (children.length > 0) {
        let closestHTML = [...children].sort((aHTML, bHTML) => {
          let aRect = aHTML.getBoundingClientRect()
          let bRect = bHTML.getBoundingClientRect()
          let a_center_oy
          let b_center_oy
          if (isGrid) {
            a_center_oy = Math.sqrt(
              Math.pow(event.pageX - (aRect.x + aRect.width / 2), 2) +
              Math.pow(event.pageY - (aRect.y + aRect.height / 2), 2)
            )
            b_center_oy = Math.sqrt(
              Math.pow(event.pageX - (bRect.x + bRect.width / 2), 2) +
              Math.pow(event.pageY - (bRect.y + bRect.height / 2), 2)
            )
          } else {
            a_center_oy = Math.abs(event.pageY - (aRect.y + aRect.height / 2))
            b_center_oy = Math.abs(event.pageY - (bRect.y + bRect.height / 2))
          }
          return a_center_oy - b_center_oy
        })[0]
        if (isGrid) {
          closestHTML = children.find(
            childHTML => childHTML.getBoundingClientRect().right >= event.pageX
          )
        }
        if (closestHTML) {
          let closestRect = closestHTML.getBoundingClientRect()
          zIndex = children.indexOf(closestHTML)
          distance = event.pageY - (closestRect.y + closestRect.height / 2)
          if (distance < 0) zIndex--
        } else {
          zIndex = children.length - 1
        }
      }
      $(instance_drag).addClass('drag-hide')
      var demo = document.getElementById('demo_auto_layout')
      if (!demo) {
        demo = document.createElement('div')
        demo.id = 'demo_auto_layout'
        demo.style.backgroundColor = '#1890FF'
        demo.style.height = `${2.4 / scale}px`
        demo.style.width = `${(newPWbHTML.offsetWidth / 2) * 0.8}px`
      }
      newPWbHTML.replaceChildren(
        ...children.slice(0, zIndex + 1),
        demo,
        ...children.slice(zIndex + 1)
      )
    } else {
      let zIndex = 0
      let distance = 0
      if (children.length > 0) {
        let closestHTML = [...children].sort((aHTML, bHTML) => {
          let aRect = aHTML.getBoundingClientRect()
          let bRect = bHTML.getBoundingClientRect()
          let a_center_ox
          let b_center_ox
          if (isGrid) {
            a_center_ox = Math.sqrt(
              Math.pow(event.pageX - (aRect.x + aRect.width / 2), 2) +
              Math.pow(event.pageY - (aRect.y + aRect.height / 2), 2)
            )
            b_center_ox = Math.sqrt(
              Math.pow(event.pageX - (bRect.x + bRect.width / 2), 2) +
              Math.pow(event.pageY - (bRect.y + bRect.height / 2), 2)
            )
          } else {
            a_center_ox = Math.abs(event.pageX - (aRect.x + aRect.width / 2))
            b_center_ox = Math.abs(event.pageX - (bRect.x + bRect.width / 2))
          }
          return a_center_ox - b_center_ox
        })[0]
        if (isGrid) {
          closestHTML = children.find(
            childHTML => childHTML.getBoundingClientRect().bottom >= event.pageY
          )
        }
        if (closestHTML) {
          let closestRect = closestHTML.getBoundingClientRect()
          zIndex = parseInt(window.getComputedStyle(closestHTML).zIndex)
          distance = event.pageX - (closestRect.x + closestRect.width / 2)
          if (distance < 0) zIndex--
        } else {
          zIndex = children.length - 1
        }
      }
      $(instance_drag).addClass('drag-hide')
      var demo = document.getElementById('demo_auto_layout')
      if (!demo) {
        demo = document.createElement('div')
        demo.id = 'demo_auto_layout'
        demo.style.backgroundColor = '#1890FF'
        demo.style.width = `${2.4 / scale}px`
        demo.style.height = `${(newPWbHTML.offsetHeight / 2) * 0.8}px`
      }
      newPWbHTML.replaceChildren(
        ...children.slice(0, zIndex + 1),
        demo,
        ...children.slice(zIndex + 1)
      )
    }
  } else {
    $(instance_drag).removeClass('drag-hide')
  }
  if (!demo) document.getElementById('demo_auto_layout')?.remove()
}

function dragInstanceEnd(event) {
  WBaseDA.listData = []
  let newPWbHTML = parent
  let new_parentID = newPWbHTML.id.length != 36 ? wbase_parentID : newPWbHTML.id
  let pWb = new_parentID !== wbase_parentID ? wbase_list.find(e => e.GID === new_parentID) : null
  let wb = select_component
  wb.ParentID = new_parentID
  wb.ChildID = wb.GID
  wb.IsCopy = true
  wb.GID = wb.value.id
  if (wb.ProjectID > 0 && wb.ProjectID !== ProjectDA.obj.ID) {
    wb.children.forEach(e => {
      e.Level = e.Level - wb.Level + (pWb?.Level ?? 0) + 1
      e.value.setAttribute('level', e.Level)
    })
    WBaseDA.listData.push(...wb.children)
  }
  wb.Level = (pWb?.Level ?? 0) + 1
  wb.value.className = wb.ListClassName
  wb.value.setAttribute('level', wb.Level)
  let demo = document.getElementById('demo_auto_layout')
  if (demo) {
    wb.value.style.position = null
    wb.value.style.left = null
    wb.value.style.top = null
    wb.value.style.right = null
    wb.value.style.bottom = null
    wb.value.style.transform = null
    demo.replaceWith(wb.value)
  } else if (new_parentID === wbase_parentID) {
    let offset = offsetScale(event.pageX, event.pageY)
    wb.value.style.left = offset.x + 'px'
    wb.value.style.top = offset.y + 'px'
    wb.value.style.right = null
    wb.value.style.bottom = null
    wb.value.style.transform = null
    wb.value.setAttribute('constx', Constraints.left)
    wb.value.setAttribute('consty', Constraints.top)
    divSection.appendChild(wb.value)
  } else if (newPWbHTML.classList.contains('w-block')) {
    wb.value.style.transform = null
    let pWbRect = newPWbHTML.getBoundingClientRect()
    pWbRect = offsetScale(pWbRect.x, pWbRect.y)
    let offset = offsetScale(event.pageX, event.pageY)
    wb.value.style.top = `${offset.y - wb.value.offsetHeight - pWbRect.y}px`
    wb.value.style.left = `${offset.x - wb.value.offsetWidth - pWbRect.x}px`
    wb.value.style.right = null
    wb.value.style.bottom = null
    wb.value.setAttribute('constx', Constraints.left)
    wb.value.setAttribute('consty', Constraints.top)
    newPWbHTML.appendChild(wb.value)
  }
  wb.Css = wb.value.style.cssText
  if (pWb) WBaseDA.listData.push(pWb)
  if (wb.ProjectID !== ProjectDA.obj.ID) {
    wb.GID = wb.ChildID
    let newWbList = createNewWbase({ wb: wb, relativeWbs: wb.children, level: wb.level })
    WBaseDA.listData.push(...newWbList)
    newWbList.forEach(e => {
      initComponents(e, newWbList.filter(el => el.ParentID === e.GID))
    })
    wb.value.replaceWith(newWbList.pop().value)
    WBaseDA.add({ listWb: WBaseDA.listData })
  } else {
    WBaseDA.listData.push(wb)
    WBaseDA.copy(WBaseDA.listData)
    wb.value.setAttribute('loading', 'true')
  }
  WBaseDA.listData = []
  const selectedTile = assets_view.querySelector('.list_tile.comp-selected')
  if (selectedTile) $(selectedTile).trigger('click')
  replaceAllLyerItemHTML()
  parent = divSection
  // handleWbSelectedList([wb])
  instance_drag?.remove()
  instance_drag = null
  // action_list[action_index].tmpHTML = [newWb.value]
}

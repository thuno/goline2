let feature_list = [
    {
        title: 'Select layer',
        more: function () { },
        onclick: function () { },
        isShow: () => selected_list.length > 0
    },
    {
        title: 'Image document',
        onclick: function (ev) {
            if (document.getElementById('popup_img_document') == undefined) {
                FileDA.init().then(res => {
                    if (res.Code === 200) showImgDocument(ev)
                })
            }
        },
        isShow: () => true,
        spaceLine: true
    },
    {
        title: 'Bring to front',
        shortKey: 'Ctrl+Alt+]',
        onclick: bringToFront,
        isShow: () =>
            selected_list.length > 0 &&
            document.getElementById(select_box_parentID)?.getAttribute('cateid') !=
            EnumCate.table
    },
    {
        title: 'Bring frontward',
        shortKey: 'Ctrl+]',
        onclick: bringFrontward,
        isShow: () =>
            selected_list.length > 0 &&
            document.getElementById(select_box_parentID)?.getAttribute('cateid') !=
            EnumCate.table
    },
    {
        title: 'Send to back',
        shortKey: 'Ctrl+Alt+[',
        onclick: sendToBack,
        isShow: () =>
            selected_list.length > 0 &&
            document.getElementById(select_box_parentID)?.getAttribute('cateid') !=
            EnumCate.table
    },
    {
        title: 'Send backward',
        shortKey: 'Ctrl+[',
        onclick: sendBackward,
        isShow: () =>
            selected_list.length > 0 &&
            document.getElementById(select_box_parentID)?.getAttribute('cateid') !=
            EnumCate.table,
        spaceLine: true
    },
    {
        title: 'Add auto layout',
        shortKey: 'Shift+A',
        onclick: addAutoLayout,
        isShow: () => selected_list.length > 0 && selected_list[0].StyleItem
    },
    {
        title: 'Create component',
        shortKey: 'Ctrl+Alt+K',
        onclick: createComponent,
        isShow: () =>
            selected_list.some(
                e => !e.IsWini && !e.value.classList.contains('w-text')
            ) && !$(selected_list[0].value).parents(`.wbaseItem-value[iswini]`).length
    },
    {
        title: 'Detach component',
        shortKey: 'Alt+K',
        onclick: detachComponent,
        isShow: function () {
            return selected_list.some(
                e =>
                    !e.value.closest(
                        `.wbaseItem-value[isinstance][level="${e.Level - 1}"]`
                    )
            )
        }
    },
    {
        title: 'Show/Hide UI',
        shortKey: 'Ctrl+\\',
        onclick: showOnOffUI,
        isShow: () => true,
        spaceLine: true
    },
    {
        title: 'Copy',
        shortKey: 'Ctrl+C',
        onclick: saveWbaseCopy,
        isShow: () => selected_list.length > 0
    },
    {
        title: 'Paste',
        shortKey: 'Ctrl+V',
        onclick: pasteWbase,
        isShow: () => copy_item != undefined
    },
    {
        title: 'Delete',
        shortKey: 'Delete',
        onclick: function () {
            WBaseDA.delete(selected_list)
        },
        isShow: () => selected_list.length > 0
    }
]

function popupRightClick(event) {
    let popup = showPopup({
        id: 'wini_features',
        hiddenOverlay: true,
        style: `left: ${event.pageX}px; top: ${event.pageY}px; width: 24rem; background-color: #000000`,
        children: feature_list.map(element => {
            if (element.isShow()) {
                let option = document.createElement('button')
                option.type = 'button'
                option.className = 'popup-function-option row'
                option.innerHTML = `<p class="regular1">${element.title}</p>`
                if (element.more) {
                    let btn_more_option = document.createElement('i')
                    btn_more_option.className = 'fa-solid fa-caret-right box24 center'
                    btn_more_option.style.fontSize = '1.4rem'
                    option.appendChild(btn_more_option)
                } else {
                    let shortKey = document.createElement('p')
                    shortKey.className = 'regular1'
                    shortKey.innerHTML = element.shortKey ?? ''
                    option.onclick = function (ev) {
                        ev.stopPropagation()
                        element.onclick(ev)
                        popup.remove()
                    }
                    option.appendChild(shortKey)
                }
                if (element.spaceLine) {
                    option.style.borderBottom = '1px solid #ffffff'
                }
                return option
            } else return null
        }).filter(e => e !== null)
    })
}

function showOnOffUI() {
    if (left_view.style.display != 'none') {
        left_view.style.display = 'none'
        right_view.style.display = 'none'
        scrollTop.style.right = '0px'
    } else {
        left_view.style.display = 'block'
        right_view.style.display = 'block'
        scrollTop.style.right = '26rem'
    }
}

function saveWbaseCopy() {
    Ultis.removeFromStorage('copy-item')
    if (select_box) {
        copy_item = selected_list.map(e => {
            let jsonWb = JSON.parse(JSON.stringify(e))
            if (e.value.style.width == '100%') {
                jsonWb.StyleItem.FrameItem.Width = -e.value.offsetWidth
            } else if (!e.StyleItem.FrameItem.Width) {
                jsonWb.offsetWidth = e.value.offsetWidth
            }
            if (e.value.style.height == '100%') {
                jsonWb.StyleItem.FrameItem.Height = -e.value.offsetHeight
            } else if (!e.StyleItem.FrameItem.Height) {
                jsonWb.offsetHeight = e.value.offsetHeight
            }
            jsonWb.PageID = PageDA.obj.ID
            return jsonWb
        })
    }
}

function pasteWbase() {
    let otherP = false
    if (copy_item?.length) {
        otherP = copy_item.every(e => e.PageID && e.PageID !== PageDA.obj.ID)
    } else {
        let storeCopy = Ultis.getStorage('copy-item')
        if (storeCopy) {
            storeCopy = JSON.parse(storeCopy)
            if (Math.floor((Date.now() - storeCopy.time) / 60000) <= 5) {
                copy_item = storeCopy.list
                otherP = true
            }
        } else {
            Ultis.removeFromStorage('copy-item')
        }
    }
    let listWb = []
    let list_new_wbase = []
    if (!otherP) {
        list_new_wbase = wbase_list.filter(e =>
            copy_item.some(copyWb => copyWb.GID === e.GID)
        )
    }
    if (list_new_wbase.length === copy_item.length || otherP) {
        if (otherP) {
            let offset = offsetScale(
                Math.min(minx, divMain.offsetWidth / 2),
                Math.min(miny, divMain.offsetHeight / 2)
            )
            list_new_wbase = copy_item.map(e => {
                let newWb = JSON.parse(JSON.stringify(e))
                newWb.GID = uuidv4()
                newWb.value = document.createElement('div')
                newWb.value.id = newWb.GID
                newWb.value.className = 'wbaseItem-value'
                newWb.ChildID = e.GID
                newWb.IsCopy = true
                newWb.IsWini = false
                newWb.value.style.width =
                    Math.abs(newWb.StyleItem.FrameItem.Width ?? newWb.offsetWidth) + 'px'
                newWb.value.style.height =
                    Math.abs(newWb.StyleItem.FrameItem.Height ?? newWb.offsetHeight) +
                    'px'
                newWb.ParentID = wbase_parentID
                newWb.Level = 1
                newWb.StyleItem.PositionItem.Left = `${offset.x -
                    Math.abs(newWb.StyleItem.FrameItem.Width ?? newWb.offsetWidth) / 2
                    }px`
                newWb.StyleItem.PositionItem.Top = `${offset.y -
                    Math.abs(newWb.StyleItem.FrameItem.Height ?? newWb.offsetHeight) / 2
                    }px`
                newWb.StyleItem.PositionItem.ConstraintsX = Constraints.left
                newWb.StyleItem.PositionItem.ConstraintsY = Constraints.top
                tmpAltHTML.push(newWb.value)
                newWb.value.setAttribute('loading', 'true')
                return newWb
            })
        } else {
            list_new_wbase = list_new_wbase.map(e => {
                let newWb = JSON.parse(JSON.stringify(e))
                let currentHTML = document.getElementById(e.GID)
                newWb.GID = uuidv4()
                newWb.value = currentHTML.cloneNode(true)
                newWb.value.id = newWb.GID
                newWb.ChildID = e.GID
                newWb.IsCopy = true
                newWb.IsWini = false
                newWb.value.style.width = currentHTML.offsetWidth + 'px'
                newWb.value.style.height = currentHTML.offsetHeight + 'px'
                newWb.value.style.transform = null
                newWb.value.removeAttribute('iswini')
                tmpAltHTML.push(newWb.value)
                newWb.value.setAttribute('loading', 'true')
                return newWb
            })
        }
        let newParent
        let parent_wbase
        if (
            selected_list.length === 1 &&
            copy_item.every(
                copyWb =>
                    selected_list[0].GID !== copyWb.GID &&
                    !selected_list[0].ListID.includes(copyWb.GID)
            )
        ) {
            newParent = selected_list[0].value
            parent_wbase = selected_list[0]
        } else {
            if (list_new_wbase[0].ParentID === wbase_parentID) {
                newParent = divSection
            } else {
                parent_wbase = wbase_list.find(
                    wb => wb.GID === list_new_wbase[0].ParentID
                )
                newParent = document.getElementById(list_new_wbase[0].ParentID)
            }
        }
        if (parent_wbase?.CateID === EnumCate.table) {
            let availableCell = findCell(newParent, { pageX: minx, pageY: miny })
            list_new_wbase.forEach(newWb => availableCell.appendChild(newWb.value))
            let listCell = parent_wbase.TableRows.reduce((a, b) => a.concat(b))
                ;[
                    ...newParent.querySelectorAll(':scope > .table-row > .table-cell')
                ].forEach(cell => {
                    listCell.find(e => e.id === cell.id).contentid = [...cell.childNodes]
                        .map(e => e.id)
                        .join(',')
                })
            parent_wbase.AttributesItem.Content = JSON.stringify(
                parent_wbase.TableRows
            )
            wbase_list.push(...list_new_wbase)
            listWb.push(...list_new_wbase)
        } else if (
            window.getComputedStyle(newParent).display.match('flex') &&
            list_new_wbase.some(e => !e.StyleItem.PositionItem.FixPosition)
        ) {
            let zIndex =
                Math.max(
                    0,
                    ...[
                        ...newParent.querySelectorAll(
                            `.wbaseItem-value[level="${parent_wbase.Level + 1}"]`
                        )
                    ].map(e => parseInt(e.style.zIndex))
                ) + 1
            for (let i = 0; i < list_new_wbase.length; i++) {
                list_new_wbase[i].value.style.left = null
                list_new_wbase[i].value.style.top = null
                list_new_wbase[i].value.style.right = null
                list_new_wbase[i].value.style.bottom = null
                list_new_wbase[i].value.style.transform = null
                list_new_wbase[i].value.style.zIndex = zIndex + i
                list_new_wbase[i].value.style.order = zIndex + i
                if (
                    list_new_wbase[i].StyleItem.FrameItem.Width < 0 &&
                    parent_wbase.StyleItem.FrameItem.Width == null
                ) {
                    list_new_wbase[i].StyleItem.FrameItem.Width =
                        list_new_wbase[i].value.offsetWidth
                }
                if (
                    list_new_wbase[i].StyleItem.FrameItem.Height < 0 &&
                    parent_wbase.StyleItem.FrameItem.Height == null
                ) {
                    list_new_wbase[i].StyleItem.FrameItem.Height =
                        list_new_wbase[i].value.offsetHeight
                }
                switch (parseInt(newParent.getAttribute('cateid'))) {
                    case EnumCate.tree:
                        newParent
                            .querySelector('.children-value')
                            .appendChild(list_new_wbase[i].value)
                        break
                    case EnumCate.carousel:
                        newParent
                            .querySelector('.children-value')
                            .appendChild(list_new_wbase[i].value)
                        break
                    default:
                        newParent.appendChild(list_new_wbase[i].value)
                        break
                }
                listWb.push(list_new_wbase[i])
                wbase_list.push(list_new_wbase[i])
            }
        } else {
            let zIndex =
                Math.max(
                    0,
                    ...[
                        ...newParent.querySelectorAll(
                            `.wbaseItem-value[level="${(parent_wbase?.Level ?? 0) + 1}"]`
                        )
                    ].map(e => parseInt(e.style.zIndex))
                ) + 1
            let parentRect = {
                x: 0,
                y: 0
            }
            if (newParent !== divSection) {
                newParent.getBoundingClientRect()
                parentRect = offsetScale(parentRect.x, parentRect.y)
            }
            for (let i = 0; i < list_new_wbase.length; i++) {
                if (list_new_wbase[i].StyleItem.FrameItem.Width < 0) {
                    list_new_wbase[i].StyleItem.FrameItem.Width =
                        list_new_wbase[i].value.offsetWidth
                }
                if (list_new_wbase[i].StyleItem.FrameItem.Height < 0) {
                    list_new_wbase[i].StyleItem.FrameItem.Height =
                        list_new_wbase[i].value.offsetHeight
                }
                let offset = offsetScale(minx, miny)
                list_new_wbase[i].StyleItem.PositionItem.Top = `${offset.y - list_new_wbase[i].value.offsetHeight - parentRect.y
                    }px`
                list_new_wbase[i].StyleItem.PositionItem.Left = `${offset.x - list_new_wbase[i].value.offsetWidth - parentRect.x
                    }px`
                list_new_wbase[i].value.style.left =
                    list_new_wbase[i].StyleItem.PositionItem.Left
                list_new_wbase[i].value.style.top =
                    list_new_wbase[i].StyleItem.PositionItem.Top
                list_new_wbase[i].StyleItem.PositionItem.ConstraintsX = Constraints.left
                list_new_wbase[i].StyleItem.PositionItem.ConstraintsY = Constraints.top
                wbase_list.push(list_new_wbase[i])
                listWb.push(list_new_wbase[i])
                newParent.appendChild(list_new_wbase[i].value)
            }
        }
        if (parent_wbase) {
            for (let i = 0; i < list_new_wbase.length; i++) {
                list_new_wbase[i].ParentID = parent_wbase.GID
                list_new_wbase[i].Level = parent_wbase.Level + 1
                list_new_wbase[i].value.setAttribute('level', parent_wbase.Level + 1)
            }
            let children = [
                ...newParent.querySelectorAll(
                    `.wbaseItem-value[level="${parent_wbase.Level + 1}"]`
                )
            ]
            children.sort(
                (a, b) => parseInt(a.style.zIndex) - parseInt(b.style.zIndex)
            )
            // for (let i = 0; i < children.length; i++) {
            //   wbase_list.find(wbase => wbase.GID == children[i].id).Sort = i
            //   children[i].style.zIndex = i
            //   children[i].style.order = i
            // }
            parent_wbase.CountChild = children.length
            parent_wbase.ListChildID = children.map(e => e.id)
            listWb.push(parent_wbase)
        }
        replaceAllLyerItemHTML()
        handleWbSelectedList(list_new_wbase)
        action_list[action_index].tmpHTML = [...tmpAltHTML]
        tmpAltHTML = []
        WBaseDA.copy(listWb)
    } else {
        copy_item = []
    }
}

function createComponent() {
    let listUpdate = []
    let un_component_list = selected_list.filter(
        e => !e.IsWini && !e.value.classList.contains('w-text')
    )
    for (let wb of un_component_list) {
        wb.IsWini = true
        wb.CopyID = null
        wb.value.setAttribute('iswini', 'true')
        document.getElementById(`wbaseID:${wb.GID}`).setAttribute('iswini', 'true')
        let wbClassName = 'w-st0-' + Ultis.toSlug(wb.Name.toLowerCase().trim())
        let existStyleName = StyleDA.cssStyleSheets
            .filter(cssItem => cssItem.Name.includes(wbClassName))
            .map(cssItem =>
                isNaN(parseInt(cssItem.Name.replace(wbClassName, '')))
                    ? 0
                    : parseInt(cssItem.Name.replace(wbClassName, ''))
            )
        for (let i = 1; i < 100; i++) {
            if (existStyleName.every(num => i !== num)) {
                wbClassName = wbClassName + `${i}`
                break
            }
        }
        if (wb.ListClassName) {
            wb.ListClassName = [
                ...wb.ListClassName.split(' ').filter(
                    cls => !cls.startsWith('w-st')
                ),
                wbClassName
            ].join(' ')
        } else {
            wb.ListClassName = wbClassName
        }
        wb.value.className = wb.ListClassName
        if (wb.value.getAttribute('width-type') === 'fill') {
            wb.value.style.width = wb.value.offsetWidth + 'px'
            wb.value.style.flex = null
        }
        if (wb.value.getAttribute('height-type') === 'fill') {
            wb.value.style.height = wb.value.offsetHeight + 'px'
            wb.value.style.flex = null
        }
        let wbCssText = wb.value.style.cssText.split(';').map(vl => vl.trim())
        let cssItem = {
            GID: wb.GID,
            Name: wbClassName,
            ProjectID: ProjectDA.obj.ID,
            Css: `.${wbClassName} { ${wbCssText
                .filter(
                    e =>
                        !e.match(
                            /(z-index|order|left|top|bottom|right|transform|--gutter)/g
                        )
                )
                .join(';')} }`
        }
        wb.value.style.cssText = wbCssText
            .filter(e =>
                e.match(/(z-index|order|left|top|bottom|right|transform|--gutter)/g)
            )
            .join(';')
        if (wb.value.getAttribute('width-type') === 'fill') {
            wb.value.style.width = '100%'
            if (wb.value.closest(`.w-row[level="${wb.Level - 1}"]`))
                wb.value.style.flex = 1
        }
        if (wb.value.getAttribute('height-type') === 'fill') {
            wb.value.style.height = wb.value.offsetHeight + 'px'
            if (wb.value.closest(`.w-col[level="${wb.Level - 1}"]`))
                wb.value.style.flex = 1
        }
        if (wb.value.style.cssText === '') {
            wb.value.style = null
            wb.Css = null
        } else {
            wb.Css = wb.value.style.cssText
        }
        let children = []
        if (
            WbClass.parent.some(
                e => e !== 'w-variant' && wb.value.classList.contains(e)
            )
        ) {
            let existNameList = [
                ...wb.value.querySelectorAll(`.wbaseItem-value[class*="w-st"]`)
            ]
                .map(e =>
                    [...e.classList].find(
                        cls => cls.startsWith('w-st')
                    )
                )
                .filter(e => e != null)
            children = wbase_list.filter(
                e => wb !== e && wb.value.contains(e.value) && e.Css
            )
            for (let childWb of children) {
                let childWbClassName =
                    `w-st${childWb.Level - wb.Level}-` +
                    Ultis.toSlug(childWb.Name.toLowerCase().trim())
                childWb.ListClassName ??= ''
                let childClsList = childWb.ListClassName.split(' ')
                let childWbCssText = childWb.value.style.cssText
                    .split(';')
                    .map(vl => vl.trim())
                if (childClsList.some(cCls => cCls.startsWith('w-st0'))) {
                    childWbClassName = childClsList.find(cCls => cCls.startsWith('w-st0'))
                    cssItem.Css += `/**/ .${wbClassName} .${childWbClassName} { ${childWbCssText
                        .filter(e =>
                            e.match(
                                /(z-index|order|left|top|bottom|right|transform|--gutter)/g
                            )
                        )
                        .join(';')} }`
                } else {
                    let existSameName = existNameList
                        .filter(name => name.includes(childWbClassName))
                        .map(name =>
                            isNaN(parseInt(name.replace(childWbClassName, '')))
                                ? 0
                                : parseInt(name.replace(childWbClassName, ''))
                        )
                    for (let i = 1; i < 100; i++) {
                        if (existSameName.every(num => i !== num)) {
                            childWbClassName = childWbClassName + `${i}`
                            break
                        }
                    }
                    childWb.ListClassName = [
                        ...childClsList.filter(
                            cls => !cls.startsWith('w-st')
                        ),
                        childWbClassName
                    ].join(' ')
                    existNameList.push(childWbClassName)
                    cssItem.Css += `/**/ .${wbClassName} .${childWbClassName} { ${childWb.value
                        .closest(`.wbaseItem-value[level="${childWb.Level - 1}"]`)
                        .classList.contains('w-block')
                        ? childWbCssText.filter(e => !e.match(/order/g)).join(';')
                        : childWbCssText
                            .filter(
                                e =>
                                    !e.match(
                                        /(z-index|left|top|bottom|right|transform|--gutter)/g
                                    )
                            )
                            .join(';')
                        } }`
                }
                childWb.value.style = null
                childWb.Css = null
                childWb.value.className = childWb.ListClassName
            }
        }
        let index = StyleDA.cssStyleSheets.findIndex(e => e.GID === cssItem.GID)
        if (index >= 0) {
            StyleDA.cssStyleSheets[index] = cssItem
            StyleDA.editStyleSheet(cssItem)
            document.getElementById(`w-st-comp${cssItem.GID}`).innerHTML = cssItem.Css
        } else {
            StyleDA.cssStyleSheets.push(cssItem)
            StyleDA.addStyleSheet(cssItem)
            let styleTag = document.createElement('style')
            styleTag.id = `w-st-comp${cssItem.GID}`
            styleTag.innerHTML = cssItem.Css
            document.head.appendChild(styleTag)
        }
        listUpdate.push(wb, ...children)
    }
    assets_list.push(...listUpdate)
    WBaseDA.edit(listUpdate, EnumObj.wBase)
    listShowName = [
        ...divSection.querySelectorAll(
            `:scope > .wbaseItem-value:is(.w-container, .w-variant, *[iswini]):not(*[isinstance])`
        )
    ]
    wdraw()
    updateUIDesignView()
}

function showImgDocument(ev) {
    CollectionDA.getListDocument().then(async (res) => {
        if (res.Code === 200) {
            if (CollectionDA.documentList.length === 0) {
                const newDocRes = await CollectionDA.addDocument({
                    ID: 0,
                    Name: 'default folder',
                    Type: ApiSelection.document
                })
                if (newDocRes !== 200) return
            }
            let imgDocument = createImgDocument(ev)
            document.body.appendChild(imgDocument)
        }
    })
}

let imgDocumentOffset = { x: 30, y: 30 }
function createImgDocument(ev) {
    let divImgDoc = document.createElement('div')
    divImgDoc.id = 'popup_img_document'
    divImgDoc.className = 'col elevation7'
    divImgDoc.style.left = (ev?.pageX ?? imgDocumentOffset.x) + 'px'
    divImgDoc.style.top = (ev?.pageY ?? imgDocumentOffset.y) + 'px'
    divImgDoc.onkeydown = function (e) {
        if (e.key == 'Enter' && document.activeElement.localName == 'input') {
            document.activeElement.blur()
        }
    }
    $(divImgDoc).on('change', `input[type="file"]`, function (ev) {
        FileDA.add(ev.target.files, CollectionDA.selectedDocument.ID)
    })
    $(divImgDoc).on('mousedown', '.popup-header', function (e) {
        e.stopPropagation()
        if (e.buttons == 1) {
            divImgDoc.setAttribute('offset', JSON.stringify({ x: e.clientX, y: e.clientY }))
        }
    })
    $(divImgDoc).on('mouseup', '.popup-header', function (e) {
        e.stopPropagation()
        divImgDoc.removeAttribute('offset')
        imgDocumentOffset = { x: divImgDoc.offsetLeft, y: divImgDoc.offsetTop }
    })
    $(divImgDoc).on('click', '.popup-header > .fa-xmark', function () {
        divImgDoc.remove()
        CollectionDA.selectedDocument = undefined
    })
    $(divImgDoc).on('click', '.img-doc-body .folder-list-container .fa-plus', function () {
        let newFolder = {
            ID: 0,
            Name: 'new folder',
            Type: ApiSelection.document
        }
        CollectionDA.addDocument(newFolder)
    })
    $(divImgDoc).on('focus', '.folder-tile input', function (ev) {
        ev.target.select()
    })
    $(divImgDoc).on('dblclick', '.folder-tile:has(input)', function (ev) {
        ev.stopPropagation()
        ev.target.querySelector('input').disabled = false
        ev.target.querySelector('input').focus()
    })
    $(divImgDoc).on('click', `.recycle-bin`, function (ev) {
        selectFolder({ ID: -1, Name: 'Recycle bin' })
    })
    $(divImgDoc).on('auxclick', '.folder-tile:has(input)', function (ev) {
        ev.stopPropagation()
        let edit_delete_popup = showPopup({
            hiddenOverlay: true,
            children: `<div class="edit-skin default-option semibold1 row">Edit</div><div class="delete-skin default-option semibold1 row">Delete</div>`,
            style: `left: ${ev.pageX}px; top: ${ev.pageY}px; background-color: #000000; width: fit-content; height: fit-content; padding: 0.2rem;border-radius: 0.2rem !important`
        })
        $(edit_delete_popup).on('click', '.edit-skin', function () {
            edit_delete_popup.remove()
            ev.target.querySelector('input').disabled = false
            ev.target.querySelector('input').focus()
        })
        $(edit_delete_popup).on('click', '.delete-skin', function (e) {
            e.stopPropagation()
            edit_delete_popup.remove()
            CollectionDA.deleteDocument(CollectionDA.list.find(docItem => docItem.ID === parseInt(ev.target.id.replace('folder-', ''))))
            ev.target.remove()
        })
    })
    const renderFolderTile = CollectionDA.documentList.map(e => {
        $(divImgDoc).on('click', `.folder-tile[id="folder-${e.ID}"]`, function (ev) {
            selectFolder(e)
        })
        return `<div id="folder-${e.ID}" class="row folder-tile" style="padding: 0 0.6rem; gap: 0.2rem">
                        <i class="fa-regular fa-folder box24 center" style="font-size: 1.4rem; pointer-events: none"></i>
                        ${TextField({
            returnType: 'string',
            className: 'regular1',
            style: 'background-color: transparent !important',
            value: e.Name,
            disabled: true,
            onBlur: function (ev) {
                ev.target.disabled = true
                e.Name = ev.target.value
                window.getSelection().removeAllRanges()
                CollectionDA.editDocument(e)
            }
        })}</div>`
    }).join('')
    $(divImgDoc).on('click', '.fa-arrow-up-from-bracket', function () {
        divImgDoc.querySelector(`input[type="file"]`).showPicker()
    })

    divImgDoc.innerHTML = `<input type="file" multiple accept="${FileDA.acceptFileTypes.join(',')}" style="display: none"/>
    <div class="popup-header semibold1 row">Image document<i class="fa-solid fa-xmark box24 center" style="font-size: 1.4rem; display: flex"></i></div>
    <div class="img-doc-body row" style="width: 100%; flex: 1; height: 100%; align-items: start">
        <div class="folder-list-container col" style="flex: 1">
            <div class="row semibold1" style="padding: 0.4rem 0.6rem;justify-content: space-between">Folder<i class="fa-solid fa-plus box24 center" style="font-size: 1.4rem; display: flex"></i></div>
            <div id="folder-${-1}" class="row folder-tile regular1 recycle-bin" style="padding: 0.4rem 0.6rem; gap: 0.6rem"><i class="fa-regular fa-folder box24 center" style="font-size: 1.4rem; pointer-events: none"></i>Recycle bin</div>
            <div class="col" style="flex: 1; height: 100%; overflow: hidden auto">
                ${renderFolderTile}
            </div>
        </div>
        <div class="col folder-content-container">
            <div class="row" style="gap: 0.8rem; width: 100%">
                ${TextField({
        returnType: 'string',
        style: 'width: 100%; flex: 1; padding: 0.2rem 0.4rem',
        className: 'regular1',
        placeholder: 'Search image...',
        prefix: '<i class="fa-solid fa-magnifying-glass box24 center" style="font-size: 1.2rem; pointer-events: none"></i>',
        onChange: ev => {
            ev.stopPropagation()
            selectFolder(CollectionDA.selectedDocument, ev.target.value)
        }
    })}
                <i class="fa-solid fa-arrow-up-from-bracket box24 center" style="font-size: 1.4rem; display: flex; color: var(--primary-color)"></i>
            </div>
        <div class="row list-img-container"><p class="semibold1">Select a folder</p></div>
        </div>
    </div>`
    return divImgDoc
}

function selectFolder(collectionItem, search = '') {
    CollectionDA.selectedDocument = collectionItem
    const oldSelectedTile = document.querySelector('.folder-tile.selected')
    if (oldSelectedTile) {
        oldSelectedTile.querySelector('i.box24').classList.remove('fa-folder-open')
        oldSelectedTile.querySelector('i.box24').classList.add('fa-folder')
        oldSelectedTile.classList.remove('selected')
    }
    const selectedTile = document.querySelector(`.folder-tile[id="folder-${collectionItem.ID}"]`)
    selectedTile.classList.add('selected')
    selectedTile.querySelector('i.box24').classList.remove('fa-folder')
    selectedTile.querySelector('i.box24').classList.add('fa-folder-open')
    let divImgs = document.querySelector('.list-img-container')
    let fileList = FileDA.list.filter(e => {
        if (search.trim() !== '' && !e.Name.toLowerCase().includes(search.toLowerCase().trim()))
            return false
        if (collectionItem.ID != -1) {
            return e.CollectionID == collectionItem.ID && !e.IsDeleted
        } else {
            return e.IsDeleted
        }
    })
    let children = []
    if (fileList.length > 0) {
        for (let file of fileList) {
            let _img = document.createElement('div')
            _img.setAttribute('fileID', file.ID)
            _img.className = 'img_folder_demo col8 col'
            _img.innerHTML = `<div class="img-value" style="background-image: url(${ConfigApi.urlFile + file.Url?.replaceAll(' ', '%20')})"></div><p class="comp-text regular1" style="width: 100%; text-align: center  ">${file.Name}</p>`
            $(_img).on('focus', '.comp-text', function (e) {
                e.target.select()
            })
            $(_img).on('blur', '.comp-text', async function (e) {
                file.Name = e.target.value
                await FileDA.edit(file)
                e.target.contentEditable = false
            })
            _img.onclick = function (e) {
                e.stopPropagation()
                $('.img_folder_demo').removeClass('selected')
                _img.classList.add('selected')
            }
            _img.ondblclick = function (e) {
                e.stopPropagation()
                $('.img_folder_demo').removeClass('selected')
                _img.classList.add('selected')
                if (selected_list.length === 1 && selected_list[0].value.classList.contains('w-svg') && file.Url.endsWith('.svg') && file.Size <= 2200) {
                    handleEditIconColor({ iconValue: file.Url })
                } else {
                    handleEditBackground({ image: file.Url })
                }
            }
            _img.onauxclick = function (e) {
                e.stopPropagation()
                $('.img_folder_demo').removeClass('selected')
                _img.classList.add('selected')
                let popupImgOptions = showPopup({
                    hiddenOverlay: true,
                    style: `left: ${e.pageX}px; top: ${e.pageY}px; background-color: #000000; border-radius: 0.2rem; width: fit-content`,
                    children: `<div class="img-option edit-img row" style="color: #ffffff">Edit</div><div class="img-option recycle-img row" style="color: #ffffff">Recycle</div><div class="img-option delete-img row" style="color: #ffffff">Delete</div>`
                })
                $(popupImgOptions).on('click', '.img-option.edit-img', function (e) {
                    e.stopPropagation()
                    _img.querySelector('comp-text').contentEditable = true
                    _img.querySelector('comp-text').focus()
                    popupImgOptions.remove()
                })
                $(popupImgOptions).on('click', '.img-option.delete-img', async function (e) {
                    e.stopPropagation()
                    if (CollectionDA.selectedDocument.ID == -1) {
                        await FileDA.delete(FileDA.selectedFile.map(file => file.ID))
                    } else {
                        await FileDA.recycle(FileDA.selectedFile.map(file => file.ID))
                    }
                    popupImgOptions.remove()
                })
                $(popupImgOptions).on('click', '.img-option.recycle-img', async function (e) {
                    e.stopPropagation()
                    await FileDA.recycle(FileDA.selectedFile.map(_file => _file.ID))
                    popupImgOptions.remove()
                })
            }
            children.push(_img)
        }
    } else {
        let notiText = document.createElement('p')
        notiText.innerHTML = CollectionDA.selectedDocument ? 'There are no images in this folder.' : 'Select a folder.'
        notiText.className = 'semibold1'
        children.push(notiText)
    }
    divImgs.replaceChildren(...children)
}

async function handleImportFile(event) {
    if (event.targetElement == 'popup_img_document') {
        let folderID = CollectionDA.selectedDocument?.ID
        if (folderID == undefined || folderID == -1) {
            folderID = CollectionDA.documentList.find(e => e.ID != -1).ID
        }
        FileDA.add(event.dataTransfer, folderID)
    } else if (event.targetElement == 'canvas_view') {
        let folderID = CollectionDA.selectedDocument?.ID
        if (folderID == undefined || folderID == -1) {
            folderID = CollectionDA.documentList.find(e => e.ID != -1).ID
        }
        let result = await FileDA.add(event.dataTransfer, folderID)
        selectParent(event)
        let offset = offsetScale(
            Math.min(minx, event.pageX),
            Math.min(miny, event.pageY)
        )
        let listAdd = []
        for (let fileItem of result) {
            let newRect
            if (fileItem.Name.endsWith('.svg')) {
                newRect = JSON.parse(JSON.stringify(WbClass.imgSvg))
                newRect.AttributesItem.Content = fileItem.Url
            } else {
                newRect = JSON.parse(JSON.stringify(WbClass.rectangle))
                newRect.Css = `background-image: url(${ConfigApi.urlFile + fileItem.Url.replaceAll(' ', '%20')
                    })`
            }
            let imgSize = await FileDA.getImageSize(ConfigApi.urlFile + fileItem.Url)
            let newObj = createWbaseHTML({
                w: imgSize.w,
                h: imgSize.h,
                x: offset.x - imgSize.w / 2,
                y: offset.y - imgSize.h / 2,
                parentid: parent.id?.length == 36 ? parent.id : wbase_parentID,
                newObj: newRect
            })
            listAdd.push(newObj)
        }
        handleWbSelectedList(listAdd)
        WBaseDA.add({ listWb: listAdd })
    }
}

function bringToFront() {
    selected_list.sort((a, b) => a.Sort - b.Sort)
    let parentWbase
    if (select_box_parentID == wbase_parentID) {
        let listChild = wbase_list.filter(
            e =>
                e.ParentID === wbase_parentID &&
                selected_list.every(selectItem => selectItem.GID != e.GID)
        )
        if (listChild.length == 0) return
        listChild.push(...selected_list)
        for (let i = 0; i < listChild.length; i++) {
            listChild[i].Sort = i
            listChild[i].value.style.zIndex = i
            listChild[i].value.style.order = i
        }
        arrange()
        parentWbase = {
            GID: wbase_parentID,
            ListChildID: listChild.map(e => e.GID)
        }
    } else {
        parentWbase = wbase_list.find(e => e.GID === select_box_parentID)
        if (parentWbase.CountChild == selected_list.length) return
        parentWbase.ListChildID = parentWbase.ListChildID.filter(id =>
            selected_list.every(selectItem => selectItem.GID != id)
        )
        parentWbase.ListChildID.push(...selected_list.map(e => e.GID))
        for (let i = 0; i < parentWbase.ListChildID.length; i++) {
            let thisWbase = wbase_list.find(e => e.GID == parentWbase.ListChildID[i])
            thisWbase.Sort = i
            thisWbase.value.style.zIndex = i
            thisWbase.value.style.order = i
        }
        arrange()
    }
    replaceAllLyerItemHTML()
    WBaseDA.parent([parentWbase, ...selected_list])
    updateHoverWbase()
    handleWbSelectedList(selected_list)
}

function bringFrontward() {
    let parentWbase
    if (select_box_parentID === wbase_parentID) {
        let listChild = wbase_list.filter(e => e.ParentID === wbase_parentID)
        for (let i = 0; i < listChild.length; i++) {
            listChild[i].Sort = i
            listChild[i].value.style.zIndex = i
            listChild[i].value.style.order = i
        }
        if (listChild.length == selected_list.length) return
        selected_list.forEach(e => {
            if (e.Sort < listChild.length - 1) e.Sort++
            e.value.style.zIndex = e.Sort
            e.value.style.order = e.Sort
        })
        listChild = wbase_list.filter(
            e =>
                e.ParentID === wbase_parentID &&
                selected_list.every(selectItem => selectItem.GID != e.GID)
        )
        for (let child of listChild) {
            if (selected_list.some(e => e.Sort == child.Sort)) child.Sort -= 1
            child.value.style.zIndex = child.Sort
            child.value.style.order = child.Sort
        }
        arrange()
        parentWbase = {
            GID: wbase_parentID,
            ListChildID: wbase_list
                .filter(e => e.ParentID === wbase_parentID)
                .map(e => e.GID)
        }
    } else {
        parentWbase = wbase_list.find(e => e.GID == select_box_parentID)
        for (let i = 0; i < parentWbase.ListChildID.length; i++) {
            let thisWbase = wbase_list.find(e => e.GID == parentWbase.ListChildID[i])
            thisWbase.Sort = i
            thisWbase.value.style.zIndex = i
            thisWbase.value.style.order = i
        }
        if (parentWbase.CountChild == selected_list.length) return
        selected_list.forEach(e => {
            if (e.Sort < parentWbase.CountChild - 1) e.Sort++
            e.value.style.zIndex = e.Sort
            e.value.style.order = e.Sort
        })
        parentWbase.ListChildID = parentWbase.ListChildID.filter(id =>
            selected_list.every(selectItem => selectItem.GID != id)
        )
        for (let id of parentWbase.ListChildID) {
            let thisWbase = wbase_list.find(e => e.GID == id)
            if (selected_list.some(e => e.Sort == thisWbase.Sort)) thisWbase.Sort -= 1
            thisWbase.value.style.zIndex = thisWbase.Sort
            thisWbase.value.style.order = thisWbase.Sort
        }
        arrange()
        parentWbase.ListChildID = wbase_list
            .filter(e => e.ParentID == parentWbase.GID)
            .map(e => e.GID)
    }
    replaceAllLyerItemHTML()
    WBaseDA.parent([parentWbase, ...selected_list])
    updateHoverWbase()
    handleWbSelectedList(selected_list)
}

function sendToBack() {
    selected_list.sort((a, b) => a.Sort - b.Sort)
    let parentWbase
    if (select_box_parentID == wbase_parentID) {
        let listChild = wbase_list.filter(
            e =>
                e.ParentID === wbase_parentID &&
                selected_list.every(selectItem => selectItem.GID != e.GID)
        )
        if (listChild.length == 0) return
        listChild.unshift(...selected_list)
        for (let i = 0; i < listChild.length; i++) {
            listChild[i].Sort = i
            listChild[i].value.style.zIndex = i
            listChild[i].value.style.order = i
        }
        arrange()
        parentWbase = {
            GID: wbase_parentID,
            ListChildID: listChild.map(e => e.GID)
        }
    } else {
        parentWbase = wbase_list.find(e => e.GID == select_box_parentID)
        if (parentWbase.CountChild == selected_list.length) return
        parentWbase.ListChildID = parentWbase.ListChildID.filter(id =>
            selected_list.every(selectItem => selectItem.GID != id)
        )
        parentWbase.ListChildID.unshift(...selected_list.map(e => e.GID))
        for (let i = 0; i < parentWbase.ListChildID.length; i++) {
            let thisWbase = wbase_list.find(e => e.GID == parentWbase.ListChildID[i])
            thisWbase.Sort = i
            thisWbase.value.style.zIndex = i
            thisWbase.value.style.order = i
        }
        arrange()
    }
    replaceAllLyerItemHTML()
    WBaseDA.parent([parentWbase, ...selected_list])
    updateHoverWbase()
    handleWbSelectedList(selected_list)
}

function sendBackward() {
    let parentWbase
    if (select_box_parentID == wbase_parentID) {
        let listChild = wbase_list.filter(e => e.ParentID === wbase_parentID)
        if (listChild.length == selected_list.length) return
        for (let i = 0; i < listChild.length; i++) {
            listChild[i].Sort = i
            listChild[i].value.style.zIndex = i
            listChild[i].value.style.order = i
        }
        selected_list.forEach(e => {
            if (e.Sort > 0) e.Sort -= 1
            e.value.style.zIndex = e.Sort
            e.value.style.order = e.Sort
        })
        listChild = wbase_list.filter(
            e =>
                e.ParentID === wbase_parentID &&
                selected_list.every(selectItem => selectItem.GID != e.GID)
        )
        for (let child of listChild) {
            if (selected_list.some(e => e.Sort == child.Sort)) child.Sort += 1
            child.value.style.zIndex = child.Sort
            child.value.style.order = child.Sort
        }
        arrange()
        parentWbase = {
            GID: wbase_parentID,
            ListChildID: wbase_list
                .filter(e => e.ParentID === wbase_parentID)
                .map(e => e.GID)
        }
    } else {
        parentWbase = wbase_list.find(e => e.GID == select_box_parentID)
        if (parentWbase.CountChild == selected_list.length) return
        for (let i = 0; i < parentWbase.ListChildID.length; i++) {
            let thisWbase = wbase_list.find(e => e.GID == parentWbase.ListChildID[i])
            thisWbase.Sort = i
            thisWbase.value.style.zIndex = i
            thisWbase.value.style.order = i
        }
        selected_list.forEach(e => {
            if (e.Sort > 0) e.Sort -= 1
            e.value.style.zIndex = e.Sort
            e.value.style.order = e.Sort
        })
        parentWbase.ListChildID = parentWbase.ListChildID.filter(id =>
            selected_list.every(selectItem => selectItem.GID !== id)
        )
        for (let id of parentWbase.ListChildID) {
            let thisWbase = wbase_list.find(e => e.GID == id)
            if (selected_list.some(e => e.Sort == thisWbase.Sort)) thisWbase.Sort += 1
            thisWbase.value.style.zIndex = thisWbase.Sort
            thisWbase.value.style.order = thisWbase.Sort
        }
        arrange()
        parentWbase.ListChildID = wbase_list
            .filter(e => e.ParentID == parentWbase.GID)
            .map(e => e.GID)
    }
    replaceAllLyerItemHTML()
    WBaseDA.parent([parentWbase, ...selected_list])
    updateHoverWbase()
    handleWbSelectedList(selected_list)
}

function detachComponent() {
    let detachList = selected_list.filter(
        e =>
            !e.value.closest(`.wbaseItem-value[isinstance][level="${e.Level - 1}"]`)
    )
    for (let wb of detachList) {
    }
}

function addAutoLayout() {
    if (selected_list.length === 1 && selected_list[0].value.classList.contains('w-container') && window.getComputedStyle(selected_list[0].value).display !== 'flex') {
        var listUpdate = [...selected_list]
        let wb = selected_list[0]
        if (wb.Level === 1 && wb.value.childElementCount && wb.value.querySelectorAll('.col-').length === 0) {
            wb.value.style.width = null
            wb.value.style.height = null
            wb.value.setAttribute('width-type', 'fit')
            wb.value.setAttribute('height-type', 'fit')
        }
        $(wb.value).addClass(select_box.w > select_box.h ? 'w-row' : 'w-col')
        $(wb.value).removeClass('w-block')
        wb.value.style.setProperty('--child-space', `8px`)
        wb.value.style.setProperty('--run-space', `0px`)
        wb.value.style.justifyContent = 'center'
        wb.value.style.alignItems = 'center'
        wb.value.style.setProperty('--padding', `8px`)
        wbase_list.forEach(cWb => {
            if (cWb.ParentID === selected_list[0].GID) {
                cWb.value.style.setProperty('--gutter', `8px`)
                cWb.Css = cWb.value.style.cssText
                listUpdate.push(cWb)
            }
        })
        wb.ListClassName = wb.value.className
        wb.Css = wb.value.style.cssText
        WBaseDA.edit(listUpdate, EnumObj.wBase)
        handleWbSelectedList(selected_list)
    } else {
        listUpdate = [...selected_list]
        let newWb = JSON.parse(JSON.stringify(WbClass.container))
        newWb.GID = uuidv4()
        newWb.AttributeID = uuidv4()
        newWb.AttributesItem.GID = newWb.AttributeID
        newWb.Level = selected_list[0].Level
        newWb.ListClassName = `wbaseItem-value w-container ${select_box.w > select_box.h ? 'w-row' : 'w-col'
            }`
        newWb.ParentID = selected_list[0].ParentID
        let newX = `${Math.min(
            ...selected_list.map(e => getWBaseOffset(e).x)
        ).toFixed(2)}px`
        let newY = `${Math.min(
            ...selected_list.map(e => getWBaseOffset(e).y)
        ).toFixed(2)}px`
        if (
            newWb.Level > 1 ||
            selected_list.some(wb => wb.value.querySelectorAll('.col-').length > 0)
        ) {
            newWb.Css += `width: ${Math.ceil(
                select_box.w / scale
            )}px; height: ${Math.ceil(select_box.h / scale)}px;`
        }
        initComponents(newWb, [])
        newWb.value.style.setProperty('--child-space', `8px`)
        newWb.value.style.setProperty('--child-space', `8px`)
        newWb.value.style.setProperty('--run-space', `0px`)
        newWb.value.style.justifyContent = 'center'
        newWb.value.style.alignItems = 'center'
        newWb.value.style.setProperty('--padding', `8px`)
        if (newWb.Level > 1) {
            let pWb = wbase_list.find(e => e.GID === newWb.ParentID)
            listUpdate.push(pWb)
            var childrenHTML = [
                ...pWb.value.querySelectorAll(
                    `.wbaseItem-value[level="${parseInt(pWb.value.getAttribute('level') ?? '0') + 1
                    }"]`
                )
            ]
            if (pWb.value.classList.contains('w-table')) {
                let cellList = pWb.TableRows.reduce((a, b) => a.concat(b))
                let availableCell = cellList.find(cd =>
                    cd.contentid.includes(selected_list[0].GID)
                )
                parentHTML
                    .querySelector(
                        `:scope > .table-row > .table-cell[id="${availableCell.id}"]`
                    )
                    .appendChild(newWb.value)
                cellList.forEach(cd => {
                    cd.contentid = cd.contentid
                        .split(',')
                        .filter(id => selected_list.every(e => e.GID !== id))
                        .join(',')
                    if (cd.id === availableCell.id) cd.contentid = newWb.GID
                })
            } else if (!window.getComputedStyle(pWb.value).display.match('flex')) {
                childrenHTML[childrenHTML.indexOf(selected_list[0].value)] = newWb.value
                childrenHTML = childrenHTML.filter(e =>
                    selected_list.every(wb => e !== wb.value)
                )
                newWb.value.style.left = newX
                newWb.value.style.top = newY
                newWb.value.setAttribute('constx', Constraints.left)
                newWb.value.setAttribute('consty', Constraints.top)
                pWb.value.replaceChildren(...childrenHTML)
            } else {
                childrenHTML[childrenHTML.indexOf(selected_list[0].value)] = newWb.value
                childrenHTML = childrenHTML.filter(e =>
                    selected_list.every(wb => e !== wb.value)
                )
                pWb.value.replaceChildren(...childrenHTML)
            }
        } else {
            childrenHTML = [
                ...divSection.querySelectorAll(`.wbaseItem-value[level="1"]`)
            ]
            childrenHTML[childrenHTML.indexOf(selected_list[0].value)] = newWb.value
            childrenHTML = childrenHTML.filter(e =>
                selected_list.every(wb => e !== wb.value)
            )
            newWb.value.style.left = newX
            newWb.value.style.top = newY
            newWb.value.setAttribute('constx', Constraints.left)
            newWb.value.setAttribute('consty', Constraints.top)
            divSection.replaceChildren(...childrenHTML)
        }
        for (let wb of selected_list) {
            wb.ParentID = newWb.GID
            wb.value.setAttribute('parentid', newWb.GID)
            wb.value.removeAttribute('constx')
            wb.value.removeAttribute('consty')
            wb.value.style.setProperty('--gutter', `8px`)
            wb.value.style.left = null
            wb.value.style.top = null
            wb.value.style.right = null
            wb.value.style.bottom = null
            wb.value.style.transform = null
            wb.value.style.zIndex = null
            wb.Css = wb.value.style.cssText
        }
        newWb.value.replaceChildren(...selected_list.map(e => e.value))
        newWb.Css = newWb.value.style.cssText
        wbase_list.push(newWb)
        listUpdate.push(newWb)
        arrange()
        wbase_list.forEach(wb => {
            if (wb !== newWb && newWb.value.contains(wb.value)) {
                wb.Level += 1
                wb.value.setAttribute('level', wb.Level)
            }
        })
        replaceAllLyerItemHTML()
        handleWbSelectedList([newWb])
        WBaseDA.parent(listUpdate)
    }
}
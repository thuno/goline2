var left_view, right_view, layer_view, assets_view, design_view, prototype_view, state_view, divMain, divSection, prototypePoint, prototype_selected_page, selectPath;
var scale = 1;
var topx = 0,
    leftx = 0,
    leftw = 0,
    reightw = 0,
    keyid = 'escape', // Key ESC
    is_dbclick = false
const factor = 0.05
const min_scale = 0.02
const max_scale = 256
var listLine = [] // gid, x,y,x1,y1
var width = document.body?.clientWidth
var height = document.body?.clientHeight
var totalH = height + scale
var totalW = width + scale
var showF12 = false
var design_view_index = 0
const isMac = navigator.userAgent.indexOf('Mac OS X') != -1
var select_component
$('body > #body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@ee0df5c/project-component/loading.html', async function () {
    const pId = location.hash.match(/file\?id\=[\d]*/g)[0].replace('file?id=', "")
    await ProjectDA.getByID(parseInt(pId))
    const res = await ProjectDA.getPermission()
    if (res.Code === 200) {
        for (let wpageItem of res.Data.WPageItems) {
            if (wpageItem.Name == undefined) {
                wpageItem.Name = `Page ${i + 1}`
            }
        }
        PageDA.list.push(...res.Data.WPageItems)
        if (PageDA.list.length > 0) {
            PageDA.obj = Ultis.getStorage('opening-page')
            if (checkTypeof(PageDA.obj) === 'string')
                PageDA.obj = JSON.parse(PageDA.obj)
            if (!PageDA.obj || PageDA.obj.ProjectID != ProjectDA.obj.ID) {
                PageDA.obj = PageDA.list.find(e => e.ID === ProjectDA.obj.PageDefaultID) ?? PageDA.list[0]
            }
            PageDA.obj.Permission = PageDA.obj.Permission
            PageDA.checkEditPermission(PageDA.obj.Permission)
        }
    }
    $('body > #body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@ee0df5c/screen/module/file/local-component/body-layout.html', async function () {
        permissionTool()
        customerList()
        left_view = document.getElementById('left_view')
        right_view = document.getElementById('right_view')
        layer_view = document.getElementById('Layer')
        assets_view = document.getElementById('Assets')
        design_view = document.getElementById('Design')
        prototype_view = document.getElementById('Prototype')
        state_view = document.getElementById('State')
        divMain = document.getElementById('canvas_view')
        divSection = document.getElementById('divSection')
        divSection.style.transform = `scale(${scale}, ${scale})`
        leftw = left_view?.offsetWidth ?? 0
        reightw = right_view?.offsetWidth ?? 0
        divSection.replaceChildren()
        let wbaseResponse = await WBaseDA.apiGetInitWbase()
        StyleDA.initSkin(ProjectDA.obj.ID).then(skinResponse => {
            CateDA.initCate()
            StyleDA.listSkin = skinResponse
            StyleDA.listSkin.forEach(skin => {
                document.documentElement.style.setProperty(`--${skin.GID}`, skin.Css)
            })
        })
        // PropertyDA.list = skinResponse.Data.WPropertyItems
        console.log('get server done: ', Date.now())
        wbase_list = initDOM(wbaseResponse)
        arrange()
        for (let wb of wbase_list) {
            wb.value = null
            initComponents(wb)
            if (wb.Level === 1) divSection.appendChild(wb.value)
        }
        StyleDA.docStyleSheets.forEach(cssRuleItem => {
            if (cssRuleItem.style.length > 0) {
                divSection
                    .querySelectorAll(cssRuleItem.selectorText)
                    .forEach(wbHTML => setAttributeByStyle(wbHTML, cssRuleItem.style))
            }
        })
        divSection
            .querySelectorAll('.wbaseItem-value[isinstance][class*="w-st0"]')
            .forEach(wbHTML => setAttributeByStyle(wbHTML))
        setupRightView()
        setupLeftView()
        if (!PageDA.obj.scale) {
            topx = PageDA.obj.topx
            leftx = PageDA.obj.leftx
            scale = PageDA.obj.scale
            divSection.style.top = topx + 'px'
            divSection.style.left = leftx + 'px'
            divSection.style.transform = `scale(${scale}, ${scale})`
            input_scale_set(scale * 100)
            positionScrollLeft()
            positionScrollTop()
        } else {
            initScroll(
                wbase_list
                    .filter(m => m.ParentID === wbase_parentID)
                    .map(m => m.StyleItem)
            )
        }
        centerViewInitListener()
        WiniIO.emitInit()
    })
});

function initDOM(list) {
    list.forEach(e => {
        e.value = document.createElement('div')
        e.value.id = e.GID
        if (e.IsWini && !e.CopyID) e.value.setAttribute('iswini', 'true')
    })
    let sortItems = []
    let newList = []
    list.forEach(e => {
        if (e.ParentID === wbase_parentID) {
            e.Level = 1
        } else {
            let parent = list.find(eP => eP.GID === e.ParentID)
            if (parent) {
                sortItems.push(e)
                parent.value.appendChild(e.value)
            } else {
                if (wbase_list.length > 0) {
                    parent = document.getElementById(e.ParentID)
                    if (parent) e.Level = parseInt(parent.getAttribute('level')) + 1
                }
                if (!parent) {
                    e.ParentID = wbase_parentID
                    e.Level = 1
                }
            }
        }
        newList.push(e)
    })
    sortItems.forEach(e => {
        e.Level =
            [...$(e.value).parents('div')].map(eP => {
                if (eP.getAttribute('iswini') && !e.IsWini) {
                    delete e.CopyID
                    delete e.ChildID
                }
                return eP.id
            }).length + 1
    })
    return newList
}

function initComponents(wb, children) {
    if (wb.AttributesItem.Json) {
        wb.JsonItem = JSON.parse(wb.AttributesItem.Json)
    }
    if (wb.AttributesItem.JsonEvent) {
        wb.JsonEventItem = JSON.parse(wb.AttributesItem.JsonEvent)
    }
    if (wb.AttributesItem.Variables) {
        wb.VariablesData = JSON.parse(wb.AttributesItem.Variables)
    }
    // if (wb.IsWini) {
    //   if (wb.ListClassName.includes('w-variant')) {
    //     wb.PropertyItems = PropertyDA.list.filter(e => e.BaseID == wb.GID)
    //     for (let property of wb.PropertyItems) {
    //       property.BasePropertyItems = property.BasePropertyItems.filter(e =>
    //         wb.ListChildID.some(id => id === e.BaseID)
    //       )
    //     }
    //   } else {
    //     let listBaseProperty = PropertyDA.list.map(e => e.BasePropertyItems)
    //     if (listBaseProperty.length > 0) {
    //       wb.BasePropertyItems = listBaseProperty
    //         .reduce((a, b) => a.concat(b))
    //         .filter(e => e.BaseID === wb.GID)
    //     } else {
    //       wb.BasePropertyItems = []
    //     }
    //   }
    // }
    switch (wb.ListClassName.split(' ')[1]) {
        case 'w-container':
            children ??= wbase_list.filter(e => e.ParentID === wb.GID)
            createContainerHTML(wb, children)
            break
        case 'w-form':
            children ??= wbase_list.filter(e => e.ParentID === wb.GID)
            createContainerHTML(wb, children)
            break
        case 'w-variant':
            children ??= wbase_list.filter(e => e.ParentID === wb.GID)
            createVariantHTML(wb, children)
            break
        case 'w-text':
            createTextHTML(wb)
            break
        case 'w-textfield':
            createTextFieldHTML(wb)
            break
        case 'w-textformfield':
            children ??= wbase_list.filter(e => e.ParentID === wb.GID)
            createTextFormFieldHTML(wb, children)
            break
        case 'w-switch':
            createSwitchHTML(wb)
            break
        case 'w-svg':
            createIconHTML(wb)
            break
        case 'w-checkbox':
            createCheckBoxHTML(wb)
            break
        case 'w-radio':
            createRadioHTML(wb)
            break
        // case EnumCate.progress_bar:
        //   createProgressBarHTML(item)
        //   break
        case 'w-button':
            children ??= wbase_list.filter(e => e.ParentID === wb.GID)
            wbutton(wb, children)
            break
        case 'w-table':
            if (wb.AttributesItem.Content != '')
                wb.TableRows = JSON.parse(wb.AttributesItem.Content)
            createTableHTML(wb, list)
            break
        // case EnumCate.datePicker:
        //   createDatePickerHTML(item)
        //   break
        // case EnumCate.chart:
        //   if (item.AttributesItem.Content != '')
        //     item.ChartData = JSON.parse(item.AttributesItem.Content)
        //   createChartHTML(item)
        //   break
        default:
            wb.value = document.createElement('div')
            break
    }
    // if (
    //   item.AttributesItem.NameField &&
    //   item.AttributesItem.NameField.trim() != ''
    // )
    // $(item.value).attr('name-field', item.AttributesItem.NameField)
    //
    wb.value.id = wb.GID
    wb.value.className = wb.ListClassName
    wb.value.setAttribute('level', wb.Level)
    //
    wb.value.setAttribute('parentid', wb.ParentID)
    if (wb.IsWini) {
        wb.value.setAttribute('iswini', wb.IsWini)
    } else if ([...wb.value.classList].some(cls => cls.startsWith('w-st0')) && wb.CopyID) {
        wb.value.setAttribute('isinstance', true)
        wb.IsInstance = true
    }
    if (wb.Css?.length > 0) {
        wb.value.style = wb.Css
        setAttributeByStyle(wb.value)
    }
}

function setAttributeByStyle(wbHTML, cssRule) {
    cssRule ??= wbHTML.style
    for (let stProp of cssRule) {
        switch (stProp) {
            case 'width':
                switch (cssRule[stProp]) {
                    case '100%':
                        wbHTML.setAttribute('width-type', 'fill')
                        break
                    case 'fit-content':
                        wbHTML.setAttribute('width-type', 'fit')
                        break
                    case 'max-content':
                        wbHTML.setAttribute('width-type', 'fit')
                        break
                    default:
                        wbHTML.removeAttribute('width-type')
                        break
                }
                break
            case 'height':
                switch (cssRule[stProp]) {
                    case '100%':
                        wbHTML.setAttribute('height-type', 'fill')
                        break
                    case 'fit-content':
                        wbHTML.setAttribute('height-type', 'fit')
                        break
                    default:
                        wbHTML.removeAttribute('height-type')
                        break
                }
                break
            case 'left':
                if (cssRule[stProp].includes('calc')) {
                    wbHTML.setAttribute('constX', Constraints.center)
                } else if (cssRule[stProp].includes('%')) {
                    wbHTML.setAttribute('constX', Constraints.scale)
                } else if (cssRule['right']) {
                    wbHTML.setAttribute('constX', Constraints.left_right)
                } else {
                    wbHTML.setAttribute('constX', Constraints.left)
                }
                break
            case 'right':
                if (!cssRule['left']) {
                    wbHTML.setAttribute('constX', Constraints.right)
                }
                break
            case 'top':
                if (cssRule[stProp].includes('calc')) {
                    wbHTML.setAttribute('constY', Constraints.center)
                } else if (cssRule[stProp].includes('%')) {
                    wbHTML.setAttribute('constY', Constraints.scale)
                } else if (cssRule['bottom']) {
                    wbHTML.setAttribute('constY', Constraints.top_bottom)
                } else {
                    wbHTML.setAttribute('constY', Constraints.top)
                }
                break
            case 'bottom':
                if (!cssRule['top']) {
                    wbHTML.setAttribute('constY', Constraints.bottom)
                }
                break
            case 'flex-wrap':
                if (cssRule[stProp] === 'wrap') {
                    wbHTML.setAttribute('wrap', 'wrap')
                }
                break
            case 'overflow':
                if (cssRule[stProp] === 'scroll') {
                    wbHTML.setAttribute('scroll', 'true')
                }
                break
            case 'position':
                const levelAttr = `[level="${parseInt(wbHTML.getAttribute('level')) - 1
                    }"]`
                if (
                    cssRule[stProp] === 'absolute' &&
                    wbHTML.closest(`.w-row${levelAttr}, .w-col${levelAttr}`)
                )
                    wbHTML.classList.add('fixed-position')
                break
            default:
                break
        }
    }
    if (cssRule.width === '') wbHTML.setAttribute('width-type', 'fit')
    if (cssRule.height === '') wbHTML.setAttribute('height-type', 'fit')
}

function getWBaseOffset(wb) {
    let leftValue
    let topValue
    if (wb.ParentID === wbase_parentID) {
        leftValue = Math.round(
            parseFloat(`${wb.value.style.left}`.replace('px', '')).toFixed(2)
        )
        topValue = Math.round(
            parseFloat(`${wb.value.style.top}`.replace('px', '')).toFixed(2)
        )
    } else {
        leftValue = Math.round(
            (wb.value.getBoundingClientRect().x -
                document.getElementById(wb.ParentID).getBoundingClientRect().x) /
            scale
        ).toFixed(2)
        topValue = Math.round(
            (wb.value.getBoundingClientRect().y -
                document.getElementById(wb.ParentID).getBoundingClientRect().y) /
            scale
        ).toFixed(2)
    }
    return { x: parseFloat(leftValue), y: parseFloat(topValue) }
}

async function callAPI(request) {
    var listParam = InputDA.list.filter(
        e => e.APIID == request.ID && e.Type == enumTypeInput.param
    )
    var listHeader = InputDA.list.filter(
        e => e.APIID == request.ID && e.Type == enumTypeInput.header
    )
    var listBody = InputDA.list.filter(
        e => e.APIID == request.ID && e.Type == enumTypeInput.body
    )

    let requestUrl = handleRequestUrl(request, listParam)
    let headers = handleListInput(listHeader)
    let contentType = 'content-Type'
    headers[contentType] = 'application/json'
    let body = handleListInput(listBody)

    var response
    if (request.Type == 1) {
        response = await post(requestUrl, headers, body)
    } else {
        response = await get(requestUrl, headers)
    }

    return response
}

function addStyleComponents(item, elements) {
    if (item.IsWini == true) {
        elements.setAttribute('class', item.StyleItem.Name)
    }
}

function handleListInput(listInput) {
    let _obj = {}
    listInput.forEach(function (item) {
        let name = item.Name
        _obj[name] = item.Value
    })
    return _obj
}

function handleRequestUrl(request, listParam) {
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

function wMainAxis(key, isHorizontal) {
    if (isHorizontal == null) {
        if (key.includes('Left')) {
            return '-webkit-left'
        } else if (key.includes('Right')) {
            return '-webkit-right'
        } else {
            return '-webkit-center'
        }
    } else if (isHorizontal) {
        if (key.includes('Left')) {
            return 'start'
        } else if (key.includes('Right')) {
            return 'end'
        } else if (key.includes('SpaceBetween')) {
            return 'space-between'
        } else {
            return 'center'
        }
    } else {
        if (key.includes('Top')) {
            return 'start'
        } else if (key.includes('Bottom')) {
            return 'end'
        } else if (key.includes('SpaceBetween')) {
            return 'space-between'
        } else {
            return 'center'
        }
    }
}

function wCrossAxis(key, isHorizontal) {
    if (isHorizontal == undefined) {
        if (key.includes('Top')) {
            return 'top'
        } else if (key.includes('Bottom')) {
            return 'bottom'
        } else {
            return 'middle'
        }
    } else if (isHorizontal) {
        if (key.includes('Top')) {
            return 'start'
        } else if (key.includes('Bottom')) {
            return 'end'
        } else {
            return 'center'
        }
    } else {
        if (key.includes('Left')) {
            return 'start'
        } else if (key.includes('Right')) {
            return 'end'
        } else {
            return 'center'
        }
    }
}

function mainAxisToAlign(key, isHorizontal) {
    if (isHorizontal == null) {
        switch (key) {
            case '-webkit-left':
                return 'Left'
            case '-webkit-right':
                return 'Right'
            default: // '-webkit-center'
                return 'Center'
        }
    } else if (isHorizontal) {
        switch (key) {
            case 'start':
                return 'Left'
            case 'end':
                return 'Right'
            case 'space-between':
                return 'SpaceBetween'
            default:
                return 'Center'
        }
    } else {
        switch (key) {
            case 'start':
                return 'Top'
            case 'end':
                return 'Bottom'
            case 'space-between':
                return 'SpaceBetween'
            default:
                return 'Center'
        }
    }
}

function crossAxisToAlign(key, isHorizontal) {
    if (isHorizontal == undefined) {
        switch (key) {
            case 'top':
                return 'Top'
            case 'bottom':
                return 'Bottom'
            default: // 'middle'
                return 'Center'
        }
    } else if (isHorizontal) {
        switch (key) {
            case 'start':
                return 'Top'
            case 'end':
                return 'Bottom'
            default:
                return 'Center'
        }
    } else {
        switch (key) {
            case 'start':
                return 'Left'
            case 'end':
                return 'Right'
            default:
                return 'Center'
        }
    }
}

// 
// 
function input_scale_set(value) {
    settingsPage = true
    share_tool.querySelector('div:last-child > input').innerHTML = `${Math.floor(value)}%`
}

function toolStateChange(toolState) {
    if (tool_state != toolState) {
        if (
            ToolState.resize_type.every(
                tool => tool !== toolState && tool_state !== tool
            )
        ) {
            let current_tool_state = document.getElementById(`${tool_state}`)
            $(current_tool_state).removeClass('on-select')
            let new_tool_state = document.getElementById(`${toolState}`)
            $(new_tool_state).addClass('on-select')
        }
        tool_state = toolState
        switch (tool_state) {
            case ToolState.move:
                document.getElementById('canvas_view').style.cursor = 'context-menu'
                break
            case ToolState.hand_tool:
                document.getElementById('canvas_view').style.cursor = 'grab'
                break
            case ToolState.resize_left:
                document.getElementById('canvas_view').style.cursor = 'e-resize'
                break
            case ToolState.resize_right:
                document.getElementById('canvas_view').style.cursor = 'e-resize'
                break
            case ToolState.resize_top:
                document.getElementById('canvas_view').style.cursor = 'n-resize'
                break
            case ToolState.resize_bot:
                document.getElementById('canvas_view').style.cursor = 'n-resize'
                break
            case ToolState.resize_top_left:
                document.getElementById('canvas_view').style.cursor = 'nw-resize'
                break
            case ToolState.resize_top_right:
                document.getElementById('canvas_view').style.cursor = 'ne-resize'
                break
            case ToolState.resize_bot_left:
                document.getElementById('canvas_view').style.cursor = 'ne-resize'
                break
            case ToolState.resize_bot_right:
                document.getElementById('canvas_view').style.cursor = 'nw-resize'
                break
            default:
                if (ToolState.create_new_type.some(tool => tool_state === tool)) {
                    document.getElementById('canvas_view').style.cursor = 'cell'
                } else {
                    document.getElementById('canvas_view').style.cursor = 'context-menu'
                }
                break
        }
    }
    if (
        [ToolState.hand_tool, ...ToolState.create_new_type].some(
            tool => tool_state == tool
        )
    ) {
        handleWbSelectedList()
        listLine = []
        listText = []
        updateHoverWbase()
    }
}

function createNewWbase({ wb, relativeWbs = [], level }) {
    let list_new_wbase = []
    let newWb = JSON.parse(JSON.stringify(wb))
    delete newWb.children
    newWb.GID = uuidv4()
    newWb.IsWini = false
    delete newWb.BasePropertyItems
    delete newWb.PropertyItems
    delete newWb.value
    delete newWb.ProtoType
    delete newWb.PrototypeID
    newWb.Level = level
    if (newWb.JsonEventItem)
        newWb.JsonEventItem = newWb.JsonEventItem.filter(e => e.Name === 'State')
    if (newWb.AttributesItem) {
        newWb.AttributeID = uuidv4()
        newWb.AttributesItem.GID = newWb.AttributeID
        if (newWb.JsonEventItem)
            newWb.AttributesItem.JsonEvent = JSON.stringify(newWb.JsonEventItem)
    }
    let list_child = relativeWbs.filter(e => e.ParentID === wb.GID)
    if (list_child.length) {
        for (let child of list_child) {
            let new_children = createNewWbase({
                wb: child,
                relativeWbs: relativeWbs,
                level: newWb.Level + 1
            })
            list_new_wbase.push(...new_children)
            switch (newWb.ListClassName.includes('w-table')) {
                case EnumCate.table:
                    newWb.AttributesItem.Content = newWb.AttributesItem.Content.replace(
                        child.GID,
                        new_children.find(e => e.ParentID === newWb.GID).GID
                    )
                    break
                default:
                    break
            }
        }
    }
    newWb.PageID = PageDA.obj.ID
    list_new_wbase.push(newWb)
    list_new_wbase.sort((a, b) => b.Level - a.Level)
    return list_new_wbase
}

//! .................................................................................................
function createWbaseHTML({ parentid, x, y, w, h, newObj }) {
    WBaseDA.listData = []
    if (newObj) {
        var new_obj = newObj
    } else {
        switch (tool_state) {
            case ToolState.rectangle:
                new_obj = WbClass.rectangle
                break
            case ToolState.container:
                new_obj = WbClass.container
                break
            case ToolState.text:
                new_obj = WbClass.text
                break
            case ToolState.base_component:
                let thisBaseComponent = base_component_list.find(
                    baseCom =>
                        baseCom.ParentID === wbase_parentID &&
                        baseCom.CateID == $('#choose-component-popup').attr('cateid')
                )
                if (thisBaseComponent)
                    new_obj = JSON.parse(JSON.stringify(thisBaseComponent))
                else {
                    toolStateChange(ToolState.move)
                    return
                }
                break
            default:
                break
        }
    }
    if (new_obj) {
        new_obj.ParentID = parentid
        let pWbHTML = document.getElementById(parentid) ?? divSection
        if (tool_state === ToolState.base_component) {
            let relativeWbase = base_component_list.filter(baseCom =>
                baseCom.ListID.includes(new_obj.GID)
            )
            let listNewWbase = createNewWbase({
                wb: new_obj,
                relativeWbs: relativeWbase,
                level: parseInt(pWbHTML.getAttribute('level') ?? 0) + 1,
                sort: pWbHTML.querySelectorAll(
                    `.wbaseItem-value[level="${parseInt(pWbHTML.getAttribute('level') ?? '0') + 1
                    }"]`
                ).length
            })
            listNewWbase.forEach(wbaseItem => {
                initComponents(
                    wbaseItem,
                    listNewWbase.filter(e => e.ParentID == wbaseItem.GID)
                )
            })
            WBaseDA.listData.push(...listNewWbase)
            new_obj = listNewWbase.pop()
            wbase_list.push(...listNewWbase)
        } else {
            new_obj = createNewWbase({
                wb: new_obj,
                level: parseInt(pWbHTML.getAttribute('level') ?? 0) + 1
            }).pop()
            initComponents(new_obj, [])
            if (!w && tool_state === ToolState.text) {
                new_obj.Css += `width: max-content;`
                new_obj.value.setAttribute('width', 'fit')
                new_obj.value.setAttribute('height', 'fit')
            } else {
                new_obj.Css += `width: ${w ?? 100}px;height: ${h ?? 100}px;`
            }
        }

        if (pWbHTML === divSection || pWbHTML.classList.contains('w-block')) {
            if (pWbHTML.classList.contains('w-block')) {
                let pRect = pWbHTML.getBoundingClientRect()
                new_obj.Css += `left: ${x - offsetScale(pRect.x, 0).x}px;top: ${y - offsetScale(0, pRect.y).y
                    }px;`
            } else {
                new_obj.Css += `left: ${x}px;top: ${y}px;`
            }
            new_obj.value.setAttribute('constx', Constraints.left)
            new_obj.value.setAttribute('consty', Constraints.top)
            pWbHTML.appendChild(new_obj.value)
        } else if (pWbHTML.classList.contains('w-table')) {
            var pWb = wbase_list.find(wb => wb.GID === parentid)
            let availableCell = findCell(pWbHTML, {
                pageX: offsetConvertScale(x, 0).x,
                pageY: offsetConvertScale(0, y).y
            })
            availableCell.appendChild(new_obj.value)
            pWb.TableRows.reduce((a, b) => a.concat(b)).find(
                cell => cell.id === availableCell.id
            ).contentid = [...availableCell.childNodes].map(e => e.id).join(',')
        } else {
            let children = [
                ...pWbHTML.querySelectorAll(
                    `.wbaseItem-value[level="${new_obj.Level}"]`
                )
            ]
            let isGrid = window.getComputedStyle(pWbHTML).flexWrap == 'wrap'
            if (pWbHTML.classList.contains('w-col')) {
                var zIndex = 0
                if (children.length > 0) {
                    let closestHTML = [...children].sort((aHTML, bHTML) => {
                        let aRect = aHTML.getBoundingClientRect()
                        let bRect = bHTML.getBoundingClientRect()
                        let a_center_oy
                        let b_center_oy
                        if (isGrid) {
                            a_center_oy = Math.sqrt(
                                Math.pow(x - offsetScale(aRect.x + aRect.width / 2, 0).x, 2) +
                                Math.pow(y - offsetScale(0, aRect.y + aRect.height / 2).y, 2)
                            )
                            b_center_oy = Math.sqrt(
                                Math.pow(x - offsetScale(bRect.x + bRect.width / 2, 0).x, 2) +
                                Math.pow(y - offsetScale(0, bRect.y + bRect.height / 2).y, 2)
                            )
                        } else {
                            a_center_oy = Math.abs(
                                y - offsetScale(0, aRect.y + aRect.height / 2).y
                            )
                            b_center_oy = Math.abs(
                                y - offsetScale(0, bRect.y + bRect.height / 2).y
                            )
                        }
                        return a_center_oy - b_center_oy
                    })[0]
                    if (isGrid) {
                        closestHTML = children.find(
                            childHTML =>
                                childHTML.getBoundingClientRect().right >=
                                offsetConvertScale(x, 0).x
                        )
                    }
                    if (closestHTML) {
                        let htmlRect = closestHTML.getBoundingClientRect()
                        zIndex = children.indexOf(closestHTML)
                        distance = y - offsetScale(0, htmlRect.y + htmlRect.height / 2).y
                        if (distance < 0) zIndex--
                    } else {
                        zIndex = children.length - 1
                    }
                }
            } else {
                zIndex = 0
                if (children.length > 0) {
                    let closestHTML = [...children].sort((aHTML, bHTML) => {
                        let aRect = aHTML.getBoundingClientRect()
                        let bRect = bHTML.getBoundingClientRect()
                        let a_center_ox
                        let b_center_ox
                        if (isGrid) {
                            a_center_ox = Math.sqrt(
                                Math.pow(x - offsetScale(aRect.x + aRect.width / 2, 0).x, 2) +
                                Math.pow(y - offsetScale(0, aRect.y + aRect.height / 2).y, 2)
                            )
                            b_center_ox = Math.sqrt(
                                Math.pow(x - offsetScale(bRect.x + bRect.width / 2, 0).x, 2) +
                                Math.pow(y - offsetScale(0, bRect.y + bRect.height / 2).y, 2)
                            )
                        } else {
                            a_center_ox = Math.abs(
                                x - offsetScale(aRect.x + aRect.width / 2, 0).x
                            )
                            b_center_ox = Math.abs(
                                x - offsetScale(bRect.x + bRect.width / 2, 0).x
                            )
                        }
                        return a_center_ox - b_center_ox
                    })[0]
                    if (isGrid) {
                        closestHTML = children.find(
                            childHTML =>
                                childHTML.getBoundingClientRect().bottom >=
                                offsetConvertScale(0, y).y
                        )
                    }
                    if (closestHTML) {
                        let htmlRect = closestHTML.getBoundingClientRect()
                        zIndex = children.indexOf(closestHTML)
                        distance = x - offsetScale(htmlRect.x + htmlRect.width / 2, 0)
                        if (distance < 0) zIndex--
                    } else {
                        zIndex = children.length - 1
                    }
                }
            }
            pWbHTML.replaceChildren(
                ...children.slice(0, zIndex + 1),
                new_obj.value,
                ...children.slice(zIndex + 1)
            )
            new_obj.value.style.order = $(new_obj.value).index()
            wbase_list
                .filter(e => e.ParentID === pWbHTML.id)
                .forEach(e => {
                    const newZindex = $(e.value).index()
                    if (newZindex != window.getComputedStyle(e.value).order) {
                        e.value.style.order = newZindex
                        WBaseDA.listData.push(e)
                    }
                })
        }
        new_obj.value.style.cssText = new_obj.Css
        wbase_list.push(new_obj)
        arrange()
        replaceAllLyerItemHTML()
    }
    toolStateChange(ToolState.move)
    if (newObj) {
        return new_obj
    } else {
        listRect = [] // xóa tất cả hình vẽ đang tồn tại để hiện thị selectedRect trên canvas
        handleWbSelectedList([new_obj])
        if (new_obj.value.classList.contains('w-text')) {
            new_obj.isNew = true
            new_obj.value.querySelector('span').contentEditable = true
            new_obj.value.querySelector('span').focus()
        } else {
            WBaseDA.enumEvent = EnumEvent.add
        }
        return
    }
}

function arrange(list) {
    if (list) {
        list.sort((a, b) => b.Level - a.Level)
    } else {
        wbase_list.sort((a, b) => b.Level - a.Level)
    }
}

function handleWbSelectedList(newlist = []) {
    newlist = newlist.filter(e => e).slice(0, 10)
    let isChange = false
    left_view
        .querySelectorAll('.layer_wbase_tile.selected')
        .forEach(layerTile => layerTile.classList.remove('selected'))
    selectPath?.remove()
    if (newlist.length > 0) {
        isChange = selected_list.some(oldE => newlist.every(newE => oldE !== newE))
        selected_list = newlist
        let layerTile
        for (let wb of selected_list.reverse()) {
            layerTile = document.getElementById(`wbaseID:${wb.GID}`)
            if (layerTile) layerTile.classList.add('selected')
        }
        ;[...$(layerTile).parents(`.col:has(> .layer_wbase_tile)`)].forEach(e => {
            let layer = e.querySelector('.layer_wbase_tile')
            if (layer !== layerTile) {
                let prefixIcon = layer.querySelector('.prefix-btn')
                if (prefixIcon)
                    prefixIcon.className = prefixIcon.className.replace('right', 'down')
            }
        })
        selected_list.sort((a, b) => $(a.value).index() - $(b.value).index())
        select_box_parentID = selected_list[0].ParentID
        let layerSelect = document.getElementById(`wbaseID:${selected_list[0].GID}`)
        let layerParentRect = document
            .getElementById(`parentID:${wbase_parentID}`)
            .getBoundingClientRect()
        if (
            layerSelect &&
            !isInRange(
                layerSelect.getBoundingClientRect().y,
                layerParentRect.y,
                layerParentRect.y + layerParentRect.height,
                true
            )
        ) {
            let scrollToY =
                layerSelect.offsetTop -
                layerSelect.offsetHeight -
                document.getElementById('div_list_page').offsetHeight -
                8
            document.getElementById(`parentID:${wbase_parentID}`).scrollTo({
                top: scrollToY,
                behavior: 'smooth'
            })
        }
    } else {
        selected_list = []
    }
    console.log('isChange: ', isChange)
    if (!objr && tool_state === ToolState.move) {
        if (isChange) {
            console.log('selected_list:', selected_list)
            // if (!WBaseDA.isCtrlZ) {
            //   addAction()
            // }
            if (assets_view.offsetWidth > 0 && tool_state === ToolState.move) {
                const selectedComp = assets_view.querySelector(
                    'div[id*="projectID:0"] .list_tile.comp-selected'
                )
                if (selectedComp)
                    assets_view.querySelector('.instance-container').replaceChildren()
                updateListComponentByProject({ ID: 0 })
            }
            f12_update_selectWbase()
            $('.wbaseItem-value').removeClass('selected')
        }
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
    updateUISelectBox()
}

function updateUISelectBox() {
    select_box = selectBox(selected_list)
    wdraw()
}

function findCell(table, event) {
    let listCellHTML = [
        ...table.querySelectorAll(':scope > .table-row > .table-cell')
    ]
    let availableCell = listCellHTML.find(cellHTML => {
        let cellRect = cellHTML.getBoundingClientRect()
        cellOffset = offsetScale(cellRect.x, cellRect.y)
        return (
            cellOffset.x <= event.pageX / scale - leftx / scale &&
            cellOffset.x + cellHTML.offsetWidth >=
            event.pageX / scale - leftx / scale &&
            cellOffset.y <= event.pageY / scale - topx / scale &&
            cellOffset.y + cellHTML.offsetHeight >= event.pageY / scale - topx / scale
        )
    })
    return availableCell
}

function dragWbaseUpdate(xp, yp, event) {
    if (alt_list.length > 0) {
        alt_list.forEach(altItem => altItem.value?.remove())
        alt_list = []
    }
    let newPWbHTML = parent
    let new_parentID = newPWbHTML.id.length != 36 ? wbase_parentID : newPWbHTML.id
    if (checkpad === 0) {
        const wbSt0 = selected_list[0].value.closest(
            `.wbaseItem-value[iswini], .wbaseItem-value[isinstance]`
        )
        if (wbSt0) {
            for (let wb of selected_list) {
                const wstCls = [...wb.value.classList].find(e => e.startsWith('w-st'))
                if (wstCls) {
                    let cssRule = StyleDA.docStyleSheets.find(e => e.selectorText.endsWith(wstCls))
                    wb.value.style.cssText = cssRule.style.cssText + wb.value.style.cssText
                }
            }
        }
    }
    if (select_box_parentID !== wbase_parentID && select_box_parentID !== new_parentID) {
        document.getElementById(select_box_parentID).removeAttribute('onsort')
    }
    if (
        drag_start_list[0].ParentID !== new_parentID &&
        drag_start_list[0].Level > 1 &&
        drag_start_list[0].ParentID === select_box_parentID
    ) {
        let oldPWbHTML = document.getElementById(select_box_parentID)
        if (oldPWbHTML.childElementCount - selected_list.length === 0) {
            if (oldPWbHTML.getAttribute('width-type') === 'fit') {
                oldPWbHTML.style.width = oldPWbHTML.offsetWidth + 'px'
            }
            if (oldPWbHTML.getAttribute('height-type') === 'fit') {
                oldPWbHTML.style.height = oldPWbHTML.offsetHeight + 'px'
            }
        }
    }
    if (newPWbHTML.classList.contains('w-table')) {
        console.log('table')
        let availableCell = findCell(newPWbHTML, event)
        if (availableCell) {
            let distance = 0
            let cellChildren = [...availableCell.childNodes].filter(eHTML =>
                selected_list.every(e => e.GID !== eHTML.id)
            )
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
            if (drag_start_list[0].ParentID !== new_parentID) {
                selected_list.forEach(e => $(e.value).addClass('drag-hide'))
                let demo = document.createElement('div')
                demo.id = 'demo_auto_layout'
                demo.style.backgroundColor = '#1890FF'
                demo.style.height = `${2.4 / scale}px`
                demo.style.width = `${select_box.w * 0.8}px`
                if (distance < 0) {
                    availableCell.replaceChildren(demo, ...cellChildren)
                } else {
                    availableCell.replaceChildren(...cellChildren, demo)
                }
            } else {
                selected_list.forEach(e => $(e.value).removeClass('drag-hide'))
                if (distance < 0) {
                    availableCell.replaceChildren(
                        ...selected_list.map(e => e.value),
                        ...cellChildren
                    )
                } else {
                    availableCell.replaceChildren(
                        ...cellChildren,
                        ...selected_list.map(e => e.value)
                    )
                }
            }
        }
    } else if (
        window.getComputedStyle(newPWbHTML).display.match('flex') &&
        selected_list.some(e => !e.value.classList.contains('fixed-position'))
    ) {
        newPWbHTML.setAttribute('onsort', 'true')
        let children = [
            ...newPWbHTML.querySelectorAll(`.wbaseItem-value[level="${parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1}"]`)
        ].filter(e => selected_list.every(wb => wb.GID !== e.id))
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
                    let htmlRect = closestHTML.getBoundingClientRect()
                    zIndex = children.indexOf(closestHTML)
                    distance = event.pageY - (htmlRect.y + htmlRect.height / 2)
                    if (distance < 0) zIndex--
                } else {
                    zIndex = children.length - 1
                }
            }
            if (drag_start_list[0].ParentID != new_parentID) {
                selected_list.forEach(e => $(e.value).addClass('drag-hide'))
                var demo = document.getElementById('demo_auto_layout')
                if (!demo) {
                    demo = document.createElement('div')
                    demo.id = 'demo_auto_layout'
                    demo.style.backgroundColor = '#1890FF'
                    demo.style.height = `${2.4 / scale}px`
                    demo.style.width = `${select_box.w * 0.8}px`
                }
                newPWbHTML.replaceChildren(
                    ...children.slice(0, zIndex + 1),
                    demo,
                    ...children.slice(zIndex + 1)
                )
            } else {
                newPWbHTML.replaceChildren(
                    ...children.slice(0, zIndex + 1),
                    ...selected_list.map(wb => {
                        $(wb.value).removeClass('drag-hide')
                        $(wb.value).removeClass('fixed-position')
                        wb.value.style.position = null
                        wb.value.style.left = null
                        wb.value.style.top = null
                        wb.value.style.right = null
                        wb.value.style.bottom = null
                        wb.value.style.transform = null
                        wb.value.setAttribute('parentid', new_parentID)
                        wb.Level = parseInt(newPWbHTML.getAttribute('level')) + 1
                        wb.value.setAttribute('level', wb.Level)
                        wb.ParentID = new_parentID
                        return wb.value
                    }),
                    ...children.slice(zIndex + 1)
                )
            }
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
                    let htmlRect = closestHTML.getBoundingClientRect()
                    zIndex = children.indexOf(closestHTML)
                    distance = event.pageX - (htmlRect.x + htmlRect.width / 2)
                    if (distance < 0) zIndex--
                } else {
                    zIndex = children.length - 1
                }
            }
            if (drag_start_list[0].ParentID != new_parentID) {
                selected_list.forEach(e => $(e.value).addClass('drag-hide'))
                var demo = document.getElementById('demo_auto_layout')
                if (!demo) {
                    demo = document.createElement('div')
                    demo.id = 'demo_auto_layout'
                    demo.style.backgroundColor = '#1890FF'
                    demo.style.width = `${2.4 / scale}px`
                    demo.style.height = `${select_box.h * 0.8}px`
                }
                newPWbHTML.replaceChildren(
                    ...children.slice(0, zIndex + 1),
                    demo,
                    ...children.slice(zIndex + 1)
                )
            } else {
                newPWbHTML.replaceChildren(
                    ...children.slice(0, zIndex + 1),
                    ...selected_list.map(wb => {
                        $(wb.value).removeClass('drag-hide')
                        $(wb.value).removeClass('fixed-position')
                        wb.value.style.position = null
                        wb.value.style.left = null
                        wb.value.style.top = null
                        wb.value.style.right = null
                        wb.value.style.bottom = null
                        wb.value.style.transform = null
                        wb.value.setAttribute('parentid', new_parentID)
                        wb.Level = parseInt(newPWbHTML.getAttribute('level')) + 1
                        wb.value.setAttribute('level', wb.Level)
                        wb.ParentID = new_parentID
                        return wb.value
                    }),
                    ...children.slice(zIndex + 1)
                )
            }
        }
    } else {
        console.log('stack')
        selected_list.forEach(wb => {
            $(wb.value).removeClass('drag-hide')
            $(wb.value).removeClass('fixed-position')

            wb.value.style.left = `${wb.tmpX + xp + parent_offset1.x - offsetp.x}px`
            wb.value.style.top = `${wb.tmpY + yp + parent_offset1.y - offsetp.y}px`
            wb.value.style.right = 'unset'
            wb.value.style.bottom = 'unset'
            wb.value.style.transform = 'none'
            wb.value.setAttribute('parentid', new_parentID)
            wb.value.querySelectorAll('.wbaseItem-value').forEach(e => {
                e.setAttribute(
                    'level',
                    parseInt(e.getAttribute('level')) -
                    wb.Level +
                    parseInt(newPWbHTML.getAttribute('level') ?? '0') +
                    1
                )
            })
            wb.Level = parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1
            wb.value.setAttribute('level', wb.Level)
            wb.ParentID = new_parentID
            return wb.value
        })
        if (select_box_parentID !== new_parentID) {
            let children = [
                ...newPWbHTML.querySelectorAll(
                    `.wbaseItem-value[level="${parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1
                    }"]`
                )
            ]
            if (children.length > 0) {
                children = children.filter(e =>
                    selected_list.every(wb => e !== wb.value)
                )
                let zIndex = children.length + 1
                newPWbHTML.replaceChildren(
                    ...children.slice(0, zIndex + 1),
                    ...selected_list.map(wb => wb.value),
                    ...children.slice(zIndex + 1)
                )
            } else {
                newPWbHTML.replaceChildren(...selected_list.map(wb => wb.value))
            }
        }
    }
    if (!demo) document.getElementById('demo_auto_layout')?.remove()
    select_box_parentID = selected_list[0].ParentID
}

function dragWbaseEnd() {
    if (alt_list.length > 0) {
        alt_list.forEach(altItem => altItem.value?.remove())
        alt_list = []
    }
    WBaseDA.listData = []
    if (drag_start_list.length > 0) {
        let newPWbHTML = parent
        let new_parentID =
            newPWbHTML.id.length != 36 ? wbase_parentID : newPWbHTML.id
        if (new_parentID !== wbase_parentID) {
            var pWb = wbase_list.find(e => e.GID === new_parentID)
            var component = newPWbHTML.closest(
                `.wbaseItem-value[iswini]:not(.w-variant)`
            )
            if (component)
                var cssItem = StyleDA.cssStyleSheets.find(e => e.GID === component.id)
        }
        //
        if (drag_start_list[0].ParentID !== new_parentID) {
            var eEvent = EnumEvent.parent
            if (drag_start_list[0].ParentID !== wbase_parentID) {
                var oldPWb = wbase_list.find(
                    wb => wb.GID === drag_start_list[0].ParentID
                )
                if (oldPWb.value.classList.contains('w-table')) {
                    let listCell = oldPWb.TableRows.reduce((a, b) => a.concat(b))
                        ;[
                            ...oldPWb.value.querySelectorAll(
                                ':scope > .table-row > .table-cell'
                            )
                        ].forEach(cell => {
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
                }
                if (oldPWb.value.classList.contains('w-variant')) {
                    let listProperty = PropertyDA.list.filter(
                        e => e.BaseID === oldPWb.GID
                    )
                    for (let propertyItem of listProperty) {
                        propertyItem.BasePropertyItems =
                            propertyItem.BasePropertyItems.filter(e =>
                                selected_list.every(wbase => e.BaseID != wbase.GID)
                            )
                    }
                }
                WBaseDA.listData.push(oldPWb)
            }
            let demo = document.getElementById('demo_auto_layout')
            if (demo) {
                demo.replaceWith(
                    ...selected_list.map(wb => {
                        $(wb.value).removeClass('drag-hide')
                        $(wb.value).removeClass('fixed-position')
                        wb.value.removeAttribute('constx')
                        wb.value.removeAttribute('consty')
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
                        if (wb.value.getAttribute('width-type') === 'fill') {
                            if (newPWbHTML.getAttribute('width-type') !== 'fit') {
                                wb.value.style.width = '100%'
                                if (newPWbHTML.classList.contains('w-row'))
                                    wb.value.style.flex = 1
                            } else {
                                wb.value.removeAttribute('width-type')
                            }
                        }
                        if (wb.value.getAttribute('height-type') === 'fill') {
                            if (newPWbHTML.getAttribute('height-type') !== 'fit') {
                                wb.value.style.height = '100%'
                                if (newPWbHTML.classList.contains('w-col'))
                                    wb.value.style.flex = 1
                            } else {
                                wb.value.removeAttribute('height-type')
                            }
                        }
                        return wb.value
                    })
                )
                if (component) {
                    wbase_list.filter(e => {
                        if (
                            e.ParentID === new_parentID &&
                            selected_list.every(wb => wb !== e)
                        ) {
                            let eRule = StyleDA.docStyleSheets.find(rule =>
                                [...divSection.querySelectorAll(rule.selectorText)].includes(
                                    e.value
                                )
                            )
                            eRule.style.order = $(e.value).index()
                            cssItem.Css = cssItem.Css.replace(
                                new RegExp(`${eRule.selectorText} {[^}]*}`, 'g'),
                                eRule.cssText
                            )
                        }
                    })
                } else {
                    wbase_list.filter(e => {
                        if (
                            e.ParentID === new_parentID &&
                            e.value.style.order != $(e.value).index()
                        ) {
                            e.value.style.order = $(e.value).index()
                            e.Css = e.value.style.cssText
                            if (selected_list.every(wb => wb !== e)) WBaseDA.listData.push(e)
                        }
                    })
                }
            } else if (new_parentID === wbase_parentID) {
                selected_list.forEach(wb => {
                    wb.value.setAttribute('constx', Constraints.left)
                    wb.value.setAttribute('consty', Constraints.top)
                    if (wb.value.getAttribute('width-type') === 'fill')
                        wb.value.removeAttribute('width-type')
                    if (wb.value.getAttribute('height-type') === 'fill')
                        wb.value.removeAttribute('height-type')
                    updateConstraints(wb.value)
                })
            } else if (newPWbHTML.classList.contains('w-block')) {
                selected_list.forEach(wb => {
                    if (wb.value.getAttribute('width-type') === 'fill')
                        wb.value.removeAttribute('width-type')
                    if (wb.value.getAttribute('height-type') === 'fill')
                        wb.value.removeAttribute('height-type')
                    updateConstraints(wb.value)
                })
            }
            if (pWb) WBaseDA.listData.push(pWb)
        } else if (window.getComputedStyle(newPWbHTML).display === 'flex') {
            if (pWb.value.getAttribute('width-type') === 'fit') {
                pWb.value.style.width = null
            }
            if (pWb.value.getAttribute('height-type') === 'fit') {
                pWb.value.style.height = null
            }
            eEvent = EnumEvent.parent
            if (component) {
                pWb.value
                    .querySelectorAll(`.wbaseItem-value[level="${pWb.Level + 1}"]`)
                    .forEach(e => {
                        if (selected_list.every(wb => wb.value !== e)) {
                            let eRule = StyleDA.docStyleSheets.find(rule =>
                                [...divSection.querySelectorAll(rule.selectorText)].includes(e)
                            )
                            eRule.style.order = $(e).index()
                            cssItem.Css = cssItem.Css.replace(
                                new RegExp(`${eRule.selectorText} {[^}]*}`, 'g'),
                                eRule.cssText
                            )
                        }
                    })
            } else {
                wbase_list.filter(e => {
                    if (
                        e.ParentID === new_parentID &&
                        e.value.style.order != $(e.value).index()
                    ) {
                        e.value.style.order = $(e.value).index()
                        e.Css = e.value.style.cssText
                        if (selected_list.every(wb => wb !== e)) WBaseDA.listData.push(e)
                    }
                })
            }
            WBaseDA.listData.push(pWb)
        } else if (new_parentID === wbase_parentID) {
            selected_list.forEach(wb => {
                wb.value.setAttribute('constx', Constraints.left)
                wb.value.setAttribute('consty', Constraints.top)
                updateConstraints(wb.value)
            })
        } else if (newPWbHTML.classList.contains('w-block')) {
            selected_list.forEach(wb => updateConstraints(wb.value))
        }
        WBaseDA.listData.push(
            ...selected_list.map(wb => {
                if (wb.value.getAttribute('width-type') === 'fill') {
                    if (
                        wb.value.closest(
                            `.w-row[level="${wb.Level - 1}"]:not(*[width-type="fit"])`
                        )
                    ) {
                        wb.value.style.width = '100%'
                        wb.value.style.flex = 1
                    } else {
                        wb.value.style.width = wb.value.offsetWidth + 'px'
                        wb.value.removeAttribute('width-type')
                    }
                }
                if (wb.value.getAttribute('height-type') === 'fill') {
                    if (
                        wb.value.closest(
                            `.w-col[level="${wb.Level - 1}"]:not(*[height-type="fit"]`
                        )
                    ) {
                        wb.value.style.height = '100%'
                        wb.value.style.flex = 1
                    } else {
                        wb.value.style.height = wb.value.offsetHeight + 'px'
                        wb.value.removeAttribute('height-type')
                    }
                }
                if (window.getComputedStyle(newPWbHTML).display === 'flex') {
                    wb.value.style.order = $(wb.value).index()
                } else {
                    wb.value.style.order = null
                }
                if (component) {
                    const stClassName = [...wb.value.classList].find(cls =>
                        cls.startsWith('w-st')
                    )
                    if (stClassName) {
                        StyleDA.docStyleSheets.find(rule => {
                            let selector = [...divSection.querySelectorAll(rule.selectorText)]
                            const check = selector.includes(wb.value)
                            if (check) {
                                rule.style.cssText += wb.value.style.cssText
                                selector.forEach(e => {
                                    if (wb.value.getAttribute('constx')) {
                                        e.setAttribute('constx', wb.value.getAttribute('constx'))
                                    } else {
                                        e.removeAttribute('constx')
                                    }
                                    if (wb.value.getAttribute('consty')) {
                                        e.setAttribute('consty', wb.value.getAttribute('consty'))
                                    } else {
                                        e.removeAttribute('consty')
                                    }
                                    if (wb.value.getAttribute('width-type')) {
                                        e.setAttribute(
                                            'width-type',
                                            wb.value.getAttribute('width-type')
                                        )
                                    } else {
                                        e.removeAttribute('width-type')
                                    }
                                    if (wb.value.getAttribute('height-type')) {
                                        e.setAttribute(
                                            'height-type',
                                            wb.value.getAttribute('height-type')
                                        )
                                    } else {
                                        e.removeAttribute('height-type')
                                    }
                                })
                                cssItem.Css = cssItem.Css.replace(
                                    new RegExp(`${rule.selectorText} {[^}]*}`, 'g'),
                                    rule.cssText
                                )
                            }
                            return check
                        })
                    } else {
                        const componentClsName = [...component.classList].find(cls =>
                            cls.startsWith('w-st0')
                        )
                        let newClassName =
                            `w-st${wb.Level - pWb.Level}-` +
                            Ultis.toSlug(wb.Name.toLowerCase().trim())
                        let existNameList = [
                            ...component.querySelectorAll(`.wbaseItem-value`)
                        ]
                            .map(e => [...e.classList].find(cls => cls.startsWith('w-st')))
                            .filter(e => e != null && e.startsWith(newClassName))
                        for (let i = 1; i < 100; i++) {
                            if (existNameList.every(vl => vl !== `${newClassName}${i}`)) {
                                newClassName = newClassName + `${i}`
                                break
                            }
                        }
                        let cssText = wb.value.style.cssText.split(';').map(vl => vl.trim())
                        let cssTextValue = newPWbHTML.classList.contains('w-block')
                            ? cssText.filter(e => !e.match(/order/g)).join(';')
                            : cssText
                                .filter(
                                    e =>
                                        !e.match(
                                            /(z-index|left|top|bottom|right|transform|--gutter)/g
                                        )
                                )
                                .join(';')
                        const clsRegex = new RegExp(
                            `.${componentClsName} .${newClassName} {[^}]*}`,
                            'g'
                        )
                        if (cssItem.Css.match(clsRegex)) {
                            cssItem.Css = cssItem.Css.replace(
                                clsRegex,
                                `.${componentClsName} .${newClassName} { ${cssTextValue} }`
                            )
                        } else {
                            cssItem.Css += `/**/ .${componentClsName} .${newClassName} { ${cssTextValue} }`
                        }
                        wb.value.classList.add(newClassName)
                        wb.IsCopy = true
                    }
                    wb.value.removeAttribute('style')
                } else if (
                    oldPWb?.value?.closest(`.wbaseItem-value[iswini]:not(.w-variant)`)
                ) {
                    wb.value.className = [...wb.value.classList]
                        .filter(cls => !cls.startsWith('w-st'))
                        .join(' ')
                }
                wb.Css = wb.value.style.cssText
                if (wb.Css.length === 0) wb.Css = null
                wb.ListClassName = wb.value.className
                return wb
            })
        )
        select_box_parentID = selected_list[0].ParentID
        if (component) {
            StyleDA.editStyleSheet(cssItem)
            document.getElementById(`w-st-comp${cssItem.GID}`).innerHTML = cssItem.Css
        } else if (
            oldPWb?.value?.closest(`.wbaseItem-value[iswini]:not(.w-variant)`)
        ) {
            WBaseDA.deleteWb({ listWb: selected_list })
        }
        if (WBaseDA.listData.length) {
            if (eEvent === EnumEvent.parent) {
                WBaseDA.parent(WBaseDA.listData, EnumObj.wBase)
            } else {
                WBaseDA.edit(WBaseDA.listData, EnumObj.wBase)
            }
        }
        newPWbHTML.removeAttribute('onsort')
        replaceAllLyerItemHTML()
        updateUIDesignView()
        drag_start_list = []
        WBaseDA.listData = []
    }
    parent = divSection
    updateHoverWbase()
    handleWbSelectedList([...selected_list])
    reloadEditOffsetBlock()
}

// ALT copy
let tmpAltHTML = []

// new alt
function dragAltUpdate(xp, yp, event) {
    console.log('drag alt update')
    let newPWbHTML = parent
    let new_parentID = newPWbHTML.id.length != 36 ? wbase_parentID : newPWbHTML.id
    if (select_box_parentID !== wbase_parentID && select_box_parentID !== new_parentID) {
        document.getElementById(select_box_parentID).removeAttribute('onsort')
    }
    if (alt_list.length == 0) {
        const component = selected_list[0].value.closest(
            `.wbaseItem-value:is(*[iswini], *[isinstance]):not(*[level="${selected_list[0].Level}"], .w-variant)`
        )
        if (component) {
            var componentCls = [...component.classList].find(e => e.startsWith('w-st0'))
        }
        for (let wb of selected_list) {
            let alt_wbase = JSON.parse(JSON.stringify(wb))
            alt_wbase.GID = uuidv4()
            alt_wbase.ChildID = wb.GID
            alt_wbase.IsCopy = true
            let tmp = wb.value.cloneNode(true)
            if (wb.value.getAttribute('width-type') === 'fill' ||
                wb.value.getAttribute('constx') === Constraints.left_right ||
                wb.value.getAttribute('constx') === Constraints.scale
            ) {
                tmp.style.width = wb.value.offsetWidth + 'px'
                tmp.style.flex = null
            }
            if (wb.value.getAttribute('height-type') === 'fill' ||
                wb.value.getAttribute('consty') === Constraints.top_bottom ||
                wb.value.getAttribute('consty') === Constraints.scale
            ) {
                tmp.style.height = wb.value.offsetHeight + 'px'
                tmp.style.flex = null
            }
            if (componentCls) {
                const removeClsList = [tmp, ...tmp.querySelectorAll(`.wbaseItem-value`)]
                removeClsList.forEach(e => {
                    if (e === tmp) {
                        tmp.id = alt_wbase.GID
                    } else {
                        e.setAttribute('copyid', e.id)
                        e.id = uuidv4()
                        e.setAttribute(
                            'parentid',
                            e.closest(
                                `.wbaseItem-value[level="${parseInt(e.getAttribute('level')) - 1
                                }"]`
                            )
                        )
                    }
                    const eCls = [...e.classList].find(cls => cls.startsWith('w-st'))
                    if (eCls) {
                        const cssRule = StyleDA.docStyleSheets.find(rule =>
                            rule.selectorText.endsWith(eCls)
                        )
                        e.style.cssText = cssRule.style.cssText + e.style.cssText
                        e.classList.remove(eCls)
                    }
                })
            }
            tmpAltHTML.push(tmp)
            alt_wbase.value = tmp
            alt_list.push(alt_wbase)
        }
    }
    if (newPWbHTML.classList.contains('w-table')) {
        console.log('table')
        let availableCell = findCell(parentHTML, event)
        if (availableCell) {
            let distance = 0
            let cellChildren = [...availableCell.childNodes].filter(eHTML =>
                alt_list.every(e => e.GID !== eHTML.id)
            )
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
            alt_list.forEach(e => $(e.value).addClass('drag-hide'))
            let demo = document.createElement('div')
            demo.id = 'demo_auto_layout'
            demo.style.backgroundColor = '#1890FF'
            demo.style.height = `${2.4 / scale}px`
            demo.style.width = `${select_box.w * 0.8}px`
            if (distance < 0) {
                availableCell.replaceChildren(demo, ...cellChildren)
            } else {
                availableCell.replaceChildren(...cellChildren, demo)
            }
        }
    } else if (
        window.getComputedStyle(newPWbHTML).display.match('flex') &&
        alt_list.some(e => !e.value.classList.contains('fixed-position'))
    ) {
        newPWbHTML.setAttribute('onsort', 'true')
        console.log('flex')
        let children = [
            ...newPWbHTML.querySelectorAll(
                `.wbaseItem-value[level="${parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1
                }"]`
            )
        ].filter(e => alt_list.every(wb => wb.GID !== e.id))
        let isGrid = window.getComputedStyle(newPWbHTML).flexWrap == 'wrap'
        if (newPWbHTML.classList.contains('w-col')) {
            let zIndex = 0
            let distance = 0
            if (children.length > 0) {
                let closestHTML = [...children].sort((aHTML, bHTML) => {
                    let aRect = aHTML.getBoundingClientRect()
                    let bRect = bHTML.getBoundingClientRect()
                    if (isGrid) {
                        var a_center_oy = Math.sqrt(
                            Math.pow(event.pageX - (aRect.x + aRect.width / 2), 2) +
                            Math.pow(event.pageY - (aRect.y + aRect.height / 2), 2)
                        )
                        var b_center_oy = Math.sqrt(
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
            alt_list.forEach(e => $(e.value).addClass('drag-hide'))
            var demo = document.getElementById('demo_auto_layout')
            if (!demo) {
                demo = document.createElement('div')
                demo.id = 'demo_auto_layout'
                demo.style.backgroundColor = '#1890FF'
                demo.style.height = `${2.4 / scale}px`
                demo.style.width = `${select_box.w * 0.8}px`
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
                    if (isGrid) {
                        var a_center_ox = Math.sqrt(
                            Math.pow(event.pageX - (aRect.x + aRect.width / 2), 2) +
                            Math.pow(event.pageY - (aRect.y + aRect.height / 2), 2)
                        )
                        var b_center_ox = Math.sqrt(
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
                    zIndex = children.indexOf(closestHTML)
                    distance = event.pageX - (closestRect.x + closestRect.width / 2)
                    if (distance < 0) zIndex--
                } else {
                    zIndex = children.length - 1
                }
            }
            alt_list.forEach(e => $(e.value).addClass('drag-hide'))
            var demo = document.getElementById('demo_auto_layout')
            if (!demo) {
                demo = document.createElement('div')
                demo.id = 'demo_auto_layout'
                demo.style.backgroundColor = '#1890FF'
                demo.style.width = `${2.4 / scale}px`
                demo.style.height = `${select_box.h * 0.8}px`
            }
            newPWbHTML.replaceChildren(
                ...children.slice(0, zIndex + 1),
                demo,
                ...children.slice(zIndex + 1)
            )
        }
    } else {
        alt_list.forEach(wb => {
            $(wb.value).removeClass('drag-hide')
            $(wb.value).removeClass('fixed-position')
            wb.value.style.left = `${wb.tmpX + xp + parent_offset1.x - offsetp.x}px`
            wb.value.style.top = `${wb.tmpY + yp + parent_offset1.y - offsetp.y}px`
            wb.value.style.right = null
            wb.value.style.bottom = null
            wb.value.style.transform = null
            wb.value.setAttribute('parentid', new_parentID)
            wb.value.querySelectorAll('.wbaseItem-value').forEach(e => {
                e.setAttribute(
                    'level',
                    parseInt(e.getAttribute('level')) -
                    wb.Level +
                    parseInt(newPWbHTML.getAttribute('level') ?? '0') +
                    1
                )
            })
            wb.Level = parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1
            wb.ParentID = new_parentID
            return wb.value
        })
        if (
            select_box_parentID !== new_parentID ||
            checkpad === selected_list.length
        ) {
            let children = [
                ...newPWbHTML.querySelectorAll(
                    `.wbaseItem-value[level="${parseInt(newPWbHTML.getAttribute('level') ?? '0') + 1
                    }"]`
                )
            ]
            if (children.length > 0) {
                let zIndex =
                    Math.max(
                        0,
                        ...children.map(eHTML => {
                            if (alt_list.some(wb => wb.GID === eHTML.id)) return 0
                            else return $(eHTML).index()
                        })
                    ) + 1
                newPWbHTML.replaceChildren(
                    ...children.slice(0, zIndex + 1),
                    ...alt_list.map(wb => wb.value),
                    ...children.slice(zIndex + 1)
                )
            }
        }
    }
    if (!demo) document.getElementById('demo_auto_layout')?.remove()
    select_box_parentID = alt_list[0].ParentID
}

function dragAltEnd() {
    WBaseDA.listData = []
    console.log('dragend alt')
    if (drag_start_list.length > 0 && alt_list.length > 0) {
        const component = selected_list[0].value.closest(
            `.wbaseItem-value:is(*[iswini], *[isinstance]):not(*[level="${selected_list[0].Level}"], .w-variant)`
        )
        let newPWbHTML = parent
        let new_parentID =
            newPWbHTML.id.length != 36 ? wbase_parentID : newPWbHTML.id
        if (new_parentID !== wbase_parentID) {
            var pWb = wbase_list.find(e => e.GID === new_parentID)
            var newComponent = pWb.value.closest('.wbaseItem-value[iswini]')
            if (newComponent)
                var cssItem = StyleDA.cssStyleSheets.find(
                    e => e.GID === newComponent.id
                )
        }
        let demo = document.getElementById('demo_auto_layout')
        if (demo) {
            demo.replaceWith(
                ...alt_list.map(wb => {
                    $(wb.value).removeClass('drag-hide')
                    $(wb.value).removeClass('fixed-position')
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
                    wb.value.querySelectorAll('.wbaseItem-value').forEach(e => {
                        e.setAttribute(
                            'level',
                            parseInt(e.getAttribute('level')) -
                            wb.Level +
                            parseInt(newPWbHTML.getAttribute('level') ?? '0') +
                            1
                        )
                    })
                    return wb.value
                })
            )
        } else if (new_parentID === wbase_parentID) {
            alt_list.forEach(wb => {
                wb.value.setAttribute('constx', Constraints.left)
                wb.value.setAttribute('consty', Constraints.top)
                updateConstraints(wb.value)
            })
        } else if (newPWbHTML.classList.contains('w-block')) {
            alt_list.forEach(wb => updateConstraints(wb.value))
        }
        if (pWb) WBaseDA.listData.push(pWb)
        alt_list.forEach(wb => {
            if (demo) wb.value.style.order = $(wb.value).index()
            if (wb.value.getAttribute('width-type') === 'fill') {
                if (
                    wb.value.closest(
                        `.w-row[level="${wb.Level - 1}"]:not(*[width-type="fit"])`
                    )
                ) {
                    wb.value.style.width = '100%'
                    wb.value.style.flex = 1
                } else {
                    wb.value.style.width = wb.value.offsetWidth + 'px'
                    wb.value.removeAttribute('width-type')
                }
            }
            if (wb.value.getAttribute('height-type') === 'fill') {
                if (
                    wb.value.closest(
                        `.w-col[level="${wb.Level - 1}"]:not(*[height-type="fit"]`
                    )
                ) {
                    wb.value.style.height = '100%'
                    wb.value.style.flex = 1
                } else {
                    wb.value.style.height = wb.value.offsetHeight + 'px'
                    wb.value.removeAttribute('height-type')
                }
            }
            if (component) {
                wb.AttributeID = uuidv4()
                wbase_list.forEach(e => {
                    if (e.GID === wb.ChildID) {
                        wb.AttributesItem = {
                            ...e.AttributesItem,
                            GID: wb.AttributeID
                        }
                        delete wb.ChildID
                        if (!cssItem) delete wb.IsCopy
                        var check = true
                    } else if (
                        selected_list.some(eSelect => eSelect.value.contains(e.value))
                    ) {
                        let cWbHTML = wb.value.querySelector(
                            `.wbaseItem-value[copyid="${e.GID}"]`
                        )
                        var newWb = JSON.parse(JSON.stringify(e))
                        newWb.GID = cWbHTML.id
                        newWb.ParentID = cWbHTML.getAttribute('parentid')
                        newWb.AttributeID = uuidv4()
                        newWb.AttributesItem.GID = newWb.AttributeID
                        newWb.Css = cWbHTML.style.cssText
                        newWb.ListClassName = cWbHTML.className
                        newWb.Level = parseInt(cWbHTML.getAttribute('level'))
                        newWb.value = cWbHTML
                        delete newWb.ChildID
                        WBaseDA.listData.push(newWb)
                        check = true
                    }
                    if (check && cssItem) {
                        newWb ??= wb
                        const componentClsName = [...newComponent.classList].find(cls =>
                            cls.startsWith('w-st0')
                        )
                        let newClassName =
                            `w-st${newWb.Level - parseInt(newComponent.getAttribute('level'))
                            }-` + Ultis.toSlug(newWb.Name.toLowerCase().trim())
                        let existNameList = [
                            ...newComponent.querySelectorAll(`.wbaseItem-value`)
                        ]
                            .map(e => [...e.classList].find(cls => cls.startsWith('w-st')))
                            .filter(e => e != null && e.startsWith(newClassName))
                        for (let i = 1; i < 100; i++) {
                            if (existNameList.every(vl => vl !== `${newClassName}${i}`)) {
                                newClassName = newClassName + `${i}`
                                break
                            }
                        }
                        let cssText = newWb.value.style.cssText
                            .split(';')
                            .map(vl => vl.trim())
                        let cssTextValue = newPWbHTML.classList.contains('w-block')
                            ? cssText.filter(e => !e.match(/order/g)).join(';')
                            : cssText
                                .filter(
                                    e =>
                                        !e.match(
                                            /(z-index|left|top|bottom|right|transform|--gutter)/g
                                        )
                                )
                                .join(';')
                        const clsRegex = new RegExp(
                            `.${componentClsName} .${newClassName} {[^}]*}`,
                            'g'
                        )
                        if (cssItem.Css.match(clsRegex)) {
                            cssItem.Css = cssItem.Css.replace(
                                clsRegex,
                                `.${componentClsName} .${newClassName} { ${cssTextValue} }`
                            )
                        } else {
                            cssItem.Css += `/**/ .${componentClsName} .${newClassName} { ${cssTextValue} }`
                        }
                        newWb.value.classList.add(newClassName)
                        newWb.value.removeAttribute('style')
                    }
                })
            }
            wb.Css = wb.value.style.cssText
            if (!wb.Css.length) wb.Css = null
            wb.ListClassName = wb.value.className
        })
        WBaseDA.listData.push(...alt_list)
        if (component) {
            wbase_list.push(...WBaseDA.listData.filter(e => e !== pWb))
            arrange()
        }
        if (demo) {
            if (cssItem) {
                newPWbHTML
                    .querySelectorAll(`.wbaseItem-value[level="${pWb.Level + 1}"]`)
                    .forEach(e => {
                        let eRule = StyleDA.docStyleSheets.find(rule =>
                            rule.selectorText.endsWith([...e.classList].find(cls => cls.startsWith('w-st')))
                        )
                        eRule.style.order = $(e).index()
                        cssItem.Css = cssItem.Css.replace(
                            new RegExp(`${eRule.selectorText} {[^}]*}`, 'g'),
                            eRule.cssText
                        )
                    })
                StyleDA.editStyleSheet(cssItem)
                document.getElementById(`w-st-comp${cssItem.GID}`).innerHTML = cssItem.Css
            } else {
                wbase_list.filter(e => {
                    if (e.ParentID === new_parentID && e.value.style.order != $(e.value).index()) {
                        e.value.style.order = $(e.value).index()
                        e.Css = e.value.style.cssText
                    }
                })
            }
        }
        if (component) {
            wbase_list.push(...WBaseDA.listData.filter(e => e !== pWb))
            arrange()
            WBaseDA.add({ listWb: WBaseDA.listData, parentid: new_parentID })
            replaceAllLyerItemHTML()
        } else {
            WBaseDA.copy(WBaseDA.listData)
            tmpAltHTML.forEach(tmp => tmp.setAttribute('loading', 'true'))
        }
        newPWbHTML.removeAttribute('onsort')
        parent = divSection
        // handleWbSelectedList(alt_list)
        // action_list[action_index].tmpHTML = [...tmpAltHTML]
        // tmpAltHTML = []
        drag_start_list = []
        alt_list = []
        WBaseDA.listData = []
    }
}

function handleCompleteAddWbase() {
    let wb = selected_list[0]
    const component = wb.value.closest(`.wbaseItem-value[iswini]`)
    if (component) {
        const componentClsName = [...component.classList].find(cls =>
            cls.startsWith('w-st0')
        )
        let newClassName =
            `w-st${wb.Level - parseInt(component.getAttribute('level'))}-` +
            Ultis.toSlug(wb.Name.toLowerCase().trim())
        let existNameList = [...component.querySelectorAll(`.wbaseItem-value`)]
            .map(e => [...e.classList].find(cls => cls.startsWith('w-st')))
            .filter(e => e != null && e.startsWith(newClassName))
        for (let i = 1; i < 100; i++) {
            if (existNameList.every(vl => vl !== `${newClassName}${i}`)) {
                newClassName = newClassName + `${i}`
                break
            }
        }
        let cssItem = StyleDA.cssStyleSheets.find(e => e.GID === component.id)
        let cssText = wb.value.style.cssText.split(';').map(vl => vl.trim())
        let cssTextValue = wb.value
            .closest(`.wbaseItem-value[level="${wb.Level - 1}"]`)
            .classList.contains('w-block')
            ? cssText.filter(e => !e.match(/order/g)).join(';')
            : cssText
                .filter(
                    e => !e.match(/(z-index|left|top|bottom|right|transform|--gutter)/g)
                )
                .join(';')
        const clsRegex = new RegExp(
            `.${componentClsName} .${newClassName} {[^}]*}`,
            'g'
        )
        if (cssItem.Css.match(clsRegex)) {
            cssItem.Css = cssItem.Css.replace(
                clsRegex,
                `.${componentClsName} .${newClassName} { ${cssTextValue} }`
            )
        } else {
            cssItem.Css += `/**/ .${componentClsName} .${newClassName} { ${cssTextValue} }`
        }
        wb.Css = null
        wb.value.removeAttribute('style')
        wb.value.classList.add(newClassName)
        wb.ListClassName = wb.value.className
        wb.IsCopy = true
        WBaseDA.listData.forEach(e => {
            let cssRule = StyleDA.docStyleSheets.find(
                rule =>
                    component.querySelector(
                        rule.selectorText.replace(componentClsName, '')
                    ) === e.value
            )
            cssRule.style.cssText += e.value.style.cssText
            cssItem.Css = cssItem.Css.replace(
                new RegExp(`${cssRule.selectorText} {[^}]*}`, 'g'),
                cssRule.cssText
            )
        })
        WBaseDA.add({ listWb: [wb] })
        StyleDA.editStyleSheet(cssItem)
        document.getElementById(`w-st-comp${cssItem.GID}`).innerHTML = cssItem.Css
        delete wb.IsCopy
    } else {
        WBaseDA.listData.push(wb)
        WBaseDA.listData.forEach(e => (e.Css = e.value.style.cssText))
        WBaseDA.add({ listWb: WBaseDA.listData })
    }
    WBaseDA.listData = []
}
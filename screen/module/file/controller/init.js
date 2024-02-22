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
$('body > #body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@db850d2/project-component/loading.html', async function () {
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
    $('body > #body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@db850d2/screen/module/file/local-component/body-layout.html', async function () {
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
        wbase_list = []
        wbase_list = initDOM(wbaseResponse)
        parent = divSection
        selected_list = []
        updateHoverWbase()
        // arrange()
        setupRightView()
        setupLeftView()
        if (!PageDA.obj.scale) {
            PageDA.obj.scale = scale
            PageDA.obj.topx = topx
            PageDA.obj.leftx = leftx
        }
        WiniIO.emitInit()
    })
});
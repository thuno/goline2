var left_view, right_view, layer_view, assets_view, design_view, prototype_view, state_view;
var scale = 1;
var topx = 0,
    leftx = 0,
    leftw = 0,
    reightw = 0
$('body > #body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@e7e38ba/project-component/loading.html', async function () {
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
    $('body > #body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@e7e38ba/screen/module/file/local-component/body-layout.html', function () {
        left_view = document.getElementById('left_view')
        right_view = document.getElementById('right_view')
        layer_view = document.getElementById('Layer')
        assets_view = document.getElementById('Assets')
        design_view = document.getElementById('Design')
        prototype_view = document.getElementById('Prototype')
        state_view = document.getElementById('State')
        leftw = left_view?.offsetWidth ?? 0
        reightw = right_view?.offsetWidth ?? 0
        setupRightView()
        setupLeftView()
        if (!PageDA.obj.scale) {
            PageDA.obj.scale = scale
            PageDA.obj.topx = topx
            PageDA.obj.leftx = leftx
        }
    })
    WiniIO.emitInit()
    permissionTool()
    customerList()
});
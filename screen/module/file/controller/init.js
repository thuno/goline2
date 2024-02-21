var left_view, right_view, layer_view, assets_view, design_view, prototype_view, state_view
$('body > #body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@30eaafa/project-component/loading.html', async function () {
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
            if (!PageDA.obj.scale) {
                PageDA.obj.scale = scale
                PageDA.obj.topx = topx
                PageDA.obj.leftx = leftx
            }
            PageDA.checkEditPermission(PageDA.obj.Permission)
        }
    }
    $('body > #body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@30eaafa/screen/module/file/local-component/body-layout.html', function () {
        left_view = document.getElementById('left_view')
        right_view = document.getElementById('right_view')
        layer_view = document.getElementById('Layer')
        assets_view = document.getElementById('Assets')
        design_view = document.getElementById('Design')
        prototype_view = document.getElementById('Prototype')
        state_view = document.getElementById('State')
        setupRightView()
        setupLeftView()
    })
    WiniIO.emitInit()
    permissionTool()
    customerList()
});
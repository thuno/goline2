var left_view, right_view, layer_view, assets_view, design_view, prototype_view, state_view
$('body > #body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@28682a3/project-component/loading.html', async function () {
    // customerList()
    const pId = location.hash.match(/file\?id\=[\d]*/g)[0].replace('file?id=', "")
    await ProjectDA.getByID(parseInt(pId))
    $('body > #body').load('./screen/module/file/local-component/body-layout.html', function () {
        permissionTool()
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
});
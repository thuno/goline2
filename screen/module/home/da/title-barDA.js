class TitleBarDA {
    static list = (i) => i != null ? JSON.parse(Ultis.getStorage('list-project-tab') ?? '[]')[i] : JSON.parse(Ultis.getStorage('list-project-tab') ?? '[]')
    static setList = (list) => Ultis.setStorage('list-project-tab', JSON.stringify(list ?? []))

    static initDataStorage() {
        if (url.includes('home') || url.every(e => !e.match(/file\?id\=[\d]*/g))) {
            TitleBarDA.updateTitleBar(0);
        } else {
            const newList = TitleBarDA.list()
            if (newList.every(e => e.ID !== ProjectDA.obj.ID)) {
                this.setList([...newList, ProjectDA.obj.ID])
            }
            TitleBarDA.updateTitleBar(ProjectDA.obj.ID)
        }
    }

    static updateTitleBar(pId) {
        let newList = TitleBarDA.list()
        document.body.querySelector('.window-bar .tab-container').innerHTML = newList.map((e, i) => {
            if (e.ID !== pId)
                $('body').on('click', `.nav-tab[data-id="${e.ID}"]`, function (ev) {
                    ev.stopPropagation()
                    window.location.href = `/#/file?id=${e.ID}`
                    window.location.reload()
                });
            $('body').on('click', `.nav-tab[data-id="${e.ID}"] > .fa-close`, function (ev) {
                ev.stopPropagation()
                newList = newList.filter(item => item !== e)
                TitleBarDA.setList(newList)
                if (i === 0) {
                    window.location.href = `/#/home`
                } else {
                    window.location.href = `/#/file?id=${newList[i - 1].ID}`
                }
                window.location.reload()
            });
            return `<button type="button" data-id="${e.ID}" class="nav-tab semibold1 row ${e.ID === pId ? 'active' : ''}">${e.Name ?? 'Untitled'}<i class="fa-solid fa-close row box20 center"></i></button>`;
        }).join('')

        // change UI with each platform
        const platform = navigator.platform;
        if (platform == 'Win32') {
            $('.title-bar-container').addClass('title-bar-win');
        } else if (platform.includes("Mac")) {
            $('.title-bar-container').addClass('title-bar-mac');
        }
    }
}

$('body', '.home-button.nav-tab', function (ev) {
    ev.stopPropagation()
    window.location.href = `/#/home`
    window.location.reload()
})

// $(document).ready(function () {
//     let token = Ultis.getStorage('token');
//     if (token != null && token != "null") {
//         $('body').on('click', '.home-button', function (e) {
//             window.location.href = "/View/home-screen.html?tab=home";
//             Ultis.setStorage('project-tab-selected', null);
//         });
//         // update selected project
//         $('body').on('click', '.nav-tab', function (e) {
//             if ($(this).data('id') != null) {
//                 Ultis.setStorage('project-tab-selected', $(this).data('id'));
//                 ProjectDA.changeProject($(this).data('id'));
//             }
//         });
//         $('body').on('mousedown', '.nav-tab', function (e) {
//             if (e.button == 2) {
//                 e.stopPropagation();
//                 $('.more-option-tab').css("top", $(this).offset().top + 39);
//                 $('.more-option-tab').css("left", $(this).offset().left);
//                 $('.more-option-tab').show();
//             }
//         });
//         $('body').on('click', '.more-option-tab .option', function (e) {
//             let tab_selected_id = Ultis.getStorage('project-tab-selected');
//             // TODO: add function tương ứng => ThuNT77
//         });
//         // add new project
//         $('body').on('click', '.button-add', function (e) {
//             ProjectDA.add({ "Name": "Untitled" });
//         });
//     }

//     // window.onclick = function (ev) {
//     //     if (!$('.appbar_popup').is(ev.target) || $('.wini-popup').has($(ev.target)).length == 1) {
//     //         $('.appbar_popup').hide();
//     //     }
//     // }
// });


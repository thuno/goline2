class TitleBarDA {
    static selectedID;

    // static initDataStorage2() {
    //     TitleBarDA.list = JSON.parse(ProjectView.get_listTabOpening) ?? [];
    //     // TitleBarDA.selectedID = 
    // }

    static list = () => JSON.parse(Ultis.getStorage('list-project-tab')) ?? []
    static setList = (list) => JSON.stringify(Ultis.setStorage('list-project-tab', list ?? []))

    static initDataStorage() {
        const list = JSON.parse(Ultis.getStorage('list-project-tab')) ?? [];

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const pid = urlParams.get('id');

        if (!TitleBarDA.list.some(e => e.ID == pid)) {
            let project = ProjectDA.list.find(e => e.ID == pid);
            if (project) {
                TitleBarDA.list.push(project);
                Ultis.setStorage('list-project-tab', JSON.stringify(TitleBarDA.list));
            }
        }
        TitleBarDA.selectedID = pid;
        TitleBarDA.updateTitleBar();
    }

    static updateTitleBar() {
        let tabs = '<div class="tabs row">';
        if (TitleBarDA.list.length > 0) {
            for (let i = 0; i < TitleBarDA.list.length; i++) {
                tabs += TitleBarDA.createTab(TitleBarDA.list[i]);
            }
        }
        tabs += '</div>';
        $('.tab-container').html(tabs);
        TitleBarDA.setActive(TitleBarDA.selectedID);

        // change UI with each platform
        var platform = navigator.platform;
        if (platform == 'Win32') {
            $('.title-bar-container').addClass('title-bar-win');
            $('.title-bar-container').removeClass('title-bar-mac');
        } else if (platform.includes("Mac")) {
            $('.title-bar-container').addClass('title-bar-mac');
            $('.title-bar-container').removeClass('title-bar-win');
        }
    }

    static createTab(item) {
        let tab =
            '<div data-id="' + item.ID + '" class="nav-tab row">' +
            '    <img class="box16" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@c6fbab0/lib/assets/pen.svg">' +
            '    <span class="semibold1 tab-title">' + item.Name + '</span>' +
            '    <button data-id="' + item.ID + '" class="tab-close button-transparent">' +
            '       <i class="fa-solid fa-close fa-sm"></i>' +
            '    </button>' +
            '</div>';
        return tab;
    }
    static setActive(id) {
        let list_tab = document.getElementsByClassName('nav-tab');
        for (let i = 0; i < list_tab.length; i++) {
            $(list_tab[i]).removeClass('active');
        }
        $('.nav-tab[data-id=' + id + ']').addClass('active');
    }
}

$(document).ready(function () {
    let token = Ultis.getStorage('token');
    if (token != null && token != "null") {
        $('body').on('click', '.home-button', function (e) {
            window.location.href = "/View/home-screen.html?tab=home";
            Ultis.setStorage('project-tab-selected', null);
        });
        // update selected project
        $('body').on('click', '.nav-tab', function (e) {
            if ($(this).data('id') != null) {
                Ultis.setStorage('project-tab-selected', $(this).data('id'));
                ProjectDA.changeProject($(this).data('id'));
            }
        });
        $('body').on('mousedown', '.nav-tab', function (e) {
            if (e.button == 2) {
                e.stopPropagation();
                $('.more-option-tab').css("top", $(this).offset().top + 39);
                $('.more-option-tab').css("left", $(this).offset().left);
                $('.more-option-tab').show();
            }
        });
        $('body').on('click', '.more-option-tab .option', function (e) {
            let tab_selected_id = Ultis.getStorage('project-tab-selected');
            // TODO: add function tương ứng => ThuNT77
        });
        // add new project
        $('body').on('click', '.button-add', function (e) {
            ProjectDA.add({ "Name": "Untitled" });
        });
    }

    // close tab
    $('body').on('mousedown', '.nav-tab', function (e) {
        if (e.button == 1) {
            let removeItem = TitleBarDA.list.find((e) => e.ID == $(this).data('id'))
            TitleBarDA.list.splice(TitleBarDA.list.indexOf(removeItem), 1);
            Ultis.setStorage('list-project-tab', JSON.stringify(TitleBarDA.list));
            if (TitleBarDA.list.length > 0) {
                Ultis.setStorage('project-tab-selected', TitleBarDA.list.at(-1).ID);
            } else {
                window.location.href = "/View/home-screen.html?tab=home";
            }
            TitleBarDA.updateTitleBar();
        }
    });
    $('body').on('mousedown', '.tab-close', function (e) {
        if (e.button == 0) {
            e.preventDefault();
            e.stopPropagation();
            let removeItem = TitleBarDA.list.find((e) => e.ID == $(this).data('id'));
            TitleBarDA.list.splice(TitleBarDA.list.indexOf(removeItem), 1);

            Ultis.setStorage('list-project-tab', JSON.stringify(TitleBarDA.list));
            if (TitleBarDA.list.length > 0) {
                Ultis.setStorage('project-tab-selected', TitleBarDA.list.at(-1).ID);
                ProjectDA.changeProject(TitleBarDA.list.at(-1).ID);
            } else {
                window.location.href = "/View/home-screen.html?tab=home";
            }
            TitleBarDA.updateTitleBar();
        }
    });
    window.onclick = function (ev) {
        if (!$('.appbar_popup').is(ev.target) || $('.wini-popup').has($(ev.target)).length == 1) {
            $('.appbar_popup').hide();
        }
    }
});


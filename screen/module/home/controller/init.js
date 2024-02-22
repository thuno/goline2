$('body > #home-body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@13c3b98/project-component/loading.html', async function () {
    const userItem = UserService.user()
    $('.user-container .user-name').text(userItem?.name ?? "-");
    $('.user-container .user-email').text(userItem?.email ?? "-");
    if (userItem?.urlAvatar)
        $('.user-container .user-avatar').css('background-image', `url(${userItem?.urlAvatar ?? ""})`);
    await ProjectDA.init()
    await TeamDA.init()
    // debugger
    const x = new Date()
    // ProjectDA.list = [{ ID: 43, Name: 'Test', DateUpdate: x }, { ID: 23, Name: 'sdfihishfoisf', DateUpdate: x }]
    $('body > #home-body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@13c3b98/screen/module/home/local-component/body-layout.html', function () {
        switch_tab_selected('recent')
    })
});

// // $('.appbar').load('/View/title-bar.html', function () {
// //     TitleBarDA.initDataStorage();
// // });

// let loadding_P_success = false;
// let loadding_T_success = false;

// function check_loadingSuccess() {
//     if (loadding_P_success && loadding_T_success) {
//         $('.list-team-container').html(TeamView.create_list_Team());
//         setTimeout(
//             async function () {
//                 $('.loading-view').hide();
//                 $('#home-body').css('display', "flex");
//                 await switch_tab_selected(url_tab, url_id);
//             }, 250
//         )
//     }
// }

var list_type = 1; // 1: grid, 2: list

async function switch_tab_selected(tab_seleted, id) {
    queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);
    url_tab = urlParams.get('tab');
    url_id = urlParams.get('id');

    $('#home-body .content-container-header>*').hide();
    $(".project-selected-view").hide();
    $(".team-content-container").hide();

    switch (tab_seleted) {
        case 'recent':
            TeamDA.selected = null;
            // $(".add-project-container").css("display", "flex");
            $(".project-selected-view").css("display", "flex");
            if (ProjectDA.selected == null) {
                $('#home-body #info-container .info_block').css("visibility", "hidden");
            }
            list_type == 1 ?
                ProjectView.create_listProjectCard(ProjectDA.list) :
                ProjectView.create_listProjectTile(ProjectDA.list);
            $('#home-body .content-container-header>.recent-header').text("Recently viewed");
            $('#home-body .content-container-header>.recent-header').css("display", "flex");
            $('#home-body #info-container .team-action-container>*').css("visibility", "hidden");
            break;
        case 'draft':
            TeamDA.selected = null;
            // $(".add-project-container").css("display", "flex");
            $(".project-selected-view").css("display", "flex");
            if (ProjectDA.selected == null) {
                $('#home-body #info-container .info_block').css("visibility", "hidden");
            }
            list_type == 1 ?
                ProjectView.create_listProjectCard(ProjectDA.list.filter(e => e.Permission == 0)) :
                ProjectView.create_listProjectTile(ProjectDA.list.filter(e => e.Permission == 0));
            $('#home-body .content-container-header>.recent-header').text("Draft view");
            $('#home-body .content-container-header>.recent-header').css("display", "flex");
            $('#home-body #info-container .team-action-container>*').css("visibility", "hidden");
            break;
        case 'team':
            $(".nav_tile").removeClass("selected");
            $(`.team-nav[data-id=${id}]`).addClass("selected")
            $('#info-container').removeClass("project");
            $('#info-container').addClass("team");
            ProjectDA.selected = null;
            TeamDA.selected = TeamDA.list.find(e => e.ID == id);
            $('.team-header-name').text(TeamDA.selected.Name);
            await TeamView.update_infoView(TeamDA.selected)
            $('.team-content-container').html(TeamView.create_listTeamChild(TeamDA.list.find(e => e.ID == id).ListChild));
            $(".team-content-container").css("display", "flex");
            // $(".add-project-container").hide();
            $('#home-body .content-container-header>.team-header').css("display", "flex");
            $('#home-body #info-container .team-action-container>*').css("visibility", "visible");
            break;
        case 'team-child':
            $(".nav_tile").removeClass("selected");
            $(`.team-child-nav[data-id=${id}]`).addClass("selected")
            $('#info-container').removeClass("project");
            $('#info-container').addClass("team");
            // ProjectDA.selected = null;
            $(".project-selected-view").css("display", "flex");
            let teamP = TeamDA.list.find(e => e.ListChild.some(el => el.ID == id))
            TeamDA.selected = teamP.ListChild.find(e => e.ID == id);
            $('.team-header-name').text(TeamDA.selected.Name);
            await TeamView.update_infoView(TeamDA.selected)
            list_type == 1 ?
                ProjectView.create_listProjectCard(ProjectDA.list.filter(e => e.TeamID == id)) :
                ProjectView.create_listProjectTile(ProjectDA.list.filter(e => e.TeamID == id));
            // $(".add-project-container").hide();
            $('#home-body .content-container-header>.team-header').css("display", "flex");
            $('#home-body #info-container .team-action-container>*').css("visibility", "visible");
            break;
        default:
            TeamDA.selected = null;
            // $(".add-project-container").css("display", "flex");
            $(".project-selected-view").css("display", "flex");
            if (ProjectDA.selected == null) {
                $('#home-body #info-container .info_block').css("visibility", "hidden");
            }
            list_type == 1 ?
                ProjectView.create_listProjectCard(ProjectDA.list) :
                ProjectView.create_listProjectTile(ProjectDA.list);
            $('#home-body .content-container-header>.recent-header').text("Recently viewed");
            $('#home-body .content-container-header>.recent-header').css("display", "flex");
            $('#home-body #info-container .team-action-container>*').css("visibility", "hidden");
            break;
    }
}

$("body").on("click", "#home-body #nav-container div.nav_tile", function (ev) {
    $(".nav_tile").removeClass("selected");
    $(this).addClass("selected")

    let url = homeUrl + "home-screen.html?tab=" + $(this).data("tab");
    if ($(this).data("id") != null) url += "&id=" + $(this).data("id");

    window.history.pushState({ Tab: $(this).data("tab") }, null, url);
    switch_tab_selected($(this).data("tab"), $(this).data("id"));
});

$("body").on("click", ".type-view-button", function (ev) {
    $(".type-view-button").removeClass("selected");
    $(this).addClass("selected");
    list_type = $(this).data("type");

    list_type == 1 ? ProjectView.create_listProjectCard(ProjectDA.list) : ProjectView.create_listProjectTile(ProjectDA.list);
});

// event header
$('body').on('click', `.show-user-action`, function (ev) {
    ev.stopPropagation();
    $(".home-popup").hide();
    $('.user-option').css("display", "flex");
});


$('body').on('click', `button.join-by-code`, function (ev) {
    ev.stopPropagation();
    $('.popup-join-by-code').css('display', 'flex');
    $('.popup-background').css('display', 'flex');
});

$('body').on('click', `.popup-join-by-code .button-join`, function (ev) {
    if ($('.popup-join-by-code input').val().length > 0) {
        ProjectDA.joinbycode({ "code": $('.popup-join-by-code input').val() });
    } else {
        toastr["warning"]('Vui lòng điền mã code dự án');
    }
});

$('body').on('input', '.search-input input', function (ev) {
    switch (url_tab) {
        case 'recent':
            list_type == 1 ?
                ProjectView.create_listProjectCard(ProjectDA.list.filter(e => e.Name.toLowerCase().includes($(this).val().toLowerCase()))) :
                ProjectView.create_listProjectTile(ProjectDA.list.filter(e => e.Name.toLowerCase().includes($(this).val().toLowerCase())));
            break;
        case 'draft':
            list_type == 1 ?
                ProjectView.create_listProjectCard(ProjectDA.list.filter(e => e.Permission == 0 && e.Name.toLowerCase().includes($(this).val().toLowerCase()))) :
                ProjectView.create_listProjectTile(ProjectDA.list.filter(e => e.Permission == 0 && e.Name.toLowerCase().includes($(this).val().toLowerCase())));
            break;
        case 'team':
            $('.team-content-container').html(TeamView.create_listTeamChild(TeamDA.list.find(e => e.ID == url_id).ListChild.filter(e => e.Name.toLowerCase().includes($(this).val().toLowerCase()))));
            break;
        case 'team-child':
            list_type == 1 ?
                ProjectView.create_listProjectCard(ProjectDA.list.filter(e => e.TeamID == url_id && e.Name.toLowerCase().includes($(this).val().toLowerCase()))) :
                ProjectView.create_listProjectTile(ProjectDA.list.filter(e => e.TeamID == url_id && e.Name.toLowerCase().includes($(this).val().toLowerCase())));
            break;
    }
});
class TeamView {
    static create_teamNav(item) {
        let team_tile =
            '<div data-id=' + item.ID + ' class="nav_tile team-nav text-body row" data-tab="team">' +
            '    <div class="box32 center"><img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@0a15f5d/lib/assets/logo.svg" alt=""></div>' +
            '    <input value="' + item.Name + '" class="regular1 team-name" type="text" readonly />' +
            '</div>';
        return team_tile;
    }

    static create_teamChildNav(item) {
        let team_child_tile =
            '<div data-id=' + item.ID + ' class="nav_tile team-child-nav text-body row" data-tab="team-child">' +
            '    <div class="box32 center"></div>' +
            '    <input value="' + item.Name + '" class="regular1 team-name" type="text" readonly />' +
            '</div>';
        return team_child_tile;
    }

    static create_list_Team() {
        let list_team = '';
        if (TeamDA.list.length > 0) {
            for (let item of TeamDA.list) {
                list_team += '<div class=" team-container col">';
                list_team += TeamView.create_teamNav(item);
                if (item.ListChild.length > 0) {
                    for (let child of item.ListChild) {
                        list_team += TeamView.create_teamChildNav(child);
                    }
                }
                list_team += '</div>';
            }
        }
        return list_team;
    }

    static create_listProjectCardTeam(team) {
        let list = ProjectDA.list.filter(e => e.TeamID == team.ID);
        let list_project = '';
        if (list.length > 0) {
            for (let item of list) {
                list_project +=
                    `<div data-id=${item.ID} class="project-card center">
                        <div class="box100"><img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@0a15f5d/lib/assets/logo.svg" /></div>
                        <div class="project-card-name regular1">${item.Name}</div>
                    </div>`;
            }
        }
        return list_project;
    }

    static create_teamChildTile(item) {
        let listPro = ProjectDA.list.filter(e => e.TeamID == item.ID)
        let team_child_tile =
            `<div data-id=${item.ID} class="team-child-tile-container row">
                <div class="team-child-info col">
                    <div class="semibold2 text-label team-child-name">${item.Name}</div>
                    <div class="space"></div>
                    <div class="team-child-detail row">
                        <button class="button-transparent box24 center text-subtitle"><i class="fa-regular fa-star fa-lg"></i></button>
                        <span class="regular1 text-subtitle">${listPro.length} files, Edit ${Ultis.getTimeEdit(item.DateUpdate)} ago</span>
                    </div>
                </div>
                <div class="list-project row">
                    ${TeamView.create_listProjectCardTeam(item)}
                </div>
            </div>`;

        return team_child_tile;
    }

    static create_listTeamChild(list) {
        let list_team_child = '';
        if (list.length > 0) {
            for (let item of list) {
                list_team_child += TeamView.create_teamChildTile(item)
            }
        }
        return list_team_child;
    }

    static async update_infoView(item) {
        $(".info_block>.logo-container").text(item.Name[0]);
        $(".info_block>.project-name").text(item.Name);
        $('#QR_container').html("").promise().done(() => { });
        new QRCode("QR_container", {
            text: item.Code,
            width: 100,
            height: 100,
            colorDark: "#000000",
            colorLight: "transparent",
            correctLevel: QRCode.CorrectLevel.M,
        });

        $('.code-container .code-value').text(item.Code);
        $(".domain-container").css("display", "none");
        $("#info-container>*").css("visibility", "visible");
        $(".member-block").css("height", "calc(100% - 512px)");
        $(".member-block .invite-member").hide();

        const listUser = await getListUser(item.CustomerTeamItems);
        $(".member-block .list-member").html(InfoView.create_listMember(listUser != null ? listUser : item.CustomerTeamItems, "team"));

        let cus = TeamDA.selected.CustomerTeamItems.find(e => e.CustomerID == userItem.ID);
        if (cus == null) {
            let teamParent = TeamDA.list.find(e => e.ID == TeamDA.selected.ParentID);
            cus = teamParent.CustomerTeamItems.find(el => el.CustomerID == userItem.ID);
        }
        if (cus?.Permission != null) {
            if (cus.Permission == 2) {
                $('.add-new-project, .invite-member').hide();
            }
            else {
                $('.add-new-project, .invite-member').show();
            }
        }
        else {
            $('.add-new-project, .invite-member').hide();
        }
    }
    static create_teamNavOptionPopup() {
        let cus = TeamDA.selected.CustomerTeamItems.find(e => e.CustomerID == userItem.ID);
        if (cus == null) {
            let teamParent = TeamDA.list.find(e => e.ID == TeamDA.selected.ParentID);
            cus = teamParent.CustomerTeamItems.find(el => el.CustomerID == userItem.ID);
        }
        let userPemission = cus.Permission;
        let team_nav_popup =
            `
            <div class="new option-tile regular11 text-subtitle-white ${userPemission != 2 ? "active" : ""}">New project</div>
            <div class="rename option-tile regular11 text-subtitle-white ${userPemission != null && userPemission != 2 ? "active" : ""}">Rename</div>
            <div class="border-line"></div>
            <div class="delete option-tile regular11 text-subtitle-white ${userPemission == 0 ? "active" : ""}">Delete</div>
            <div class="leave option-tile regular11 text-subtitle-white ${userPemission != null && userPemission != 0 ? "active" : ""}">Leave</div>
            `
        return team_nav_popup;
    }

}


$(`body`).on(`mousedown`, `.nav_tile.team-nav, .nav_tile.team-child-nav`, function (ev) {
    if ($(this).hasClass('team-nav')) {
        TeamDA.selected = TeamDA.list.find(e => e.ID == $(this).data("id"));

        $(".nav_tile").removeClass("selected");
        $(`.team-nav[data-id=${TeamDA.selected.ID}]`).addClass("selected")
    } else {
        let teamP = TeamDA.list.find(e => e.ListChild.some(el => el.ID == $(this).data("id")));
        TeamDA.selected = teamP.ListChild.find(e => e.ID == $(this).data("id"));

        $(".nav_tile").removeClass("selected");
        $(`.team-child-nav[data-id=${TeamDA.selected.ID}]`).addClass("selected")
    }
    if (ev.button == 2) {
        ev.stopPropagation();
        $(".home-popup").hide();
        $('.team-nav-popup').html(TeamView.create_teamNavOptionPopup());
        let posEqual = $("body").height() - ev.pageY;
        $('.team-nav-popup').css({
            top: posEqual > 140 ? ev.pageY : ev.pageY - 140,
            left: ev.pageX,
            display: "block",
        });
    }
});

$(`body`).on(`click`, `.team-nav-popup .option-tile.active.new`, function (ev) {
    if (TeamDA.selected.ParentID == null) {
        TeamDA.add({
            ParentID: TeamDA.selected.ID,
            Name: "New project"
        });
    } else {
        ProjectDA.add({
            ID: 0,
            TeamID: TeamDA.selected,
            Name: "Untitled"
        });
    }
});
$(`body`).on(`click`, `.team-nav-popup .option-tile.active.rename`, function (ev) {
    if (TeamDA.selected.ParentID == null) {
        $(`.team-nav[data-id=${TeamDA.selected.ID}] input`).removeAttr("readonly");
        $(`.team-nav[data-id=${TeamDA.selected.ID}] input`).focus();
        $(`.team-nav[data-id=${TeamDA.selected.ID}] input`).select();
    } else {
        $(`.team-child-nav[data-id=${TeamDA.selected.ID}] input`).removeAttr("readonly");
        $(`.team-child-nav[data-id=${TeamDA.selected.ID}] input`).focus();
        $(`.team-child-nav[data-id=${TeamDA.selected.ID}] input`).select();
    }
});

$(`body`).on(`blur`, `.team-container>.nav_tile>input`, function (ev) {
    if ($(this).val() != TeamDA.selected.Name) {
        $(this).prop("readonly", "true");
        TeamDA.selected.Name = $(this).val();
        TeamDA.edit(TeamDA.selected);
    }
});
$(`body`).on(`keydown`, `.team-container>.nav_tile>input`, function (ev) {
    if (ev.key == "Enter") {
        $(this).trigger("blur");
    }
});

$(`body`).on(`click`, `.team-nav-popup .option-tile.active.delete`, function (ev) {
    ev.stopPropagation();
    $('.team-nav-popup').hide();
    let item = {
        type: "warning",
        title: "Thông báo",
        content: `Bạn có chắc chắn muốn xóa <span class="text-error semibold2">${TeamDA.selected.Name}</span> không? Bạn sẽ không thể tiếp tục làm việc với nhóm này nữa!`,
        cancelTitle: "Cancel",
        confirmTitle: "Confirm",
        cancelAction: function () {
        },
        confirmAction: function () {
            TeamDA.deleted(TeamDA.selected);
        },
    };
    $('.popup-background').append(PopupDA.create_alertPopup_center(item));
    $('.popup-background').css("display", "flex");
});

$(`body`).on(`click`, `.team-nav-popup .option-tile.active.leave`, function (ev) {
    ev.stopPropagation();
    $('.team-nav-popup').hide();
    let item = {
        type: "warning",
        title: "Thông báo",
        content: `Bạn có chắc chắn muốn rời khỏi <span class="text-error semibold2">${TeamDA.selected.Name}</span> không? Bạn sẽ không thể tiếp tục làm việc với nhóm này nữa!`,
        cancelTitle: "Cancel",
        confirmTitle: "Confirm",
        cancelAction: function () {
        },
        confirmAction: function () {
            UrPermissionDA.deleteCustomerTeam(TeamDA.selected.CustomerTeamItems.find(e => e.CustomerID == userItem.ID));
        },
    };
    $('.popup-background').append(PopupDA.create_alertPopup_center(item));
    $('.popup-background').css("display", "flex");
});


//move
{
    let na_id;
    let move = false;
    $('body').on('mousemove', function (ev) {
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let tab = urlParams.get('tab');
        if (ev.buttons == 1 && ProjectDA.selected && (tab == 'team-child' || tab == "draft")) {
            move = true;
            $('.move-card').show();
            $('.move-card').css('top', ev.pageY + 12);
            $('.move-card').css('left', ev.pageX + 4);
            if ($('.team-nav').is(ev.target) || $('.team-nav').has(ev.target).length == 1) {
                na_id = $(ev.target).data('id');
                $('.team-nav[data-id=' + na_id + '], .team-nav[data-id=' + na_id + '] *').css('cursor', 'not-allowed');
            }
        }
    });

    $('body').on('mouseup', async function (ev) {
        if (move) {
            $('.team-nav[data-id=' + na_id + '], .team-nav[data-id=' + na_id + '] *').css('cursor', 'default');
            $('.move-card').hide();
            let team = $(ev.target).closest('.team-child-nav');
            if (team.length == 1 && $(team).data("id") != TeamDA.selected?.ID) {
                //check quyền
                let permission = TeamDA.selected != null ? TeamDA.getPermission(TeamDA.selected) : EnumPermission.owner;
                if (permission != EnumPermission.viewer) {
                    let new_team = TeamDA.getByID($(team).data('id'));
                    if (TeamDA.getPermission(new_team) != EnumPermission.viewer) {
                        ProjectDA.selected.TeamID = $(team).data("id");
                        ProjectDA.edit(ProjectDA.selected);
                        TeamDA.selected = TeamDA.getByID($(team).data("id"));
                        // history.pushState('', 'Team', homeUrl + "/home-screen.html?tab=team-child&id=" + url_id);
                        // update_UI_InfoView(TeamDA.selected, 'team');
                        // update_SelectedOption();
                        await switch_tab_selected(url_tab, url_id);
                    } else {
                        toastr.warning(`Bạn phải có quyền Admin trở lên ở ${new_team.Name} để thực hiện thao tác này!`);
                    }
                } else {
                    toastr.warning(`Bạn phải có quyền Admin trở lên ở ${TeamDA.selected.Name} để thực hiện thao tác này!`);
                }
            }
            move = false;
        }
    });
}
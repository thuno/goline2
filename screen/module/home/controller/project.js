class ProjectView {
    static set_listTabOpening(value) {
        localStorage.setItem("list_project_tab_open", value);
    };
    static set_selectedTab(value) {
        localStorage.setItem("project_selected_tab", value);
    };

    static get_listTabOpening() {
        return localStorage.getItem("list_project_tab_open");
    };
    static get_selectedTab() {
        return localStorage.getItem("project_selected_tab");
    };

    static create_projectCard(item) {
        let project_card =
            `<div data-id=${item.ID} class="project-card col col6-xxl col8-xl col12  ${item.ID == ProjectDA.selected?.ID ? "selected" : ""}">
                <div class="project-bg"></div>    
                <div class="project-card-info row">
                    <div class="box24 center row"><i class="fa-solid fa-pen-nib" style="font-size: 1.2rem;color: #ffffff"></i></div>
                    <div class="col" style="flex: 1;gap: 0.4rem;">
                        <input value="${item.Name}" class="project-name semibold1 text-title" readonly/>
                        <span class="regular0 text-subtitle">Editor ${Ultis.getTimeEdit(item.DateUpdate)} ago</span>
                    </div>
                </div>
            </div>`
        return project_card;
    }

    static create_projectTile(item) {
        let project_card =
            `<div data-id=${item.ID} class="project-tile row ${item.ID == ProjectDA.selected?.ID ? "selected" : ""}">
                <div class="box32 circular text-body center"><i class="fa-regular fa-star fa-lg"></i></div>
                <input  value="${item.Name}" class="project-name semibold1 text-title space" readonly/>
                <div class="space regular1 text-subtitle">Edit ${Ultis.getTimeEdit(item.DateUpdate)} ago</div>
                <div class="box24 circular text-disable center"><i class="fa-solid fa-circle"></i></div>
                <div class="box24 circular text-disable center"><i class="fa-solid fa-circle"></i></div>
            </div>`
        return project_card;
    }


    static create_listProjectCard(list) {
        $('.project-content-container').html("");
        for (let item of list) {
            $('.project-content-container').append(ProjectView.create_projectCard(item))
        }
    }
    static create_listProjectTile(list) {
        $('.project-content-container').html("");
        for (let item of list) {
            $('.project-content-container').append(ProjectView.create_projectTile(item))
        }
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
        $('.domain-container u').text(item?.Domain ?? item.Code);
        $('.change-domain-input').val(item?.Domain ?? item.Code);
        $('.description-block input').val(item?.Description ?? "");
        $('.keyword-block input').val(item?.Keyword ?? "");
        $("#info-container>*").css("visibility", "visible");
        $(".member-block").css("height", "calc(100% - 544px)");
        $(".member-block .invite-member").show();

        const listUser = await getListUser(item.CustomerProjectItems);
        $(".member-block .list-member").html(InfoView.create_listMember(listUser != null ? listUser : item.CustomerProjectItems, "project"));

        ProjectDA.selected.Permission == 2 ?
            $('.edit-domain-button, .invite-member').hide() :
            $('.edit-domain-button, .invite-member').show();
    }

    static create_projectOptionPopup() {
        let userPemission = ProjectDA.selected.CustomerProjectItems.find(e => e.CustomerID == userItem.ID)?.Permission;
        let popup =
            `
            <div class="open option-tile regular11 text-subtitle-white active">Open</div>
            <div class="border-line"></div>
            <div class="open_blank option-tile regular11 text-subtitle-white active">Open in new tab</div>
            <div class="api option-tile regular11 text-subtitle-white active">Setting API & Router</div>
            <div class="border-line"></div>
            <div class="option-tile regular11 text-subtitle-white ">Move to team</div>
            <div class="rename option-tile regular11 text-subtitle-white ${userPemission != 2 ? "active" : ""}">Rename</div>
            <div class="border-line"></div>
            <div class="remove option-tile regular11 text-subtitle-white ${userPemission != null && userPemission != 0 ? "active" : ""}">Remove from recent</div>
            <div class="delete option-tile regular11 text-subtitle-white ${userPemission == 0 ? "active" : ""}">Delete</div>
            `;
        return popup;
    }

    static show_option = false;
    static mouserEvent;
}


$("body").on("click", ".project-card, .project-tile", async function (ev) {
    ev.stopPropagation();
    $(".project-card, .project-tile").removeClass("selected");
    ev.target.closest('.project-card, .project-tile').classList.add('selected')
    // ProjectDA.selected = ProjectDA.list.find(e => e.ID == $(this).data("id"));

    // ProjectDA.getByID(ProjectDA.selected.ID);
    // if (ev.button == 0 && ev.detail == 2) {
    //     window.location.href = homeUrl + "project-design-view.html?id=" + $(this).data("id");
    // }
    // else if (ev.button == 2) {
    //     $(".home-popup").hide();
    //     ProjectView.show_option = true;
    //     ProjectView.mouserEvent = ev;
    // }

    // $(".domain-container").css("display", "flex");
    // $('#info-container').removeClass("team");
    // $('#info-container').addClass("project");

    // // debugger
    // await ProjectView.update_infoView(ProjectDA.selected);


});

$("body").on("dblclick", ".project-card", async function (ev) {
    const pId = parseInt(ev.target.closest('.project-card').getAttribute('data-id'))
    let newTitleList = TitleBarDA.list()
    if (newTitleList.every(e => e.ID !== pId)) newTitleList.push(ProjectDA.list.find(e => e.ID === pId))
    TitleBarDA.setList(newTitleList)
    window.location.replace(`/#/file?id=${pId}`);
    window.location.reload()
})

$('body').on(`click`, `.add-project-container .button-add-project`, function (ev) {
    debugger
    // if (url_tab == "team-child") {
    //     let cus = TeamDA.selected.CustomerTeamItems.find(e => e.CustomerID == userItem.ID);
    //     if (cus == null) {
    //         let teamParent = TeamDA.list.find(e => e.ID == TeamDA.selected.ParentID);
    //         cus = teamParent.CustomerTeamItems.find(el => el.CustomerID == userItem.ID);
    //     }
    //     if (cus?.Permission != 2) {
    //         ProjectDA.add({ ID: 0, TeamID: TeamDA.selected.ID, Name: "Untitled" });
    //     } else {
    //         let item = {
    //             type: "info",
    //             title: "Thông báo",
    //             content: `Bạn không có quyền thực hiện thao tác này`,
    //             cancelTitle: "Cancel",
    //             confirmTitle: "Confirm",
    //             cancelAction: function () { },
    //             confirmAction: function () { },
    //         };
    //         $('.popup-background').append(PopupDA.create_alertPopup_center(item));
    //         $('.popup-background').css("display", "flex");
    //     }
    // } else {
    ProjectDA.add({ ID: 0, Name: "Untitled" }).then(res => {
        if (res.Code === 200) {
            TitleBarDA.setList([...TitleBarDA.list(), res.Data])
            window.location.replace(`/#/file?id=${res.Data.ID}`);
            window.location.reload()
        }
    })
    // }
});

$('body').on(`click`, `.project-option-popup .option-tile.active.open`, function (ev) {
    window.location.href = homeUrl + "project-design-view.html?id=" + ProjectDA.selected.ID;
});

$('body').on(`click`, `.project-option-popup .option-tile.active.open_blank`, function (ev) {
    window.open(homeUrl + `project-design-view.html?id=${ProjectDA.selected.ID}`);
});

$('body').on(`click`, `.project-option-popup .option-tile.active.api`, function (ev) {
    window.location.href = homeUrl + `api-view.html?pid=${ProjectDA.selected.ID}`;
});

$('body').on(`click`, `.project-option-popup .option-tile.active.rename`, function (ev) {
    $(`.project-card[data-id="${ProjectDA.selected.ID}"], .project-tile[data-id="${ProjectDA.selected.ID}"]`).find("input").removeAttr("readonly");
    $(`.project-card[data-id="${ProjectDA.selected.ID}"], .project-tile[data-id="${ProjectDA.selected.ID}"]`).find("input").focus();
    $(`.project-card[data-id="${ProjectDA.selected.ID}"], .project-tile[data-id="${ProjectDA.selected.ID}"]`).find("input").select();
});

$('body').on('blur', '.project-card input, .project-tile input', function (ev) {
    if ($(this).val() != ProjectDA.selected.Name) {
        $(`.project-card[data-id="${ProjectDA.selected.ID}"], .project-tile[data-id="${ProjectDA.selected.ID}"]`).find("input").prop("readonly", "true");
        ProjectDA.selected.Name = $(this).val();
        ProjectDA.edit(ProjectDA.selected);
    }
});
$('body').on('keydown', '.project-card input, .project-tile input', function (ev) {
    if (ev.key == "Enter") {
        $(this).trigger("blur");
    }
});

$('body').on(`click`, `.project-option-popup .option-tile.active.remove`, function (ev) {
    ev.stopPropagation();
    let item = {
        type: "warning",
        title: "Thông báo",
        content: `Bạn có chắc chắn muốn rời khỏi <span class="text-primary semibold2">${ProjectDA.selected.Name}</span> không? Bạn sẽ không thể tiếp tục làm việc với dự án này nữa!`,
        cancelTitle: "Cancel",
        confirmTitle: "Confirm",
        cancelAction: function () {
        },
        confirmAction: function () {
            let item = ProjectDA.selected.CustomerProjectItems.find(e => e.CustomerID == userItem.ID)
            ProjectDA.deleteCustomerProject(item.ID);
        },
    };
    $('.popup-background').append(PopupDA.create_alertPopup_center(item));
    $('.popup-background').css("display", "flex");
    $('.project-option-popup').hide();
});

$('body').on(`click`, `.project-option-popup .option-tile.active.delete`, function (ev) {
    ev.stopPropagation();
    let item = {
        type: "warning",
        title: "Thông báo",
        content: `Bạn có chắc chắn muốn xóa <span class="text-error semibold2">${ProjectDA.selected.Name}</span> không? Bạn sẽ không thể tiếp tục làm việc với dự án này nữa!`,
        cancelTitle: "Cancel",
        confirmTitle: "Confirm",
        cancelAction: function () {
        },
        confirmAction: function () {
            TitleBarDA.list = TitleBarDA.list.filter(e => e.ID != ProjectDA.selected.ID);
            TitleBarDA.updateTitleBar();

            ProjectDA.deleted({ id: ProjectDA.selected.ID });
        },
    };
    $('.popup-background').append(PopupDA.create_alertPopup_center(item));
    $('.popup-background').css("display", "flex");
    $('.project-option-popup').hide();
});

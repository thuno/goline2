class ProjectDA {
    static selected;
    static obj_click;
    static list = [];
    static urlCtr = "Project/";
    static showing_list = [];
    static obj = { ID: 0 };
    static permission = 2;

    static isShowPopup = false;
    static openingList = [];
    static assetsList = [];
    static objOneClick = { ID: 0 };
    static objInvite = {};
    static importLib = false;
    static responsiveJson = {
        Column: 24,
        BreakPoint: [
            // {
            //     Key: "X-small (xs)",
            //     Width: 480
            // },
            {
                Key: "Small (sm)",
                Width: 576,
            },
            {
                Key: "Medium (md)",
                Width: 768,
            },
            {
                Key: "Large (lg)",
                Width: 992,
            },
            {
                Key: "X-large (xl)",
                Width: 1200,
            },
            {
                Key: "XX-large (xxl)",
                Width: 1600,
            },
        ],
    };

    static async init() {
        const res = await getData('/view/project-getall')
        if (res.Code === 200) {
            this.list = res.Data
        } else {
            toastr["error"](res.Message);
        }
        return res
    }

    static async checkDomain(domain) {
        const res = await getData('/view/check-domain', { params: { domain: domain } })
        if (res.Code === 200) {
            debugger
            // ProjectDA.list = res.data
        } else {
            toastr["error"](res.Message);
        }
        return res
        // let url = ProjectDA.urlCtr + `CheckDomain?domain=${domain}`;
        // emitGet(null, url, EnumObj.project, EnumEvent.check);
    }

    static async add(obj) {
        const res = await postData('/view/add-project', { data: obj })
        if (res.Code === 200) {
            res.Data.Name = obj.Name
            ProjectDA.list.push(res.Data)
        } else {
            toastr["error"](res.Message);
        }
        return res
    }

    static async edit(obj) {
        const res = await postData('/view/edit-project', { data: obj })
        if (res.Code === 200) {
            ProjectDA.list[ProjectDA.list.findIndex(e => e.ID === obj.ID)] = obj
        } else {
            toastr["error"](res.Message);
        }
        return res
    }

    static async delete(obj) {
        const res = await postData('/view/delete-project', { data: obj })
        if (res.Code === 200) {
            ProjectDA.list = ProjectDA.list.filter(e => e.ID !== obj.ID)
        } else {
            toastr["error"](res.Message);
        }
        return res
    }

    static editRouter(obj) {
        var url = ProjectDA.urlCtr + "Edit";
        if (ProjectDA.obj.ID != 0) {
            if (obj.ResponsiveJson) {
                obj = JSON.parse(JSON.stringify(obj));
                obj.ResponsiveJson = JSON.stringify(obj.ResponsiveJson);
            }
            WiniIO.emitPort(obj, url, EnumObj.project, EnumEvent.editRouter);
        } else if (socketH?.connected) {
            emitPort(obj, url, EnumObj.project, EnumEvent.editRouter);
        }
    }

    static joinbycode(obj) {
        let url = ProjectDA.urlCtr + "joinbycode";
        emitPort(obj, url, EnumObj.project, EnumEvent.joinbycode);
    }

    static editcode(obj) {
        let url = ProjectDA.urlCtr + "EditCode";
        emitPort(obj, url, EnumObj.project, EnumEvent.editcode);
    }

    static async addCustomerProject(obj) {
        const res = await postData('/view/add-customer-project', { data: obj })
        if (res.code === 200) {
            debugger
        } else {
            toastr["error"](res.message);
        }
        return res
        // var url = "UrPermission/AddCustomerProject";
        // if (ProjectDA.obj.ID != 0) {
        //     WiniIO.emitPort(obj, url, EnumObj.customerProject, EnumEvent.add);
        // } else {
        //     emitPort(obj, url, EnumObj.customerProject, EnumEvent.add);
        // }
    }

    static async editCustomerProject(obj) {
        const res = await postData('/view/edit-customer-project', { data: obj })
        if (res.code === 200) {
            debugger
        } else {
            toastr["error"](res.message);
        }
        return res
        // let url = "UrPermission/EditCustomerProject";
        // if (ProjectDA.obj.ID != 0) {
        //     WiniIO.emitPort(obj, url, EnumObj.customerProject, EnumEvent.edit);
        // } else {
        //     emitPort(obj, url, EnumObj.customerProject, EnumEvent.edit);
        // }
    }

    static async deleteCustomerProject(id) {
        const res = await postData('/view/delete-customer-team', { params: { id: id } })
        if (res.code === 200) {
            debugger
        } else {
            toastr["error"](res.message);
        }
        return res
        // let url = "UrPermission/DeleteCustomerProject?id=" + obj;
        // if (ProjectDA.obj.ID != 0) {
        //     WiniIO.emitPort(null, url, EnumObj.customerProject, EnumEvent.delete);
        // } else {
        //     emitPort(null, url, EnumObj.customerProject, EnumEvent.delete);
        // }
    }

    static getByIDApi() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const pid = urlParams.get("pid");
        var url = ProjectDA.urlCtr + "GetByIDApi?pid=" + pid;
        emitGet(null, url, EnumObj.project, EnumEvent.getProjectByIDapi);
    }

    static async getByID(id) {
        const res = await getData('/view/project-getById', { params: { pid: id } })
        if (res.Code === 200) {
            ProjectDA.obj = res.Data
        } else {
            toastr["error"](res.message);
        }
        return res
        // let pid;
        // if (id == null) {
        //     const queryString = window.location.search;
        //     const urlParams = new URLSearchParams(queryString);
        //     pid = urlParams.get("id");
        // } else {
        //     pid = id;
        // }
        // let url = ProjectDA.urlCtr + "GetByID?pid=" + pid;
        // if (ProjectDA.obj.ID == 0) {
        //     emitGet(null, url, EnumObj.project, EnumEvent.getProjectByID);
        // } else {
        //     WiniIO.emitGet(null, url, EnumObj.project, EnumEvent.getProjectByID);
        // }
    }

    static getProjectInfor() {
        let url = ProjectDA.urlCtr + "GetByID";
        WiniIO.emitGet(null, url, EnumObj.project, EnumEvent.getProjectByID);
    }

    static async getPermission() {
        const res = await getData('/view/get-permission')
        if (res.Code === 200) {
        } else {
            toastr["error"](res.message);
        }
        return res
        // let url = ProjectDA.urlCtr + "GetPermissionItem";
        // WiniIO.emitGet(null, url, EnumObj.project, EnumEvent.permission);
    }

    static create_UI_Project(item) {
        let pro = "";

        if (HomeDA.sort_project == 1) {
            pro = '<div class="disable-text-select project-card-container ' + `${ProjectDA.selected?.ID == item.ID ? "selected" : ""}` + '">' + '    <div class="project-card col elevation7"  data-id="' + item.ID + '">' + '        <div class="design-preview background-grey3"></div>' + '        <div class="project-info row background-white">' + '            <img src="https://cdn.jsdelivr.net/gh/WiniGit/goline@cda4f66/lib/assets/pen.svg" class="box32">' + '                <div class="col">' + '                    <input class="button-text-5 text-title" type="text" value="' + item.Name + '" disabled>' + '                        <span class="regular11 text-subtitle">Editor ' + Ultis.getTimeEdit(item.DateUpdate) + " ago</span>" + "                </div>" + "        </div>" + "    </div>" + "</div>";
        } else {
            pro = '<div class="disable-text-select project-tile elevation4 row ' + `${ProjectDA.selected?.ID == item.ID ? "selected" : ""}` + '" data-id="' + item.ID + '">' + '    <div class="block1 row">' + '        <button class="button-transparent box32"><i class="fa-regular fa-star"></i></button>' + '        <input type="text" class="button-text-5 text-title" value="' + item.Name + '" disabled>' + "    </div>" + '    <div class="block2">' + '        <span class="regular11 text-subtitle">Editor ' + Ultis.getTimeEdit(item.DateUpdate) + " ago</span>" + "    </div>" + '    <div class="block3 row">' + '        <div class="box12 circular background-grey3"></div>' + '        <div class="box12 circular background-grey3"></div>' + "    </div>" + "</div>";
        }
        return pro;
    }

    static set_selected(this_item) {
        this.getByID($(this_item).data("id"));
        $(".project-card-container .project-card").removeClass("selected");
        $(".project-tile").removeClass("selected");
        $(this_item).addClass("selected");
        ProjectDA.selected = ProjectDA.list.find((e) => e.ID == $(this_item).data("id"));
        update_UI_InfoView(ProjectDA.selected, "project");
    }

    static projectUIByPermission() { }

    static update_titlebar(id) {
        if (!TitleBarDA.list.some((e) => e.ID == id)) {
            TitleBarDA.list.push(ProjectDA.list.find((e) => e.ID == id));
        }
        Ultis.setStorage("list-project-tab", JSON.stringify(TitleBarDA.list));
        Ultis.setStorage("project-tab-selected", id);
        TitleBarDA.updateTitleBar();
        TitleBarDA.setActive(id);
    }

    static changeProject(projectId) {
        ProjectDA.update_titlebar(projectId);
        if (copy_item?.length) {
            Ultis.setStorage(
                "copy-item",
                JSON.stringify({
                    time: Date.now(),
                    list: copy_item,
                }),
            );
        }
        window.location.href = "/View/project-design-view.html?id=" + projectId;
    }
}

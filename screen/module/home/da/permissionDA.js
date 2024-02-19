class PermissionDA {
    static async getCustomerItem(email) {
        const res = await getData('/view/get-id-by-email', { params: { email: email } })
        if (res.code === 200) {
            if ($('#info-container').hasClass("team")) {
                if (TeamDA.selected.CustomerTeamItems.some((e) => e.CustomerID == res.data.ID)) {
                    toastr["error"]("Người dùng đã là thành viên trong nhóm này!");
                } else {
                    let customerInviteItem = {
                        ID: 0,
                        Permission: ProjectDA.permission,
                        CustomerID: res.data.ID,
                        CustomerName: res.data.Email,
                        TeamID: TeamDA.selected.ID,
                        UrlAvatar: res.data.UrlAvatar,
                    }
                    TeamDA.addCustomerTeam(customerInviteItem);
                }
            }
            else {
                if (ProjectDA.selected.CustomerProjectItems.some(e => e.CustomerID == res.data.ID)) {
                    toastr["error"]("Người dùng đã là thành viên của dự án này!");
                } else {
                    let customerInviteItem = {
                        ID: 0,
                        Permission: ProjectDA.permission,
                        CustomerID: res.data.ID,
                        CustomerName: res.data.Email,
                        ProjectID: ProjectDA.selected.ID,
                        UrlAvatar: res.data.UrlAvatar,
                    }
                    ProjectDA.addCustomerProject(customerInviteItem);
                }
            }
        } else {
            toastr["error"]("Người dùng chưa đăng ký tài khoản Wini!");
        }
    }
    static editCustomerItem(item) {
        var url = 'Customer/UpdateAcount';
        if (ProjectDA.obj.ID != 0) {
            WiniIO.emitPort(item, url, EnumObj.customer, EnumEvent.edit);
        } else {
            emitPort(item, "Customer/UpdateAcount", EnumObj.customer, EnumEvent.edit);
        }
    }
    static getByCode(code) {
        let url = 'UrPermission/GeIDByCode?code=' + code;
        if (code.length == 12) {
            emitGet(null, url, EnumObj.team, EnumEvent.getByCode);
        } else if (code.length == 14) {
            emitGet(null, url, EnumObj.project, EnumEvent.getByCode);
        } else if (code.length == 16) {
            emitGet(null, url, EnumObj.page, EnumEvent.getByCode);
        } else {
            toastr.error('Mã code không đúng!');
        }
    }
}
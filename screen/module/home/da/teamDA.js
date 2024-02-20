class TeamDA {
    static urlCtr = "WTeam/";

    static list = [];
    static obj = {};

    static selected = { ID: 0 };
    static objInvite = {};

    // static getById(id) {
    //     var url = TeamDA.urlCtr + 'GetbyteamId?id=' + id;
    //     emitGet(null, url, EnumObj.team, EnumEvent.get);
    // }

    static getByID(ID) {
        let _list = [...TeamDA.list, ...TeamDA.list.map(item => item.ListChild).reduce((a, b) => a.concat(b))]
        return _list.find(e => e.ID == ID);
    }

    static getPermission(team) {
        return team.CustomerTeamItems.find((e) => e.CustomerID == userItem.ID)?.Permission;
    }

    static async getProjectbyTeamId(id) {
        const res = await getData('/view/project-getByTeamId', {
            params: { id: id }
        })
        if (res.code === 200) {
            this.list = res.data
        } else {
            toastr["error"](res.message);
        }
        return res
        // var url = TeamDA.urlCtr + 'GetbyteamId?id=' + id;
        // emitGet(null, url, EnumObj.team, EnumEvent.getProjectByID);
    }

    static async init() {
        const res = await getData('/view/team-getall')
        if (res.code === 200) {
            debugger
        } else {
            toastr["error"](res.message);
        }
        return res
    }

    static async add(obj) {
        const res = await postData('/view/add-team', { data: obj })
        if (res.code === 200) {
            debugger
        } else {
            toastr["error"](res.message);
        }
        return res
    }

    static create(obj) {
        var url = TeamDA.urlCtr + 'Add';
        emitPort(obj, url, EnumObj.team, EnumEvent.create);
    }

    static async edit(obj) {
        const res = await postData('/view/edit-team', { data: obj })
        if (res.code === 200) {
            debugger
        } else {
            toastr["error"](res.message);
        }
        return res
    }

    static async delete(obj) {
        const res = await postData('/view/delete-team', { data: obj })
        if (res.code === 200) {
            debugger
        } else {
            toastr["error"](res.message);
        }
        return res
    }

    static async leave(obj) {
        const res = await postData('/view/leave-team', { data: obj })
        if (res.code === 200) {
            debugger
        } else {
            toastr["error"](res.message);
        }
        return res
    }

    static async addCustomerTeam(obj) {
        const res = await postData('/view/add-customer-team', { data: obj })
        if (res.code === 200) {
            debugger
        } else {
            toastr["error"](res.message);
        }
        return res
    }

    static async editCustomerTeam(obj) {
        const res = await postData('/view/edit-customer-team', { data: obj })
        if (res.code === 200) {
            debugger
        } else {
            toastr["error"](res.message);
        }
        return res
    }

    static async deleteCustomerTeam(id) {
        const res = await postData('/view/delete-customer-team', { params: { id: id } })
        if (res.code === 200) {
            debugger
        } else {
            toastr["error"](res.message);
        }
        return res
    }
}
class ApiSelection {
    static collection = 0;
    static document = 1;
}

class CollectionDA {
    static list = [];
    static selected;
    static element_selected;

    static selectedDocument
    static documentList = [];

    static urlCtr = "Collection/";

    static wInit() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('pid');
        var url = CollectionDA.urlCtr + 'ListItem?pid=' + id;
        WiniIO.emitGet(null, url, EnumObj.collection, EnumEvent.init);
    }

    static init() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('pid');
        var url = CollectionDA.urlCtr + 'ListItem?pid=' + id;
        emitGet(null, url, EnumObj.collection, EnumEvent.init);
    }

    static async getListDocument() {
        const res = await getData('/view/collection-getall', { params: { pid: ProjectDA.obj.ID, type: ApiSelection.document } })
        if (res.Code === 200) {
            this.documentList = res.Data
        } else {
            toastr["error"](res.Message);
        }
        return res
    }

    static async addDocument(item) {
        const res = await postData('/view/add-collection', { data: item, params: { pid: ProjectDA.obj.ID } })
        if (res.Code === 200) {
            this.documentList.push(res.Data)
        } else {
            toastr["error"](res.Message);
        }
        return res
    }

    static async editDocument(item) {
        const res = await postData('/view/edit-collection', { data: item, params: { pid: ProjectDA.obj.ID } })
        if (res.Code === 200) {
            debugger
            this.documentList[this.documentList.findIndex(e => e.ID === item.ID)] = item
        } else {
            toastr["error"](res.Message);
        }
        return res
    }

    static async deleteDocument(item) {
        const res = await postData('/view/delete-collection', { data: item, params: { pid: ProjectDA.obj.ID } })
        if (res.Code === 200) {
            debugger
            this.documentList = this.documentList.filter(e => e.ID !== item.ID)
        } else {
            toastr["error"](res.Message);
        }
        return res
    }

    static add(item) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('pid');
        var url = CollectionDA.urlCtr + 'Add?pid=' + id;
        emitPort(item, url, EnumObj.collection, EnumEvent.add);
    }

    static edit(item) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('pid');
        var url = CollectionDA.urlCtr + 'Edit?pid=' + id;
        emitPort(item, url, EnumObj.collection, EnumEvent.edit);
    }

    static deleted(id) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const pid = urlParams.get('pid');
        var url = CollectionDA.urlCtr + 'Delete?pid=' + pid;
        emitPort({ 'ID': id }, url, EnumObj.collection, EnumEvent.delete);
    }

    static getElementByID(id) {
        return this.list.find(e => e.ID == id);
    }

    static set_selected() {
        $('.collection-tile').removeClass('selected');
        if (!CollectionDA.selected.listApi.some(e => e.GID == RequestDA.selected?.GID)) {
            $('.collection-tile[data-id="' + CollectionDA.selected.ID + '"]').addClass('selected');
        }
    }

    // static set_selected(id) {
    //     let item = $('.collection-tile[data-id="' + id + '"]')
    //     $('.collection-tile').removeClass('selected');

    //     if (RequestDA.selected == null) {
    //         $(item).addClass('selected');
    //     }
    //     // else {
    //     //     RequestDA.set_selected(RequestDA.selected);
    //     // }

    //     CollectionDA.selected = CollectionDA.getByID(id);
    //     if (CollectionDA.selected.listApi == null) {
    //         CollectionDA.selected.listApi = [];
    //     }
    // }

    static getByID(ID) {
        return CollectionDA.list.find(e => e.ID == ID);
    }

    static update_list_api(new_item) {
        let item = CollectionDA.selected.listApi.find(e => e.GID == new_item.GID);
        let index = CollectionDA.selected.listApi.indexOf(item);
        CollectionDA.selected.listApi[index] = new_item;
    }

    static update_UI_ListCollection(list) {
        if (list == null) {
            list = CollectionDA.list.filter(e => e.Type == ApiSelection.collection);
        }

        let list_collection = '';
        if (list.length > 0) {
            for (let item of list) {
                list_collection +=
                    '<div class="collection-container col">' +
                    '    <div data-id="' + item.ID + '" class="collection-tile option-tile row">' +
                    '        <button class="box24 button-transparent"><i class="fa-solid fa-chevron-down fa-xs"></i></button>' +
                    '        <img class="box24" src="https://cdn.jsdelivr.net/gh/WiniGit/goline@0a15f5d/lib/assets/logo.svg">' +
                    '        <input class="button-text-5 text-title" type="text" value="' + item.Name + '" disabled>' +
                    '    </div>' +
                    '    <div class="list-request col">' + RequestDA.update_UI_ListRequestTile(item.listApi) + '</div>' +
                    '</div>';
            }
        } else {
            list_collection = '<span class="row center regular11 text-placeholder">No files yet</span>'
        }

        $('.collection-nav-bar-bar').html(list_collection);

        if (CollectionDA.selected == null && CollectionDA.list.length > 0) {
            if (CollectionDA.list.length > 1) {
                CollectionDA.selected = CollectionDA.list[1];
                // CollectionDA.set_selected(CollectionDA.list[1].ID);
            }
        }
    }
}

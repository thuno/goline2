class PageDA {
  static list = [];
  static enableEdit = false;
  static obj = { ID: Ultis.getStorage('pageId') ?? 0, ProjectID: 0, Permission: 2 };
  static setSelected(obj) {
    PageDA.obj = obj
    Ultis.setStorage('pageId', obj.ID);
  };
  static urlCtr = "Page/";
  static settingsPage = false;
  static customerList = [];

  static saveSettingsPage() {
    PageDA.obj.scale = scale;
    PageDA.obj.leftx = leftx;
    PageDA.obj.topx = topx;
    this.setSelected(PageDA.obj);
  }

  static selectPage(pageItem) {
    if (pageItem && pageItem.ID !== PageDA.obj.ID) {
      this.setSelected(pageItem);
      window.location.reload()
    }
  }

  static checkEditPermission(permisson) {
    if (permisson != undefined && permisson < EnumPermission.viewer) {
      PageDA.enableEdit = true;
    } else {
      PageDA.enableEdit = false;
      document.body.setAttribute("enable", "false");
    }
  }

  static editCustomerPermission(obj, enumObj = EnumObj.customerProject) {
    let url = `UrPermission/${enumObj === EnumObj.customerProject ? "EditCustomerProject" : "EditCustomerTeam"}`;
    WiniIO.emitPort(obj, url, enumObj, EnumEvent.edit);
  }

  static deleteCustomerPermission(obj, enumObj = EnumObj.customerProject) {
    let url = `UrPermission/${enumObj === EnumObj.customerProject ? "DeleteCustomerProject" : "DeleteCustomerTeam"}?id=${obj.ID}`;
    WiniIO.emitPort(null, url, enumObj, EnumEvent.delete);
  }

  static getDataById() {
    var url = PageDA.urlCtr + "GetByID";
    WiniIO.emitGet(null, url, EnumObj.page, EnumEvent.get);
  }

  static getAll(pid) {
    obj.ProjectID = pid;
    var url = PageDA.urlCtr + "ListItem";
    WiniIO.emitPort(obj, url, EnumObj.page, EnumEvent.init);
  }

  static add(obj) {
    WiniIO.emitPage([obj], EnumEvent.add);
  }

  static edit(obj) {
    this.setSelected(obj);
    WiniIO.emitPage([obj], EnumEvent.edit);
  }

  static sort() {
    for (var i = 0; i < list.length; i++) list[i].Sort = i;
    WiniIO.emitPage(list, EnumEvent.sort);
  }

  static delete(obj) {
    let thisPageTile = document.getElementById(`pageID:${obj.ID}`);
    thisPageTile.remove();
    this.settingsPage = true;
    this.saveSettingsPage();
    WiniIO.emitPage([obj], EnumEvent.delete);
  }
}

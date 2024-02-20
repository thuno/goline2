class PageDA {
  static list = [];
  static enableEdit = false;
  static obj = { ID: 0, ProjectID: 0, Permission: 2 };
  static urlCtr = "Page/";
  static settingsPage = false;
  static customerList = [];

  static saveSettingsPage() {
    if (this.settingsPage) {
      PageDA.obj.scale = scale;
      PageDA.obj.leftx = leftx;
      PageDA.obj.topx = topx;
      if (!ProjectDA.obj.PageItem) ProjectDA.obj.PageItem = PageDA.list;
      ProjectDA.obj.PageItem.splice(
        ProjectDA.obj.PageItem.findIndex((page) => page.ID === PageDA.obj.ID),
        1,
        PageDA.obj,
      );
      TitleBarDA.list.splice(
        TitleBarDA.list.findIndex((project) => project.ID === ProjectDA.obj.ID),
        1,
        ProjectDA.obj,
      );
      Ultis.setStorage("opening-page", JSON.stringify(PageDA.obj));
      this.settingsPage = false;
    }
  }

  static pageLoadingView(func) {
    divSection.replaceChildren();
    let loadingView = document.createElement("div");
    loadingView.className = "loading-view";
    document.getElementById("body").appendChild(loadingView);
    $(loadingView).load("/View/loading.html", func);
  }

  static selectPage(pageItem) {
    if (pageItem && pageItem.ID !== PageDA.obj.ID) {
      PageDA.obj = pageItem;
      Ultis.setStorage("opening-page", JSON.stringify(pageItem));
      PageDA.pageLoadingView(initData);
    }
  }

  static checkEditPermission(item) {
    if (item?.Permission != undefined && item.Permission < EnumPermission.viewer) {
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
    this.settingsPage = true;
    this.saveSettingsPage();
    Ultis.setStorage("opening-page", JSON.stringify(obj));
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

class FileDA {
  static list = [];
  static selectedFile = [];
  static urlCtr = 'WFile/';
  static acceptFileTypes = ["image/png", "image/gif", "image/jpeg", "image/svg", "image/svg+xml"];

  static async init() {
    const res = await getData('/view/file-getall')
    if (res.Code === 200) {
      this.list = res.Data
    } else {
      toastr["error"](res.Message);
    }
    return res
  }

  static async getImageSize(file) {
    let isFile = file instanceof Blob;
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.src = isFile ? window.URL.createObjectURL(file) : file;
      img.onload = () => resolve({ w: img.width, h: img.height });
      img.onerror = reject;
    });
  }

  static selectFile(listFile = []) {
    FileDA.selectedFile = listFile;
    [...document.getElementsByClassName("img_folder_demo")].forEach((eHTML) => {
      if (listFile.some((e) => eHTML.getAttribute("fileID") == e.ID)) {
        eHTML.style.backgroundColor = "#e6f7ff";
      } else {
        eHTML.style.backgroundColor = null;
      }
    }
    );
  }

  static async add(listFile, collectionId) {
    debugger
    let result = await WiniIO.emitFile(listFile, collectionId);
    FileDA.list.push(...result);
    if (document.getElementById("popup_img_document")) {
      selectFolder(CollectionDA.documentList.find((e) => e.ID == collectionId));
    }
    return result;
  }

  static edit(fileItem) {
    let url = FileDA.urlCtr + 'Edit';
    WiniIO.emitPort(fileItem, url, EnumObj.file, EnumEvent.edit);
  }

  static delete(listId) {
    let url = FileDA.urlCtr + 'Delete';
    FileDA.list = FileDA.list.filter((e) => listId.every((id) => e.ID != id));
    FileDA.selectedFile = [];
    WiniIO.emitPort({ ListID: listId }, url, EnumObj.file, EnumEvent.delete);
  }

  static recycle(listId) {
    let url = FileDA.urlCtr + 'Recycle';
    FileDA.list.forEach((e) => {
      if (listId.some((id) => e.ID == id)) {
        e.IsDeleted = !e.IsDeleted;
      }
    });
    FileDA.selectedFile = [];
    WiniIO.emitPort({ ListID: listId }, url, EnumObj.file, EnumEvent.recycle);
  }
}

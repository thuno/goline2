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

  static async add(listFile, docId) {
    let result = await uploadFile({ listFile: listFile, docId: docId });
    debugger
    FileDA.list.push(...result);
    if (document.getElementById("popup_img_document")) {
      selectFolder(CollectionDA.documentList.find((e) => e.ID === docId));
    }
    return result;
  }

  static async edit(fileItem) {
    const res = await postData('/view/edit-file', { data: fileItem })
    if (res.Code === 200) {
      debugger
      FileDA.list[FileDA.list.findIndex(e => e.ID === fileItem.ID)] = fileItem
    } else {
      toastr["error"](res.Message);
    }
    return res
  }

  static async delete(listId) {
    const res = await postData('/view/delete-file', { data: { ListID: listId } })
    if (res.Code === 200) {
      debugger
      FileDA.list = FileDA.list.filter((e) => listId.every((id) => e.ID != id));
      FileDA.selectedFile = [];
    } else {
      toastr["error"](res.Message);
    }
    return res
  }

  static async recycle(listId) {
    WiniIO.emitPort({ ListID: listId }, url, EnumObj.file, EnumEvent.recycle);
    const res = await postData('/view/recycle-file', { data: { ListID: listId } })
    if (res.Code === 200) {
      debugger
      FileDA.list.forEach((e) => {
        if (listId.some((id) => e.ID == id)) {
          e.IsDeleted = !e.IsDeleted;
        }
      });
      FileDA.selectedFile = [];
    } else {
      toastr["error"](res.Message);
    }
    return res
  }
}

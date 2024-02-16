{/* <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js" integrity="sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script> */ }
class UserService {
    static token = () => Ultis.getStorage('token')
    static setToken = (txt) => Ultis.setStorage('token', txt)
    static user = () => Ultis.getStorage('customer')
    static setUser = (data) => Ultis.setStorage('customer', JSON.stringify(data))
    static timeRefresh = () => Ultis.getStorage('time_refresh')

    static encryptData = (text) => {
        const data = CryptoJS.AES.encrypt(
            JSON.stringify(text),
            secretPass
        ).toString();
        return data;
    };

    static decryptData = (text) => {
        if (text) {
            const bytes = CryptoJS.AES.decrypt(text, secretPass);
            const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return data;
        }
        return null;

    };

    static setTimeRefresh() {
        var now = Date.now() / 1000 + 9 * 60
        Ultis.setStorage('time_refresh', now)
    }

    static refreshToken = () => this.decryptData(Ultis.getStorage('refreshToken'))
    static setRefreshToken = (txt) => this.encryptData(txt)

    static refreshNewToken = async () => {
        const response = await BaseDA.post('/view/refresh-token', {
            headers: {
                'Content-Type': 'application/json',
                params: { token: this.refreshToken() }
            }
        })
        if (response.code === 200) {
            this.setToken(response.data)
        } else if (response.code === 404) {
            toastr['error']('Phiên đăng nhập cảu bạn đã hết hạn')
            setTimeout(function () {
                localStorage.clear()
                window.location.href = '/screen/login-view.html'
            }, 500)
        } else {
            toastr['error'](response.message)
        }
    }

    static headers = async () => {
        const timeRefresh = this.timeRefresh()
        const now = Date.now() / 1000
        if (timeRefresh && timeRefresh > 0 && timeRefresh <= now) {
            await this.refreshNewToken()
            return {
                refreshToken: this.refreshToken(),
                token: this.token(),
                pid: StyleDA.skinProjectID ?? ProjectDA.obj?.ID ?? 0,
                pageid: PageDA.obj?.ID,
                'Content-Type': 'application/json'
            }
        } else {
            return {
                token: this.token(),
                refreshToken: '',
                pid: StyleDA.skinProjectID ?? ProjectDA.obj?.ID,
                pageid: PageDA.obj?.ID,
                'Content-Type': 'application/json'
            }
        }
    }
}

const postData = async (url, { data, params }) => {
    const headers = await UserService.headers()
    const response = await BaseDA.post(url, {
        headers: params ? { ...headers, params: params } : headers,
        body: data
    })
    if (response.code === 200) {
        return response.data
    } else {
        toastr['error'](response.message)
        return null
    }
}

const getData = async (url, { params }) => {
    const headers = await UserService.headers()
    const response = await BaseDA.get(url, {
        headers: params ? { ...headers, params: params } : headers,
    })
    if (response.code === 200) {
        return response.data
    } else {
        toastr['error'](response.message)
        return null
    }
}

const uploadFile = async ({ listFile, collectionId }) => {
    listFile = [...listFile];
    const now = new Date();
    let headers = await UserService.headers();
    headers.folder = UserService.user().id;
    headers.collectionId = collectionId;
    headers.code = ProjectDA.obj.Code;
    headers.datee = `${now.getFullYear()}${now.getMonth()}${now.getDate()}`; // datee chư sko phải date
    let listFileResult = [];
    for (let i = 0; i < Math.ceil(listFile.length / 5); i++) {
        const formData = new FormData();
        let endIndex = i * 5 + 5;
        if (listFile.length < endIndex) {
            endIndex = listFile.length;
        }
        let sliceList = listFile.slice(i * 5, endIndex);
        for (let j = 0; j < sliceList.length; j++) {
            formData.append("files", sliceList[j]);
        }
        let result = await BaseDA.postFile(ConfigApi.socketWiniFile + 'uploadfile', {
            headers: headers,
            formData: formData
        })
        listFileResult.push(...result);
    }
    return listFileResult;
}
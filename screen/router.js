const url = location.hash.split('/')
console.log(url)

if (UserService.token()) {
    if (url.includes('home') || url.every(e => !e.match(/file\?id\=[\d]*/g))) {
        window.location.hash = '/home'
        document.head.querySelector('title').innerHTML = 'Home'
        let cssTag = document.createElement('link')
        cssTag.rel = "stylesheet"
        cssTag.href = "https://cdn.jsdelivr.net/gh/thuno/goline2@a3df2c2/screen/module/home/home.css"
        // cssTag.href = "./screen/module/home/home.css"
        document.head.appendChild(cssTag)
        $('body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@a3df2c2/screen/module/home/home.html')
        // $('body').load('./screen/module/home/home.html')
    } else {
        // window.location.hash = '/file'
        document.head.querySelector('title').innerHTML = 'File'
        let cssTag = document.createElement('link')
        cssTag.rel = "stylesheet"
        cssTag.href = "https://cdn.jsdelivr.net/gh/thuno/goline2@a3df2c2/screen/module/file/design-view.css"
        // cssTag.href = "./screen/module/file/design-view.css"
        document.head.appendChild(cssTag)
        // $('body').load('./screen/module/file/design-view.html')
        $('body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@a3df2c2/screen/module/file/design-view.html')
    }
} else {
    window.location.hash = '/login'
    document.head.querySelector('title').innerHTML = 'Login'
    let cssTag = document.createElement('link')
    cssTag.rel = "stylesheet"
    cssTag.href = "https://cdn.jsdelivr.net/gh/thuno/goline2@a3df2c2/screen/module/login/login-view.css"
    document.head.appendChild(cssTag)
    $('body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@a3df2c2/screen/module/login/login-view.html')
}
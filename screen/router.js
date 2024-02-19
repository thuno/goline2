console.log(location.pathname)

const url = location.hash.split('/')
if (UserService.token()) {
    if (url.includes('home') || !url.includes('file')) {
        window.location.hash = '/home'
        document.head.querySelector('title').innerHTML = 'Home'
        let cssTag = document.createElement('link')
        cssTag.rel = "stylesheet"
        cssTag.href = "https://cdn.jsdelivr.net/gh/thuno/goline2@bfb518f/screen/module/home/home.css"
        document.head.appendChild(cssTag)
        $('body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@bfb518f/screen/module/home/home.html')
    } else {
        window.location.hash = '/file'
        $('body').load('./file/design-view.html')
    }
} else {
    window.location.hash = '/login'
    document.head.querySelector('title').innerHTML = 'Login'
    let cssTag = document.createElement('link')
    cssTag.rel = "stylesheet"
    cssTag.href = "https://cdn.jsdelivr.net/gh/thuno/goline2@bfb518f/screen/module/login/login-view.css"
    document.head.appendChild(cssTag)
    $('body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@bfb518f/screen/module/login/login-view.html')
}
console.log(location.pathname)

const url = location.hash.split('/')
if (UserService.token()) {
    if (url.includes('home.html')) {
        window.location.hash = '/home'
        $('body').load('./home/home.html')
    } else {
        window.location.hash = '/design-view'
        $('body').load('./file/design-view.html')
    }
} else {
    window.location.hash = '/login'
    document.head.querySelector('title').innerHTML = 'Login'
    let cssTag = document.createElement('link')
    cssTag.rel = "stylesheet"
    cssTag.href = "https://cdn.jsdelivr.net/gh/thuno/goline2@8a82ee8/screen/module/login/login-view.css"
    document.head.appendChild(cssTag)
    $('body').load('https://cdn.jsdelivr.net/gh/thuno/goline2@8a82ee8/screen/module/login/login-view.html')
}
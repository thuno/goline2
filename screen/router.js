console.log(location.pathname)

const url = location.pathname.split('/')
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
    cssTag.href = "./screen/module/login/login-view.css"
    document.head.appendChild(cssTag)
    $('body').load('./screen/module/login/login-view.html')
}
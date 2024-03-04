function showPopup({ id, children, hiddenOverlay = false, style, onDispose }) {
    let popupOverlay = document.createElement('div')
    popupOverlay.className = `popup-overlay ${hiddenOverlay ? 'hidden-overlay' : ''}`
    popupOverlay.innerHTML = `<div ${id?.length ? `id="${id}"` : ''} class="popup-container col" ${style?.length ? `style="${style}"` : ''}></div>`
    let popupContainer = popupOverlay.querySelector('.popup-container')
    if (typeof children === 'string') {
        popupContainer.innerHTML = children
    } else if (Array.isArray(children)) {
        popupContainer.replaceChildren(...children)
    } else {
        popupContainer.replaceChildren(children)
    }
    if (hiddenOverlay) {
        popupOverlay.onclick = function (ev) {
            if (ev.target.classList.contains('popup-overlay')) {
                if (onDispose) onDispose()
                popupOverlay.remove()
            }
        }
    } else {
        let closeBtn = document.createElement('button')
        closeBtn.className = 'popup-close-btn row'
        closeBtn.innerHTML = `<svg width='100%' height='100%' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' >
            <path fillRule='evenodd' clipRule='evenodd' d='M16.4223 4.7559C16.7477 4.43047 16.7477 3.90283 16.4223 3.57739C16.0968 3.25195 15.5692 3.25195 15.2438 3.57739L9.99967 8.82147L4.7556 3.57739C4.43016 3.25195 3.90252 3.25195 3.57709 3.57739C3.25165 3.90283 3.25165 4.43047 3.57709 4.7559L8.82116 9.99998L3.57709 15.2441C3.25165 15.5695 3.25165 16.0971 3.57709 16.4226C3.90252 16.748 4.43016 16.748 4.7556 16.4226L9.99967 11.1785L15.2438 16.4226C15.5692 16.748 16.0968 16.748 16.4223 16.4226C16.7477 16.0971 16.7477 15.5695 16.4223 15.2441L11.1782 9.99998L16.4223 4.7559Z' fill='#00204D' fillOpacity={0.6} />
        </svg>`
        closeBtn.onclick = function () {
            if (onDispose) onDispose()
            popupOverlay.remove()
        }
        popupContainer.appendChild(closeBtn)
    }
    document.body.appendChild(popupOverlay)
    const thisPopupRect = popupContainer.getBoundingClientRect()
    if (thisPopupRect) {
        if (thisPopupRect.right > document.body.offsetWidth) {
            popupContainer.style.left = null
            popupContainer.style.right = '0.4rem'
        }
        if (thisPopupRect.bottom > document.body.offsetHeight) {
            popupContainer.style.top = null
            popupContainer.style.bottom = '0.4rem'
        }
    }
    return popupOverlay
}
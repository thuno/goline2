function createContainerHTML(wb, data) {
    wb.value = document.createElement(wb.ListClassName.includes('w-form') ? 'form' : 'div')
    let fragment = document.createDocumentFragment()
    fragment.replaceChildren(...data.map(cWb => cWb.value))
    wb.value.replaceChildren(fragment)
}

function createRectangleHTML(item) {
    item.value = document.createElement("div");
}

function createTextHTML(wb) {
    wb.value = document.createElement('div')
    wb.value.innerHTML = `<span>${wb.AttributesItem.Content}</span>`
    $(wb.value).on('focus', 'span', function () {
        if (window.getComputedStyle(wb.value).position === 'absolute') {
            let transformX = '0'
            switch (window.getComputedStyle(wb.value).textAlign) {
                case TextAlign.center:
                    transformX = '-50%'
                    var thisComputeStyle = window.getComputedStyle(wb.value)
                    wb.value.style.left =
                        parseFloat(thisComputeStyle.left.replace('px')) +
                        wb.value.offsetWidth / 2 +
                        'px'
                    wb.value.style.right = null
                    break
                case TextAlign.right:
                    transformX = '-100%'
                    thisComputeStyle ??= window.getComputedStyle(wb.value)
                    wb.value.style.left =
                        parseFloat(thisComputeStyle.left.replace('px')) +
                        wb.value.offsetWidth +
                        'px'
                    wb.value.style.right = null
                    break
                default:
                    break
            }
            let transformY = '0'
            switch (window.getComputedStyle(wb.value).alignItems) {
                case TextAlignVertical.center:
                    transformY = '-50%'
                    thisComputeStyle ??= window.getComputedStyle(wb.value)
                    wb.value.style.top =
                        parseFloat(thisComputeStyle.top.replace('px')) +
                        wb.value.offsetHeight / 2 +
                        'px'
                    wb.value.style.bottom = null
                    break
                case TextAlignVertical.bottom:
                    transformY = '-100%'
                    thisComputeStyle ??= window.getComputedStyle(wb.value)
                    wb.value.style.top =
                        parseFloat(thisComputeStyle.top.replace('px')) +
                        wb.value.offsetHeight +
                        'px'
                    wb.value.style.bottom = null
                    break
                default:
                    break
            }
            wb.value.style.transform = `translate(${transformX},${transformY})`
        }
        let range = document.createRange()
        range.selectNodeContents(this)
        let sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
    })
    $(wb.value).on('blur', 'span', function () {
        this.contentEditable = false
        let selection = window.getSelection()
        selection.removeAllRanges()
        if (this.innerText.length > 0) {
            if (window.getComputedStyle(wb.value).position === 'absolute')
                updateConstraints(wb.value)
            wb.AttributesItem.Content = this.innerText
            wb.Css = wb.value.style.cssText
            if (wb.isNew) {
                handleCompleteAddWbase()
            } else {
                WBaseDA.edit([wb], EnumObj.attribute)
            }
        } else if (wb.isNew) {
            wbase_list = wbase_list.filter(e => e.GID !== wb.GID)
            let layerCotainer = left_view.querySelector(`.col:has(.layer_wbase_tile[id="wbaseID:${wb.GID}"])`)
            layerCotainer.remove()
            wb.value.remove()
            handleWbSelectedList()
        } else {
            WBaseDA.delete([wb])
        }
    })
}


const txtfd_eye_on = `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.535 11.0314C20.2527 9.21757 16.7559 5 12.0001 5C7.24426 5 3.75156 9.21757 2.46429 11.0322C2.16215 11.4615 2 11.9737 2 12.4986C2 13.0236 2.16215 13.5357 2.46429 13.965V13.965C3.75156 15.7797 7.24426 19.9973 12.0001 19.9973C16.7559 19.9973 20.2527 15.7797 21.5358 13.965C21.838 13.5356 22.0001 13.0232 22 12.4981C21.9999 11.973 21.8374 11.4607 21.535 11.0314V11.0314ZM12.0001 16.6646C11.1761 16.6646 10.3707 16.4202 9.6856 15.9625C9.00052 15.5047 8.46657 14.8541 8.15126 14.0929C7.83595 13.3316 7.75345 12.494 7.9142 11.6859C8.07494 10.8778 8.4717 10.1355 9.05432 9.5529C9.63693 8.97028 10.3792 8.57352 11.1873 8.41278C11.9954 8.25203 12.8331 8.33453 13.5943 8.64984C14.3555 8.96515 15.0061 9.4991 15.4639 10.1842C15.9216 10.8693 16.166 11.6747 16.166 12.4986C16.166 13.6035 15.7271 14.6631 14.9458 15.4444C14.1645 16.2256 13.1049 16.6646 12.0001 16.6646V16.6646Z"  fill-opacity="0.6" /></svg>`
const txtfd_eye_off = `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.535 10.5207C20.9132 9.64509 20.2186 8.82344 19.4587 8.0645L16.1085 11.4147C16.1408 11.6043 16.16 11.7958 16.166 11.988C16.166 13.0928 15.7271 14.1524 14.9458 14.9337C14.1645 15.715 13.1049 16.1539 12.0001 16.1539C11.8079 16.1479 11.6164 16.1287 11.4268 16.0964L8.71316 18.81C9.7535 19.25 10.8705 19.4799 12.0001 19.4866C16.7559 19.4866 20.2527 15.269 21.5358 13.4544C21.838 13.0249 22.0002 12.5125 22 11.9874C21.9999 11.4623 21.8374 10.95 21.535 10.5207Z"  fill-opacity="0.6" /><path d="M12.0001 4.48931C7.24426 4.48931 3.75156 8.70688 2.46429 10.5216C2.16215 10.9508 2 11.463 2 11.988C2 12.5129 2.16215 13.0251 2.46429 13.4544C3.56373 15.0216 4.90982 16.4003 6.45023 17.5369L9.0531 14.9341C8.6662 14.5472 8.35929 14.088 8.14989 13.5825C7.94048 13.0771 7.83268 12.5354 7.83264 11.9882C7.83257 10.8833 8.27143 9.8236 9.05268 9.04223C9.83393 8.26087 10.8936 7.82186 11.9985 7.82178C13.1035 7.82171 14.1632 8.26057 14.9445 9.04182L9.0531 14.9341L17.5524 6.43562C15.952 5.21981 14.0093 4.53883 12.0001 4.48931Z"  fill-opacity="0.6" /><path d="M2.83505 21.9861C2.67029 21.9861 2.50924 21.9372 2.37226 21.8457C2.23527 21.7541 2.12851 21.624 2.06546 21.4718C2.00242 21.3196 1.98592 21.1521 2.01805 20.9905C2.05018 20.8289 2.12951 20.6804 2.24599 20.5639L20.576 2.23388C20.7331 2.08211 20.9436 1.99813 21.1621 2.00003C21.3805 2.00193 21.5895 2.08955 21.744 2.24403C21.8985 2.39851 21.9861 2.60748 21.988 2.82594C21.9899 3.0444 21.9059 3.25486 21.7541 3.412L3.42411 21.742C3.2679 21.8983 3.05601 21.9861 2.83505 21.9861Z"  fill-opacity="0.6" /></svg>`
const txtfd_calendar = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="95%" viewBox="0 0 17 16" fill="none"><path d="M12.3876 2.99967V1.88856C12.3876 1.74122 12.3291 1.59991 12.2249 1.49573C12.1207 1.39154 11.9794 1.33301 11.832 1.33301C11.6847 1.33301 11.5434 1.39154 11.4392 1.49573C11.335 1.59991 11.2765 1.74122 11.2765 1.88856V2.99967H12.3876Z"  fill-opacity="0.6" /><path d="M5.72092 2.99967V1.88856C5.72092 1.74122 5.66239 1.59991 5.5582 1.49573C5.45401 1.39154 5.31271 1.33301 5.16536 1.33301C5.01802 1.33301 4.87671 1.39154 4.77253 1.49573C4.66834 1.59991 4.60981 1.74122 4.60981 1.88856V2.99967H5.72092Z"  fill-opacity="0.6" /><path d="M13.4987 14.1108H3.4987C3.05667 14.1108 2.63275 13.9352 2.32019 13.6226C2.00763 13.3101 1.83203 12.8861 1.83203 12.4441V5.2219C1.83203 4.77987 2.00763 4.35595 2.32019 4.04339C2.63275 3.73082 3.05667 3.55523 3.4987 3.55523H13.4987C13.9407 3.55523 14.3646 3.73082 14.6772 4.04339C14.9898 4.35595 15.1654 4.77987 15.1654 5.2219V12.4441C15.1654 12.8861 14.9898 13.3101 14.6772 13.6226C14.3646 13.9352 13.9407 14.1108 13.4987 14.1108ZM14.0543 6.33301H2.94314V12.4441C2.94314 12.5915 3.00167 12.7328 3.10586 12.837C3.21005 12.9411 3.35136 12.9997 3.4987 12.9997H13.4987C13.646 12.9997 13.7873 12.9411 13.8915 12.837C13.9957 12.7328 14.0543 12.5915 14.0543 12.4441V6.33301Z"  fill-opacity="0.6" /><path d="M6.27648 7.44412H4.05425V9.11079H6.27648V7.44412Z"  fill-opacity="0.6" /><path d="M9.60981 7.44412H7.38759V9.11079H9.60981V7.44412Z"  fill-opacity="0.6" /><path d="M6.27648 10.2219H4.05425V11.8886H6.27648V10.2219Z"  fill-opacity="0.6" /><path d="M9.60981 10.2219H7.38759V11.8886H9.60981V10.2219Z"  fill-opacity="0.6" /><path d="M12.9431 7.44412H10.7209V9.11079H12.9431V7.44412Z"  fill-opacity="0.6" /></svg>`

function createTextFormFieldHTML(wb, data) {
    wb.value = document.createElement('div')
    let fragment = document.createDocumentFragment()
    fragment.replaceChildren(...data.map(cWb => cWb.value))
    wb.value.replaceChildren(fragment)
}

function createTextFieldHTML(wb) {
    wb.value = document.createElement('div')
    let children = `<div class="input-container"><input ${wb.JsonItem.ReadOnly ? 'readOnly' : ''} ${wb.JsonItem.Enabled ? '' : 'disabled'} value=${wb.AttributesItem.Content
        } class="${wb.AttributesItem.Content?.length > 0 ? 'content' : ''}"/>${wb.JsonItem.Label?.length > 0 ? `<label>${wb.JsonItem.Label}</label>` : ''
        }</div>`
    if (wb.JsonItem.Type === WTextFormFieldType.obscureText) {
        children += `<div class="suffix-btn-txtfd eye-icon">${txtfd_eye_off}</div>`
        wb.value.innerHTML = children
        wb.value.querySelector('.input-container > input').type = 'password'
    } else if (
        [
            WTextFormFieldType.datePicker,
            WTextFormFieldType.monthPicker,
            WTextFormFieldType.yearPicker
        ].some(e => wb.JsonItem.Type === e)
    ) {
        children += `<div class="suffix-btn-txtfd calendar-icon">${txtfd_calendar}</div>`
        wb.value.setAttribute('type', wb.JsonItem.Type)
        wb.value.innerHTML = children
    } else {
        wb.value.innerHTML = children
        wb.value.querySelector('.input-container > input').type = wb.JsonItem.Type
    }
    $(wb.value).on('input', 'input', function (ev) {
        if (ev.target.value.length > 0) {
            $(wb.value).addClass('content')
        } else {
            $(wb.value).removeClass('content')
        }
    })
}

function createSwitchHTML(wb) {
    wb.value = document.createElement('label')
    wb.value.innerHTML = `<input type="checkbox" ${wb.AttributesItem.Content === 'true' ? 'checked' : ''}/><span class="slider"></span>`
    wb.value.onclick = function (ev) {
        ev.stopImmediatePropagation()
        ev.stopPropagation()
        ev.preventDefault()
    }
}

function createCheckBoxHTML(wb) {
    wb.value = document.createElement('label')
    toggle.innerHTML = `<input type="checkbox"${wb.AttributesItem.Content === 'true' ? ' checked' : ''}/><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.72 11.52 L10.8 15.6 L18 7.2" fill="none" stroke-linecap="round" stroke="#ffffff"/></svg>`
    wb.value.onclick = function (ev) {
        ev.stopImmediatePropagation()
        ev.stopPropagation()
        ev.preventDefault()
    }
}

function createRadioHTML(wb) {
    wb.value = document.createElement("label")
    wb.value.innerHTML = `<input type="radio" ${wb.JsonItem.Checked === 'true' ? 'checked' : ''} value="${wb.AttributesItem.Content}"/><span class="checkmark"></span>`
    wb.value.onclick = function (ev) {
        ev.stopImmediatePropagation()
        ev.stopPropagation()
        ev.preventDefault()
    }
}
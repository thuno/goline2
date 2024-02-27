function GroupButtonOptions({ value, options = [], onselect, activeColor = '#e5e5e5', returnType = 'object', direction = 'row', style = '', disabled = false }) {
    if (returnType === 'string') {
        const dataId = uuidv4()
        return `<div class="${direction} group-button-options ${disabled ? 'disabled' : ''}" data-id="${dataId}" style="--active-color: ${activeColor};${style}">${options.map(e => {
            $('body').on('click', `.group-button-options[data-id="${dataId}"] > button[id-value="${e.id}"]`, function () { onselect(e) })
            return e.htmlText ?? `<button id-value="${e.id}" type="button" class="${e.class ?? 'box24 row center'} ${value === e.id ? 'selected' : ''}" style="${e.style ?? ''}" ${e.img ? `img-bg="${e.img}"` : ''}>${e.icon ?? ''}</button>`
        }).join('')}</div>`
    } else {
        let newElement = document.createElement('div')
        newElement.className = `${direction} group-button-options ${disabled ? 'disabled' : ''}`
        newElement.style.cssText = `--active-color: ${activeColor};${style}`
        newElement.innerHTML = options.map(e => {
            $(newElement).on('click', `button[id-value="${e.id}"]`, function () { onselect(e) })
            return e.htmlText ?? `<button id-value="${e.id}" type="button" class="${e.class ?? 'box24 row center'} ${value === e.id ? 'selected' : ''}" style="${e.img ? `--img-bg: url(${e.img});` : ''}${e.style ?? ''}" ${e.img ? `img-bg="${e.img}"` : ''}>${e.icon ?? ''}</button>`
        }).join('')
        return newElement
    }
}
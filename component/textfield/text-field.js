const TextField = ({ id, value = '', maxLength, onChange, onBlur, onFocus, placeholder = '', disabled, readOnly, className, helperText, name, suffix, prefix, helperTextColor, style, type = 'text', returnType = 'object', focusSelectAll = true }) => {
    if (returnType === 'string') {
        if (onFocus || focusSelectAll) {
            var dataId = uuidv4()
            $('body').on('focus', `.text-field-container[txtf-id="${dataId}"] > input`, (ev) => {
                ev.target.select()
                if (onFocus) onFocus(ev)
            })
        }
        if (onChange) {
            dataId ??= uuidv4()
            $('body').on('change', `.text-field-container[txtf-id="${dataId}"] > input`, onChange)
        }
        if (onBlur) {
            dataId ??= uuidv4()
            $('body').on('blur', `.text-field-container[txtf-id="${dataId}"] > input`, onBlur)
        }
        return `<div ${id?.length ? `id="${id}"` : ''} ${dataId ? `txtf-id="${dataId}"` : ''}  class="text-field-container row ${className ?? 'placeholder-2'} ${helperText?.length && 'helper-text'}" style="--helper-text-color: ${helperTextColor ?? '#e14337'};${style ?? ''}" ${helperText?.length ? `helper-text="${helperText}"` : ''}>
            ${prefix ?? ''}
            <input type="${type}" value="${value}" placeholder="${placeholder}" ${maxLength ? `maxLength="${maxLength}"` : ''} ${name ? `name="${name}"` : ''} ${readOnly ? 'readOnly' : ''} ${disabled ? 'disabled' : ''}/>
            ${suffix ?? ''}
        </div>`
    } else {
        let newElement = document.createElement('div')
        if (id?.length) newElement.id = id
        newElement.className = `text-field-container row ${className ?? 'placeholder-2'} ${helperText?.length && 'helper-text'}`
        newElement.style.cssText = `--helper-text-color: ${helperTextColor ?? '#e14337'};${style ?? ''}`
        if (helperText?.length) newElement.setAttribute('helper-text', helperText)
        if (prefix) {
            if (typeof prefix === 'string') {
                var htmlText = prefix
            } else {
                newElement.appendChild(prefix)
            }
        }
        htmlText ??= ''
        htmlText += `<input type="${type}" value="${value}" placeholder="${placeholder}" ${maxLength ? `maxLength="${maxLength}"` : ''} ${name ? `name="${name}"` : ''} ${readOnly ? 'readOnly' : ''} ${disabled ? 'disabled' : ''}/>`
        if (suffix) {
            if (typeof suffix === 'string') {
                htmlText += suffix
                newElement.innerHTML = htmlText
            } else {
                newElement.innerHTML = htmlText
                newElement.appendChild(suffix)
            }
        } else {
            newElement.innerHTML = htmlText
        }
        if (onFocus || focusSelectAll) {
            $('body').on('focus', 'input', (ev) => {
                ev.target.select()
                if (onFocus) onFocus(ev)
            })
        }
        if (onChange)
            $(newElement).on('change', 'input', onChange)
        if (onBlur)
            $(newElement).on('blur', 'input', onBlur)
        return newElement
    }
}
const Select1 = ({ id, value, onChange, placeholder = '', disabled, className, helperText, helperTextColor, style, type = 'button', returnType = 'object', options, dropdownStyle, dropdownClass, iconOnly = false, onHover, icon }) => {
    const selectedValue = (options ?? []).find(e => e.id === value)
    if (returnType === 'string') {
        const dataId = uuidv4()
        let popup = null
        switch (type) {
            case 'button':
                $('body').on('focus', `.select1-container[slct1-id="${dataId}"]`, function (ev) {
                    const thisSelect1 = ev.target.closest('.select1-container')
                    let suffixIcon = thisSelect1.querySelector('.fa-chevron-down')
                    if (suffixIcon) {
                        suffixIcon.classList.add('fa-chevron-up')
                        suffixIcon.classList.remove('fa-chevron-down')
                    }
                    popup = showSelect1Options({ dropdownStyle: dropdownStyle, dropdownClass: dropdownClass, value: value, options: options, parent: thisSelect1, hiddenSearch: true, onChange: onChange })
                })
                if (onHover) $('body').on('mouseover', `.select1-container[slct1-id="${dataId}"]`, function (ev) { onHover(ev) })
                $('body').on('blur', `.select1-container[slct1-id="${dataId}"]`, function (ev) {
                    if (popup?.onOverOption) {
                        let selectItem = popup.onOverOption
                        onChange(selectItem)
                    }
                    const thisSelect1 = ev.target.closest('.select1-container')
                    let suffixIcon = thisSelect1.querySelector('.fa-chevron-up')
                    if (suffixIcon) {
                        suffixIcon.classList.add('fa-chevron-down')
                        suffixIcon.classList.remove('fa-chevron-up')
                    }
                    popup?.remove()
                })
                return `<button ${id?.length ? `id="${id}"` : ''} ${dataId ? `slct1-id="${dataId}"` : ''}  class="select1-container row ${className ?? 'regular1'} ${helperText?.length && 'helper-text'} ${disabled ? 'disabled' : ''}" style="--helper-text-color: ${helperTextColor ?? '#e14337'};${style ?? ''}" ${helperText?.length ? `helper-text="${helperText}"` : ''}>
                    ${iconOnly ? '' : selectedValue?.name ? `<div class="select1-value-name row">${selectedValue.name}</div>` : `<div class="select1-placeholder">${placeholder ?? ''}</div>`}
                    ${icon ?? '<i class="fa-solid fa-chevron-down" style="font-size: 1.2rem;color: #888"></i>'}
                </button>`
            default:
                $('body').on('click', `.select1-container[slct1-id="${dataId}"]`, function (ev) {
                    showSelect1Options({ dropdownStyle: dropdownStyle, dropdownClass: dropdownClass, options: options, parent: ev.target.closest('.select1-container'), onChange: onChange })
                })
                if (onHover) $('body').on('mouseover', `.select1-container[slct1-id="${dataId}"]`, function (ev) { onHover(ev) })
                return `<div ${id?.length ? `id="${id}"` : ''} ${dataId ? `slct1-id="${dataId}"` : ''} class="select1-container row ${className ?? 'regular1'} ${helperText?.length && 'helper-text'} ${disabled ? 'disabled' : ''}" style="--helper-text-color: ${helperTextColor ?? '#e14337'};${style ?? ''}" ${helperText?.length ? `helper-text="${helperText}"` : ''}>
                    ${iconOnly ? '' : selectedValue?.name ? `<div class="select1-value-name">${selectedValue.name}</div>` : `<div class="select1-placeholder">${placeholder ?? ''}</div>`}
                    ${icon ?? '<i class="fa-solid fa-chevron-down" style="font-size: 1.2rem;color: #888"></i>'}
                </div>`
        }
    } else {
        let popup = null
        switch (type) {
            case 'button':
                var newElement = document.createElement('button')
                newElement.type = 'button'
                newElement.onfocus = function (ev) {
                    const thisSelect1 = ev.target.closest('.select1-container')
                    let suffixIcon = thisSelect1.querySelector('.fa-chevron-down')
                    if (suffixIcon) {
                        suffixIcon.classList.add('fa-chevron-up')
                        suffixIcon.classList.remove('fa-chevron-down')
                    }
                    popup = showSelect1Options({ dropdownStyle: dropdownStyle, dropdownClass: dropdownClass, value: value, options: options, parent: thisSelect1, hiddenSearch: true, onChange: onChange })
                }
                newElement.onblur = function (ev) {
                    if (popup?.onOverOption) {
                        let selectItem = popup.onOverOption
                        onChange(selectItem)
                    }
                    const thisSelect1 = ev.target.closest('.select1-container')
                    let suffixIcon = thisSelect1.querySelector('.fa-chevron-up')
                    if (suffixIcon) {
                        suffixIcon.classList.add('fa-chevron-down')
                        suffixIcon.classList.remove('fa-chevron-up')
                    }
                    popup?.remove()
                }
                if (onHover) newElement.onmouseover = onHover
                break;
            default:
                newElement = document.createElement('div')
                if (onHover) newElement.onmouseover = onHover
                newElement.onclick = function (ev) {
                    showSelect1Options({ dropdownStyle: dropdownStyle, dropdownClass: dropdownClass, options: options, parent: ev.target.closest('.select1-container'), onChange: onChange })
                }
                break;
        }
        if (id?.length) newElement.id = id
        newElement.className = `select1-container row ${className ?? 'regular1'} ${helperText?.length && 'helper-text'} ${disabled ? 'disabled' : ''}" style="--helper-text-color: ${helperTextColor ?? '#e14337'};${style ?? ''}`
        newElement.style.cssText = `--helper-text-color: ${helperTextColor ?? '#e14337'};${style ?? ''}`
        if (helperText?.length) newElement.setAttribute('helper-text', helperText)
        newElement.innerHTML = `${iconOnly ? '' : selectedValue?.name ? `<div class="select1-value-name">${selectedValue.name}</div>` : `<div class="select1-placeholder">${placeholder ?? ''}</div>`}${icon ?? '<i class="fa-solid fa-chevron-down" style="font-size: 1.2rem;color: #888"></i>'}`
        return newElement
    }
}

function showSelect1Options({ hiddenSearch = false, parent, options = [], value, onChange, dropdownStyle, dropdownClass }) {
    const offset = parent.getBoundingClientRect()
    let search = null
    let popup = document.createElement('div')
    popup.className = `select1-popup col ${dropdownClass ?? ''}`
    popup.style.cssText = `top: ${offset.y + offset.height + 2}px; left: ${offset.x}px; width: ${offset.width}px;${dropdownStyle ?? ''}`
    let htmlText = ''
    if (!hiddenSearch) {
        let onSelect = null
        popup.onmouseover = function (ev) { onSelect = ev.target }
        popup.onmouseout = function () { onSelect = null }
        htmlText += `<div class="row header-search"><input autoFocus placeholder="Tìm kiếm" /></div>`
        $(popup).on('change', '.header-search > input', function (ev) {
            if (ev.target.value.trim().length) {
                search = options.filter(e => e.name.toLowerCase().includes(ev.target.value.trim().toLowerCase()))
            } else {
                search = null
            }
            renderOptions()
        })
        $(popup).on('blur', '.header-search > input', function (ev) {
            if (popup.onOverOption) {
                let selectItem = popup.onOverOption
                onChange(selectItem)
                let suffixIcon = parent.querySelector('.fa-chevron-up')
                if (suffixIcon) {
                    suffixIcon.classList.add('fa-chevron-down')
                    suffixIcon.classList.remove('fa-chevron-up')
                }
                popup.remove()
            } else if (onSelect) {
                ev.target.focus()
            } else {
                let suffixIcon = parent.querySelector('.fa-chevron-up')
                if (suffixIcon) {
                    suffixIcon.classList.add('fa-chevron-down')
                    suffixIcon.classList.remove('fa-chevron-up')
                }
                popup.remove()
            }
        })
    }
    htmlText += `<div class="col select1-body"><div class="col select1-scroll-view"></div></div>`
    popup.innerHTML = htmlText
    function renderOptions() {
        let listOptionsView = popup.querySelector('.select1-scroll-view')
        if (search?.length === 0 || options.length === 0) {
            listOptionsView.innerHTML = `<div className='no-results-found'>No result found</div>`
        } else {
            listOptionsView.replaceChildren(...(search ?? options).map(item => {
                let option = document.createElement('button')
                option.type = 'button'
                option.className = `select1-tile row regular1 ${item.disabled ? 'disabled' : ''}`
                option.style.cssText = `color: #262626;${item.style ?? ''}`
                option.innerHTML = `${value != null ? `<i class="fa-solid fa-check" style="font-size: 1.2rem; color: inherit !important; visibility: ${item.id === value ? 'visible' : 'hidden'}"></i>` : ''}${typeof item.prefix === 'string' ? item.prefix : ''}${item.title ?? item.name ?? ''}`
                option.onmouseover = function () {
                    popup.onOverOption = item
                }
                option.onmouseout = function () {
                    delete popup.onOverOption
                }
                return option
            }))
        }
    }
    renderOptions()
    document.body.appendChild(popup)
    const thisPopupRect = popup.getBoundingClientRect()
    if (thisPopupRect) {
        if (thisPopupRect.right > document.body.offsetWidth) {
            popup.style.left = null
            popup.style.right = '0.4rem'
        }
        if (thisPopupRect.bottom > document.body.offsetHeight) {
            popup.style.top = null
            popup.style.bottom = '0.4rem'
        }
    }
    return popup
}
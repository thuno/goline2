const Checkbox = ({ id, returnType = 'object', size = '2.4rem', value, disabled, className, checkColor, onChange }) => {
    if (returnType === 'string') {
        const dataId = uuidv4()
        $('body').on('change', `.checkbox-container[chcbx-id=${dataId}] > input`, onChange)
        return `<label ${id?.length ? `id=${id}` : ''} ${dataId ? `chcbx-id=${dataId}` : ''} class="checkbox-container row ${className}" style="width: ${size}; height: ${size}" >
        <input type="checkbox" ${value ? 'checked' : ''} ${disabled ? "disabled" : ''} />
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
            <path d="M6.72 11.52 L10.8 15.6 L18 7.2" fill="none" strokeLinecap="round" stroke=${checkColor ?? '#ffffff'} />
        </svg>
    </label>`
    } else {
        let newElement = document.createElement('label')
        if(id?.length) newElement.id = id
        newElement.className = `checkbox-container row ${className}`
        newElement.style.cssText = `width: ${size}; height: ${size}`
        newElement.innerHTML = `<input type="checkbox" ${value ? 'checked' : ''} ${disabled ? "disabled" : ''} />
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
            <path d="M6.72 11.52 L10.8 15.6 L18 7.2" fill="none" strokeLinecap="round" stroke=${checkColor ?? '#ffffff'} />
        </svg>`
        newElement.querySelector('input').onchange = onChange
        return newElement
    }
}
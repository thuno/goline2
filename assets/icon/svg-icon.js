const IconFixedSize = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 7.5v-2h-1v5h1v-2h9v2h1v-5h-1v2h-9z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`;
const IconHugContent = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3.354 4.646l-.708.708L5.293 8l-2.646 2.646.707.708L6.707 8 3.354 4.646zm10 .708L10.707 8l2.647 2.646-.708.708L9.293 8l3.354-3.354.707.708z" fill-rule="nonzero" fill-opacity="${opacity}" fill="${color}"></path></svg>`;
const IconFillContainer = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5.647 4.646l.707.708L3.707 8l2.646 2.647-.707.707L2.293 8l3.354-3.354zm4 .708L12.293 8l-2.646 2.646.707.708L13.708 8l-3.354-3.354-.707.708z" fill-rule="nonzero" fill-opacity="${opacity}" fill="${color}"></path></svg>`;
const IconCheckMark = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg width="${width}" height="${height}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.8615 5.13839C19.1574 5.43424 19.1574 5.91392 18.8615 6.20977L9.01304 16.0583C8.71719 16.3541 8.23752 16.3541 7.94167 16.0583L2.63864 10.7552C2.34279 10.4594 2.34279 9.9797 2.63864 9.68385C2.93449 9.388 3.41416 9.388 3.71001 9.68385L8.47735 14.4512L17.7902 5.13839C18.086 4.84254 18.5657 4.84254 18.8615 5.13839Z" fill-opacity="${opacity}" fill="${color}"/></svg>`;
const IconRatioWH = ({ color = '#667994', width = '58%', height = '100%', opacity = 1, toggle = false }) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 8 14" xmlns="http://www.w3.org/2000/svg"><path d="${toggle ? 'M6 3.5V5h1V3.5C7 1.567 5.433 0 3.5 0 1.567 0 0 1.567 0 3.5V5h1V3.5C1 2.12 2.12 1 3.5 1 4.88 1 6 2.12 6 3.5zM6 9h1v1.5C7 12.433 5.433 14 3.5 14 1.567 14 0 12.433 0 10.5V9h1v1.5C1 11.88 2.12 13 3.5 13 4.88 13 6 11.88 6 10.5V9zM3 4v6h1V4H3z' : 'M6 5V3.5C6 2.12 4.88 1 3.5 1 2.12 1 1 2.12 1 3.5V5H0V3.5C0 1.567 1.567 0 3.5 0 5.433 0 7 1.567 7 3.5V5H6zm1 4H6v1.5C6 11.88 4.88 13 3.5 13 2.12 13 1 11.88 1 10.5V9H0v1.5C0 12.433 1.567 14 3.5 14 5.433 14 7 12.433 7 10.5V9z'}" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}" ></path></svg>`
const IconRadiusDetails = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 4.5C2 3.12 3.12 2 4.5 2H6v1H4.5C3.672 3 3 3.672 3 4.5V6H2V4.5zM10 2h1.5C12.88 2 14 3.12 14 4.5V6h-1V4.5c0-.828-.672-1.5-1.5-1.5H10V2zm-7 8v1.5c0 .828.672 1.5 1.5 1.5H6v1H4.5C3.12 14 2 12.88 2 11.5V10h1zm11 0v1.5c0 1.38-1.12 2.5-2.5 2.5H10v-1h1.5c.828 0 1.5-.672 1.5-1.5V10h1z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const IconMoreSkins = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M0 1.5C0 2.328.672 3 1.5 3 2.328 3 3 2.328 3 1.5 3 .672 2.328 0 1.5 0 .672 0 0 .672 0 1.5zm6 0C6 2.328 6.672 3 7.5 3 8.328 3 9 2.328 9 1.5 9 .672 8.328 0 7.5 0 6.672 0 6 .672 6 1.5zM7.5 9C6.672 9 6 8.328 6 7.5 6 6.672 6.672 6 7.5 6 8.328 6 9 6.672 9 7.5 9 8.328 8.328 9 7.5 9zM0 7.5C0 8.328.672 9 1.5 9 2.328 9 3 8.328 3 7.5 3 6.672 2.328 6 1.5 6 .672 6 0 6.672 0 7.5z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const IconFixPosition = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 7V5H7v2H5v1h2v2h1V8h2V7H8z" fill-rule="nonzero" fill-opacity="${opacity}" fill="${color}"></path><path d="M2 2h3v1H3v2H2V2zm8 0h3v3h-1V3h-2V2zM3 12v-2H2v3h3v-1H3zm10-2v3h-3v-1h2v-2h1z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const IconEffectSettings = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 .5V0H7v3h1V.5zM2.904 2.197l-.354-.354-.707.707.354.354L3.61 4.318l.354.354.707-.708-.354-.353-1.414-1.414zm9.9.707l.353-.354-.707-.707-.354.354-1.414 1.414-.354.353.708.708.353-.354 1.414-1.414zM.5 7H0v1h3V7H.5zm12 0H12v1h3V7h-2.5zm-8.182 4.39l.354-.354-.707-.708-.354.354-1.414 1.414-.354.354.707.707.354-.354 1.414-1.414zm7.071-.708l-.354-.354-.707.708.354.353 1.414 1.414.354.354.707-.707-.354-.354-1.414-1.414zM8 12.5V12H7v3h1v-2.5zm.998-5.002c0 .828-.672 1.5-1.5 1.5-.829 0-1.5-.672-1.5-1.5 0-.829.671-1.5 1.5-1.5.828 0 1.5.671 1.5 1.5zm1 0c0 1.38-1.12 2.5-2.5 2.5-1.38 0-2.5-1.12-2.5-2.5 0-1.38 1.12-2.5 2.5-2.5 1.38 0 2.5 1.12 2.5 2.5z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}" ></path></svg>`
const IconUnlinkSkin = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M4 0v3h1V0H4zm9.103.896c-1.162-1.161-3.045-1.161-4.207 0l-2.75 2.75.707.708 2.75-2.75c.771-.772 2.022-.772 2.793 0 .771.77.771 2.021 0 2.792l-2.75 2.75.707.708 2.75-2.75c1.162-1.162 1.162-3.046 0-4.208zM.896 13.103c-1.162-1.161-1.162-3.045 0-4.207l2.75-2.75.707.708-2.75 2.75c-.771.77-.771 2.021 0 2.792.771.772 2.022.772 2.793 0l2.75-2.75.707.707-2.75 2.75c-1.162 1.162-3.045 1.162-4.207 0zM14 10h-3V9h3v1zM10 11v3H9v-3h1zM3 4H0v1h3V4z" fill-rule="nonzero" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const IconAutoWidth = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 11.5l3.354-3.354.707.708L6.914 11h9.879l-2.146-2.146.707-.708 3.353 3.354-3.353 3.354-.707-.707L16.793 12H6.914l2.147 2.146-.707.708L5 11.5z" fill-rule="nonzero" fill-opacity="${opacity}" fill="${color}" ></path></svg>`
const IconAutoHeight = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 14 10" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h14v1H0V0zm0 4h14v1H0V4zm9 4H0v1h9V8z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}" ></path></svg>`
const IconBorderAll = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 6h6v1H9V6zm6 12H9v-1h6v1zm-9-3V9h1v6H6zm12-6v6h-1V9h1z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const IconBorderLeftRight = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 6h6v1H9V6zm6 12H9v-1h6v1zm-9-3V9h1v6H6zm12-6v6h-1V9h1z" fill-rule="evenodd" fill-opacity=".3" fill="${color}"></path><path d="M6 18V6h1v12H6z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path><path d="M18 6v12h-1V6h1z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const IconBorderLeft = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 18H10v-1h6.5c.276 0 .5-.224.5-.5v-9c0-.276-.224-.5-.5-.5H10V6h6.5c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5z" fill-rule="evenodd" fill-opacity=".3" fill="${color}"></path><path d="M6 18V6h1v12H6z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const IconBorderRight = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 6H14v1H7.5c-.276 0-.5.224-.5.5v9c0 .276.224.5.5.5H14v1H7.5c-.828 0-1.5-.672-1.5-1.5v-9C6 6.672 6.672 6 7.5 6z" fill-rule="evenodd" fill-opacity=".3" fill="${color}"></path><path d="M18 6v12h-1V6h1z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const IconBorderTopBottom = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 6h6v1H9V6zm6 12H9v-1h6v1zm-9-3V9h1v6H6zm12-6v6h-1V9h1z" fill-rule="evenodd" fill-opacity=".3" fill="${color}"></path><path d="M6 6h12v1H6V6z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path><path d="M18 18H6v-1h12v1z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const IconBorderTop = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 16.5V10h1v6.5c0 .276.224.5.5.5h9c.276 0 .5-.224.5-.5V10h1v6.5c0 .828-.672 1.5-1.5 1.5h-9c-.828 0-1.5-.672-1.5-1.5z" fill-rule="evenodd" fill-opacity=".3" fill="${color}"></path><path d="M6 6h12v1H6V6z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const IconBorderBottom = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 7.5V14h-1V7.5c0-.276-.224-.5-.5-.5h-9c-.276 0-.5.224-.5.5V14H6V7.5C6 6.672 6.672 6 7.5 6h9c.828 0 1.5.672 1.5 1.5z" fill-rule="evenodd" fill-opacity=".3" fill="${color}"></path><path d="M18 18H6v-1h12v1z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const IconPaddingDetails = ({color = '#667994', width = '100%', height = '100%', opacity = 1} = {}) => `<svg class="svg" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><path d="M3 0h6v1H3V0zM0 3v6h1V3H0zm11 0v6h1V3h-1zm-8 9h6v-1H3v1z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}" ></path></svg>`
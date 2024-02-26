const FixedSize = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 7.5v-2h-1v5h1v-2h9v2h1v-5h-1v2h-9z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`;
const HugContent = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3.354 4.646l-.708.708L5.293 8l-2.646 2.646.707.708L6.707 8 3.354 4.646zm10 .708L10.707 8l2.647 2.646-.708.708L9.293 8l3.354-3.354.707.708z" fill-rule="nonzero" fill-opacity="${opacity}" fill="${color}"></path></svg>`;
const FillContainer = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5.647 4.646l.707.708L3.707 8l2.646 2.647-.707.707L2.293 8l3.354-3.354zm4 .708L12.293 8l-2.646 2.646.707.708L13.708 8l-3.354-3.354-.707.708z" fill-rule="nonzero" fill-opacity="${opacity}" fill="${color}"></path></svg>`;
const CheckMark = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg width="${width}" height="${height}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.8615 5.13839C19.1574 5.43424 19.1574 5.91392 18.8615 6.20977L9.01304 16.0583C8.71719 16.3541 8.23752 16.3541 7.94167 16.0583L2.63864 10.7552C2.34279 10.4594 2.34279 9.9797 2.63864 9.68385C2.93449 9.388 3.41416 9.388 3.71001 9.68385L8.47735 14.4512L17.7902 5.13839C18.086 4.84254 18.5657 4.84254 18.8615 5.13839Z" fill-opacity="${opacity}" fill="${color}"/></svg>`;
const RatioWH = ({ color = '#667994', width = '58%', height = '100%', opacity = 1, toggle = false }) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 8 14" xmlns="http://www.w3.org/2000/svg"><path d="${toggle ? 'M6 3.5V5h1V3.5C7 1.567 5.433 0 3.5 0 1.567 0 0 1.567 0 3.5V5h1V3.5C1 2.12 2.12 1 3.5 1 4.88 1 6 2.12 6 3.5zM6 9h1v1.5C7 12.433 5.433 14 3.5 14 1.567 14 0 12.433 0 10.5V9h1v1.5C1 11.88 2.12 13 3.5 13 4.88 13 6 11.88 6 10.5V9zM3 4v6h1V4H3z' : 'M6 5V3.5C6 2.12 4.88 1 3.5 1 2.12 1 1 2.12 1 3.5V5H0V3.5C0 1.567 1.567 0 3.5 0 5.433 0 7 1.567 7 3.5V5H6zm1 4H6v1.5C6 11.88 4.88 13 3.5 13 2.12 13 1 11.88 1 10.5V9H0v1.5C0 12.433 1.567 14 3.5 14 5.433 14 7 12.433 7 10.5V9z'}" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}" ></path></svg>`
const RadiusDetails = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 4.5C2 3.12 3.12 2 4.5 2H6v1H4.5C3.672 3 3 3.672 3 4.5V6H2V4.5zM10 2h1.5C12.88 2 14 3.12 14 4.5V6h-1V4.5c0-.828-.672-1.5-1.5-1.5H10V2zm-7 8v1.5c0 .828.672 1.5 1.5 1.5H6v1H4.5C3.12 14 2 12.88 2 11.5V10h1zm11 0v1.5c0 1.38-1.12 2.5-2.5 2.5H10v-1h1.5c.828 0 1.5-.672 1.5-1.5V10h1z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const MoreSkins = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M0 1.5C0 2.328.672 3 1.5 3 2.328 3 3 2.328 3 1.5 3 .672 2.328 0 1.5 0 .672 0 0 .672 0 1.5zm6 0C6 2.328 6.672 3 7.5 3 8.328 3 9 2.328 9 1.5 9 .672 8.328 0 7.5 0 6.672 0 6 .672 6 1.5zM7.5 9C6.672 9 6 8.328 6 7.5 6 6.672 6.672 6 7.5 6 8.328 6 9 6.672 9 7.5 9 8.328 8.328 9 7.5 9zM0 7.5C0 8.328.672 9 1.5 9 2.328 9 3 8.328 3 7.5 3 6.672 2.328 6 1.5 6 .672 6 0 6.672 0 7.5z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
const FixPosition = ({ color = '#667994', width = '100%', height = '100%', opacity = 1 } = {}) => `<svg class="svg" width="${width}" height="${height}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 7V5H7v2H5v1h2v2h1V8h2V7H8z" fill-rule="nonzero" fill-opacity="${opacity}" fill="${color}"></path><path d="M2 2h3v1H3v2H2V2zm8 0h3v3h-1V3h-2V2zM3 12v-2H2v3h3v-1H3zm10-2v3h-3v-1h2v-2h1z" fill-rule="evenodd" fill-opacity="${opacity}" fill="${color}"></path></svg>`
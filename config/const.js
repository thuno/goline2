class EnumObj {
    // only for ctrlz
    static skin = 0;
    //
    static wBase = 1;
    static attribute = 2;
    static cate = 5;
    static type = 6;
    static project = 7;
    static User = 8;
    static variant = 9;
    static wBaseAttribute = 15;
    static team = 21;
    static database = 22;
    static field = 24;
    static package = 25;
    static userTeam = 26;
    static userProject = 27;
    static urPermissions = 34;
    static page = 35;
    static customer = 36;
    static customerPage = 37;
    static customerTeam = 38;
    static customerProject = 39;
    static baseFrame = 40;
    static collection = 41;
    static request = 42;
    static table = 44;
    static file = 46;
    static unDeleted = 54;
    static apiInput = 55;
    static apiOutput = 56;
    static router = 57;
    static apilist = 58;
    static css = 60;
}
class EnumEvent {
    static edit_delete = -1;
    static copy = 0;
    static add = 1;
    static edit = 2;
    static delete = 3;
    static unDelete = 4;
    static sort = 5;
    static parent = 6;
    static quay = 7;
    static init = 8;
    static get = 9;
    static permission = 10;
    static getProjectByID = 11;
    static getByCode = 12;
    static propertyBase = 13;
    static listBase = 14;
    static recycle = 15;
    static instance = 16;
    static verifyPhone = 17;
    static registor = 18;
    static verifyAuthen = 19;
    static merge = 20;
    static select = 21;
    static leave = 22;
    static editcode = 23;
    static joinbycode = 24;
    static Save = 25;
    static getProjectByIDapi = 26;
    static check = 27;
    static create = 28;
    static editRouter = 29;
    static home_init = 30;

}

class WEnum {
    static field = 1;
    static list = 2;
    static obj = 3;
    static enumDataType(type) {
        switch (type) {
            case field:
                return 'Field';
            case list:
                return 'List';
            case obj:
                return 'Obj';
            default:
                return '';
        }
    }
}

class ToolState {
    static move = 'Move'
    static container = 'Container'
    static rectangle = 'Rectangle'
    static circle = 'Circle'
    static base_component = 'BaseComponent'
    static text = 'Text'
    static hand_tool = 'HandTool'
    static resize_top_left = 'ResizeTopLeft'
    static resize_top_right = 'ResizeTopRight'
    static resize_bot_left = 'ResizeBottomLeft'
    static resize_bot_right = 'ResizeBottomRight'
    static resize_left = 'ResizeLeft'
    static resize_right = 'ResizeRight'
    static resize_top = 'ResizeTop'
    static resize_bot = 'ResizeBottom'

    static create_new_type = [
        this.container,
        this.rectangle,
        this.circle,
        this.base_component,
        this.text
    ]

    static resize_type = [
        this.resize_top,
        this.resize_left,
        this.resize_right,
        this.resize_bot,
        this.resize_top_left,
        this.resize_top_right,
        this.resize_bot_left,
        this.resize_bot_right
    ]
}

class EnumPermission {
    static owner = 0
    static editer = 1
    static viewer = 2

    static get_namePermission(per) {
        switch (per) {
            case this.owner:
                return 'Owner'
            case this.editer:
                return 'Can edit'
            case this.viewer:
                return 'Can view'
            default:
                return 'Can view'
        }
    }
}

class ComponentState {
    static hover = 'hover'
    static disabled = 'disabled'
    static focus = 'focus'
    static error = 'error'
    static warning = 'warning'
    static success = 'success'

    static listState = [
        this.hover,
        this.disabled,
        this.focus,
        this.error,
        this.warning,
        this.success
    ]
}

class AlignmentType {
    static top_left = 'TopLeft'
    static top_center = 'TopCenter'
    static top_right = 'TopRight'
    static left_center = 'LeftCenter'
    static center = 'Center'
    static right_center = 'RightCenter'
    static bottom_left = 'BottomLeft'
    static bottom_center = 'BottomCenter'
    static bottom_right = 'BottomRight'
}

class Constraints {
    static top = 'top'
    static bottom = 'bottom'
    static left = 'left'
    static right = 'right'
    static top_bottom = 'top_bottom'
    static left_right = 'left_right'
    static center = 'center'
    static scale = 'scale'
}

class BorderSide {
    static all = 'all'
    static left = 'left'
    static top = 'top'
    static right = 'right'
    static bottom = 'bottom'
    static top_bottom = 'top-bottom'
    static left_right = 'left-right'
}

class BorderStyle {
    static solid = 'solid'
    static dotted = 'dotted'
    static dashed = 'dashed'
    static double = 'double'
    static groove = 'groove'
    static inset = 'inset'
    static inset = 'ridge'
}

class TextAutoSize {
    static autoWidth = 'Auto Width'
    static autoHeight = 'Auto Height'
    static fixedSize = 'Fixed Size'
}

class TextAlign {
    static left = 'start'
    static center = 'center'
    static right = 'end'
}

class TextAlignVertical {
    static top = 'start'
    static middle = 'center'
    static bottom = 'end'
}

class ShadowType {
    static dropdown = 'Drop shadow'
    static inner = 'Inner shadow'
    static layer_blur = 'Layer blur'
}

class TableType {
    static header = 0
    static only_body = 1
    static header_footer = 2
    static footer = 3
}

class ChartType {
    static bar = 'bar'
    static bubble = 'bubble'
    static line = 'line'
    static doughnut = 'doughnut'
    static pie = 'pie'
    static radar = 'radar'
    static polar = 'polarArea'

    static axes_chart = [this.bar, this.bubble, this.line]
    static list = [
        ...this.axes_chart,
        this.doughnut,
        this.pie,
        this.radar,
        this.polar
    ]
}

class WTextFormFieldType {
    static text = 'text'
    static obscureText = 'obscure text'
    static datePicker = 'date'
    static monthPicker = 'month'
    static yearPicker = 'year'

    static list = [
        this.text,
        this.obscureText,
        this.datePicker,
        this.monthPicker,
        this.yearPicker
    ]
}

class ValidateType {
    static is_email = 0
    static maxCharacter = 1
    static minCharacter = 2
    static is_number = 3
    static is_phoneNumber = 4
    static contain_special_character = 5
    static contain_number = 6
    static contain_uppercase = 7
    static contain_lowercase = 8
    static only_text = 9
    static not_empty = 10

    static typeName(typeNumber = 10) {
        let _typeName
        switch (typeNumber) {
            case this.is_email:
                _typeName = 'Email'
                break
            case this.maxCharacter:
                _typeName = 'Max character'
                break
            case this.minCharacter:
                _typeName = 'Min character'
                break
            case this.is_number:
                _typeName = 'Only number'
                break
            case this.is_phoneNumber:
                _typeName = 'Phone number'
                break
            case this.contain_special_character:
                _typeName = 'Contain special character'
                break
            case this.contain_number:
                _typeName = 'Contain number'
                break
            case this.contain_lowercase:
                _typeName = 'Contain lowercase'
                break
            case this.contain_uppercase:
                _typeName = 'Contain uppercase'
                break
            case this.only_text:
                _typeName = 'Only text'
                break
            case this.not_empty:
                _typeName = 'Not empty'
                break
            default:
                break
        }
        return _typeName
    }
}

class KeyboardType {
    static datetime = 'datetime'
    static email = 'email'
    static multiline = 'multiline'
    static name = 'name'
    static none = 'none'
    static number = 'number'
    static phone = 'phone'
    static address = 'address'
    static text = 'text'
    static url = 'url'
    static visiblePassword = 'visiblePassword'
}

class WDataType {
    static string = 'string'
    static array = 'array'
    static object = 'object'
    static number = 'number'
    static boolean = 'boolean'
    static undefined = 'undefined'
    static null = 'null'

    static list = [
        this.string,
        this.array,
        this.object,
        this.number,
        this.boolean,
        this.null
        // this.undefined,
    ]
}

class WCarouselEffect {
    static fade = 'fade'
    static easeInOut = 'ease-in-out'
}

class enumTypeInput {
    static param = 1
    static header = 2
    static body = 3
}

const uuid4Regex =
    /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g
const hexRegex = /(#){0,1}[0-9A-Fa-f]{6,8}$/i
const svgRegex = /(fill|stroke)(="[^none](\w|\d|#){1,}"|:[^none](\w|\d|#){1,})/g
const brpRegex = /\(([^)-]+)\)/g
const spChaRegex = /[!@#\$%\^\&*\)\(+=._-]/g
const classRegex = /\.([^\s{}]+)/g
const listBorderSide = [
    BorderSide.all,
    BorderSide.top,
    BorderSide.left,
    BorderSide.bottom,
    BorderSide.right,
    BorderSide.left_right,
    BorderSide.top_bottom
]
const listDevice = [
    [
        {
            Name: 'Iphone 14',
            Height: 844,
            Width: 390
        },
        {
            Name: 'Iphone 14 Pro',
            Height: 852,
            Width: 393
        },
        {
            Name: 'Iphone 14 Plus',
            Height: 926,
            Width: 428
        },
        {
            Name: 'Iphone 14 Pro Max',
            Height: 932,
            Width: 430
        },
        {
            Name: 'Iphone 13',
            Height: 844,
            Width: 390
        },
        {
            Name: 'Iphone 13 Pro',
            Height: 844,
            Width: 390
        },
        {
            Name: 'Iphone 13 Pro Max',
            Height: 926,
            Width: 428
        },
        {
            Name: 'Iphone 13 Mini',
            Height: 812,
            Width: 375
        },
        {
            Name: 'Iphone SE',
            Height: 568,
            Width: 320
        },
        {
            Name: 'Iphone 8 Plus',
            Height: 736,
            Width: 414
        },
        {
            Name: 'Iphone 8 Plus',
            Height: 667,
            Width: 375
        },
        {
            Name: 'Android Small',
            Height: 640,
            Width: 360
        },
        {
            Name: 'Android Large',
            Height: 800,
            Width: 360
        }
    ],
    [
        {
            Name: 'Surface Pro 8',
            Height: 960,
            Width: 1440
        },
        {
            Name: 'Ipad Mini 8.3',
            Height: 1133,
            Width: 744
        },
        {
            Name: 'Ipad Pro 11"',
            Height: 1194,
            Width: 834
        },
        {
            Name: 'Ipad Pro 12.9"',
            Height: 1366,
            Width: 1024
        }
    ],
    [
        {
            Name: 'MacBook E',
            Height: 832,
            Width: 1280
        },
        {
            Name: 'MacBook Pro 14"',
            Height: 982,
            Width: 1512
        },
        {
            Name: 'MacBook Pro 16"',
            Height: 1117,
            Width: 1728
        },
        {
            Name: 'Desktop',
            Height: 1080,
            Width: 1920
        },
        {
            Name: 'Wireframes',
            Height: 1024,
            Width: 1440
        },
        {
            Name: 'TV',
            Height: 720,
            Width: 1280
        }
    ]
]
const wbase_parentID = '019cc638-18b3-434d-8c4a-973537cde698'
const resizeWbase = new ResizeObserver(entries => {
    entries.forEach(entry => {
        let framePage = entry.target
        let localResponsive =
            ProjectDA.obj.ResponsiveJson ?? ProjectDA.responsiveJson
        let brpShortName = localResponsive.BreakPoint.map(brp =>
            brp.Key.match(brpRegex).pop().replace(/[()]/g, '')
        )
        let listClass = [...framePage.classList].filter(clName =>
            [...brpShortName, 'min-brp'].every(brpKey => clName != brpKey)
        )
        let closestBrp = localResponsive.BreakPoint.filter(
            brp => framePage.offsetWidth >= brp.Width
        )
        if (closestBrp.length > 0) {
            closestBrp = closestBrp
                .pop()
                .Key.match(brpRegex)
                .pop()
                .replace(/[()]/g, '')
            listClass.push(closestBrp)
        } else {
            listClass.push('min-brp')
        }
        framePage.className = listClass.join(' ')
    })
})
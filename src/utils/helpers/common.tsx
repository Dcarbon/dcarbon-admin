import { Tooltip } from 'antd'
import chalk from 'chalk'
import { SweetAlertOptions } from 'sweetalert2'

function isEmpty(obj: Array<any> | object): boolean {
    if (!obj || typeof obj !== 'object') return !obj

    if (Array.isArray(obj)) {
        return !obj.length
    }

    return !Object.keys(obj).length
}

function removeUndefinedAndNull(obj: Object) {
    const result: Record<string, any> = {}

    for (const key in obj) {
        if (
            obj[key as keyof Object] !== undefined &&
            obj[key as keyof Object] !== null
        ) {
            result[key as any] = obj[key as keyof Object]
        }
    }

    return result
}

const getSweetErrorConfig = (message: string): SweetAlertOptions => {
    return {
        icon: 'error',
        title: message,
        width: 600,
        padding: '3em',
        color: '#716add',
        backdrop: `
            rgba(0,0,123,0.4)
            url("/images/common/nyan-cat.gif")
            left top
            no-repeat
        `,
    }
}

const logger = ({
    message,
    type,
}: {
    message: string
    type: 'ERROR' | 'INFO'
}) => {
    switch (type) {
        case 'ERROR':
            console.error(chalk.red(message))
            break

        default:
            console.info(chalk.blue(message))
            break
    }
}

const getInfoDevice = () => {
    const device = /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)
        ? 'MOBILE'
        : 'DESKTOP'
    const collapsed = device !== 'DESKTOP'

    return {
        device,
        collapsed,
    } as const
}
const truncateText = (text: string) => {
    if (!text) return ''
    return (
        <p style={{ cursor: 'pointer', marginBottom: '0' }}>
            <Tooltip title={text}>
                {text.substring(0, 10) +
                    '...' +
                    text.substring(text.length - 6, text.length)}
            </Tooltip>
        </p>
    )
}
const convertToSlug = (value: string) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9/-]/g, '')
        .replace(/\//g, '-')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '')
}
const formatByEnUsNum = (value: number) => {
    return value.toLocaleString('en-US')
}

function isFloat(n: number) {
    return Number(n) === n && n % 1 !== 0
}

export {
    formatByEnUsNum,
    truncateText,
    removeUndefinedAndNull,
    isEmpty,
    getSweetErrorConfig,
    logger,
    getInfoDevice,
    convertToSlug,
    isFloat,
}

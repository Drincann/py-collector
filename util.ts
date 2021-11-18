enum RESCODE {
    SUCCESS = 0,
    FAIL = 1,
    PARAM_ERROR = 2,
}

function responseData(code: RESCODE, data: any = { message: 'nonimplement' }) {
    return { code, data }
}

const allowedFileExt = { '.7z': true, '.zip': true, '.rar': true }
export { RESCODE, responseData, allowedFileExt }
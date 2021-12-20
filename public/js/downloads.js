const RESCODE = {
    SUCCESS: 0,
    FAIL: 1,
    PARAM_ERROR: 2,
}

function renderLoading(state) {
    const loading = $('#loading')
    if (state) {
        loading.show()
    } else {
        loading.hide()
    }

}

function renderFileList(fileLists) {
    function getListHtml(listinfo) {
        return `
        <div class="row mt-5">
            <div class="col-12">
                <ul class="list-group">
                    ${getTimeHtml(listinfo.time)}
                    ${listinfo.files.reduce((acc, fileinfo) => acc += getFileHtml(fileinfo), '')}
                </ul>
            </div>
        </div>`
    }
    function getFileHtml(fileinfo) {
        return `<li class="list-group-item"><a href="${fileinfo.url}">${fileinfo.name}</a></li>`
    }
    function getTimeHtml(timeStr) {
        return `<li class="list-group-item active" aria-current="true">${timeStr}</li>`
    }

    const fileListsBox = $('#fileLists')
    fileListsBox.html('')
    for (const fileList of fileLists) {
        fileListsBox.append(
            getListHtml(fileList)
        )
    }
}

(async () => {

    renderLoading(true);
    $.ajax({
        url: '/info',
        type: 'GET',
        success: function (data) {
            if (data.code == RESCODE.SUCCESS) {
                renderFileList(data.data.items)
            } else {
                renderInfo('alert-danger', 'error: ' + data.data.message)
            }
            renderLoading(false)
        },
        error: function (data) {
            renderInfo('alert-danger', 'error: ' + data.responseText)
            renderLoading(false)
        }
    })
})();
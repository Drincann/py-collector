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
function renderInfo(type, info) {
    const infobox = $('#infobox')

    infobox.stop().slideUp(() => {
        infobox.html('')
        infobox.append(
            `
            <div class="alert ${type}" role="alert" style="text-align: center;">
                ${info}
            </div>
            `
        )
        infobox.slideDown()
    })
}
$(function () {

    submitButton = $('#submit')
    submitButton.on('click', function () {
        const form = new FormData()
        form.append('groupId', $('#groupId').val())
        form.append('codePack', $('#codePack')[0].files[0])
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.code == RESCODE.SUCCESS) {
                    renderInfo('alert-success', data.data.message)
                } else {
                    renderInfo('alert-danger', 'error: ' + data.data.message)
                }
                renderLoading(false)
            }
        })
        renderLoading(true)
    })

})
window.onload = () => {
    const btnSubmit = document.getElementById('btn_submit')

    btnSubmit.addEventListener('click', (evt) => {
        const passphrase = document.getElementById('passphrase').value
        window.api.sendPassphrase(passphrase)
    })

    const board = document.getElementById('board')
    window.ipc.receive('msg:update', (payload) => {
        board.innerText = payload
    })
}
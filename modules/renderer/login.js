window.onload = () => {
    const btnSubmit = document.getElementById('btn_submit')

    btnSubmit.addEventListener('click', (evt) => {
        const passphrase = document.getElementById('passphrase').value
        window.api.sendPassphrase(passphrase)
    })
}
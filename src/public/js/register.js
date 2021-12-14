const signUp = (event) => {
    event.preventDefault();
    const errorEl = document.getElementById('error');
    errorEl.hidden = true;
    errorEl.innerText = '';
    fetch('/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: event.target[0].value,
            email: event.target[1].value,
            password: event.target[2].value
        })
    }).then(res => {
        if (res.status === 201) {
            res.json()
                .then((token) => {
                    // TODO: save token to session storage
                })
        } else {
            res.text()
                .then((error) => {
                    errorEl.innerText = error;
                    errorEl.hidden = false;
                })
        }
    })
}
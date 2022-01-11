const signIn = (event) => {
    event.preventDefault();

    const errorEl = document.getElementById('error');
    errorEl.hidden = true;
    errorEl.innerText = '';
    fetch('/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: event.target[0].value,
            password: event.target[1].value
        })
    }).then(res => {
        if (res.status === 200) {
            res.json()
                .then((token) => {
                    localStorage.setItem('token', token.content);
                    localStorage.setItem('iv', token.iv);
                    window.location.replace('/');
                });
        } else {
            res.text()
                .then((error) => {
                    errorEl.innerText = error;
                    errorEl.hidden = false;
                });
        }
    }).catch(err => {
        errorEl.innerText = err;
        errorEl.hidden = false;
    });
}
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token') && localStorage.getItem('iv')) {
        auth().then(res => {
            if (res.status !== 200) {
                window.location.replace('/');
            }
        });
    } else {
        window.location.replace('/');
    }
});

const onQuestionPost = (event) => {
    event.preventDefault();

    auth().then(res => {
        if (res.status === 200) {
            const errorEl = document.getElementById('error');
            const successEl = document.getElementById('success');
            errorEl.hidden = true;
            errorEl.innerText = '';

            fetch('/new', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Token': JSON.stringify({
                        content: localStorage.getItem('token'),
                        iv: localStorage.getItem('iv')
                    }),
                },
                body: JSON.stringify({
                    title: event.target[0].value,
                    body: `<p>${event.target[1].value}</p>`
                })
            }).then(res => {
                if (res.status === 201) {
                    successEl.hidden = false;
                    setTimeout(() => {
                        window.location.replace('/');
                    }, 1000);
                } else {
                    res.text()
                        .then((error) => {
                            errorEl.innerText = error;
                            errorEl.hidden = false;
                            setTimeout(() => {
                                window.location.replace('/');
                            }, 1000);
                        });
                }
            }).catch(error => {
                errorEl.innerText = error;
                errorEl.hidden = false;
            });
        } else {
            window.location.replace('/');
        }
    });
}
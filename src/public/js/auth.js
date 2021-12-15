auth = () => {
    return fetch('/user/me', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: {content: localStorage.getItem('token'), iv: localStorage.getItem('iv')}
        })
    });
}
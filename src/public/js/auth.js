getUsername = () => {
    return fetch('/user/me', {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Token': JSON.stringify({
                content: localStorage.getItem('token'),
                iv: localStorage.getItem('iv')
            })
        }
    });
}
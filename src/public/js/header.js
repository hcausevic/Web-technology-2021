window.onload = (event) => {
    if (localStorage.getItem('token') && localStorage.getItem('iv')) {
        fetch('/user/me', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: {content: localStorage.getItem('token'), iv: localStorage.getItem('iv')}
            })
        }).then(res => {
            if (res.status === 200) {
                // user logged in
                res.json().then(user => {
                    showFields();
                    document.getElementById('username').innerText = user.username;
                })
            } else {
                // user logged out
                hideFields();
            }
        })
    } else {
        // user logged out
        hideFields();
        localStorage.clear();
    }
};

logout = () => {
    localStorage.clear();
    window.location.replace('/login');
}

showFields = () => {
    document.getElementById('usernameContainer').hidden = false;
    document.getElementById('login').hidden = true;
    document.getElementById('signup').hidden = true;
    document.getElementById('askQuestion').hidden = false;
    document.getElementById('logout').hidden = false;
}

hideFields = () => {
    document.getElementById('usernameContainer').hidden = true;
    document.getElementById('login').hidden = false;
    document.getElementById('signup').hidden = false;
    document.getElementById('askQuestion').hidden = true;
    document.getElementById('logout').hidden = true;
}

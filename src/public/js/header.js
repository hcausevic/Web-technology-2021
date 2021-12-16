window.onload = (event) => {
    if (localStorage.getItem('token') && localStorage.getItem('iv')) {
        auth().then(res => {
            if (res.status === 200) {
                // user logged in
                res.json().then(user => {
                    showFields();
                    document.getElementById('username').innerText = user.username;
                    redirectToHome();
                })
            } else {
                // user logged out
                hideFields();
                localStorage.clear();
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

redirectToHome = () => {
    // prevent access to login and register page for logged in users
    if (window.location.pathname === '/login' || window.location.pathname === '/register') {
        window.location.replace('/');
    }
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

window.onload = (event) => {
    if (localStorage.getItem('token') && localStorage.getItem('iv')) {
        auth().then(res => {
            if (res.status === 200) {
                // user logged in
                res.json().then(user => {
                    showFields();
                    document.getElementById('username').innerText = user.username;
                    redirectToHome();
                });
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

    const searchInputElement = document.getElementById('search-input');
    if (searchInputElement) {
        searchInputElement.addEventListener('keyup', event => {
            if (event.key === 'Enter') {
                const query = searchInputElement.value;

                // upon pressing enter we will return defaults for
                // page and limit which are 1 and 10
                const location = `?page=1&limit=10&q=${query}`;
                window.location.href = location;

                searchInputElement.value = query;
            }
        });
    }
};

logout = () => {
    localStorage.clear();
    window.location.replace('/login');
}

redirectToHome = () => {
    // prevent access to login, register and new page for certain users
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

const onHeartClick = (event) => {
    event.stopPropagation();
    const [, entityModel, id] = event.target.id.split('-');
    const liked = event.target.classList.contains('question-card--liked');

    fetch('/like', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Token': JSON.stringify({
                content: localStorage.getItem('token'),
                iv: localStorage.getItem('iv')
            })
        },
        body: JSON.stringify({
            entityModel,
            operation: liked ? 'decrement' : 'increment',
            id,
        })
    }).then(res => {
        if (res.status === 200) {
            const scoreElement = document.getElementById(`heart-${entityModel}-score-${id}`);
            if (liked) {
                scoreElement.innerText = parseInt(scoreElement.innerText) - 1;
            } else {
                scoreElement.innerText = parseInt(scoreElement.innerText) + 1;
            }
            event.target.classList.toggle('question-card--liked');
        }
    });
};

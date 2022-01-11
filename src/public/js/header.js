window.onload = (event) => {
    if (localStorage.getItem('token') && localStorage.getItem('iv')) {
        getUsername().then(res => {
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

                // upon pressing enter we will return defaults for page and limit which are 1 and 10
                window.location.href = `?page=1&limit=10&q=${query}`;
                searchInputElement.value = query;
            }
        });
    }
};

const logout = () => {
    localStorage.clear();
    window.location.replace('/login');
}

const redirectToHome = () => {
    // prevent access to login, register and new page for logged in users
    if (window.location.pathname === '/login' || window.location.pathname === '/register') {
        window.location.replace('/');
    }
}

const showFields = () => {
    document.getElementById('username-container').hidden = false;
    document.getElementById('login').hidden = true;
    document.getElementById('signup').hidden = true;
    document.getElementById('ask-question').hidden = false;
    document.getElementById('logout').hidden = false;
}

const hideFields = () => {
    document.getElementById('username-container').hidden = true;
    document.getElementById('login').hidden = false;
    document.getElementById('signup').hidden = false;
    document.getElementById('ask-question').hidden = true;
    document.getElementById('logout').hidden = true;
}

const onHeartClick = (event) => {
    event.stopPropagation();

    const [, entityModel, id] = event.target.id.split('-');
    const liked = event.target.classList.contains('question-card--liked');

    const errorEl = document.getElementById(`${id}-error`);
    errorEl.hidden = true;
    errorEl.innerText = '';

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
                scoreElement.innerText = String(Number(scoreElement.innerText) - 1);
            } else {
                scoreElement.innerText = String(Number(scoreElement.innerText) + 1);
            }
            event.target.classList.toggle('question-card--liked');
        } else if (res.status === 401) { // unauthorized
            errorEl.innerText = `You have to be logged in to like ${entityModel} !`;
            errorEl.hidden = false;
            setTimeout(() => {
                errorEl.innerText = '';
                errorEl.hidden = true;
            }, 3000);
        }
    });
};

const onQuestionCardClick = (event) => {
    if (event.target.id) {
        window.location.href = `/questions/${event.target.id}`;
    }
}

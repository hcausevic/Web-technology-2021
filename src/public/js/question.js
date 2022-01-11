const createRelatedItem = ({ id, text }) => {
    const element = document.createElement('li');
    element.setAttribute('id', id);
    element.setAttribute('onclick', 'onRelatedItemClick(event)');
    element.classList.add('content__item');
    element.innerText = text;
    return element;
}

document.addEventListener('DOMContentLoaded', () => {
    const id = window.location.pathname.split('/').pop();
    const q = new URLSearchParams(window.location.search).get('q');

    fetch(`/search?docId=${id}&q=${q}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    }).then(res => {
        res.json().then(r => {
            const listContainer = document.getElementById('related-items-container');
            const list = document.createElement('ul');
            list.setAttribute('id', 'question-related-items');
            list.classList.add('content__related-items', 'animated');
            
            r.forEach(el => list.append(createRelatedItem(el)));

            const title = document.createElement('div');
            title.setAttribute('class', 'content__related-title');
            title.innerText = 'Related';
            listContainer.appendChild(title);
            listContainer.appendChild(list);
        });
    });

    fetch('/like', {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Token': JSON.stringify({
                    content: localStorage.getItem('token'),
                    iv: localStorage.getItem('iv')
            })
        },
    }).then(res => {
        res.json().then(({ questions, answers }) => {
            const relevantAnswers = document.getElementsByClassName('heart-answer');
            if (questions.includes(id)) {
                const el = document.getElementById(`heart-questions-${id}`);
                el.classList.toggle('question-card--liked');
            }

            for (const answer of relevantAnswers) {
                const [, , id] = answer.id.split('-');
                if (answers.includes(id)) {
                    const el = document.getElementById(`heart-answers-${id}`);
                    el.classList.toggle('answer-card--liked');
                }
            }
        });
    })
});


const onRelatedItemClick = (e) => {
    window.location.href = `/questions/${e.target.id}`;
};

const onPostAnswer = (e) => {
    e.preventDefault();
    const parentId = window.location.pathname.split('/').pop();

    fetch('/answer', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Token': JSON.stringify({
                    content: localStorage.getItem('token'),
                    iv: localStorage.getItem('iv')
            })
        },
        body: JSON.stringify({
            answer: `<p>${e.target[0].value}</p>`,
            parentId,
        })
    }).then(res => {
        if (res.status === 201) {
            window.location.reload();
        }
    });


};

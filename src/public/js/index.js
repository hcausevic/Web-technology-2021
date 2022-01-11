const pageInputElement = document.getElementById('page-num-input');

if (pageInputElement) {
    pageInputElement.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const limit = urlSearchParams.get('limit');
            const q = urlSearchParams.get('q');

            let location = `?page=${pageInputElement.value}`
            if (limit) {
                location += `&limit=${limit}`
            }
            if (q) {
                location += `&q=${q}`;
            }
            window.location.href = location;
        }
    });

    // protecting page number from invalid values
    pageInputElement.addEventListener('change', event => {
        const { min, max, value } = event.target;
        const intValue = parseInt(value);
        if (intValue > parseInt(max)) {
            event.target.value = max;
        } else if (intValue < parseInt(min)) {
            event.target.value = min;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const relevantElements = document.getElementsByClassName('heart-question');
    fetch('/likes', {
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
        res.json().then(({ questions }) => {
            for (const element of relevantElements) {
                const [, , id] = element.id.split('-');
                if (questions.includes(id)) {
                    const el = document.getElementById(`heart-questions-${id}`);
                    el.classList.toggle('question-card--liked');
                }
            }
        });
    })
});

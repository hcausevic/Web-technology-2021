const onRelatedItemClick = (e) => {
    window.location.href = `/questions/${e.target.id}`;
};

const onPostAnswer = (e) => {
    e.preventDefault();

    fetch('/answers', {
        method: 'POST',
        body: JSON.stringify({
            answer: e.target[0].value,
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
};

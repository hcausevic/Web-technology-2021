import { QUESTIONS, ANSWERS, USERS } from '../index.js';

export const getQuestion = (req, res) => {
    const { id } = req.params;

    if (!Object.keys(QUESTIONS).includes(id)) {
        //TODO; need to return error page when it gets created
        return res.status(404).json({ message: 'Not Found.' });
    }

    const [date, time] = new Date(QUESTIONS[id].CreationDate).toLocaleString().split(', ');
    const username = USERS[QUESTIONS[id].OwnerUserId]?.username || `User with id: ${QUESTIONS[id].OwnerUserId}`;
    const question = {
        id,
        ...QUESTIONS[id],
        CreationDate: `${time}, ${date}`,
        username,
    };

    const relevantAnswers = [];

    for (const [key, value] of Object.entries(ANSWERS).reverse()) {
        if (value.ParentId == id) {
            const [answerDate, answerTime] = new Date(value.CreationDate).toLocaleString().split(', ');
            const answerUsername = USERS[value.OwnerUserId]?.username || `User with id: ${value.OwnerUserId}`
            relevantAnswers.push({
                id: key,
                ...value,
                CreationDate: `${answerTime}, ${answerDate}`,
                username: answerUsername,
            });

        }
    }

    const data = {
        search: false,
        username: '',
        question,
        answers: relevantAnswers,
    }
    res.render('../public/views/question.ejs', data);
};

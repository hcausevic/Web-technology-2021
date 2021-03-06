import {ANSWERS, ENTITIES, QUESTIONS, USERS, WORD_MAPPER} from '../index.js';
import {generateUUID} from '../utils/crypto.js';
import {embeddings, preprocessDoc} from '../utils/text-process.js';
import {formatDate} from '../utils/date.js';

export const getQuestion = (req, res) => {
    const { id } = req.params;

    if (!Object.keys(QUESTIONS).includes(id)) {
        return res.status(404).render('../public/views/error.ejs', { search: false });
    }

    const username = USERS[QUESTIONS[id].OwnerUserId]?.username || `User with id: ${QUESTIONS[id].OwnerUserId}`;
    const question = {
        id,
        ...QUESTIONS[id],
        CreationDate: formatDate(QUESTIONS[id].CreationDate),
        username,
    };

    const relevantAnswers = [];

    for (const [key, value] of Object.entries(ANSWERS).reverse()) {
        if (value.ParentId === id) {
            const answerUsername = USERS[value.OwnerUserId]?.username || `User with id: ${value.OwnerUserId}`
            relevantAnswers.push({
                id: key,
                ...value,
                CreationDate: formatDate(value.CreationDate),
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

export const postQuestion = (req, res) => {
    const { title, body } = req.body;
    const preprocessedTitle = preprocessDoc(title);

    if (!title.trim() || !preprocessDoc(body)) {
        return res.status(400).send('Bad Request');
    }

    if (res.userId) {
        // create question
        const question = {
            OwnerUserId: res.userId,
            CreationDate: new Date().toISOString(),
            Score: 0,
            Title: title,
            Body: body
        };

        const questionId = generateUUID();
        QUESTIONS[questionId] = question;

        ENTITIES[questionId] = embeddings(WORD_MAPPER, preprocessedTitle);

        res.status(201).json(question);
    } else {
        return res.status(401).send('Token invalid!');
    }
}

export const getNewQuestionForm = (req, res) => {
    const data = {
        search: false,
    }
    res.render('../public/views/new.ejs', data);
}

import { QUESTIONS, ANSWERS, USERS } from '../index.js';

export const putLike = async (req, res) => {
    const { entityModel, operation, id } = req.body;
    if (!(['questions', 'answers'].includes(entityModel)) || !(['increment', 'decrement'].includes(operation)) ) {
        return res.status(400).send('Invalid request!');
    }

    const likedArray = entityModel === 'questions' ? 'likedQuestions' : 'likedAnswers'

    // prevent double (dis)likes
    if (USERS[res.userId][likedArray].includes(id)) {
        if (operation === 'increment') {
            return res.status(400).send('Bad request!');
        }
    } else {
        if (operation === 'decrement') {
            return res.status(400).send('Bad request!');
        }
    }

    const data = entityModel === 'questions' ? QUESTIONS : ANSWERS;
    const entity = data[id];
    if (!entity) {
        return res.status(404).send('Not found!');
    }

    const likeFn = operation === 'increment' ? (score) => ++score : (score) => --score;

    data[id] = {
        ...entity,
        Score: likeFn(entity.Score)
    };

    operation === 'increment' ?
        USERS[res.userId][likedArray].push(id) :
        USERS[res.userId][likedArray] = USERS[res.userId][likedArray].filter(e => e !== id);

    return res.status(200).json({ id, score: data[id].Score });
}

export const getLikes = async (req, res) => {
    const { likedQuestions, likedAnswers } = USERS[res.userId];
    return res.status(200).json({
        questions: likedQuestions,
        answers: likedAnswers,
    });
};
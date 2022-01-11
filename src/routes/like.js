import { QUESTIONS, ANSWERS, USERS } from '../index.js';

export const putLike = async (req, res) => {
    const { entityModel, operation, id } = req.body;
    if (!(['questions', 'answers'].includes(entityModel)) || !(['increment', 'decrement'].includes(operation)) ) {
        return res.status(400).send('Invalid request!');
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

    if (operation === 'increment') {
        entityModel === 'questions' ?
            USERS[res.userId].likedQuestions.push(id) :
            USERS[res.userId].likedAnswers.push(id);
    } else {
        entityModel === 'questions' ?
            USERS[res.userId].likedQuestions =  USERS[res.userId].likedQuestions.filter(e => e != id): 
            USERS[res.userId].likedAnswers = USERS[res.userId].likedAnswers.filter(e => e != id);
    }
    

    return res.status(200).json({ id, score: data[id].Score });
}

export const getLike = async (req, res) => {
    const { likedQuestions, likedAnswers } = USERS[res.userId];
    return res.status(200).json({
        questions: likedQuestions,
        answers: likedAnswers,
    });
};
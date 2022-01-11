import { preprocessDoc } from '../utils/text-process.js';
import { generateUUID } from '../utils/crypto.js';
import { ANSWERS } from '../index.js';

export const postAnswer = (req, res) => {
    const ParentId = req.body.parentId;
    const Body = req.body.answer;
    if (!ParentId || preprocessDoc(Body) === '') {
        return res.status(400).send('Bad Request!');
    }

    const id = generateUUID();

    ANSWERS[id] = {
        OwnerUserId: res.userId,
        Score: 0,
        CreationDate: new Date().toISOString(),
        Body,
        ParentId,
    };

    return res.status(201).json({ created: ANSWERS[id] });
};

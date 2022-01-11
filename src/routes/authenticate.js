import { decrypt } from '../utils/crypto.js';
import { USERS } from '../index.js';

export const getUsername = (req, res) => {
    const { token } = req.body;
    try {
        const { username } = JSON.parse(decrypt(token));
        const found = Object.values(USERS).find(value => value.username === username);
        if (found) {
            res.status(200).json({ username });
        } else {
            res.status(401).send('Token invalid!');
        }
    } catch (error) {
        res.status(401).send('Token invalid!');
    }
};

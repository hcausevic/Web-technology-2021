import { decrypt } from '../utils/crypto.js';

export const getUsername = (req, res) => {
    const { token } = req.body;
    try {
        const { username } = JSON.parse(decrypt(token));
        res.status(200).json({ username });
    } catch (error) {
        res.status(401).send('Token invalid!');
    }
};

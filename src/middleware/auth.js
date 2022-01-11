import e from 'express';
import { USERS } from '../index.js';
import { decrypt } from '../utils/crypto.js';

export const auth = () => {
    return async (req, res, next) => {
        try {
            const token = JSON.parse(req.headers['token']);
            const { username } = JSON.parse(decrypt(token));
            const user = Object.entries(USERS).find(([_, value]) => value.username === username);
            if (!user) {
                throw new Error('User not found!');
            }

            res.userId = user[0];
            next();
        } catch (error) {
            res.status(401).json({ message: 'Authentication failed! '});
        }
    }
};
import { USERS } from '../index.js';

export const getUsername = (req, res) => {
    return res.status(200).json({username: USERS[res.userId].username})
};

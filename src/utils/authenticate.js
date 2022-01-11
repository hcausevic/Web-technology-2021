import { USERS } from '../index.js';
import { decrypt } from './crypto.js';

export const getUserFromToken = (token) => {
    try {
        const { username } = JSON.parse(decrypt(token));
        return Object.entries(USERS)
            .map(data => ({
                id: data[0],
                username: data[1].username,
                password: data[1].password,
                email: data[1].email
            }))
            .find(user => user.username === username);
    } catch (error) {
        return null;
    }
}
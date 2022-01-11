import { encrypt, hash } from '../utils/crypto.js';
import { USERS } from '../index.js';

export const getLogin = (req, res) => {
    const data = {
        search: false,
    }
    res.render('../public/views/login.ejs', data);
};

export const postLogin = (req, res) => {
    const { username, password } = req.body;
    const user = Object.values(USERS)
        .find(user => user.username === username && user.password === hash(password, 'md5'));

    if (user != null) {
        // create session token
        const token = encrypt(JSON.stringify(user));
        return res.status(200).json(token);
    } else {
        return res.status(401).send('Incorrect username or password!');
    }
};
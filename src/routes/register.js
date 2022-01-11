import { USERS } from '../index.js';
import { encrypt, generateUUID, hash } from '../utils/crypto.js';

export const getRegister = (req, res) => {
    const data = {
        search: false,
    }
    res.render('../public/views/register.ejs', data);
};

export const postRegister = (req, res) => {
    const { username, email, password } = req.body;

    const existingUsername = Object.values(USERS).find(user => user.username === username);
    const existingEmail = Object.values(USERS).find(user => user.email === email);

    if (existingUsername != null) {
        return res.status(409).send('User with that username already exists!');
    }
    if (existingEmail != null) {
        return res.status(409).send('User with that email already exists!');
    }

    // create user
    const newUser = {
        username,
        password: hash(password, 'md5'),
        email
    }
    USERS[generateUUID()] = {... newUser, likedQuestions: [], likedAnswers: []};

    // create session token
    const token = encrypt(JSON.stringify(newUser));

    res.status(201).json(token);
};
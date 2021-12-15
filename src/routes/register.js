import fs from 'fs';
import path from 'path';
import {encrypt, generateUUID, hash} from "../utils/crypto.js";

export const getRegister = (req, res) => {
    const data = {
        title: 'Web Technology 2021',
        search: false,
    }
    res.render('../public/views/register.ejs', data);
};

export const postRegister = (req, res) => {
    const {username, email, password} = req.body;
    const filePath = path.join('src', 'database', 'users.json');
    let users = {};

    // check whether user with that email/username already exists
    try {
        users = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'}));
    } catch (err) {
        return res.status(500).send('Server error. Please try again later.')
    }
    const existingUsername = Object.values(users).find(user => user.username === username);
    const existingEmail = Object.values(users).find(user => user.email === email);

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
    users[generateUUID()] = newUser;

    // save user
    try {
        fs.writeFileSync(filePath, JSON.stringify(users));

    } catch (err) {
        return res.status(500).send('Server error. Please try again later.');
    }

    // create session token
    const token = encrypt(JSON.stringify(newUser));

    res.status(201).json(token);
};
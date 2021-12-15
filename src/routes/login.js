import path from "path";
import fs from "fs";
import {encrypt, hash} from "../utils/crypto.js";

export const getLogin = (req, res) => {
    const data = {
        title: 'Web Technology 2021',
        search: false,
    }
    res.render('../public/views/login.ejs', data);
};

export const postLogin = (req, res) => {
    const {username, password} = req.body;

    const filePath = path.join('src', 'database', 'users.json');
    let users = {};

    // try to find the user
    try {
        users = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'}));
    } catch (err) {
        return res.status(500).send('Server error. Please try again later.')
    }
    const user = Object.values(users)
        .find(user => user.username === username && user.password === hash(password, 'md5'));

    if (user != null) {
        // create session token
        const token = encrypt(JSON.stringify(user));
        return res.status(200).json(token);
    } else {
        return res.status(401).send('Incorrect username or password!');
    }
};
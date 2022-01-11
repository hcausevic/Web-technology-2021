import {decrypt} from "./crypto.js";
import fs from "fs";
import path from "path";

export const getUserFromToken = (token) => {
    try {
        const {username} = JSON.parse(decrypt(token));
        const filePath = path.join('src', 'database', 'users.json');
        const users = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'}));
        return Object.entries(users)
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
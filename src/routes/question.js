import fs from 'fs';
import path from 'path';
import {generateUUID} from "../utils/crypto.js";
import {getUserFromToken} from "../utils/authenticate.js";

export const getNewQuestionForm = (req, res) => {
    const data = {
        title: 'Web Technology 2021',
        search: false,
    }
    res.render('../public/views/new.ejs', data);
}

export const getQuestion = (req, res) => {
    const {id} = req.params;
    const filePath = path.join('src', 'database', 'questions.json');
    let questions = {};
    try {
        questions = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'}));
    } catch (err) {
        return res.status(500).json({message: 'Server error.'});
    }


    if (!Object.keys(questions).includes(id)) {
        //TODO; need to return error page when it gets created
        return res.status(404).json({message: 'Not Found.'});
    }

    const question = {id, ...questions[id]};
    const answersFilePath = path.join('src', 'database', 'answers.json');
    let answers = {};
    try {
        answers = JSON.parse(fs.readFileSync(answersFilePath, {encoding: 'utf-8'}));
    } catch (err) {
        return res.status(500).json({message: 'Server error.'});
    }

    const relevantAnswers = [];

    for (const [key, value] of Object.entries(answers)) {
        if (value.ParentId === id) {
            relevantAnswers.push({
                id: key,
                ...value
            });
        }
    }

    const data = {
        title: 'Web Technology 2021',
        search: true,
        username: '',
        question,
        answers: relevantAnswers,
    }
    res.render('../public/views/question.ejs', data);
};

export const postQuestion = (req, res) => {
    const {token, title, body} = req.body;
    const filePath = path.join('src', 'database', 'questions.json');
    let questions = {};

    try {
        questions = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'}));
    } catch (err) {
        return res.status(500).send('Server error');
    }

    const user = getUserFromToken(token);
    if (user) {
        // create question
        const question = {
            OwnerUserId: user.id,
            CreationDate: new Date().toISOString(),
            Score: 0,
            Title: title,
            Body: body
        };
        questions[generateUUID()] = question;

        // save question
        try {
            fs.writeFileSync(filePath, JSON.stringify(questions));
            res.status(201).json(question);

        } catch (err) {
            return res.status(500).send('Server error. Please try again later.');
        }
    } else {
        return res.status(401).send('Token invalid!');
    }
}

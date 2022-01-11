import express from 'express';
import ejs from 'ejs';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const COLOR_BLUE = '\x1b[34m%s\x1b[0m';

// import routes
import { getHome } from './routes/home.js';
import { getRegister, postRegister } from './routes/register.js';
import { getUsername } from './routes/authenticate.js';
import { getLogin, postLogin } from './routes/login.js';
import { getSearch } from './routes/search.js';
import { paginate } from './middleware/paginate.js';
import { auth } from './middleware/auth.js';
import { getLike, putLike } from './routes/like.js';
import { postAnswer } from './routes/answer.js';
import { getNewQuestionForm, getQuestion, postQuestion } from './routes/question.js';
import { getAbout } from "./routes/about.js";
import { getError } from "./routes/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const pathToPublic = path.join(__dirname, 'public');

const questionsFilePath = path.join(__dirname, 'data', 'questions.json');
const answersFilePath = path.join(__dirname, 'data', 'answers.json');
const usersFilePath = path.join(__dirname, 'data', 'users.json');
const entitiesPath = path.join(process.cwd(), 'entities.json');
const wordMapperPath = path.join(process.cwd(), 'wv.json');

export const QUESTIONS = JSON.parse(fs.readFileSync(questionsFilePath, 'utf8'));
export const ANSWERS = JSON.parse(fs.readFileSync(answersFilePath, 'utf8'));
export const USERS = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
export const ENTITIES = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'));
export const WORD_MAPPER = JSON.parse(fs.readFileSync(wordMapperPath, 'utf8'));

app.use(express.static(pathToPublic));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', pathToPublic);
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

app.get('/', paginate(QUESTIONS), getHome);
app.get('/register', getRegister);
app.post('/register', postRegister);
app.post('/user/me', getUsername);
app.get('/login', getLogin);
app.post('/login', postLogin);
app.get('/questions/:id', getQuestion);
app.put('/like', auth(), putLike);
app.get('/like', auth(), getLike);
app.get('/search', getSearch);
app.post('/answer', auth(), postAnswer);
app.get('/new', getNewQuestionForm);
app.post('/new', auth(), postQuestion);
app.get('/about', getAbout);
app.get('*', getError);

const server = app.listen(port, () => {
    console.log(COLOR_BLUE, `Application is listening on port ${port}`)
});

process.on('SIGINT', () => {
    console.log(COLOR_BLUE, '\n\nSaving data, please wait for it to finish!');
    server.close(() => {
        fs.writeFileSync(questionsFilePath, JSON.stringify(QUESTIONS));
        fs.writeFileSync(answersFilePath, JSON.stringify(ANSWERS));
        fs.writeFileSync(usersFilePath, JSON.stringify(USERS));
        fs.writeFileSync(entitiesPath, JSON.stringify(ENTITIES));
    });
});
import express from 'express';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// import routes
import { getHome } from './routes/home.js';
import { getRegister, postRegister } from './routes/register.js';
import { getUsername } from './routes/authenticate.js';
import { getLogin, postLogin } from './routes/login.js';
import { getQuestion } from './routes/question.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const pathToPublic = path.join(__dirname, 'public');

app.use(express.static(pathToPublic));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', pathToPublic);
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

app.get('/', getHome);
app.get('/register', getRegister);
app.post('/register', postRegister);
app.post('/user/me', getUsername);
app.get('/login', getLogin);
app.post('/login', postLogin);
app.get('/questions/:id', getQuestion);

app.listen(port, () => {
    console.log(`Application is listening on port ${port}`)
});
import express from 'express';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// import routes
import { getHome } from './routes/home.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const pathToPublic = path.join(__dirname, 'public');

app.use(express.static(pathToPublic));
app.set('views', pathToPublic);
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

app.get('/', getHome);

app.listen(port, () => {
    console.log(`Application is listening on port ${port}`)
});
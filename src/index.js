import express from 'express';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// import routes
import { getHome } from './routes/home.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('./public'));
app.set('views', __dirname + '/public');
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

app.get('/', getHome);

app.listen(port, () => {
    console.log(`Application is listening on port ${port}`)
});
import express from 'express';

// import routes
import { getHome } from './routes/home.js';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', getHome);

app.listen(port, () => {
    console.log(`Application is listening on port ${port}`)
});
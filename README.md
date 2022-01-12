# Web-technology-2021

## Running application locally
Requirements: `linux/macOs`</br>
1. Install project dependencies by executing command `npm install` in the root project directory.
2. Run `npm start`. This will pretrain data inside the `src/data/questions.json` file and then run the application.
You can access it on `localhost:3000` in your browser. If you want to retrain the data you can pass optional `--retrain=yes` parameter to the script.

## Running application with Docker (in case of issues with WSL)
Requirements: `Docker`for your system
1. Build application image by executing `docker build -t wt .`
2. Run `docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app wt`</br></br>
*Disclaimer: this was not part of the homework, it was used just for dev purposes.*
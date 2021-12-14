# Web-technology-2021

## Running application locally
Requirements: `linux/macOs`</br>
1. Install project dependencies by executing command `npm install` in the root project directory.
2. Run `npm start`

## Running application with Docker
Requirements: `Docker`for your system
1. Build application image by executing `docker build -t wt .`
2. Run `docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app wt`
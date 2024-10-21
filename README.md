# Coffee-Shop

## Tech Stack

- Frontend: EJS, HTML, CSS
- Backend: Node.js, Express
- Database: MongoDB

## Dependency

### Client

- @babel/core: ^7.25.2
- @babel/preset-env: ^7.25.4
- axios: ^1.7.7
- babel: ^6.23.0
- cookie-parser: ^1.4.7
- dotenv: ^16.4.5
- ejs: ^3.1.10
- express: ^4.21.0
- multer: ^1.4.5-lts.1
- reload: ^3.3.0
- @babel/node: ^7.25.7
- babel-cli: ^6.26.0
- nodemon: ^3.1.7
- reload: ^2.2.0

### Server

- @aws-sdk/client-s3: ^3.670.0
- @aws-sdk/s3-request-presigner: ^3.670.0
- @meanie/mongoose-to-json: ^2.6.0
- aws-sdk: ^2.1691.0
- bcryptjs: ^2.4.3
- cookie-parser: ^1.4.6
- cors: ^2.8.5
- dayjs: ^1.11.13
- dotenv: ^16.4.5
- exceljs: ^4.4.0
- express: ^4.19.2
- http-status: ^1.7.4
- joi: ^17.13.3
- jsonwebtoken: ^9.0.2
- mongoose: ^8.6.2
- morgan: ^1.10.0
- multer: ^1.4.5-lts.1
- nodemon: ^3.1.7
- passport: ^0.7.0
- passport-jwt: ^4.0.1
- pdfkit: ^0.15.0
- sharp: ^0.33.5
- validator: ^13.12.0
- winston: ^3.14.2

## How to run

1. Clone the repository
2. Go to the client and server folders and run `npm install`
3. Go to the client folder and run `npm start`
4. Go to the server folder and run `npm start`

## Example Environment Variables

- Client
PORT= your port

- Server
DB_CONNECTION=mongo_url
PORT=port
WHITE_LIST=white_list
ROOT_ROUTE=/
SSH_PRIVATE_KEY=kry
SSH_HOST=host_server
SSH_USER=username
APP_DIR=/dir
PM2_APP_NAME=app_name
JWT_SECRET=not-so-secret
JWT_ACCESS_EXPIRATION_MINUTES=minutes
JWT_REFRESH_EXPIRATION_DAYS=days
AWS_ACCESS_KEY_ID=id-key
AWS_SECRET_ACCESS_KEY=access_key
AWS_REGION=region
AWS_BUCKET=bucket_name

## Project structure

- client
    - src
        - assets
            - css
            - img
            - js
        - public
        - routes
        - utils
        - views
        - app.js
    - docker-compose.yml
    - Dockerfile
    - nginx.conf
    - package.json
    - README.md
- server
    - src
        - config
        - controllers
        - database
        - middlewares
        - models
        - routes
        - services
        - utils
        - validations
        - worker
        - server.js
    - index.js
    - package.json
- .env
- .gitlab-ci.yml
- Dockerfile
- docker-compose.yml
- nginx.conf
- package.json
- README.md




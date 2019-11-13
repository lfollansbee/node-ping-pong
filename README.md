# Ping Pong CRUD Functionalities

## To Run:
Install all of the project dependencies first: <br>
 `$ npm i`

To get the project up and running: <br>
`$ npm run start` 
<br> The api will be running on `http://localhost:8080/`

## Mongo
To have a working database locally, ensure that you have `mongo` installed on your machine.

If MongoDb is not installed on your machine, you should head to [MongoDb Download Center](https://www.mongodb.com/download-center/community), download and install the version compatible with your operating system before you continue.


### Database run command:
`$ mongod`

## To run tests:
Make sure you have mongo running in one window of your terminal ( `$ mongod` ).

`$ npm run test` to run it once or `$ npm run test:verbose` to keep it running.

I got the test set-up help [here](https://zellwk.com/blog/endpoint-testing/).
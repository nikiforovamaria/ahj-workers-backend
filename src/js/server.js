const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body')
const slow = require('koa-slow');
const { v4: uuidv4 } = require('uuid');
const Router = require("koa-router");
const cors = require('@koa/cors');
const faker = require('faker');

const app = new Koa();

const data = {
    "status": "ok",
    "timestamp": `${ new Date().toLocaleDateString() } ${ new Date().toLocaleTimeString() }`,
    "articles": [
      {
        "id": uuidv4(),
        "image": faker.image.avatar(),
        "description": faker.lorem.words(10) ,
        "received": `${ new Date().toLocaleDateString() } ${ new Date().toLocaleTimeString() }`,
      },
      {
        "id": uuidv4(),
        "image": faker.image.avatar(),
        "description": faker.lorem.words(10),
        "received": `${ new Date().toLocaleDateString() } ${ new Date().toLocaleTimeString() }`,
      },
    ]
}

console.log(data);

app.use(slow({
  delay: 4000,
}));

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));

const router = new Router();

app.use(async (ctx) => {
  switch (ctx.request.url) {
    case '/articles':
      ctx.response.body = data;
      break;
  }
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback())
server.listen( port , () => console.log('server started'));
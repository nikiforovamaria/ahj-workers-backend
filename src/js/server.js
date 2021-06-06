const http = require("http");
const Koa = require("koa");
const slow = require('koa-slow');
const { v4: uuidv4 } = require('uuid');
const Router = require("koa-router");
const faker = require('faker');

const app = new Koa();

const data = {
  "status": "ok",
  "timestamp": `${ new Date().toLocaleDateString() } ${ new Date().toLocaleTimeString() }`,
  "articles": [
    {
      "id": uuidv4(),
      "image": faker.image.avatar(),
      "description": faker.lorem.words(10),
      "received": `${ new Date().toLocaleDateString() } ${ new Date().toLocaleTimeString() }`
    },
    {
      "id": uuidv4(),
      "image": faker.image.avatar(),
      "description": faker.lorem.words(10),
      "received": `${ new Date().toLocaleDateString() } ${ new Date().toLocaleTimeString() }`
    },
  ]
}

console.log(data);

app.use(slow({
  delay: 4000,
}));

app.use(async (ctx, next) => {
  const origin = ctx.request.get("Origin");
  if (!origin) {
    return await next();
  }

  const headers = { "Access-Control-Allow-Origin": "*" };

  if (ctx.request.method !== "OPTIONS") {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get("Access-Control-Request-Method")) {
    ctx.response.set({
      ...headers,
      "Access-Control-Allow-Methods": "GET, POST, PUD, DELETE, PATCH",
    });
  }

  if (ctx.request.get("Access-Control-Request-Headers")) {
    ctx.response.set(
      "Access-Control-Allow-Headers",
      ctx.request.get("Access-Control-Request-Headers")
    );
  }

  ctx.response.status = 204;

  ctx.respond = false;
});

app.use(async (ctx) => {
  switch (ctx.request.url) {
    case '/articles':
      ctx.response.body = data;
      break;
  }
});

const router = new Router();

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
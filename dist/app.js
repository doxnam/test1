const fastify = require("fastify");
const nunjucks = require("nunjucks");

const encoders = {};

const flagEncoder = (input, callback) => {
  const flag = "*** CENSORED ***";
  callback(null, flag);
};

const base64Encoder = (input, callback) => {
  try {
    const result = Buffer.from(input).toString("base64");
    callback(null, result);
  } catch (error) {
    callback(error);
  }
};

const urlEncoder = (input, callback) => {
  try {
    const result = encodeURIComponent(input);
    callback(null, result);
  } catch (error) {
    callback(error);
  }
};

const app = fastify();
app.register(require("point-of-view"), { engine: { nunjucks } });
app.register(require("fastify-formbody"));
app.register(require("fastify-cookie"));
app.register(require("fastify-session"), {
  secret: Math.random().toString(2),
  cookie: { secure: false },
});

app.get("/", async (request, reply) => {
  reply.view("index.html", { sessionId: request.session.sessionId });
});

app.post("/", async (request, reply) => {
  if (request.body.encoder.match(/[FLAG]/)) {
    throw new Error("Not Allow");
  }

  if (request.body.input.length < 20) {
    throw new Error("String is too short");
  }

  if (request.body.input.length > 1000) {
    throw new Error("String is too long");
  }

  encoders["base64"] = base64Encoder;
  encoders["url"] = urlEncoder;
  encoders[`FLAG_${request.session.sessionId}`] = flagEncoder;

  const result = await new Promise((resolve, reject) => {
    encoders[request.body.encoder](request.body.input, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

  reply.view("index.html", {
    input: request.body.input,
    result,
    sessionId: request.session.sessionId,
  });
});

app.setErrorHandler((error, request, reply) => {
  reply.view("index.html", { error, sessionId: request.session.sessionId });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

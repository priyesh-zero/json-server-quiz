const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "data/db.json"));
const middlewares = jsonServer.defaults({ static: "client" });

server.use(middlewares);

server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);

server.use(jsonServer.bodyParser);

server.post("/auth/login", (req, res) => {
  const { users } = require("./data/db.json");
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.send({ ok: false, message: "Invalid Credentials" });
  }
  return res.send({ ok: true, token: user._id });
});

const checkAuthToken = (req, res) => {
  const { users } = require("./data/db.json");
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).send({ ok: false, message: "No Token Provided" });
    return;
  } else if (token.split(" ").length !== 2) {
    res.status(401).send({
      ok: false,
      message:
        'Token must be in "Bearer xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" format',
    });
    return;
  }
  const user = users.find((u) => u._id === token.split(" ")[1]);

  if (!user) {
    res
      .status(401)
      .send({ ok: false, message: "Invalid Token! Please login again." });
    return;
  }
  return user;
};

server.get("/auth/whoami", (req, res) => {
  const user = checkAuthToken(req, res);
  if (user) {
    delete user.password;

    res.send({ ok: true, user });
  }
});

server.use((req, res, next) => {
  if (checkAuthToken(req, res)) {
    next();
  }
});

server.use(router);

server.listen(8000, () => {
  console.log(`Server listening on 8000`);
});

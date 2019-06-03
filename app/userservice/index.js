const express = require("express");
const cors = require("cors");

const port = process.env.SERVER_PORT || 9010;
const users = require("./users");

const app = express();

app.use(cors());

app.get("/users", (_, res) => res.json(users));
app.get("/users/:userId", (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) {
    return res
      .status(404)
      .json({ error: `User with id '${req.params.userId}' not found` });
  }

  return res.json(user);
});

app.listen(port, () => {
  console.log(`  📞    User API Server listening on port ${port}`);
});

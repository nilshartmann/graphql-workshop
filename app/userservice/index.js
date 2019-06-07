const express = require("express");
const cors = require("cors");

const port = process.env.SERVER_PORT || 9010;
const users = require("./users");

const app = express();

app.use(cors());

// for debugging
let usersRequestCounter = 0;
let usersByIdCounter = 0;

app.get("/users", (_, res) => {
  console.log("READING ALL USERS");

  // no caching here
  ++usersRequestCounter;
  res.json(
    users.map(u => ({ ...u, requestId: `users_${usersRequestCounter}` }))
  );
});
app.get("/users/:userId", (req, res) => {
  console.log("READING USER WITH ID " + req.params.userId);
  const user = users.find(u => u.id === req.params.userId);
  if (!user) {
    return res
      .status(404)
      .json({ error: `User with id '${req.params.userId}' not found` });
  }

  // make apollo server cache the requests
  ++usersByIdCounter;
  res.set("Cache-Control", "public, max-age=31557600, s-maxage=31557600");
  return res.json({ ...user, requestId: `usersById_${usersByIdCounter}` });
});

app.listen(port, () => {
  console.log(`  📞    User API Server listening on port ${port}`);
});

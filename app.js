"use strict";

const express = require("express");
// const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const findFriendsRoutes = require("./routes/findFriends");
const matchesRoutes = require("./routes/matches");
const messagesRoutes = require("./routes/messages");

const morgan = require("morgan");

const app = express();

// app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);
//route aws

//routes..
app.use("/auth", authRoutes);
app.use("/findFriends", findFriendsRoutes);
app.use("/matches", matchesRoutes);
app.use("/messages", messagesRoutes);

/** Handle 404 errors -- this matches everything */

app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */

app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;

var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", function (req, res, _next) {
  res.send("respond with a resource");
});

router.post("/login", async (req, res) => {
  try {
    const token = await userController.loginUser(req.body);
    return res
      .status(200)
      .cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600000,
      })
      .json(token);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message });
  }
});
module.exports = router;

const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

router.get("/me", auth, (req, res) => {
  res.json({
    message: "JWT is valid",
    admin: req.admin
  });
});

module.exports = router;

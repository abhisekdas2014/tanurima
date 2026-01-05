const router = require("express").Router();

// Controller (business logic)
const authController = require("../controllers/auth.controller");

// Middleware (JWT protection)
const authMiddleware = require("../middleware/auth.middleware");

// PUBLIC route (no JWT)
router.post("/login", authController.login);

// PROTECTED test route
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Authenticated",
    admin: req.admin
  });
});

module.exports = router;

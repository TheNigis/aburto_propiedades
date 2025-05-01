const { Router } = require("express");
const router = Router();

const IndexController = require(".././controllers/indexController");
const AuthController = require(".././controllers/authController");

/* Inicio General */
router.get("/", IndexController.index);
router.get("/propiedad/:id", IndexController.propiedad);

/* Landing */
router.get("/personas", IndexController.landingUser);
router.get("/equipos", IndexController.landingTeam);

router.get("/logout", IndexController.logout);

module.exports = router;
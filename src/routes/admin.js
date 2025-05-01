const { Router } = require("express");
const router = Router();

const AdminController = require(".././controllers/adminController");

/* Dashboard */
router.get("/panel", AdminController.panelAdmin);
router.get("/panel/:id", AdminController.editarPropiedad);
router.post("/panel/:id", AdminController.confirmarEdicionPropiedad);
router.post("/panel/:id/eliminar", AdminController.eliminarPropiedad);


router.get("/crear-propiedad", AdminController.crearPropiedades);
router.post('/crear-propiedad', AdminController.envioPropiedades);
router.post("/return-files", AdminController.returnFiles);
module.exports = router;
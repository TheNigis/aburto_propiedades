const { Router } = require("express");
const router = Router();

const DashboardController = require(".././controllers/dashboardController");
const UserController = require(".././controllers/userController");

/* Dashboard */
router.get("/dashboard", DashboardController.dashboard);
router.post('/activities', DashboardController.activities);
router.get('/activity/:idActivity', DashboardController.activity);
router.post('/activities/filter', DashboardController.filterActivities);

router.get('/profile', UserController.profile);
router.post('/edit-profile', UserController.editProfile);
router.post('/edit-photo', UserController.editPhoto);
router.get('/external/:idUser', UserController.externalProfile);

module.exports = router;
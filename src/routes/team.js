const { Router } = require("express");
const router = Router();

const TeamsController = require(".././controllers/teamsController");

router.get("/list", TeamsController.listOfActivities);
router.post("/list", TeamsController.activities);

router.get('/get/:idTeam', TeamsController.team);
router.post('/create/:idActivity', TeamsController.createTeam);

router.get("/list/:idTeams"); // TeamsController.team

router.get('/activity/:idActivity', TeamsController.showTeamsActivity);
router.post('/activity/:idActivity', TeamsController.apiTeamsActivity);

module.exports = router;
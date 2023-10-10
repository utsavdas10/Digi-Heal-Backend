const router = require("express").Router();
const functionalController = require('../controllers/functional-controllers');


// Initializing the routes
router.get('/:email/health-metrics', functionalController.getHealthMetrics);

router.post('/health-metrics', functionalController.postHealthMetrics);

router.get('/:email/nutrition-data', functionalController.getNutritionData);

router.post('/nutrition-data', functionalController.postNutritionData);

router.get('/:email/workout-data', functionalController.getWorkoutData);

router.post('/workout-data', functionalController.postWorkoutData);

router.get('/:email/progress', functionalController.getProgress);

router.post('/setGoal', functionalController.setGoal);

router.post('/setProgress', functionalController.setProgress);


module.exports = router;
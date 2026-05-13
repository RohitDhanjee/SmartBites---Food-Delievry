const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const adminMiddleware = require('../middleware/admin');

// --- Public Routes ---
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurant);
router.get('/menu/:restaurantId', restaurantController.getMenu);

// --- Admin Protected Routes ---
// Apply adminMiddleware to all routes below this line
router.use(adminMiddleware);

// Restaurant management
router.post('/add', restaurantController.addRestaurant);
router.put('/update/:id', restaurantController.updateRestaurant);
router.delete('/delete/:id', restaurantController.deleteRestaurant);

// Menu management
router.post('/menu/add', restaurantController.addMenuItem);
router.put('/menu/update/:id', restaurantController.updateMenuItem);
router.delete('/menu/delete/:id', restaurantController.deleteMenuItem);

module.exports = router;


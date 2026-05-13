// ============================================================
// Restaurant Controller
// ============================================================
// Business logic for restaurant and menu operations.
// ============================================================

const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// ============================================================
// GET / — List all restaurants
// ============================================================
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isOpen: true }).sort({ rating: -1 });
    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurants',
      error: error.message
    });
  }
};

// ============================================================
// GET /:id — Get single restaurant
// ============================================================
exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant',
      error: error.message
    });
  }
};

// ============================================================
// GET /menu/:restaurantId — Get menu for a restaurant
// ============================================================
exports.getMenu = async (req, res) => {
  try {
    const items = await MenuItem.find({
      restaurantId: req.params.restaurantId,
      isAvailable: true
    });
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu',
      error: error.message
    });
  }
};

// ============================================================
// POST /add — Add a new restaurant (admin)
// ============================================================
exports.addRestaurant = async (req, res) => {
  try {
    const { name, cuisine, address, rating, image, deliveryTime } = req.body;
    const restaurant = await Restaurant.create({
      name, cuisine, address, rating, image, deliveryTime
    });
    res.status(201).json({
      success: true,
      message: 'Restaurant added successfully',
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add restaurant',
      error: error.message
    });
  }
};

// ============================================================
// POST /menu/add — Add a menu item to a restaurant
// ============================================================
exports.addMenuItem = async (req, res) => {
  try {
    const { restaurantId, name, description, price, category, image } = req.body;

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const menuItem = await MenuItem.create({
      restaurantId, name, description, price, category, image
    });
    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add menu item',
      error: error.message
    });
  }
};

// ============================================================
// PUT /update/:id — Update restaurant (admin)
// ============================================================
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      message: 'Restaurant updated successfully',
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update restaurant',
      error: error.message
    });
  }
};

// ============================================================
// DELETE /delete/:id — Delete restaurant (admin)
// ============================================================
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Also delete all menu items for this restaurant
    await MenuItem.deleteMany({ restaurantId: req.params.id });

    res.json({
      success: true,
      message: 'Restaurant and its menu deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete restaurant',
      error: error.message
    });
  }
};

// ============================================================
// PUT /menu/update/:id — Update menu item (admin)
// ============================================================
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item',
      error: error.message
    });
  }
};

// ============================================================
// DELETE /menu/delete/:id — Delete menu item (admin)
// ============================================================
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item',
      error: error.message
    });
  }
};


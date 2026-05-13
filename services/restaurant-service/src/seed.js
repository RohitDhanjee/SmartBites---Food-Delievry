// ============================================================
// Seed Script — Populate demo restaurants and menu items
// ============================================================
// Run this script to populate the database with sample data
// so the project works out-of-the-box for demonstrations.
//
// Usage: npm run seed
// ============================================================

const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const restaurants = [
  {
    name: 'Karachi Biryani House',
    cuisine: 'Pakistani',
    address: '123 University Road, Karachi',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    deliveryTime: '30-40 min'
  },
  {
    name: 'Pizza Planet',
    cuisine: 'Italian',
    address: '456 Main Boulevard, Lahore',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    deliveryTime: '25-35 min'
  },
  {
    name: 'Dragon Wok',
    cuisine: 'Chinese',
    address: '789 Blue Area, Islamabad',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
    deliveryTime: '35-45 min'
  },
  {
    name: 'Burger Lab',
    cuisine: 'American',
    address: '321 Gulberg III, Lahore',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    deliveryTime: '20-30 min'
  },
  {
    name: 'Chai Khana',
    cuisine: 'Desi Cafe',
    address: '555 Defence, Karachi',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400',
    deliveryTime: '15-25 min'
  }
];

const menuItemsMap = {
  'Karachi Biryani House': [
    { name: 'Chicken Biryani', description: 'Aromatic basmati rice with tender chicken pieces', price: 350, category: 'main', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300' },
    { name: 'Mutton Biryani', description: 'Premium mutton cooked with fragrant spices', price: 550, category: 'main', image: 'https://images.unsplash.com/photo-1642821373181-203a6e0fca3b?w=300' },
    { name: 'Raita', description: 'Yogurt with cucumber and mint', price: 80, category: 'side', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
    { name: 'Seekh Kebab', description: 'Grilled spiced minced meat kebabs', price: 280, category: 'appetizer', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300' },
    { name: 'Kheer', description: 'Traditional rice pudding dessert', price: 150, category: 'dessert', image: 'https://images.unsplash.com/photo-1571006682654-8e358e85569d?w=300' },
    { name: 'Lassi', description: 'Sweet yogurt drink', price: 120, category: 'drink', image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=300' }
  ],
  'Pizza Planet': [
    { name: 'Margherita Pizza', description: 'Classic tomato, mozzarella, and basil', price: 800, category: 'main', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300' },
    { name: 'Pepperoni Pizza', description: 'Loaded with spicy pepperoni slices', price: 950, category: 'main', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300' },
    { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 300, category: 'appetizer', image: 'https://images.unsplash.com/photo-1619531040576-f9416aabed02?w=300' },
    { name: 'Caesar Salad', description: 'Fresh romaine with caesar dressing', price: 400, category: 'side', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300' },
    { name: 'Tiramisu', description: 'Italian coffee-flavored dessert', price: 450, category: 'dessert', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300' },
    { name: 'Coca Cola', description: 'Chilled soft drink 500ml', price: 100, category: 'drink', image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300' }
  ],
  'Dragon Wok': [
    { name: 'Chicken Chow Mein', description: 'Stir-fried noodles with chicken and vegetables', price: 450, category: 'main', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300' },
    { name: 'Sweet & Sour Chicken', description: 'Crispy chicken in tangy sweet and sour sauce', price: 500, category: 'main', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300' },
    { name: 'Spring Rolls', description: 'Crispy vegetable spring rolls (4 pcs)', price: 250, category: 'appetizer', image: 'https://images.unsplash.com/photo-1548507200-e9e0e7e5394b?w=300' },
    { name: 'Egg Fried Rice', description: 'Wok-fried rice with eggs and scallions', price: 350, category: 'side', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
    { name: 'Mango Pudding', description: 'Silky mango flavored dessert', price: 200, category: 'dessert', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300' },
    { name: 'Green Tea', description: 'Traditional Chinese green tea', price: 150, category: 'drink', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=300' }
  ],
  'Burger Lab': [
    { name: 'Classic Smash Burger', description: 'Juicy beef patty with cheese and special sauce', price: 650, category: 'main', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
    { name: 'Double Stack Burger', description: 'Two beef patties stacked with double cheese', price: 900, category: 'main', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300' },
    { name: 'Loaded Fries', description: 'Crispy fries with cheese sauce and jalapeños', price: 350, category: 'side', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300' },
    { name: 'Chicken Wings', description: 'Buffalo-style crispy chicken wings (6 pcs)', price: 450, category: 'appetizer', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300' },
    { name: 'Chocolate Shake', description: 'Thick chocolate milkshake', price: 350, category: 'drink', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300' },
    { name: 'Brownie Sundae', description: 'Warm brownie with vanilla ice cream', price: 400, category: 'dessert', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300' }
  ],
  'Chai Khana': [
    { name: 'Doodh Patti Chai', description: 'Rich milk tea brewed to perfection', price: 120, category: 'drink', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300' },
    { name: 'Paratha Roll', description: 'Flaky paratha stuffed with spiced chicken', price: 250, category: 'main', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300' },
    { name: 'Samosa (2 pcs)', description: 'Crispy fried pastry with spiced potato filling', price: 100, category: 'appetizer', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
    { name: 'Dahi Bhalla', description: 'Lentil dumplings in spiced yogurt', price: 180, category: 'side', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=300' },
    { name: 'Gulab Jamun', description: 'Sweet milk dumplings in sugar syrup', price: 150, category: 'dessert', image: 'https://images.unsplash.com/photo-1666190020607-03f7f1094235?w=300' },
    { name: 'Kashmiri Chai', description: 'Pink tea with cardamom and nuts', price: 180, category: 'drink', image: 'https://images.unsplash.com/photo-1563639297067-26224d0e72da?w=300' }
  ]
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`✅ Inserted ${createdRestaurants.length} restaurants`);

    // Insert menu items for each restaurant
    let totalItems = 0;
    for (const restaurant of createdRestaurants) {
      const items = menuItemsMap[restaurant.name];
      if (items) {
        const itemsWithId = items.map(item => ({
          ...item,
          restaurantId: restaurant._id
        }));
        await MenuItem.insertMany(itemsWithId);
        totalItems += items.length;
      }
    }
    console.log(`✅ Inserted ${totalItems} menu items`);

    console.log('\n🎉 Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();

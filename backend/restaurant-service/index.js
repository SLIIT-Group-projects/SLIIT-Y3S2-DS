require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
 
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const restaurantRoutes = require('./routes/restaurant.routes');
const menuItemRoutes = require('./routes/menu.routes');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'));
app.listen(process.env.PORT, () => console.log('Restuarant service running on port 5004')
); 



app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuItemRoutes);

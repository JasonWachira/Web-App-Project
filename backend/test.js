require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected!'))
.catch(err => console.error('❌ Connection error:', err));



const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: __dirname + '/../.env' });

// Load models
const Temple = require('../models/Temple');
const User = require('../models/User');
const Testimonial = require('../models/Testimonial');
const Service = require('../models/Service');
const Content = require('../models/Content');

// Load data
const { temples, users, testimonials, services, seasonalEvent } = require('./data');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import into DB
const importData = async () => {
  try {
    await Temple.deleteMany();
    await User.deleteMany();
    await Testimonial.deleteMany();
    await Service.deleteMany();
    await Content.deleteMany();

    await Temple.create(temples);
    await User.create(users);
    await Testimonial.create(testimonials);
    await Service.create(services);
    await Content.create(seasonalEvent);


    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Temple.deleteMany();
    await User.deleteMany();
    await Testimonial.deleteMany();
    await Service.deleteMany();
    await Content.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}

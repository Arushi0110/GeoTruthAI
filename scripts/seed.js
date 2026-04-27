const mongoose = require('mongoose');
const News = require('../server/models/News');

mongoose.connect(process.env.MONGO_URI || 'mongodb://root:example@localhost:27017/geotruthai?authSource=admin');

const seedData = [
  { text: 'Breaking: Local election rigged!', location: { lat: 28.6139, lng: 77.2090 }, trustScore: 25 },
  { text: 'Weather forecast accurate', location: { lat: 40.7128, lng: -74.0060 }, trustScore: 85 },
  { text: 'Crypto crash incoming', location: { lat: 34.0522, lng: -118.2437 }, trustScore: 12 },
];

async function seed() {
  await News.deleteMany({});
  for (const data of seedData) {
    await new News(data).save();
  }
  console.log('✅ Seeded 3 demo news items');
  mongoose.disconnect();
}

seed();

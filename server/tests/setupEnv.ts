// Provide defaults for env vars used in tests
process.env.PORT = process.env.PORT || '0';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sublink_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

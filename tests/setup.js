jest.setTimeout(500000);

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

//So by default mongoose does not want to use its built in promise implementation and it
//wants you to tell it what implementation of promises we should use.
//So right here we're telling mongoose to make use of the node yes global promise object.
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });

//and we need to tell the jest to see this file forceablly and execute otherthings
//to do the above we define it inside package.json
// "jest":{
//     "setupTestFrameworkScriptFile":"./tests/setup.js"
//   },

//To test some js code use codepen.io
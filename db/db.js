const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI

//connecting to db

mongoose.connect(connectionString,{ useNewUrlParser: true,
                                    useUnifiedTopology: true,
                                    useCreateIndex: true,
                                    useFindAndModify: false
   });

//connection checks

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${connectionString}`);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });
  
  mongoose.connection.on('error', (err) => {
    console.log('Mongoose error: ', err);
  });
  



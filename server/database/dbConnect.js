const mongoose = require('mongoose')

const dbUri = process.env.MONGO_URI || 'mongodb://mongo_db:27017/letschat';

mongoose.connect(dbUri)
.then(()=>{
    console.log('mongodb connected');
})
.catch((err)=>{
    console.log('connection failed',err);
})

module.exports = mongoose
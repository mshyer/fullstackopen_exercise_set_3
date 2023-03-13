const mongoose = require('mongoose');

if (process.argv.length<3) {
  console.log('give password as argument');
  console.log('followed by a name and number to add a contanct');
}

const password = process.argv[2];

const dbName = 'phonebook_database';

const url = `mongodb+srv://mshy:${password}@cluster0.vxpxoyz.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Entry = mongoose.model('Entry', entrySchema);
const name = process.argv[3];
const number = process.argv[4];

// let promise;


if (name && number) {
  const entry = new Entry({
    name,
    number,
  });  
  entry.save().then(result => {
    console.log(`phonebook entry saved for ${name}: ${number}`);
    mongoose.connection.close();
  });
} else {
  Entry.find({}).then(result => { //finds all the entries
    console.log('phonebook:')
    result.forEach( entry => {
      console.log(entry)
    })
    mongoose.connection.close();
  });
}
'use strict';

const config = require('../config.json');
const MongoClient = require('mongodb').MongoClient;

class SaboteurDB {
  constructor(){
    this.db = MongoClient.connect(config.mongo, {useNewUrlParser: true})
      .then(db_client => {
	console.log('DB connected');
	return db_client.db();
      });
  }

  addInCollection(added={}, options={}, collection=config.db.game){
    this.db.then(d => d.collection(collection).insertOne(added, options));
  }

  deleteInCollection(filter={}, deleted={}, options={}, collection=config.db.game){
    this.db.then(d => d.collection(collection).deleteOne(filter, deleted, options));
  }

  updateInCollection(filter={}, updated={}, options={}, collection=config.db.game){
    this.db.then(d => d.collection(collection).updateOne(filter, updated, options));
  }
  
  register_message(message) {
    let filter = {
      channel: {
	id: message.channel.id,
	name: message.channel.name
      }
    };
    let updated = {
      $push:
      {
	message:
	{ 
	  content: message.content,
	  author: message.author.id,
	  date: Date(message.createdTimestamp),
	  id: message.id,
	  deleted: false,
	  edited: false
	}
      }
    };
    let options = {
      upsert: true
    };
    this.updateInCollection(filter, updated, options, config.db.log);  }
}

module.exports = SaboteurDB;


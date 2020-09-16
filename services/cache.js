const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');

//const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}){
    //This two values is created by us using this because we can use this value inside exec function
this.useCache = true; //This is equal to query instance blog.find() will create query instance
this.hashKey = JSON.stringify(options.key || '');

return this;
}

mongoose.Query.prototype.exec = async function (){
    //console.log('Im ABOUT TO RUN A QUERY');

    //If we directly assign this two to one object it will change the underline property
    // console.log(this.getQuery());
    // console.log(this.mongooseCollection.name); 
    
    //we can call above function by
    //this.useCache
    if(!this.useCache){
        return exec.apply(this, arguments);
    }

    //This will safetly copies one property to another
    //We are going to assign the getQuery() object and collection object to the empty object({})
    const key = JSON.stringify( Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    // See if we have a value for 'key' in redis
const cacheValue = await client.hget(this.hashKey, key);

    // If we do, return that
if(cacheValue){
    //console.log(this);
//const doc = new this.model(JSON.parse(cacheValue))

const doc = JSON.parse(cacheValue);

//If doc is array of records is array returns true if not returns false
   // Array.isArray(doc) ? its an array : its an Object;
   //its an array
   // we need to iterate and call this.model for each array to return doc instance
   //its an object
   //we can call this.model directly
   return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
}
    // Otherwise, issue the query and store the result in redis
const result = await exec.apply(this, arguments);
//console.log(result);
//console.log(result.validate);

//Redis HSET only accepts 3 arguments. If you want to store multiple keys in one call, you should use HMSET.
client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

return result
}


//forcely deleting the hashkey
module.exports = {
    clearHash(hashKey){
        client.del(JSON.stringify(hashKey));
    }
}
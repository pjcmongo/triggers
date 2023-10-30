exports = function(changeEvent) {
  
    // A Database Trigger will always call a function with a changeEvent.
    // Documentation on ChangeEvents: https://docs.mongodb.com/manual/reference/change-events/

    // Access the _id of the changed document:
    const docId = changeEvent.documentKey._id;

    // Access the latest version of the changed document
    // (with Full Document enabled for Insert, Update, and Replace operations):
    const fullDocument = changeEvent.fullDocument;

    const updateDescription = changeEvent.updateDescription;

    //See which fields were changed (if any):
    if (updateDescription) {
      const updatedFields = updateDescription.updatedFields; // A document containing updated fields
    }

    //See which fields were removed (if any):
    if (updateDescription) {
      const removedFields = updateDescription.removedFields; // An array of removed fields
    }

    // Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

    //Note: In Atlas Triggers, the service name is defaulted to the cluster name.

    //Call other named functions if they are defined in your application:
    //const result = context.functions.execute("function_name", arg1, arg2);

    //Access the default http client and execute a GET request:
    //const response = context.http.get({ url: <URL> })

    //Learn more about http client here: https://docs.mongodb.com/realm/functions/context/#context-http
    
    const mongodb = context.services.get("Cluster0");
    const db = mongodb.db("paul");
    const events_agg = db.collection("events_agg");
    
    query = {
      device: fullDocument['device'],
      event_count: {$lt:5}
    }

    // push an event, set min_num and max_num, increment event_count
    updates = {
      $push: {events: {time: fullDocument['time'], measurement: fullDocument['measurement']}}, 
      $min: {min_val: fullDocument['measurement']}, 
      $max: {max_val:fullDocument['measurement']}, 
      $inc:{event_count:1}}    
    
    // push to existing bucket or create new bucket (upsert) if requred
    const event = events_agg.updateOne(query, updates, {upsert: true});
    
    return JSON.stringify(event);
    




  
};

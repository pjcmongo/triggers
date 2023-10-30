exports = async function(changeEvent) {
  // A Database Trigger will always call a function with a changeEvent.
  // Documentation on ChangeEvents: https://docs.mongodb.com/manual/reference/change-events/

  // just adding comment here

  // This sample function will listen for events and replicate them to a collection in a different Database

  // Access the _id of the changed document:
  const docId = changeEvent.documentKey._id;
  
  const fullDocument = changeEvent.fullDocument;
  
  const mongodb = context.services.get("Cluster0");
  const db = mongodb.db("paul");
  const events = db.collection("events");
  
  const events_agg2 = db.collection("events_agg2");


// the following works
/*
    const pipeline = [
      { $match: {device:fullDocument['device']} },
      { $sortByCount:"$device" } ];
                    //, {
          //  $merge: { into: {db:"paul", coll:"events_agg2"}, on: "_id", whenMatched: "replace", whenNotMatched: "insert" }
          //}

    const aggCount = await events.aggregate(pipeline).toArray();
    
    query = { device: aggCount[0]._id}
    updates = {$set: {count: aggCount[0].count} }
    
    const event = events_agg2.updateOne(query, updates, {upsert: true});
    
    return(JSON.stringify(event));
*/    
    
    
  // Get the "FullDocument" present in the Insert/Replace/Update ChangeEvents
  //try {
    // If this is a "delete" event, delete the document in the other collection
    //if (changeEvent.operationType === "delete") {
    //  await collection.deleteOne({"_id": docId});
    //}

    // If this is an "insert" event, insert the document into the other collection
    //else if (changeEvent.operationType === "insert") {
      //await collection.insertOne(changeEvent.fullDocument);
   const pipeline = [
        { $sortByCount:"$device" } ,
        { $merge: { into: {db:"paul", coll:"events_agg2"}, on: "_id", whenMatched: "replace", whenNotMatched: "insert" } }
   ];

   const out = await events.aggregate(pipeline).toArray();

   return JSON.stringify(out);
      
    //}

    // If this is an "update" or "replace" event, then replace the document in the other collection
    //else if (changeEvent.operationType === "update" || changeEvent.operationType === "replace") {
    //  await collection.replaceOne({"_id": docId}, changeEvent.fullDocument);
    //}
  //} catch(err) {
  //  console.log("error performing mongodb write: ", err.message);
  //}
};

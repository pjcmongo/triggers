exports = function() {
   const mongodb = context.services.get("Cluster0");
   const db = mongodb.db("paul");
   const events = db.collection("events");
   const event = events.insertOne(
      {
            device: Math.floor(Math.random() * 10) + 1,
            time: new Date(),
            measurement: Math.random() * 100,
            type: "event"
      }
   );
   return JSON.stringify(event);
};

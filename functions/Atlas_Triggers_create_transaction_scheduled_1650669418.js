exports = function() {
  /*
    A Scheduled Trigger will always call a function without arguments.
    Documentation on Triggers: https://docs.mongodb.com/realm/triggers/overview/

    Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

    Access a mongodb service:
    const collection = context.services.get(<SERVICE_NAME>).db("db_name").collection("coll_name");
    const doc = collection.findOne({ name: "mongodb" });

    Note: In Atlas Triggers, the service name is defaulted to the cluster name.

    Call other named functions if they are defined in your application:
    const result = context.functions.execute("function_name", arg1, arg2);

    Access the default http client and execute a GET request:
    const response = context.http.get({ url: <URL> })

    Learn more about http client here: https://docs.mongodb.com/realm/functions/context/#context-http
  */
   const mongodb = context.services.get("Cluster0");
   const db = mongodb.db("3x");
   const events = db.collection("transactions");
   const currentDate = new Date()
   const event = events.insertOne(
      {
            transactionId: Math.floor(Math.random()*10000),
            transactionDate: currentDate,
            total: (Math.random()*100).toFixed(2),
            type: "valid"
      }
   );
   return JSON.stringify(event);
};

exports = function () {

   const datalake = context.services.get("DataLake0");
   const db = datalake.db("atlas");
   const events = db.collection("events_live");

   const pipeline = [
      {
            $match: {
               "time": {
                  $gt: new Date(Date.now() - 60 * 60 * 1000),
                  $lt: new Date(Date.now())
               }
            }
      }, {
            "$out": {
               "s3": {
                  "bucket": "pjc-s3-bucket",
                  "region": "us-west-2",
                  "filename": "events/events_s3",
                  "format": {
                        "name": "parquet",
                        "maxFileSize": "10GB",
                        "maxRowGroupSize": "100MB"
                  }
               }
            }
      }
   ];

   return events.aggregate(pipeline);
};
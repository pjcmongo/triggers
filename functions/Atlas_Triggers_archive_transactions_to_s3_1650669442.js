exports = function () {

   const datalake = context.services.get("DataLake0");
   const db = datalake.db("atlas");
   const transactions = db.collection("transactions_live");
   
   const atlasCluster = context.services.get("Cluster0");
   const atlasDb = atlasCluster.db("3x");
   const atlasTransactions = atlasDb.collection("transactions");   
   
   const now = Date.now();
   
   console.log("delete from live");
   atlasTransactions.deleteMany({"transactionDate": {$lt: new Date(now - 2 * 60 * 60 * 1000)}})
   .then(res => {
     console.log("deleted from live",res);
   })
   .catch(err => {
     console.log("error deleting from live",err);
   });
   
   
   // set archive all docs more than 1 hour old
   // 1 hour = 60*60*1000 = 3,600,000 msec

   const pipeline = [
      {
            $match: {
               "transactionDate": {
                  $lt: new Date(now - 60 * 60 * 1000)
               }
            }
      }, {
            "$out": {
               "s3": {
                  "bucket": "pjc-s3-bucket",
                  "region": "us-west-2",
                  "filename": {
                    "$concat": [
                      "archived_transactions/",
                      {
                        "$toString": "$transactionId"
                      }
                    ]
                  },
                  "format": {
                        "name": "json",
                        "maxFileSize": "10MiB"
                  }
               }
            }
      }
   ];

   try {
    console.log("copying to archive");
    return transactions.aggregate(pipeline);
    //.then(res => {
    //  console.log("completed copying to archive");
    //})
    //.catch(err => {
    //  console.log("error copying to archive",err);
    //});
   } catch (error) {
     console.log("error",error);
     throwError(res,error);
     return;
   }
};

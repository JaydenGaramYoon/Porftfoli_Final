import mongoose from "mongoose";
mongoose.connect('mongodb+srv://rkfka9536:dbs3508%21@cluster.vmhdsec.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
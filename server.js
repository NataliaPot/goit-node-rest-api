import mongoose from "mongoose";

import { app } from "./app.js";

const DB_HOST =
  "mongodb+srv://Natalia:XKnU1VphJwFDI3JF@cluster0.dwcsg2o.mongodb.net/contacts_reader?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

// const { DB_HOST, PORT = 3000 } = process.env;

// mongoose.set("strictQuery", true);

// mongoose
//   .connect(DB_HOST)
//   .then(() => {
//     app.listen(PORT);
//   })
//   .catch((error) => {
//     console.log(error.message);
//     process.exit(1);
//   });

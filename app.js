import express from 'express';
import mongoose from 'mongoose';

const app = express();

app.use("/health", (req, res, next) => {
    console.log("Incoming v1/health");
    res.status(200).json({message: "social media service is up and running"});
});

mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
        console.log("MongoDB is connected");
    }).catch((err) => {
        console.log(err);
    });

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
})
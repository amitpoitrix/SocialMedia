import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.routes.js'

const app = express();

app.use(express.json());

app.use("/health", (req, res, next) => {
    console.log("Incoming /health endpoint");

    return res.status(200).json({message: "Social Media service is up and running and is resilient"});
});

app.use("/v1/user", userRouter);

mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
        console.log("MongoDB is connected");
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
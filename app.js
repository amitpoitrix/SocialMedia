import express from 'express';

const app = express();

app.use("/health", (req, res, next) => {
    res.status(200).json({message: "social media service is up and running"});
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
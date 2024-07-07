import { Router } from 'express';
import { getAllUser, signUp, signIn } from '../controllers/user.controller.js';

const userRouter = Router();

// routers.route("/fetchAllUsers").get(getAllUser);
userRouter.get("/fetchAllUsers", getAllUser);
userRouter.post("/signUp", signUp);
userRouter.post("/signIn", signIn);

export default userRouter;
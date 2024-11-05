import { Router } from "express";
import userRouter from "./user.routes.js";
import { AccountRouter } from "./account.routes.js";

export const mainRouter=Router()

mainRouter.use("/user",userRouter);
mainRouter.use("/account",AccountRouter);
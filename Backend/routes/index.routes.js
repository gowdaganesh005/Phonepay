import { Router } from "express";
import userRouter from "./user.routes.js";

export const mainRouter=Router()

mainRouter.use("/user",userRouter);
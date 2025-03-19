import { Router } from "express";
import { UserController } from "../controllers/users.js";

export const userRouter = Router();

userRouter.get("/", UserController.getAllUsers);
userRouter.get("/:id", UserController.getUserById);
userRouter.post("/", UserController.createUser);
userRouter.put("/:id", UserController.updateUser);
userRouter.delete("/:id", UserController.deleteUser);



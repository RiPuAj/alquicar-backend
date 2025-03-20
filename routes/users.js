import { Router } from "express";
import { UserController } from "../controllers/users.js";

export const createUserRouter = ({userModel}) => {

    const userRouter = Router();
    const userController = new UserController({userModel});

    userRouter.get("/", userController.getAll);
    userRouter.get("/:id", userController.getById);
    userRouter.post("/", userController.create);
    userRouter.patch("/:id", userController.update);
    userRouter.delete("/:id", userController.delete);

    

    return userRouter;
};




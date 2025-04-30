import { Router } from "express";
import { UserController } from "../controllers/users.js";
import { authMiddleware } from "../middlewares/auth.js";

export const createUserRouter = ({userModel}) => {

    const userRouter = Router();
    const userController = new UserController({userModel});

    userRouter.get("/", userController.getAll);
    userRouter.get("/getdata", userController.getData)
    userRouter.get("/:id", authMiddleware, userController.getById);
    userRouter.get("/email/:email", userController.getByEmail);
    userRouter.post("/", userController.create);
    userRouter.patch("/:id", authMiddleware, userController.update);
    userRouter.delete("/:id", authMiddleware, userController.delete);

    

    return userRouter;
};




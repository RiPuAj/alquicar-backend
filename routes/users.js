import { Router } from "express";
import { UserController } from "../controllers/users.js";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware, adminOrSelfMiddleware } from "../middlewares/admin.js";

export const createUserRouter = ({userModel}) => {

    const userRouter = Router();
    const userController = new UserController({userModel});

    userRouter.get("/", [authMiddleware, adminMiddleware] , userController.getAll);
    userRouter.get("/getdata", userController.getData)
    userRouter.get("/:id", [authMiddleware, adminOrSelfMiddleware], userController.getById);
    userRouter.get("/email/:email", userController.getByEmail);
    userRouter.post("/", userController.create);
    userRouter.patch("/:id", [authMiddleware, adminOrSelfMiddleware], userController.update);
    userRouter.delete("/:id", [authMiddleware, adminOrSelfMiddleware], userController.delete);

    

    return userRouter;
};




import {UserController} from "./UserController";
import {userRepo} from "../repositories";
import {ChatController} from "./ChatController";
import {AuthController} from "./AuthController";
import {authService} from "../services";

export const userController = new UserController(userRepo);
export const chatController = new ChatController();
export const authController = new AuthController(authService);

import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { GetUserById, UserCreateInput, UserLoginInput } from "../types/user.js";

export class UserController {
  static async register(req: Request<{}, {}, UserCreateInput>, res: Response) {
    try {
      const user = await UserService.createUser(req.body);
      const token = UserService.generateToken(user.id);
      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async login(req: Request<{}, {}, UserLoginInput>, res: Response) {
    try {
      const user = await UserService.loginUser(req.body);
      const token = UserService.generateToken(user.id);
      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async userData(req: Request<{}, {}, GetUserById>, res: Response) {
    console.log("req.body", req.body);
    try {
      const user = await UserService.getUser(req.body);
      console.log("foundd", user);

      res.json({ user });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static health(_req: Request, res: Response) {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  }
}

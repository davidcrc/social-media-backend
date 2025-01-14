import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { UserCreateInput, UserLoginInput } from "../types/user.js";
import { AuthStateService } from "./auth.service.js";

const prisma = new PrismaClient();
const authStateService = new AuthStateService();

export class UserService {
  static async createUser(data: UserCreateInput): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        app_metadata: JSON.stringify({
          provider: "email",
          providers: ["email"],
        }),
      },
    });

    const token = this.generateToken(user.id);
    await authStateService.handleAuthChange("SIGNED_IN", { user, token });

    return user;
  }

  static async loginUser(data: UserLoginInput): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { last_sign_in_at: new Date() },
    });

    const token = this.generateToken(user.id);
    await authStateService.handleAuthChange("SIGNED_IN", { user, token });

    return user;
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, "your-secret-key");
  }

  static onAuthStateChange =
    authStateService.onAuthStateChange.bind(authStateService);
}

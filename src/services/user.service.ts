import { PrismaClient, User, UserMetaData } from "@prisma/client";
import jwt from "jsonwebtoken";
import { GetUserById, UserCreateInput, UserLoginInput } from "../types/user.js";
import { AuthStateService } from "./auth.service.js";

const prisma = new PrismaClient();
const authStateService = new AuthStateService();

export class UserService {
  static async createUser(data: UserCreateInput): Promise<UserMetaData> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await prisma.userMetaData.create({
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

  static async loginUser(data: UserLoginInput): Promise<UserMetaData> {
    const user = await prisma.userMetaData.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.userMetaData.update({
      where: { id: user.id },
      data: { last_sign_in_at: new Date() },
    });

    const token = this.generateToken(user.id);
    await authStateService.handleAuthChange("SIGNED_IN", { user, token });

    return user;
  }

  static async getUser(data: GetUserById): Promise<User> {
    const userMetaData = await prisma.userMetaData.findUnique({
      where: { id: data.userId },
      include: { user: true },
    });

    console.log("waaa", userMetaData);
    if (!userMetaData || !userMetaData.userId || !userMetaData.user) {
      throw new Error("User not found");
    }

    return userMetaData.user;
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, "your-secret-key");
  }

  static onAuthStateChange =
    authStateService.onAuthStateChange.bind(authStateService);
}

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
export class UserService {
    static async createUser(data) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser) {
            throw new Error('User already exists');
        }
        return prisma.user.create({
            data: {
                email: data.email,
                app_metadata: JSON.stringify({
                    provider: 'email',
                    providers: ['email']
                })
            }
        });
    }
    static async loginUser(data) {
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            throw new Error('User not found');
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { last_sign_in_at: new Date() }
        });
        return user;
    }
    static generateToken(userId) {
        return jwt.sign({ userId }, 'your-secret-key');
    }
}

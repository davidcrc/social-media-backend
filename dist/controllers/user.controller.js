import { UserService } from '../services/user.service.js';
export class UserController {
    static async register(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            const token = UserService.generateToken(user.id);
            res.json({ user, token });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const user = await UserService.loginUser(req.body);
            const token = UserService.generateToken(user.id);
            res.json({ user, token });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static health(_req, res) {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    }
}

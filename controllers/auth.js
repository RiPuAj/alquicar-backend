import { UserModel } from '../models/mysql/users.js';
import { registerSchema } from '../schemas/auth.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export class AuthController {
  static async register(req, res) {
    const { error } = registerSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.details[0].message });
    const { email, password } = req.body;

    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ email, password: hashedPassword });

      res.status(201).json({ message: 'Usuario registrado', user });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error al registrar usuario' });
    }
  }

  static async login(req, res) {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { email, password } = req.body;
    try {
      var user = await UserModel.getByEmailWithPass({email});
      console.log(password, user.password);
      if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

      var isMatch = await bcrypt.compare(password, user.password);
      isMatch = password === user.password;
      if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error en el login' });
    }
  }
}

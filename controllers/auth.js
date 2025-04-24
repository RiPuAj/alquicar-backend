import { UserModel } from '../models/mysql/users.js';
import { registerSchema } from '../schemas/auth.js'
import { loginSchema } from '../schemas/auth.js';
import { AuthModel } from '../models/mysql/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // tu correo
    pass: process.env.EMAIL_PASS  // una contraseña de aplicación
  }
});


const JWT_SECRET = process.env.JWT_SECRET;


export class AuthController {
  static async register(req, res) {
    const { error } = registerSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.details[0].message });
    const {name, email, password, address, phone, dni} = req.body;

    try {
      const existingUser = await UserModel.getByEmail({email});
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        input: {
          name: name,
          email: email,
          password: hashedPassword,
          address: address,
          phone: phone,
          role: 'user', // o lo que corresponda
          dni: dni
        }
      });
      const token = jwt.sign({ id: user.user[0].id }, JWT_SECRET, { expiresIn: '1h' });
      console.log(user.user[0]);
      await transporter.sendMail({
        from: '"Alquicar" <alquicar03@gmail.com>',
        to: user.user[0].email,
        subject: 'Confirma tu correo',
        html: `
          <h3>Hola ${user.user[0].name}</h3>
          <p>Gracias por registrarte. Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
          <a href="https://localhost:3000/auth/verify?token=${token}">Confirmar cuenta</a>
        `
      });
      res.status(201).json({ message: 'Usuario registrado', user });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error al registrar usuario' });
    }
  }

  static async login(req, res) {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { email, password } = req.body;
    try {
      var user = await UserModel.getByEmailWithPass({email});
      if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
      await AuthController.createSession(user, token);
      res.json({ token });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error en el login' });
    }
  }
  static async verify(req, res){
    const { token } = req.query;
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (id){
        res.status(200).json({ message: 'Cuenta confirmada correctamente' });
      }
      res.status(400).json({ message: 'fallo en la verificación' });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: 'Token inválido o expirado' });
    }
  }
  static async createSession(user, token){
    AuthModel.createSession({user, token});

  }
}

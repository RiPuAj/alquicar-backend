import bcrypt from 'bcryptjs';
import { validateUser, validatePartialUser } from '../schemas/user.js';
import { catchAndResponseError } from '../errors/handler-error.js';
import { EmailSender } from '../services/emailSender.js';
import { MediaModel } from '../models/mysql/media.js'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER, // tu correo
    pass: process.env.EMAIL_PASS  // una contraseña de aplicación
  }
});


const JWT_SECRET = process.env.JWT_SECRET;

/*export class AuthController {
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
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
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
}*/


export class AuthController {

  constructor({ userModel }) {
    this.userModel = userModel;
  }

  register = async (req, res) => {

    const userRequest = { ...req.body, role: 'user' };
    const validationUser = validateUser(userRequest);

    if (!validationUser.success) {
      return res.status(400).json({ error: JSON.parse(validationUser.error.message) });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userWithHashedPassword = {
      ...userRequest,
      password: hashedPassword,
    }

    try {

      const response = await this.userModel.create({ input: userWithHashedPassword });

      EmailSender.sendConfirmationEmail({
        email: response.user[0].email,
        name: response.user[0].name,
        token: this.createToken({ id: response.user[0].id, role: response.user[0].role })
      });
      res.status(201).json({message: 'Usuario registrado, falta verificación de correo'});	

    } catch (error) {
      catchAndResponseError(error, res);
    }
  }

  login = async (req, res) => {

    try {
      const user = await this.userModel.getByEmailWithPass({ email: req.body.email });


      if (!user) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }

      const passwordComparation = await bcrypt.compare(req.body.password, user.password);

      if (!passwordComparation) res.status(401).json({ error: 'Contraseña incorrecta' });
      
      if(!user.isVerified) {
        return res.status(401).json({ error: 'Usuario no verificado' });
      }

      const token = this.createToken({ id: user.id, role: user.role });


      res.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      }).send(
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone,
            role: user.role,
            dni: user.dni
          },
          token,
        }
      );

    } catch (error) {
      catchAndResponseError(error, res);
    }
  }

  logout = async (req, res) => {
    try {
      res.clearCookie('access_token').status(200).json({ message: 'Sesión cerrada' });
    } catch (error) {
      catchAndResponseError(error, res);
    }
  }

  verifyAccount = async (req, res) =>{
    const token = req.query.token;
    if (!token) return res.status(400).json({ error: 'Token no proporcionado' });

    const decoded = jwt.decode(token, JWT_SECRET);
    if (!decoded) return res.status(400).json({ error: 'Token inválido' });

    const { id } = decoded;
    
    try {
        const response = await this.userModel.update({ id, input: { isVerified: true } });
        const input = {id};
        await MediaModel.create({ input });
        res.status(200).json({ message: 'Usuario verificado' });
    } catch (error) {
      catchAndResponseError(error, res);
    }
    
  }

  isAuthenticated = async (req, res) => {
    const token = req.cookies.access_token;

    if (!token) return res.status(401).json({ error: 'No autenticado' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await this.userModel.getById({ id: decoded.id });
      if (!user) return res.status(401).json({ error: 'No autenticado' });
      res.status(200).json({ user: user });
      
    } catch (error) {
      catchAndResponseError(error, res);
    }
  }

  createToken = ({ id, role }) => {
    return jwt.sign({ id: id, role: role }, JWT_SECRET, { expiresIn: '1d' });
  }

}


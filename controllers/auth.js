import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateUser, validatePartialUser } from '../schemas/user.js';
import { catchAndResponseError } from '../errors/handler-error.js';

const JWT_SECRET = process.env.JWT_SECRET;

/*export class AuthController {
  static async register(req, res) {
    const { error } = registerSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.details[0].message });
    const {name, email, password, address, phone, dni} = req.body;

    try {
      const existingUser = await UserModel.getByEmail({email});
      console.log(existingUser)
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

      const user = await this.userModel.create({ input: userWithHashedPassword });
      res.status(201).json(user);

    } catch (error) {
      catchAndResponseError(error, res);
    }
  }

  login = async (req, res) => {

    const validationUser = validatePartialUser(req.body);

    if (!validationUser.success) {
      return res.status(400).json({ error: JSON.parse(validationUser.error.message) });
    }

    try {
      const user = await this.userModel.getByEmailWithPass({ email: req.body.email });


      if (!user) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }

      const passwordComparation = await bcrypt.compare(req.body.password, user.password);

      if (!passwordComparation) res.status(401).json({ error: 'Contraseña incorrecta' });

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });


      res.cookie('access_token', token, {
        httpOnly: true,
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

}


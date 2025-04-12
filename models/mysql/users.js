import { handlerDatabaseError } from '../../errors/handler-error.js';
import { CreateMYSQLConnection } from './mysql-config.js';
import { parseUUIDToBuffer, parseBufferToUUID } from '../../utils/uuid-utils.js'; // utilidades que definimos abajo

const conn = await CreateMYSQLConnection.getConncetion();

export class UserModel {
  static async getAll() {
    try {
      const [users] = await conn.query(
        'SELECT id, name, email, address, phone, role, dni FROM users'
      );
      return users.map(user => ({
        ...user,
        id: parseBufferToUUID(user.id)
      }));
    } catch (e) {
      console.log(e);
      throw new DatabaseError('Error getting all users');
    }
  }

  static async getById({ id }) {
    try {
      const [user] = await conn.query(
        'SELECT id, name, email, address, phone, role, dni FROM users WHERE id = ?',
        [parseUUIDToBuffer(id)]
      );
      if (!user.length) return null;
      return {
        ...user[0],
        id: parseBufferToUUID(user[0].id)
      };
    } catch (e) {
      console.log(e);
      throw new DatabaseError('Error getting user');
    }
  }

  static async getByEmail({ email }) {
    try {
      const [users] = await conn.query(
        'SELECT id, name, email, address, phone, role, dni FROM users WHERE email = ?',
        [email]
      );
      return users.map(user => ({
        ...user,
        id: parseBufferToUUID(user.id)
      }));
    } catch (e) {
      console.log(e);
      throw new DatabaseError('Error getting user');
    }
  }

  static async create({ input }) {
    const { name, email, password, address, phone, role, dni } = input;
    let { id } = input;

    if (!id) {
      const [uuidResult] = await conn.query('SELECT UUID() AS id');
      id = uuidResult[0].id;
    }

    try {
      await conn.query(
        `INSERT INTO users (id, name, email, password, address, phone, role, dni)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parseUUIDToBuffer(id),
          name,
          email,
          password,
          address,
          phone,
          role,
          dni
        ]
      );

      const user = await UserModel.getById({ id });
      return { success: true, message: 'User created', user };
    } catch (e) {
      console.log(e.code);
      handlerDatabaseError({ err: e });
    }
  }

  static async update({ id, input }) {
    const fields = Object.keys(input);
    const values = Object.values(input);
    const updates = fields.map(field => `${field} = ?`).join(', ');

    try {
      await conn.query(
        `UPDATE users SET ${updates} WHERE id = ?`,
        [...values, parseUUIDToBuffer(id)]
      );
    } catch (e) {
      console.log(e);
      handlerDatabaseError({ err: { message: 'Error updating user' } });
    }

    return await UserModel.getById({ id });
  }

  static async delete({ id }) {
    try {
      return await conn.query('DELETE FROM users WHERE id = ?', [parseUUIDToBuffer(id)]);
    } catch (e) {
      handlerDatabaseError({ err: { message: 'Error deleting user' } });
    }
  }
}

import { handlerDatabaseError } from '../../errors/handler-error.js';
import { CreateMYSQLConnection } from './connectionCreater.js';
import { v4 as uuidv4, parse, stringify } from 'uuid';
const conn = await CreateMYSQLConnection.getConncetion();
export class UserModel{
    static async getAll(){

        try{

            const [users, tableInfo] = await conn.query('SELECT BIN_TO_UUID(id) id, name, email, address, phone, role, dni FROM users');
            return users;

        }catch(e){
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting all users');
        }

        
    }
    static async getData({token}){
        try{
            const [session] = await conn.query("SELECT * from sessions WHERE sessionid = ?", [token]);
            const id = stringify(session[0].user_id);
            const data = await this.getById({id});
            return data;
        }catch (e){
            console.log(e);
        }
    }
            
    static async getById({id}){
        
        try{

            const [user, tableInfo] = await conn.query(
                'SELECT BIN_TO_UUID(id) id, name, email, address, phone, role, dni FROM users WHERE id = UUID_TO_BIN(?)', [id]);
            return user;

        }catch(e){
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting user');
        }

        
    }

    static async getByEmail({email}){

        try{

            const [users, tableInfo] = await conn.query(
                'SELECT BIN_TO_UUID(id) AS id, name, email, address, phone, role, dni FROM users WHERE email = ?',  [email]);
            return users[0];

        }catch(e){
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting user');
        }
    }
    static async getByEmailWithPass({email}){

        try{

            const [users, tableInfo] = await conn.query(
                'SELECT BIN_TO_UUID(id) AS id, name, email, password, address, phone, role, dni, isVerified FROM users WHERE email = ?',  [email]);
            return users[0];

        }catch(e){
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting user');
        }
    }
    
    static async create({input}){

        // TODO Hacer cuando ya esté en uso el correo
        // TODO Hacer cuando ya esté en uso el dni
        // TODO Hacer cuando ya esté en uso el teléfono

        // TODO Implementar las contraseñas encriptadas

        const {
            name,
            email,
            password,
            address,
            phone,
            role,
            dni
        } = input;
    
        let {id} = input; 
    
        if (!id) {
            // Si no hay ID, generar uno desde la base de datos
            const [uuidResult] = await conn.query('SELECT UUID() AS id');
            id = uuidResult[0].id;
        }

        try{
            console.log(id, name, email, password, address, phone, role, dni);
            await conn.query(`
                INSERT INTO users (id, name, email, password, address, phone, role, dni)
                VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?)`, [id, name, email, password, address, phone, role, dni]);

            const user = await UserModel.getById({id});
            return {success: true, message: 'User created', user: user};

        } catch(e){
            console.log(e);
            console.log(e.code);
            //TODO: manejar error
            handlerDatabaseError({error: e});            
        }
        
    }
    
    static async update({id, input}){

        //TODO Hacer cuando ya esté en uso el correo
        //TODO Hacer cuando ya esté en uso el dni
        //TODO Hacer cuando ya esté en uso el teléfono
        

        const fields = Object.keys(input);
        const values = Object.values(input);
        const updates = fields.map((field, index) => `${field} = ?`).join(', ');

        try{
            const [result] = await conn.query(
                `UPDATE users SET ${updates} WHERE id = UUID_TO_BIN(?)`, [...values, id]);
        }catch(e){
            console.log(e);
            handlerDatabaseError({error: {message: 'Error updating user'}});
            //TODO: manejar error
        } 
        
        const userUpdated = UserModel.getById({id});
    
        return userUpdated;
    }
    
    static async delete({id}){

        try{

            const res = await conn.query('DELETE FROM users WHERE id = UUID_TO_BIN(?)', [id]);
            return res;
        
        } catch(e){
            // TODO Manejar error
            handlerDatabaseError({error: {message: 'Error deleting user'}});
        }

    }
}
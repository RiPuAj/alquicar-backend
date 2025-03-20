import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}

const conn = await mysql.createConnection(config);


export class UserModel{
    static async getAll(){

        try{

            const [users, tableInfo] = await conn.query('SELECT BIN_TO_UUID(id) id, name, email, address, phone, rol, dni FROM users');
            return users;

        }catch(e){
            // TODO Manejar error
            console.log(e);
        }

        
    }
            
    static async getById({id}){
        
        try{

            const [user, tableInfo] = await conn.query(
                'SELECT BIN_TO_UUID(id) id, name, email, address, phone, rol, dni FROM users WHERE id = UUID_TO_BIN(?)', [id]);
            return user;

        }catch(e){
            // TODO Manejar error
            console.log(e);
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
            rol,
            dni
        } = input;
    
        let {id} = input; 
    
        if (!id) {
            // Si no hay ID, generar uno desde la base de datos
            const [uuidResult] = await conn.query('SELECT UUID() AS id');
            id = uuidResult[0].id;
        }

        try{
            await conn.query(`
                INSERT INTO users (id, name, email, password, address, phone, rol, dni)
                VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?)`, [id, name, email, password, address, phone, rol, dni]);
            
            return {success: true, message: 'User created', id};

        } catch(e){
            console.log(e);
            //TODO: manejar error
            return {success: false, message: 'Error in user creation'}; 
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
            console.log(e);
        }

    }
}
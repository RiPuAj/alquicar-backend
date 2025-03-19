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
    static async getAllUsers(){
        const [users, tableInfo] = await conn.query('SELECT * FROM users');
        console.log(users);
        return users;
    }
            
    static async getUserById(id){}
}
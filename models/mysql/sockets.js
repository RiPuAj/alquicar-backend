import { CreateMYSQLConnection } from "./connectionCreater.js";
import{ DatabaseError } from "../../errors/database-error.js";

const conn = await CreateMYSQLConnection.getConncetion();

export class SocketsModel{
    static async getAll(){
        try{
            const [sockets, tableInfo] = await conn.query('SELECT * FROM sockets');
            return sockets;
        }catch(e){
            // TODO Manejar error

            throw new DatabaseError('Error getting all sockets');
        }
    }

    static async getById({id}){
        try{
            const [sockets, tableInfo] = await conn.query('SELECT socket_id FROM sockets WHERE user_id = UUID_TO_BIN(?)', [id]);
            return sockets[0];
        }catch(e){
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting socket by id');
        }
    }

    static async create({input}){
        try{
            const [sockets, tableInfo] = await conn.query('INSERT INTO sockets (socket_id, user_id, last_connection) VALUES (?, UUID_TO_BIN(?), NOW())', [input.socket_id, input.user_id]);
            return sockets[0];
        }catch(e){
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error creating socket');
        }
    }

    static async update({id, socket_id}){
        try{
            const [sockets, tableInfo] = await conn.query('UPDATE sockets SET socket_id = ?, last_connection = NOW() WHERE user_id = UUID_TO_BIN(?)', [socket_id, id]);
            return sockets[0];
        }catch(e){
            // TODO Manejar error
            throw new DatabaseError('Error updating socket');
        }
    }

}
import { catchAndResponseError } from "../errors/handler-error.js";

export class SocketsController {
    constructor({ socketModel }) {
        this.socketModel = socketModel;
    }

    create = async ({user_id, socket_id}) => {
        
        try{
            const existSocket = await this.socketModel.getById({id: user_id});
            if (!existSocket){
                const newSocket = await this.socketModel.create({input: {socket_id: socket_id, user_id: user_id}});
                return newSocket;
            } else {
                const updatedSocket = await this.socketModel.update({id: user_id, socket_id: socket_id});
                return updatedSocket;
            }
        } catch(e){
            catchAndResponseError({error: e, message: 'Error creating socket by user id'});
        }
    }

    getSocketIdByUserId = async ({id}) => {
        try{
            const existSocket = await this.socketModel.getById({id: id});
            return existSocket;
        } catch(e){
            console.log(e);
            catchAndResponseError({error: e, message: 'Error getting socket by user id'});
        }
    }
}
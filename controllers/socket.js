export class SocketsController {
    constructor({ socketModel }) {
        this.socketModel = socketModel;
    }

    create = async ({user_id}) => {
        
        try{
            const existSocket = await this.socketModel.getById({id: user_id});
            console.log(existSocket);
        } catch(e){
            console.log(e);
        }
    }
}
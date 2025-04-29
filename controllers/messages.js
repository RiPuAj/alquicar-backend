import { validateMessage } from "../schemas/message.js";

export class MessagesController{

    constructor({ messagesModel }){
        this.messagesModel = messagesModel;
    }
    
    create = async ({input}) =>{
        const validationMessage = validateMessage(input);
        if(!validationMessage.success){
            return {error: JSON.parse(validationMessage.error.message)};
        }
        try{
            await this.messagesModel.create({input});
        }catch(e){
            console.log(e);
            throw new Error('Error en el envio de mensaje');
        }
    }
}
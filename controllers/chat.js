export class ChatController {

    constructor({ chatModel }) {
        this.chatModel = chatModel;
    }

    getAllMyChats = async ({ id }) => {
        try {
            const chatsAsCustomer = await this.chatModel.getAllMyChatsAsCustomer({ id: id });
            const chatsAsOwner = await this.chatModel.getAllMyChatsAsOwner({ id: id });
            //const chats = [...chatsAsCustomer, ...chatsAsOwner];

            const uniqueOwner = chatsAsOwner.filter(
                o => !chatsAsCustomer.some(c => c.contact_id === o.contact_id)
            );
            const chats = [...chatsAsCustomer, ...uniqueOwner];

            return chats;
        } catch (error) {
            //TODO Manejar error
            console.log(error);
            return { error: 'Error al obtener los chats' };
        }
    };

    createMessage = async ({ newMessage }) => {
        try {
            const response = await this.chatModel.createMessage({ newMessage });
            return response;

        } catch (error) {
            //TODO Manejar error
            console.log(error);
            return { error: 'Error al enviar el mensaje' };
        }
    };

    getSocketIdByUserId = async ({ id }) => {
        try {
            const existSocket = await this.chatModel.getSocketIdByUserId({ id: id });
            return existSocket.socket_id;
        } catch (error) {
            //TODO Manejar error
            console.log(error);
            return { error: 'Error al obtener el socket' };
        }
    };

    getMessageById = async ({ id }) => {
        try {
            const message = await this.chatModel.getMessageById({ id: id });
            return message;
        } catch (error) {
            //TODO Manejar error
            console.log(error);
            return { error: 'Error al obtener el mensaje' };
        }
    }
}
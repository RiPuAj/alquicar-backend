export class ChatController {

    constructor({ chatModel }) {
        this.chatModel = chatModel;
    }

    getAllMyChats = async (req, res) => {
        try {
            const chats = await this.chatModel.getAllMyChatsAsCustomer({id: req.user_info.id});
            res.status(200).json(chats);
        } catch (error) {
            //TODO Manejar error
            console.log(error);
            res.status(500).json({ error: 'Error fetching chats' });
        }
    };
}
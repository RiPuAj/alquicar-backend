import { MessagesController } from "../controllers/messages.js";

export const createMessagesEvents = ({ io, messagesModel }) => {
    const messagesController = new MessagesController({ messagesModel: messagesModel });

    io.on("send message", async (data) => {
        try {
            const { from_id, to_id, message } = data;
            console.log("Mensaje recibido", data);
            await messagesController.create({ input: { from_id, to_id, message } });
            io.emit("message sent", { from_id, to_id, message });
        } catch (e) {

            io.emit("error", { error: "Error en el envio de mensaje" });
        }
    });

}
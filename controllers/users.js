import { validateUser, validatePartialUser } from '../schemas/user.js';

export class UserController {

    constructor({ userModel }) {
        this.userModel = userModel;
    }


    getAll = async (req, res) => {

        try{
            const allUsers = await this.userModel.getAll();
            return res.json(allUsers);
        } catch (e) {
            if (e instanceof DatabaseError) {
                return res.status(500).json({ error: e.message });
            }
        }

    }

    getById = async (req, res) => {
        const { id } = req.params;
        
        try{
        
            const user = await this.userModel.getById({ id });
            
            if (user.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            return res.json(user);
        } catch (e) {
            
            if (e instanceof DatabaseError) {
                return res.status(500).json({ error: e.message });
            }

            console.log(e);
        }

    }

    create = async (req, res) => {

        const user = validateUser(req.body);

        if (!user.success) {
            return res.status(400).json({ error: JSON.parse(user.error.message) });
        }

        const newUser = await this.userModel.create({ input: user.data });

        if (!newUser.success) {
            return res.status(400).json({ error: newUser.message });
        }

        res.status(201).json(newUser);

    }

    update = async (req, res) => {
        const result = validatePartialUser(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params

        const user = await this.userModel.update({ id, input: result.data })

        if (!user) {
            return res.status(404).json({ error: 'Error updating user' })
        }

        res.status(201).json(user);

    }

    delete = async (req, res) => {
        const { id } = req.params;

        const result = await this.userModel.delete({ id });

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json({ message: 'User deleted' });
    }
}
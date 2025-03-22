export class vehiclesModel{
    constructor({database}){
        this.database = database;
    }
    getAll = async () => {
        return await this.database.query('SELECT * FROM vehicles');
    }
    getById = async ({id}) => {
        return await this.database.query('SELECT * FROM vehicles WHERE id = ?', [id]);
    }
    create = async ({input}) => {
        return await this.database.query('INSERT INTO vehicles SET ?', input);
    }
    update = async ({id, input}) => {
        return await this.database.query('UPDATE vehicles SET ? WHERE id = ?', [input, id]);
    }
    delete = async ({id}) => {
        return await this.database.query('DELETE FROM vehicles WHERE id = ?', [id]);
    }
}
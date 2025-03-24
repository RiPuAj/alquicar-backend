export class DatabaseError extends Error {
    constructor(message) {
      super(message);
      this.name = 'DatabaseError';
    }
  }

export const handlerDatabaseError = ({err, message}) => {
  if(!err) throw new DatabaseError(message);
  
  if (err.code === 'ER_DUP_ENTRY') {
    if (err.message.includes('users.email')) {
        throw new DatabaseError('Email already in use');
    
    } else if (err.message.includes('users.dni')) {
        throw new DatabaseError('DNI already in use');
    
    } else if (err.message.includes('users.phone')) { 
        throw new DatabaseError('Phone already in use');
    } else {
        throw new DatabaseError(err.message);
    }
  } else if( err.code === 'ER_NO_REFERENCED_ROW_2'){
    if(err.sqlMessage.includes('vehicle_id')){
        throw new DatabaseError('Vehicle not found');
    } else if(err.sqlMessage.includes('customer_id')){
        throw new DatabaseError('Customer not found');
    } 
  } else {
    throw new DatabaseError(err.message);
  }
}
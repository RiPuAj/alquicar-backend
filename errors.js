export const handlerDatabaseError = ({err}) => {
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
}
}


class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
  }
}
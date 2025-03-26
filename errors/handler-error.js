export const handlerDatabaseError = ({ error }) => {
  if (error instanceof DatabaseError) {
    throw error;
  } else if (error.code === 'ER_DUP_ENTRY') {
    if (error.message.includes('users.email')) {
      throw new DatabaseError('Email already in use');

    } else if (error.message.includes('users.dni')) {
      throw new DatabaseError('DNI already in use');

    } else if (error.message.includes('users.phone')) {
      throw new DatabaseError('Phone already in use');
    } else {
      throw new DatabaseError('Error en la base de datos');
    }
  } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    if (error.sqlMessage.includes('vehicle_id')) {
      throw new DatabaseError('Vehicle not found');
    } else if (error.sqlMessage.includes('customer_id')) {
      throw new DatabaseError('Customer not found');
    }
  }
}

export const catchAndResponseError = (error, res) => {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    } else if (error instanceof DatabaseError) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Ha ocurrido un error fatal" });
    }
  }
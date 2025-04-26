import {DatabaseError } from './database-error.js';
import { ValidationError } from './validation-error.js';

const duplicateEntryMessages = {
  'users.email': 'Email already in use',
  'users.dni': 'DNI already in use',
  'users.phone': 'Phone already in use',
};

const foreignKeyMessages = {
  'vehicle_id': 'Vehicle not found',
  'customer_id': 'Customer not found',
};

export const handlerDatabaseError = ({ error }) => {
  if (error instanceof DatabaseError) {
    throw error;
  }

  switch (error.code) {
    case 'ER_DUP_ENTRY': {
      const message = Object.keys(duplicateEntryMessages).find((key) => 
        error.message.includes(key)
      );
      throw new DatabaseError(duplicateEntryMessages[message] || 'Error en la base de datos');
    }

    case 'ER_NO_REFERENCED_ROW_2': {
      const message = Object.keys(foreignKeyMessages).find((key) => 
        error.sqlMessage.includes(key)
      );
      throw new DatabaseError(foreignKeyMessages[message] || 'Error en la base de datos');
    }

    case 'ECONNREFUSED':
      throw new DatabaseError('Base de datos no disponible');

    default:
      throw new DatabaseError('Error en la base de datos');
  }
};

export const catchAndResponseError = (error, res) => {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    } else if (error instanceof DatabaseError) {
      return res.status(400).json({ error: error.message });
    } else {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ error: "Ha ocurrido un error fatal" });
    }
  }
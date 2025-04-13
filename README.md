# alquicar-backend
Backend de la aplicación AlquiCar, desarrollada por el grupo número 8 para la asignatura Producción del Software.

## Para ejecutar:
```bash
npm run dev
```

## Dependencias:
- Node.js, EXPRESS
- Base de datos activa en el puerto para desarrollo local 3006
- Archivo de configuración de la base de datos en *[./alquicarDB.sql](./alquicarDB.sql)*
- dependencias de software instalables con: 
```bash 
npm install
```
### Servidor SQL
- Para que este proyecto se ejecute correctamente es necesario tener un servidor mysql activo en el puerto 3006.
- Este servidor será accedido a la cuenta **root** **SIN** contraseña.
- Si se desease se podria utilizar una base de datos mariadb en el mismo puerto en la rama deploy-mariadb con la configuración de la DB que se encuentra en dicha rama
- Enlaces a [mysql server](https://dev.mysql.com/downloads/mysql/) y [mysql workbench](https://dev.mysql.com/downloads/workbench/)
## Métodos generales de acceso:
- En [api.http](./api.http) se encuentran ejemplos de acceso
### User:
- GET
- POST
- PATCH
### Vehicle:
- GET
### Reservation:
- GET
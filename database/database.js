const sequelize = require('sequelize');
const connection = new sequelize('guiaperguntas', 'root', '123456',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;

//se der um erro oque pode concertar é
//ALTER USER 'root'@'localhost'IDENTIFIED WITH mysql_native-password BY '123456' 
//123456 é a senha do root do mysql

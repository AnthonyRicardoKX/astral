const Sequelize = require('sequelize');

module.exports.db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operationAliases: false,
    define: {
        freezeTableName: true
    }
});
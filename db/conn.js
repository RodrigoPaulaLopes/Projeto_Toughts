const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('pensamentos', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})

try{
    sequelize.authenticate()
    console.log('conectado com sucesso');
}catch(error){
    console.log(`Error: ${error}`);
}

module.exports = sequelize
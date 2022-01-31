const {DataTypes} = require('sequelize')

const db = require('../db/conn.js')
const User = require('../models/User.js')


const Toughts = db.define('tought', {
    title: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
    },
})

Toughts.belongsTo(User)
User.hasMany(Toughts)

module.exports = Toughts
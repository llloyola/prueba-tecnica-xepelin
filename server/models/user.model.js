module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
			allowNull: false
        },
      	name: {
        	type: Sequelize.STRING,
			allowNull: false
      	},
      	email: {
        	type: Sequelize.STRING,
			allowNull: false,
			unique: true
      	},
      	password: {
        	type: Sequelize.STRING,
			allowNull: false
      	}
    });
  
    return User;
};
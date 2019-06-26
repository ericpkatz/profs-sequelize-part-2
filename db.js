const  Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/prof_sequelize_2', { logging: false });

const User = conn.define('user', {
  name: {
    type: Sequelize.STRING
  }
});

User.belongsTo(User, { as: 'manager' });
User.hasMany(User, { foreignKey: 'managerId', as: 'peasants' });

User.findPeasants = function(){
  return this.findAll({
    where: {
      managerId: {
        [Sequelize.Op.ne] : null
      }
    }
  });
}
User.prototype.sayHi = function(){
  console.log('hello my name is ' + this.name);
}

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const names = ['moe', 'larry', 'curly', 'shep'];
  const [moe, larry, curly, shep] = await Promise.all(names.map( name => User.create({ name })));
  curly.managerId = moe.id;
  await curly.save();
  larry.managerId = curly.id;
  await larry.save();
  shep.managerId = curly.id;
  await shep.save();
};

module.exports = {
  syncAndSeed,
  models: {
    User
  }
};


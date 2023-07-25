//
// This file runs through all models and adds them to the model array
// it associates all the required ones as well (shouldn't need to change)
//
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const getFiles = (dir, prepend = './') => fs.readdirSync(dir).map(f => {
  if (f.slice(-3) !== '.js')
    return getFiles(`${dir}/${f}`, `${f}/`);
  return f;
})
  .flat()
  .map(f => `${prepend}${f}`);
const files = getFiles(__dirname)
  .filter(file => file !== `./${basename}` && file.slice(-3) === '.js');

module.exports = sequelize => {
  const modelArray = files.map(f => require(f)(sequelize));
  const models = modelArray.reduce((m, next) => ({
    ...m,
    [next.modelName]: next.model,
  }), { sequelize, Sequelize: require('sequelize') });
  modelArray.forEach(model => model.associate(models));
  return models;
}
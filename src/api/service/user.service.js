const { User } = require('../../models/User.model');

async function getAll() {
  const users = await User.findAll({ order: ['name'] });

  return users;
}

async function get(id) {
  const user = await User.findByPk(id);

  return user;
}

let counter = 1;

function generateId() {
  counter = (counter + 1) % 1000;

  return Math.floor(Date.now() / 1_000_000) * 1000 + counter;
}

async function create(name) {
  const createdUser = User.create({ id: generateId(), name });

  return createdUser;
}

async function deleteById(id) {
  const deletedUser = await User.destroy({ where: { id } });

  if (deletedUser === 0) {
    return null;
  }

  return deletedUser;
}

async function update({ id, name }) {
  const [count, users] = await User.update(
    { name },
    {
      where: {
        id,
      },
      returning: true,
    },
  );

  if (count === 0) {
    return null;
  }

  return users[0];
}

const usersService = {
  getAll,
  get,
  create,
  deleteById,
  update,
};

module.exports = { usersService };

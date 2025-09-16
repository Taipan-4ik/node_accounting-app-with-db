const { Expense } = require('../../models/Expense.model');

async function getAll() {
  const expenses = await Expense.findAll({ order: ['title'] });

  return expenses;
}

function get(id) {
  return Expense.findByPk(id);
}

let counter = 0;

function generateId() {
  counter = (counter + 1) % 1000;

  return Math.floor(Date.now() / 1_000_000) * 1000 + counter;
}

async function create(title, userId, spentAt, amount, category, note) {
  return Expense.create({
    id: generateId(),
    title,
    userId,
    spentAt,
    amount,
    category,
    note,
  });
}

async function deleteById(id) {
  const deletedExpense = await Expense.destroy({ where: { id } });

  if (deletedExpense === 0) {
    return null;
  }

  return deletedExpense;
}

async function update({ id, title, amount, category, note, spentAt }) {
  const [count, users] = await Expense.update(
    {
      title,
      amount,
      category,
      note,
      spentAt,
    },
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

module.exports.expensesService = {
  getAll,
  get,
  create,
  deleteById,
  update,
};

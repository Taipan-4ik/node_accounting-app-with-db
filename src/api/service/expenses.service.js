const { Expense } = require('../../models/Expense.model');

async function getAll(userId, categories, from, to) {
  const expenses = await Expense.findAll({ order: ['title'] });
  let filteredExpenses = expenses;

  if (userId) {
    filteredExpenses = filteredExpenses.filter(
      (exp) => exp.userId === Number(userId),
    );
  }

  if (categories) {
    const categoryArray = Array.isArray(categories) ? categories : [categories];

    filteredExpenses = filteredExpenses.filter(
      (exp) => categoryArray.includes(exp.category),
      // eslint-disable-next-line function-paren-newline
    );
  }

  if (from) {
    filteredExpenses = filteredExpenses.filter(
      (exp) => new Date(exp.spentAt) >= new Date(from),
    );
  }

  if (to) {
    filteredExpenses = filteredExpenses.filter(
      (exp) => new Date(exp.spentAt) <= new Date(to),
    );
  }

  if (filteredExpenses.length > 1) {
    filteredExpenses.sort((a, b) => a.id - b.id);
  }

  return filteredExpenses;
}

function get(id) {
  return Expense.findByPk(id);
}

async function create(title, userId, spentAt, amount, category, note) {
  return Expense.create({
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

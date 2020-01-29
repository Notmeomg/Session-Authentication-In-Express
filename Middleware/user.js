// TODO: DB
const users = [
  { id: 1, name: 'Keen', email: 'keen@gmail.com', password: 'secret' },
  { id: 2, name: 'Keen2', email: 'keen2@gmail.com', password: 'secret2' },
  { id: 3, name: 'Keen3', email: 'keen3@gmail.com', password: 'secret3' },
]

const user = (req, res, next) => {
  const { userId } = req.session
  
  if (userId) {
    res.locals.user = users.find(
      user => user.id === userId
    )
  }
  next();
};

module.exports = user;

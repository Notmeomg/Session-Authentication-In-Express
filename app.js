const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { NODE_ENV, SESS_SECRET } = require('dotenv').config().parsed;
const { port, sess_duration, sess_name } = require('./config');
const { redirectLogin, redirectHome } = require('./Middleware/redirects');
const user = require('./Middleware/user');

const app = express();

// TODO: DB
const users = [
  { id: 1, name: 'Keen', email: 'keen@gmail.com', password: 'secret' },
  { id: 2, name: 'Keen2', email: 'keen2@gmail.com', password: 'secret2' },
  { id: 3, name: 'Keen3', email: 'keen3@gmail.com', password: 'secret3' },
]

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  name: sess_name,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: sess_duration,
    sameSite: true, // 'strict'
    secure: NODE_ENV === 'production'
  },
}));

app.use(user);

app.get('/', (req, res) => {
  const { userId }  = req.session;
  res.send(`
    <h1>Welcome!</h1>
    ${userId ? `
      <a href="/home">Home</a>
      <form method="post" action="/logout">
        <button>Logout</button>
      </form>
    ` : `
      <a href="/login">Login</a>
      <a href="/register">Register</a>
    `}

  `)
});

app.get('/home', redirectLogin, (req, res) => {
  const { user } = res.locals;
  console.log(req.session);
  console.log(req.sessionID);
  res.send(`
    <h1>Home</h1>
    <a href="/">Main</a>
    <ul>
      <li>Name: ${user.name}</li>
      <li>Email: ${user.email}</li>
    </ul>
  `);
});

// app.get('/profile', redirectLogin, (req, res) => {
//   const { user } = res.locals;
// });

app.get('/login', redirectHome, (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="post">
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="submit" />
    </form>
    <a href="/register">Register</a>
  `);
});

app.get('/register', redirectHome, (req, res) => {
  res.send(`
    <h1>Register</h1>
    <form action="/register" method="post">
      <input name="name" placeholder="Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="submit" />
    </form>
    <a href="/login">Login</a>
  `);
});

app.post('/login', redirectHome, (req, res) => {
  const { email, password } = req.body;

  if (email && password) { // TODO: Validation
    const user = users.find(
      user => user.email === email && user.password === password // TODO: Hash
    );

    if (user) {
      req.session.userId = user.id;
      return res.redirect('/home');
    }
  }

  res.redirect('/login');
});

app.post('/register', redirectHome, (req, res) => {
  const { name, email, password } = req.body;

  if (name && email && password) { // TODO: Validation
    const exists = users.some(
      user => user.email === email
    )

    if (!exists) {
      const user = {
        id: users.length + 1,
        name,
        email,
        password // TODO: Hash
      }

      users.push(user);

      req.session.userId = user.id;
      return res.redirect('/home');
    }
  }

  res.redirect('/register'); // TODO: qs errors : /register?error=error.auth.userExists
});

app.post('/logout', redirectLogin, (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect('/home');
    
    res.clearCookie(sess_name);
    res.redirect('/login');
  });
});

app.listen(port, () => console.log(
  `http://localhost:${port}`
));
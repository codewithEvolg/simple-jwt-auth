const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000

const JWT_SECRET = process.env.JWT_SECRET || 'spongebob'; 

const db = {
  fruits: [],
  users : []  
};

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.heades.authorization;
  if (!authorizationHeader) {
    return res.status(403).send({message: 'Authorization header not provided!'})
  }

  const token = authorizationHeader.split(' ')[1];
  if (!token) {
    return res.status(403).send({message: 'Token does not exist!'})
  }

  jwt.verify(token, JWT_SECRET, (err, decode) => {
    if (err) {
      return res.status(403).send({message: 'Token does not valid!'})
    }

    next();
  });
}

//middlewares
app.use(express.json())

app.get('/', (req, res) => {
  res.json({message: 'Hello World!'} )
})

//CREATE
app.post('/api/fruits', verifyToken, (req, res)=> { 
  const newFruit = {
    ...req.body
  };
  db.fruits.push(newFruit);
  console.log(db.fruits);
  res.json({message:'fruits created!'})
});

//READ ALL
app.get('api/fruits', verifyToken, (req, res)=>{
  res.json({message:'Here are your fruits', fruits: db.fruits})
});

//READ ONE
app.get('api/fruits/:id ',(req, res)=>{

});

//READ ONE
app.put('api/fruits/:id ',(req, res)=>{

});

//READ ONE
app.delete('api/fruits/:id ',(req, res)=>{

});

//AUTH API
//REGISTER
app.post('/api/auth/register', (req, res) => {
  const newUser = {
    ...req.body
  };
  db.users.push(newUser);
  console.log(db.users);
  res.json({message:'user created!'})
})

//LOGIN
app.post('/api/auth/login', (req, res) => {
  const {email, password} = req.body;
  const user = db.users.find((usr)=>{
    usr.email === email
  });
  if (!user || user.password !== password) {
    return res.status(401).json('Invalid Credentials!');
  }

  const payload = {...user, password : null}; //we want to remove the password so it doesn't get sent as part of our jwt
  const token = jwt.sign(payload, JWT_SECRET);
  res.json({message:'Welcome!!!', token});
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
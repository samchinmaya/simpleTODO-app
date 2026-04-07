const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "password";
const app = express();
let users = [];

app.use(express.json());
app.get('/',(req,res)=>{
  res.sendFile(__dirname +"/public/index.html")
})
app.post("/signup",(req,res)=>{
  const username = req.body.username
  const password = req.body.password
  const useral = users.find(u => u.username===username)
  if (useral){
    res.json({
      message:"the username is already in use!"

    })
  }else{
    users.push({
      username : username,
      password : password
    })
    res.json({
      message:"you've signed up!!"
    })
  }
  console.log("/signup is working!! ")
})
app.post("/signin", (req,res)=>{

  const username = req.body.username;
  const password = req.body.password;
  let foundedUser = users.find(User => User.username=== username && User.password===password)
  if (foundedUser){
    const token = jwt.sign({
      username: username
    },JWT_SECRET);
    res.json({
      token:token
    })
  }else{
    res.status(403).send({
      message:"invalid username and password"
    })

  }
  console.log(users)
})
function auth(req,res,next){
  const token = req.headers.token;
  if (!token) {
    return res.json({
      message: "Token must be provided"
    })
  }
  const decodedData = jwt.verify(token, JWT_SECRET);
  if (decodedData.username){
    req.username = decodedData.username;
    console.log("authentication is working ! ")
    next()
    
  }else{
    res.json({
      message:"this user haven't logged in yet!!"
    })
  }
}

app.get('/account',auth, (req,res)=>{
  let foundUser = users.find(user => user.username===req.username)
  
  res.json({
    username: foundUser.username
  })
})
app.post('/add',auth, (req,res)=>{
  let usertodo = req.body.todo;
  let userfound = users.find(u=> u.username===req.username)
  if(!userfound){
    return res.status(404).json({message:"User not found 404!! "})
  }
  if (!userfound) {
    return res.status(400).json({message:"enter the todo to save"})
  }
  if (!userfound.todos) {
    userfound.todos=[]
    
  }
  userfound.todos.push(usertodo);
  res.json({
    message:"todo added successfully",
    todos:userfound.todos
  })
  
})
app.delete('/delete',auth, (req,res)=>{
  const todo_delete = req.body.todo
  const user = users.find(u=>u.username===req.username)
  if(!user.todos) return res.status(404).json({message:"no todos found"})
  const index = user.todos.indexOf(todo_delete);
  if(index!==-1){
    user.todos.splice(index,1);
    res.json({message:'todo deleted',todos:user.todos});

  }else{
    res.status(400).json({
      message:"todo not found in your list"
    })
  }
})
app.post('/todo',auth, (req,res)=>{
})
app.listen(3000,()=>console.log("working in 3000"))

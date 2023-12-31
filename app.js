const express=require('express')
const app=express()
const mongoose = require('mongoose');
const Person = require('./model/person');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
var cors = require('cors');

app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/demo')
  .then(() => console.log('Connected!'));

  const db=mongoose.connection

  let middle=(req,res,next)=>{
    console.log('middleware');
    let a=2
    if(a==2){

        next()
    } 
}

app.use(middle)

  app.use(express.json())

  const verifyToken=(req,res,next)=>{
    const token= req.headers['authorization'];
    console.log(token);

    if(!token){
        return res.status(403).json({ message: 'Token is not provided'})
    }

    jwt.verify(token,'abc',(err,decoded)=>{
        if(err){
            return res.status(401).json({message: 'Unauthorized: Invalid token'})
        }
        req.decoded= decoded
        console.log(req.decoded);
        next();
    });
  };

// app.get('/find',middle,async function(req,res){

//     let response=await db.collection('hospital').find().toArray()
//     console.log(response);
//     res.json(response)
// })

app.get('/find',verifyToken,async function(req,res){

    let response=await Person.find()
    console.log(response);
    res.json(response)
})


app.post('/login',middle,async function(req,res){

    const {username,password}=req.body
    console.log(req.body);

   try{
if(username && password){

    let response=await Person.findOne({username})
    console.log(response);
    if(response){
        try{

            const passwordMatch = await bcrypt.compare(password,response.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
              }          

            const token = jwt.sign({ id: response.id, username: response.username },'abc');
            res.json({status:true,token});
            console.log(token);
        }catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
          }
    }
    else{
        res.json({status:false})
    }

    // if (!response) {
    //     return res.status(401).json({ message: 'Invalid username or password' });
    //   }
    // else{
    //     try{

    //         const token = jwt.sign({ id: response.id, username: response.username, password: response.password },'abc');
    //         res.json({token});
    //     }catch (error) {
    //         res.status(500).json({ message: 'Internal Server Error' });
    //       }
    // }

}

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: err.message });
    }
  
})



app.get('/findOne/:id',async (req,res)=>{
    let id=new mongoose.Types.ObjectId(req.params.id)
    let response=await db.collection('hospital').findOne({_id:id})
    console.log(response);
    res.json(response)
})



// app.post('/add',async (req,res)=>{
//     console.log(req.body);
//     let response=await db.collection('hospital').insertOne(req.body)
//     console.log(response);
//     res.json(response)
// })

app.post('/add',async (req,res)=>{
    console.log(req.body);
try{

    const hashedPassword = await bcrypt.hash(req.body.password,saltRounds);

    // let newPerson=new Person(req.body)
    let newPerson = new Person({ ...req.body, password : hashedPassword});

    let response=await newPerson.save()
    console.log(response);
    res.json(response)
}
catch(err){
    console.log(err.message);
    res.status(500).json({ error: err.message })
}
})

// app.put('/update/:id',async(req,res)=>{
//     let id = new mongoose.Types.ObjectId(req.params.id)
//     let response=await db.collection('hospital').updateOne({_id:id},{$set:req.body})
//     console.log(response);
//     res.json(response)
// })

app.put('/update/:id',async(req,res)=>{
    let id =req.params.id
    let response=await Person.findByIdAndUpdate(id,req.body)
    console.log(response);
    res.json(response)
})

// app.delete('/delete',async (req,res)=>{
//     let response=await db.collection('people').deleteOne({Name:null})
//     console.log(response);
//     res.json(response)
// })

// app.delete('/delete/:id',async (req,res)=>{
//     let id = new mongoose.Types.ObjectId(req.params.id)
//     let response=await db.collection('people').deleteOne({_id:id})
//     console.log(response);
//     res.json(response)
// })

app.delete('/delete/:id',async (req,res)=>{
    let id=req.params.id
    console.log(id);
    let response=await Person.findByIdAndDelete(id)
    console.log(response);
    res.json(response)
})

app.listen(5000)
const express=require('express')
const app=express()
const mongoose = require('mongoose');
var cors = require('cors');
const Person = require('./model/person');
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/hospital')
  .then(() => console.log('Connected!'));

  const db=mongoose.connection

  let middle=(req,res,next)=>{
    console.log('middleware');
    let a=2
    if(a==2){

        next()
    } 
}

// app.use(middle)

  app.use(express.json())

// app.get('/find',middle,async function(req,res){

//     let response=await db.collection('hospital').find().toArray()
//     console.log(response);
//     res.json(response)
// })

app.get('/find',middle,async function(req,res){

    let response=await Person.find()
    console.log(response);
    res.json(response)
})


app.post('/login',middle,async function(req,res){

    let response=await Person.findOne(req.body)
    console.log(req.body);
    if(response){
        res.json({status:true})
    }
    else{
        res.json({status:false})
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

    let newPerson=new Person(req.body)
    let response=await newPerson.save()
    console.log(response);
    res.json(response)
}
catch(err){
    console.log(err.message);
    res.status(500).json(err.message)
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

app.delete('/delete',async (req,res)=>{
    let response=await db.collection('people').deleteOne({Name:null})
    console.log(response);
    res.json(response)
})
// app.delete('/delete/:id',async (req,res)=>{
//     let id=req.params.id
//     console.log(id);
//     let response=await Person.findByIdAndDelete(id)
//     console.log(response);
//     res.json(response)
// })

app.listen(4000)
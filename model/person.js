const mongoose=require('mongoose')

const personSchema=mongoose.Schema({
    Name:{
        require:true,
        type:String,
        minlength:3
    },
    Age:{
        require:true,
        type:String,
        maxlength:2
    },
    State:{
        require:true,
        type:String,
        minlength:3
    },
    username:{
        unique:true,
        require:true,
        type:String,
        minlength:3
    },
    password:{
        require:true,
        type:String,
        minlength:3
    }

})

const Person= mongoose.model('Person',personSchema,'people');
module.exports=Person
const mongoose=require('mongoose')

const personSchema=mongoose.Schema({
    Name:{
        required: true,
        type: String,
        minlength: 3
    },
    Age:{
        required: true,
        type: String,
        maxlength: 2
    },
    State:{
        required: true,
        type: String,
        minlength: 3
    },
    username:{
        unique: true,
        required: true,
        type: String,
        minlength: 3
    },
    password:{
        required: true,
        type: String,
        minlength: 3
    }

})

const Person= mongoose.model('Person',personSchema,'people');
module.exports=Person
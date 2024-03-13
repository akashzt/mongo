const mongoose=require('mongoose');
const addressSchema = mongoose.Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  pinCode: String,
  active: {
    type:Boolean,
    default: false
  },
  typeAddess:{
    type:String,
    enum:["home","office"],
    default:"home"
  }
});
const userSchema =mongoose.Schema({
    email: {
        type: String,
        required: [true,"please enter email address"],
        unique:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please enter a valid email'
        ]
    },
    password: {
        type: String,
        required:[true,'please enter a passwod']
    },
    name:  {
        type: String,
        required:[true,'please enter your name']
    },
    profileImage: {
        type: String,
        default:'avatar.png'
      },
      phone: {
        type: String,
        required:[true,'please enter phone number']
      },
      role: {
        type: String,
        default: 'user'
      },
      active: {
        type: Boolean,
        default: 1
      },
      addresses:[addressSchema],
      createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User',userSchema);
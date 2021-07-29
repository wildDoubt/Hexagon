const {model, Schema} = require('mongoose');

module.exports = model("User", new Schema({

    // Basic Information
    user_id         : String,
    username        : String,

    // Game Status
    total_playtime  : {type:Number, default: 0},
    activity        : [{type:Object}]

}));

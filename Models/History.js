const {model, Schema} = require('mongoose');

module.exports = model("History", new Schema({

    // Basic Information
    user_id         : String,
    activity_name   : String,

    // Game Record
    start_time      : {type:Date},
    end_time        : {type:Date, default: new Date()}

}));

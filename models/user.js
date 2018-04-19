import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String },
    password: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: String },
    address: { type: String }
});
var user = mongoose.model('User', userSchema);
export default user;
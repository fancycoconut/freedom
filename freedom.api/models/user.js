import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true, maxlength: 100 },
    lastName: { type: String, required: true, maxlength: 100 },
    email: { type: String, index: true, unique: true, required: true, maxlength: 255 },
    dateOfBirth: { type: Date, required: false },

    salt: { type: String, required: true },
    passwordHash: { type: String, required: true }
});

export default mongoose.model('User', UserSchema);
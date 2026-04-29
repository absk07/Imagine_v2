import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    unknownCredit: number;
    history: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    unknownCredit: {
        type: Number,
        required: false,
        default: 5
    },
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserHistory'
    }]
}, {
    timestamps: true
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
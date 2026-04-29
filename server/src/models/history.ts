import mongoose, { Schema, Document } from 'mongoose';

export interface IHistory extends Document {
    name: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserHistorySchema: Schema<IHistory> = new Schema({
    name: String,
    url: String
}, {
    timestamps: true
});

const UserHistory = mongoose.model<IHistory>('UserHistory', UserHistorySchema);

export default UserHistory;
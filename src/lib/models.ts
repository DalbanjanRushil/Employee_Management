import mongoose, { Schema, Model, models } from 'mongoose';

// Interface
export interface IWorker {
    _id: string;
    name: string;
    labourRate: number;
    joinedAt: Date;
    isActive: boolean;
}

const WorkerSchema = new Schema<IWorker>({
    name: { type: String, required: true },
    labourRate: { type: Number, required: true, default: 6.0 },
    joinedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
});


export interface IWorkOrder {
    _id: string;
    workerId: mongoose.Types.ObjectId | string;
    workerName: string; // Denormalized for faster reads? No, let's use populate.
    quantity: number;
    sellingPrice: number;
    labourRate: number; // Snapshot
    status: 'PENDING' | 'COMPLETED' | 'CHECKED';
    createdAt: Date;
    completedAt?: Date;
}

const WorkOrderSchema = new Schema<IWorkOrder>({
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    quantity: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    labourRate: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'CHECKED'], default: 'PENDING' },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
});


export interface IMaterial {
    _id: string;
    workerId: mongoose.Types.ObjectId | string;
    name: string;
    cost: number;
    date: Date;
}

const MaterialSchema = new Schema<IMaterial>({
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

export const Worker = models.Worker || mongoose.model<IWorker>('Worker', WorkerSchema);
export const WorkOrder = models.WorkOrder || mongoose.model<IWorkOrder>('WorkOrder', WorkOrderSchema);
export const Material = models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);


export interface IUser {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role: 'ADMIN' | 'USER';
    lastLogin: Date;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

export const User = models.User || mongoose.model<IUser>('User', UserSchema);

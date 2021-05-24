import { Types } from 'mongoose';

export interface IEntity {
    id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
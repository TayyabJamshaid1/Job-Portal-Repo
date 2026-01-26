import mongoose, { Schema, model, models } from "mongoose";

export interface IEmployer {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  avatarUrl: string;
  bannerImageUrl: string;
  organizationType: string;
  teamSize: string;
  yearOfEstablishment: string;
  websiteUrl: string;
  location: string;
  _id?: mongoose.Types.ObjectId;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
const employersSchema = new Schema<IEmployer>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    bannerImageUrl: {
      type: String,
      default: null,
    },
    organizationType: {
      type: String,
      default: null,
    },
    teamSize: {
      type: String,
      default: null,
    },
    yearOfEstablishment: {
      type: String,
      default: null,
    },
    websiteUrl: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Employer =
  models?.Employer || model<IEmployer>("Employer", employersSchema);
export default Employer;

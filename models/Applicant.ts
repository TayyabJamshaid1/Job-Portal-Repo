import mongoose, { Mongoose, Schema, model, models } from "mongoose";
export interface IApplicant {
  userId: mongoose.Types.ObjectId;
  biography: string;
  dateOfBirth: Date;
  nationality: string;
  maritalStatus: string;
  gender: string;
  education: string;
  experience: string;
  websiteUrl: string;
  location: string;
  _id?: mongoose.Types.ObjectId;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
const applicantSchema = new Schema<IApplicant>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    biography: {
      type: String,
           default:null

    },
    dateOfBirth: {
      type: Date,
           default:null

    },
    nationality: {
      type: String,
           default:null

    },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced"],
            default:null

    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
           default:null

    },
    education: {
      type: String,
      enum: ["none", "high school", "undergraduate", "masters", "phd"],
           default:null

    },
    experience: {
      type: String,
           default:null

    },
    websiteUrl: {
      type: String,
           default:null

    },
    location: {
      type: String,
           default:null

    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Applicant =
  models?.Applicant || model<IApplicant>("Applicant", applicantSchema);
export default Applicant;

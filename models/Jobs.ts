import { SALARY_CURRENCY,SALARY_PERIOD,JOB_TYPE ,WORK_TYPE,JOB_LEVEL,MIN_EDUCATION} from "@/lib/constant";
import mongoose, { Schema, model, models } from "mongoose";



/* =======================
   INTERFACE
======================= */

export interface IJobs {
  title: string;
  employerId: mongoose.Types.ObjectId;
  description: string;
  tags?: string;
  minSalary?: number;
  maxSalary?: number;
  salaryCurrency?: (typeof SALARY_CURRENCY)[number];
  salaryPeriod?: (typeof SALARY_PERIOD)[number];
  location?: string;
  jobType?: (typeof JOB_TYPE)[number];
  workType?: (typeof WORK_TYPE)[number];
  jobLevel?: (typeof JOB_LEVEL)[number];
  experience?: string;
  minEducation?: (typeof MIN_EDUCATION)[number];
  isFeatured: boolean;
  expiresAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/* =======================
   SCHEMA
======================= */

const jobsSchema = new Schema<IJobs>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    employerId: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    tags: {
      type: String,
    },

    minSalary: {
      type: Number,
    },

    maxSalary: {
      type: Number,
    },

    salaryCurrency: {
      type: String,
      enum: SALARY_CURRENCY,
    },

    salaryPeriod: {
      type: String,
      enum: SALARY_PERIOD,
    },

    location: {
      type: String,
    },

    jobType: {
      type: String,
      enum: JOB_TYPE,
    },

    workType: {
      type: String,
      enum: WORK_TYPE,
    },

    jobLevel: {
      type: String,
      enum: JOB_LEVEL,
    },

    experience: {
      type: String,
    },

    minEducation: {
      type: String,
      enum: MIN_EDUCATION,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      required: true,
    },

    expiresAt: {
      type: Date,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/* =======================
   MODEL
======================= */

const Jobs = models?.Jobs || model<IJobs>("Jobs", jobsSchema);
export default Jobs;

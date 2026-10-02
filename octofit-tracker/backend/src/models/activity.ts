import { model, Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['run', 'walk', 'cycle', 'swim', 'strength'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    points: { type: Number, required: true, min: 0, default: 0 },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

export const Activity = model('Activity', activitySchema);

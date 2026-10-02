import { model, Schema } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, required: true, min: 0, default: 0 },
    period: {
      type: String,
      enum: ['all-time', 'weekly'],
      required: true,
      default: 'all-time',
      index: true,
    },
  },
  { timestamps: true },
);

leaderboardSchema.index({ user: 1, period: 1 }, { unique: true });

export const Leaderboard = model('Leaderboard', leaderboardSchema);

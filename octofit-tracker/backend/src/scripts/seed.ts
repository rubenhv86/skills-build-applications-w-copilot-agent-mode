import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { Activity } from '../models/activity';
import { Leaderboard } from '../models/leaderboard';
import { Team } from '../models/team';
import { User } from '../models/user';
import { Workout } from '../models/workout';

const user = User;
const team = Team;
const activity = Activity;
const leaderboard = Leaderboard;
const workout = Workout;

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  await connectDatabase();

  try {
    const ids = {
      users: [
        new mongoose.Types.ObjectId('650000000000000000000001'),
        new mongoose.Types.ObjectId('650000000000000000000002'),
        new mongoose.Types.ObjectId('650000000000000000000003'),
      ],
      teams: [
        new mongoose.Types.ObjectId('650000000000000000000011'),
        new mongoose.Types.ObjectId('650000000000000000000012'),
      ],
      activities: [
        new mongoose.Types.ObjectId('650000000000000000000021'),
        new mongoose.Types.ObjectId('650000000000000000000022'),
        new mongoose.Types.ObjectId('650000000000000000000023'),
        new mongoose.Types.ObjectId('650000000000000000000024'),
      ],
      leaderboard: [
        new mongoose.Types.ObjectId('650000000000000000000031'),
        new mongoose.Types.ObjectId('650000000000000000000032'),
        new mongoose.Types.ObjectId('650000000000000000000033'),
      ],
      workouts: [
        new mongoose.Types.ObjectId('650000000000000000000041'),
        new mongoose.Types.ObjectId('650000000000000000000042'),
        new mongoose.Types.ObjectId('650000000000000000000043'),
        new mongoose.Types.ObjectId('650000000000000000000044'),
      ],
    };

    await Promise.all([
      user.deleteMany({ _id: { $in: ids.users } }),
      team.deleteMany({ _id: { $in: ids.teams } }),
      activity.deleteMany({ _id: { $in: ids.activities } }),
      leaderboard.deleteMany({ _id: { $in: ids.leaderboard } }),
      workout.deleteMany({ _id: { $in: ids.workouts } }),
    ]);

    await user.insertMany([
      {
        _id: ids.users[0],
        username: 'alex-morgan',
        email: 'alex.morgan@example.com',
        displayName: 'Alex Morgan',
      },
      {
        _id: ids.users[1],
        username: 'sam-chen',
        email: 'sam.chen@example.com',
        displayName: 'Sam Chen',
      },
      {
        _id: ids.users[2],
        username: 'jordan-lee',
        email: 'jordan.lee@example.com',
        displayName: 'Jordan Lee',
      },
    ]);

    await team.insertMany([
      {
        _id: ids.teams[0],
        name: 'Trail Blazers',
        description: 'A team focused on running and outdoor adventures.',
        members: [ids.users[0], ids.users[1]],
      },
      {
        _id: ids.teams[1],
        name: 'Daily Momentum',
        description: 'Building consistent, healthy routines together.',
        members: [ids.users[1], ids.users[2]],
      },
    ]);

    const today = new Date();
    const daysAgo = (days: number) =>
      new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

    await activity.insertMany([
      {
        _id: ids.activities[0],
        user: ids.users[0],
        type: 'run',
        durationMinutes: 38,
        distanceKm: 6.2,
        points: 62,
        date: daysAgo(1),
      },
      {
        _id: ids.activities[1],
        user: ids.users[1],
        type: 'cycle',
        durationMinutes: 50,
        distanceKm: 18,
        points: 75,
        date: daysAgo(2),
      },
      {
        _id: ids.activities[2],
        user: ids.users[2],
        type: 'strength',
        durationMinutes: 32,
        points: 48,
        date: daysAgo(1),
      },
      {
        _id: ids.activities[3],
        user: ids.users[0],
        type: 'walk',
        durationMinutes: 45,
        distanceKm: 3.8,
        points: 38,
        date: daysAgo(3),
      },
    ]);

    await leaderboard.insertMany([
      {
        _id: ids.leaderboard[0],
        user: ids.users[0],
        team: ids.teams[0],
        points: 100,
        period: 'all-time',
      },
      {
        _id: ids.leaderboard[1],
        user: ids.users[1],
        team: ids.teams[0],
        points: 75,
        period: 'all-time',
      },
      {
        _id: ids.leaderboard[2],
        user: ids.users[2],
        team: ids.teams[1],
        points: 48,
        period: 'all-time',
      },
    ]);

    await workout.insertMany([
      {
        _id: ids.workouts[0],
        title: 'Easy Trail Run',
        description: 'A relaxed outdoor run to build aerobic endurance.',
        activityType: 'run',
        difficulty: 'beginner',
        durationMinutes: 30,
      },
      {
        _id: ids.workouts[1],
        title: 'Steady Cycling Session',
        description: 'Maintain a comfortable pace and focus on smooth cadence.',
        activityType: 'cycle',
        difficulty: 'intermediate',
        durationMinutes: 45,
      },
      {
        _id: ids.workouts[2],
        title: 'Full-body Strength',
        description: 'A balanced bodyweight session for major muscle groups.',
        activityType: 'strength',
        difficulty: 'beginner',
        durationMinutes: 25,
      },
      {
        _id: ids.workouts[3],
        title: 'Recovery Mobility',
        description: 'Gentle mobility work to support recovery and flexibility.',
        activityType: 'mobility',
        difficulty: 'beginner',
        durationMinutes: 20,
      },
    ]);

    console.log('Database seeding complete');
  } finally {
    await disconnectDatabase();
  }
}

void seedDatabase().catch((error: unknown) => {
  console.error('Error seeding database:', error);
  process.exitCode = 1;
});

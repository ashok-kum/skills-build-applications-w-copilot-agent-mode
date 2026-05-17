from django.test import TestCase
from .models import User, Team, Activity, Leaderboard, Workout

class ModelSmokeTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create(name='Test User', email='test@example.com', team=self.team)

    def test_user_creation(self):
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(self.user.team.name, 'Test Team')

    def test_activity_creation(self):
        activity = Activity.objects.create(user=self.user, activity='Running', duration=30)
        self.assertEqual(Activity.objects.count(), 1)
        self.assertEqual(activity.user, self.user)

    def test_leaderboard_creation(self):
        entry = Leaderboard.objects.create(user=self.user, points=100)
        self.assertEqual(Leaderboard.objects.count(), 1)
        self.assertEqual(entry.user, self.user)

    def test_workout_creation(self):
        workout = Workout.objects.create(user=self.user, workout='Pushups', reps=50)
        self.assertEqual(Workout.objects.count(), 1)
        self.assertEqual(workout.user, self.user)

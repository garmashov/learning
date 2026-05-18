from django.core.management.base import BaseCommand
from django.conf import settings
from djongo import models

# Define models inline for demonstration; in a real project, these would be in models.py
class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    team = models.CharField(max_length=100)
    class Meta:
        app_label = 'octofit_tracker'
        db_table = 'users'

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    class Meta:
        app_label = 'octofit_tracker'
        db_table = 'teams'

class Activity(models.Model):
    user_email = models.EmailField()
    activity_type = models.CharField(max_length=100)
    duration = models.IntegerField()  # minutes
    class Meta:
        app_label = 'octofit_tracker'
        db_table = 'activities'

class Leaderboard(models.Model):
    team = models.CharField(max_length=100)
    points = models.IntegerField()
    class Meta:
        app_label = 'octofit_tracker'
        db_table = 'leaderboard'

class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    suggested_for = models.CharField(max_length=100)
    class Meta:
        app_label = 'octofit_tracker'
        db_table = 'workouts'

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Clear existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Users
        users = [
            User(email='tony@stark.com', name='Tony Stark', team='Marvel'),
            User(email='steve@rogers.com', name='Steve Rogers', team='Marvel'),
            User(email='bruce@wayne.com', name='Bruce Wayne', team='DC'),
            User(email='clark@kent.com', name='Clark Kent', team='DC'),
        ]
        for user in users:
            user.save()

        # Activities
        activities = [
            Activity(user_email='tony@stark.com', activity_type='Running', duration=30),
            Activity(user_email='steve@rogers.com', activity_type='Cycling', duration=45),
            Activity(user_email='bruce@wayne.com', activity_type='Swimming', duration=60),
            Activity(user_email='clark@kent.com', activity_type='Flying', duration=120),
        ]
        for activity in activities:
            activity.save()

        # Leaderboard
        Leaderboard.objects.create(team='Marvel', points=75)
        Leaderboard.objects.create(team='DC', points=90)

        # Workouts
        workouts = [
            Workout(name='Super Strength', description='Strength training for superheroes.', suggested_for='Marvel'),
            Workout(name='Flight Endurance', description='Endurance training for flying heroes.', suggested_for='DC'),
        ]
        for workout in workouts:
            workout.save()

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))

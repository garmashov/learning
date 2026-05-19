from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout

class ObjectIdField(serializers.CharField):
    def to_representation(self, value):
        return str(value) if value is not None else None

class UserSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='pk', read_only=True)

    class Meta:
        model = User
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='pk', read_only=True)

    class Meta:
        model = Team
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='pk', read_only=True)

    class Meta:
        model = Activity
        fields = '__all__'

class LeaderboardSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='pk', read_only=True)

    class Meta:
        model = Leaderboard
        fields = '__all__'

class WorkoutSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='pk', read_only=True)

    class Meta:
        model = Workout
        fields = '__all__'

from django.db import models
from django.contrib.auth.models import User



class Quiz(models.Model):
    title = models.CharField(max_length=100)

class Question(models.Model):
    SINGLE = 'S'
    MULTI = 'M'
    TEXT = 'T'
    QUESTION_TYPES = [
        (SINGLE, 'Single Choice'),
        (MULTI, 'Multiple Choice'),
        (TEXT, 'Text')
    ]

    question_type = models.CharField(max_length=1, choices=QUESTION_TYPES, default='S')
    text = models.TextField(max_length=100, default='')
    text_answer = models.TextField(max_length=100, default='')
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)

class Choice(models.Model):
    text = models.CharField(null=True, max_length=200)
    is_correct = models.BooleanField(default=False)
    index = models.IntegerField(default=0)
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
   
class UserAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choices = models.ManyToManyField(Choice)
    
class UserQuizStat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
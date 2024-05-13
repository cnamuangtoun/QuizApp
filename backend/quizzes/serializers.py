from rest_framework import serializers
from .models import Quiz, Question, Choice, UserAnswer, UserQuizStat



class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct', 'index']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, allow_empty=False)
    text_answer = serializers.CharField(required=False)

    class Meta:
        model = Question
        fields = ['id', 'text', 'question_type', 'choices', 'text_answer']

    def create(self, validated_data):
        choices_data = validated_data.pop('choices', [])
        question = Question.objects.create(**validated_data)
        
        for choice_data in choices_data:
            Choice.objects.create(
                question=question,
                text=choice_data.get('text'),
                is_correct=choice_data.get('is_correct', False),
                index=choice_data.get('index', 0)
            )

        return question

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'questions']
    
    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        quiz = Quiz.objects.create(**validated_data)
        for question_data in questions_data:
            question_serializer = QuestionSerializer(data=question_data)
            if question_serializer.is_valid(raise_exception=True):
                question_serializer.save(quiz=quiz)
        return quiz
    
class UserAnswerSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())
    choices = serializers.ListField(child=serializers.IntegerField(), write_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = UserAnswer
        fields = ['user', 'question', 'choices']

    def validate(self, data):
        question = data['question']
        choices = data.get('choices', [])
        if question.question_type == 'T':
            word_count = len(question.text_answer.split())
        
            valid_choices = {choice.index: choice.id for choice in Choice.objects.filter(question=question)}
            
            if not all(0 <= index < word_count for index in choices):
                raise serializers.ValidationError({"choices": "One or more selected indices are out of range."})
            if not all(index in valid_choices for index in choices):
                raise serializers.ValidationError({"choices": "Submitted indices do not match any valid choices."})
            
            # Replace indices with their corresponding choice IDs
            data['choices'] = [valid_choices[index] for index in choices if index in valid_choices]
        else:
            valid_choices = list(question.choices.values_list('id', flat=True))
            if not all(choice_id in valid_choices for choice_id in choices):
                raise serializers.ValidationError({"choices": "One or more choices are not valid for this question."})

        return data

    def create(self, validated_data):
        print(self.context)
        user = self.context['request'].user
        choices = validated_data.pop('choices')
        user_answer = UserAnswer.objects.create(user=user, **validated_data)
        user_answer.choices.set(choices)
        return user_answer
    
class UserQuizStatSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    quiz = QuizSerializer(read_only=True)
    
    class Meta:
        model = UserQuizStat
        fields = ['user', 'quiz', 'score', 'completed']
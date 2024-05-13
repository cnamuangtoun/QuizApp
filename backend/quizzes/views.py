from django.shortcuts import render
from rest_framework import views, status
from rest_framework.response import Response
from .serializers import QuizSerializer, UserAnswerSerializer, UserQuizStatSerializer
from .models import Quiz, UserQuizStat
from rest_framework.permissions import IsAuthenticated



class QuizView(views.APIView):
    def get(self, request):
        quizzes = Quiz.objects.all()
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = QuizSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SingleQuizView(views.APIView):
    def get(self, request, quiz_id):
        quiz = Quiz.objects.get(pk=quiz_id)
        serializer = QuizSerializer(quiz)
        return Response(serializer.data)

class QuizSubmissionView(views.APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, quiz_id):
        serializer = UserAnswerSerializer(data=request.data.get('finalAnswer'), 
                                          context={'request': request}, many=True)
        quiz = Quiz.objects.get(pk=quiz_id)
        user = request.user
        if serializer.is_valid():
            user_answers = serializer.save()

            # Evaluate the answers
            results = self.evaluate_answers(user_answers, quiz)
            
            stats, created = UserQuizStat.objects.update_or_create(
                user=user,
                quiz=quiz,
                defaults={'score': results['percentage'], 'completed': True}
            )
            
            return Response(results, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def evaluate_answers(self, user_answers, quiz):
        score = 0
        total_questions = quiz.questions.count()
        
        # Dictionary to hold submitted answers with question ID as key
        submitted_answers = {answer.question.id: answer for answer in user_answers}
        
        for question in quiz.questions.all():
            if question.id in submitted_answers:
                user_answer = submitted_answers[question.id]
                if question.question_type == 'S':  # Single Choice
                    correct_choice = question.choices.filter(is_correct=True).first()
                    if correct_choice and user_answer.choices.filter(id=correct_choice.id).exists():
                        score += 1

                elif question.question_type in {'M', 'T'}:  # Multiple Choice, Text
                    correct_choices = set(question.choices.filter(is_correct=True).values_list('id', flat=True))
                    submitted_choices = set(user_answer.choices.values_list('id', flat=True))
                    if submitted_choices == correct_choices:
                        score += 1

        return {
            "score": score,
            "total": total_questions,
            "percentage": (score / total_questions) * 100 if total_questions else 0
        }

class QuizScoreView(views.APIView):
    def get(self, request, quiz_id):
        try:
            user_stats = UserQuizStat.objects.get(user=request.user, quiz_id=quiz_id)
            serializer = UserQuizStatSerializer(user_stats)
            return Response(serializer.data)
        except UserQuizStat.DoesNotExist:
            return Response({"message": "Score data not found or quiz not taken yet."}, status=404)

class UserQuizStatsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stats = UserQuizStat.objects.filter(user=request.user).select_related('quiz')
        serializer = UserQuizStatSerializer(stats, many=True)
        return Response(serializer.data)
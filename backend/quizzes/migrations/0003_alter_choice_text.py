# Generated by Django 5.0.6 on 2024-05-13 11:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0002_alter_question_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='choice',
            name='text',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
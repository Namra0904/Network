# Generated by Django 5.0.2 on 2024-08-17 14:31

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Post', '0001_initial'),
        ('User', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment_content', models.TextField(max_length=90)),
                ('comment_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('commenter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='commenters', to='User.user')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='Post.post')),
            ],
        ),
    ]
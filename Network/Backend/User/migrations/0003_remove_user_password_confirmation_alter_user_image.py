# Generated by Django 5.0.2 on 2024-09-05 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0002_otp_delete_token'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='password_confirmation',
        ),
        migrations.AlterField(
            model_name='user',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='profile_images/'),
        ),
    ]

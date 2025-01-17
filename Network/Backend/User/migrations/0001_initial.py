# Generated by Django 5.0.2 on 2024-08-17 14:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Token',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=255)),
                ('token', models.CharField(max_length=255)),
                ('email', models.EmailField(blank=True, max_length=254, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=255)),
                ('email', models.EmailField(blank=True, max_length=254, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('password_confirmation', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='profile_images')),
                ('dob', models.DateField(blank=True, null=True)),
                ('firstname', models.CharField(max_length=100)),
                ('lastname', models.CharField(max_length=100)),
                ('is_verified', models.BooleanField(default=False)),
            ],
        ),
    ]

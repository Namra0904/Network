# Generated by Django 5.0.2 on 2024-09-21 01:57

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0006_blacklistedtoken_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='passwordresetrequest',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2024, 9, 21, 2, 12, 2, 776570, tzinfo=datetime.timezone.utc)),
        ),
    ]

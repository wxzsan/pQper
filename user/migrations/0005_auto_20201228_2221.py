# Generated by Django 3.1.2 on 2020-12-28 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_auto_20201215_1622'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='active',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='verification',
            field=models.CharField(default=123456, max_length=12),
            preserve_default=False,
        ),
    ]

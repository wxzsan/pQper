# Generated by Django 3.1.2 on 2020-12-15 05:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('commentarea', '0002_auto_20201212_0426'),
    ]

    operations = [
        migrations.AddField(
            model_name='commentarea',
            name='star_number',
            field=models.IntegerField(default=0),
        ),
    ]
# Generated by Django 3.1.2 on 2020-12-28 09:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('commentarea', '0008_auto_20201228_0823'),
        ('chatgroup', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chatgroup',
            name='paper',
        ),
        migrations.AddField(
            model_name='chatgroup',
            name='paper',
            field=models.ManyToManyField(to='commentarea.Paper'),
        ),
    ]

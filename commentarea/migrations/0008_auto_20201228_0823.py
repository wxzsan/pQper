# Generated by Django 3.1.2 on 2020-12-28 08:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('commentarea', '0007_paperfile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paperfile',
            name='paper',
            field=models.FileField(upload_to='papers'),
        ),
    ]

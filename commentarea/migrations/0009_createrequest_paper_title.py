# Generated by Django 3.1.4 on 2021-01-02 07:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('commentarea', '0008_auto_20201228_0823'),
    ]

    operations = [
        migrations.AddField(
            model_name='createrequest',
            name='paper_title',
            field=models.CharField(default='default create request name', max_length=255),
            preserve_default=False,
        ),
    ]
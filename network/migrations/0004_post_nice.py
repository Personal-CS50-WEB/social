# Generated by Django 4.0.6 on 2022-10-31 16:02

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_following'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='nice',
            field=models.ManyToManyField(null=True, related_name='nicepost', to=settings.AUTH_USER_MODEL),
        ),
    ]

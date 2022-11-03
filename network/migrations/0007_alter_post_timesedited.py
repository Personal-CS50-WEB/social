# Generated by Django 4.0.6 on 2022-11-03 12:16

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0006_post_timesedited'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='timesedited',
            field=models.DateTimeField(auto_now=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]

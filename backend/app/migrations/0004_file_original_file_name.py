# Generated by Django 4.2.2 on 2023-06-26 20:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_alter_file_download_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='original_file_name',
            field=models.CharField(max_length=255, null=True),
        ),
    ]

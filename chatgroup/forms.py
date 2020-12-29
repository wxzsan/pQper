from django import forms
from django.forms import ModelForm

from .models import *
class AddAnnotationForm(forms.Form):
    content = forms.CharField(
        max_length = 255,
        error_messages = {
            'max_length': "Annotation can't exceed 255 characters"
        }
    )
    x = forms.FloatField()
    y = forms.FloatField()
    pageNum = forms.IntegerField()
    paperId = forms.IntegerField()

class ChatGroupPaperForm(forms.Form):
    paper  = forms.FileField()
    title = forms.CharField()
    chatGroupId = forms.IntegerField()
    
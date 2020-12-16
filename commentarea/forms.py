from django import forms
from django.forms import ModelForm

from .models import *

class GetCommentAreaForm(forms.Form):
    commentAreaId = forms.IntegerField()

class OpShortCommentForm(forms.Form):
    shortCommentId = forms.IntegerField()
    # userId = forms.IntegerField()

class OpCommentAreaForm(forms.Form):
    commentAreaId = forms.IntegerField()
    # userId = forms.IntegerField()

class OpLongCommentForm(forms.Form):
    longCommentId = forms.IntegerField()
    # userId = forms.IntegerField()

class GetLongCommentForm(forms.Form):
    longCommentId = forms.IntegerField()
    inCommentArea = forms.IntegerField()

class PostLongCommentForm(forms.Form):
    commentAreaId = forms.IntegerField()
    content = forms.CharField()
    title = forms.CharField(
        max_length = 255,
        error_messages = {
            'max_length': "Title of a long comment can't exceed 255 characters"
        }
    )
    # userId = forms.IntegerField()

class PostShortCommentForm(forms.Form):
    commentAreaId = forms.IntegerField()
    # userId = forms.IntegerField()
    content = forms.CharField(
        max_length = 255,
        error_messages = {
            'max_length': "Short comment can't exceed 255 characters"
        }
    )

class PostShortCommentForLongCommentForm(forms.Form):
    longCommentId = forms.IntegerField()
    # userId = forms.IntegerField()
    shortComment = forms.CharField(
        max_length = 255,
        error_messages = {
            'max_length': "Short comment can't exceed 255 characters"
        }
    )


class CreateCommentAreaForm(forms.Form):
    # userId = forms.IntegerField()
    paperPdfInStr = forms.CharField(
        max_length = 255,
        error_messages = {
            'max_length': "Paper str can't exceed 255 characters"
        }
    )
    paperTitle  = forms.CharField(
        max_length = 255,
        error_messages = {
            'max_length': "Paper title can't exceed 255 characters"
        }
    )

class ApproveCreateCommentAreaRequestForm(forms.Form):
    requestId = forms.IntegerField()

class PaperForm(ModelForm):
    class Meta:
        model = PaperFile
        fields = ['title', 'paper']
import datetime
from haystack import indexes
from commentarea.models import Paper, CommentArea
 
# class PaperIndex(indexes.SearchIndex, indexes.Indexable):     
#     # 类名必须为需要检索的Model_name+Index，这里需要检索Note，所以创建NoteIndex
#     # 创建一个text字段
#     text = indexes.CharField(document=True, use_template=True)  
#     title = indexes.CharField(model_attr='title')   
#     path = indexes.CharField(model_attr='path')

#     # 重载get_model方法，必须要有！
#     def get_model(self):          
#         return Paper

#     # 重载index_..函数
#     def index_queryset(self, using=None):   
#         """Used when the entire index for model is updated."""
#         return self.get_model().objects.all()

class CommentAreaIndex(indexes.SearchIndex, indexes.Indexable):     
    # 类名必须为需要检索的Model_name+Index，这里需要检索Note，所以创建NoteIndex
    # 创建一个text字段
    text = indexes.CharField(document=True, use_template=True)  
    name = indexes.CharField(model_attr='name')   
    paper = indexes.CharField(model_attr='paper')
    # path = indexes.CharField(model_attr='path')

    # 重载get_model方法，必须要有！
    def get_model(self):          
        return CommentArea

    # 重载index_..函数
    def index_queryset(self, using=None):   
        """Used when the entire index for model is updated."""
        return self.get_model().objects.all()
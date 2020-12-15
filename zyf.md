## url
下面是每个请求对应的url，前端需要调用某个api的时候只需要发送
localhost:8000/commentarea/对应API的英文

然后需要注意标注在后面的 GET 和 POST标注

对于GET请求，所有的参数放到url中（在网上也可以查）request.body中没有任何东西

对于POST请求，所有参数放到request.body中，url中应该只有指定调用哪个后端api，至于参数如何放，可以参考我和龙晟写的那个demo中的方法

get_comment_area （GET）获取讨论区内容 
post_long_comment (POST) 发送长评 
post_short_comment (POST) 发送短评
post_short_comment_for_long_comment (POST) 为长评写短评
rose_comment (GET) 点赞评论
egg_comment (GET) 点踩评论
star_comment (GET) 收藏长评
star_comment_area (GET) 收藏讨论区
request_create_comment_area (POST) 提交申请
approve_create_comment_area_request (GET) 批准创建讨论区
reject_create_comment_area_request (GET) 拒绝创建讨论区
get_create_comment_area_request (无所谓，就用GET吧) 获取创建讨论区请求
get_star_comment_area_list (GET) 获取讨论区列表（用户收藏的）
get_short_comment (GET) 获取短评
get_long_comment (GET) 获取长评
get_star_long_comment_list (GET) 获取用户收藏的所有长评
cancel_star_comment (GET) 取消收藏长评
cancel_star_comment_area (GET) 取消收藏讨论区
cancel_egg_comment (GET) 取消踩评论
cancel_rose_comment (GET) 取消赞评论

## 后端相关数据结构
这部分我直接搬运python代码了，后面的参数对前端来说不重要，你只要知道不同的属性的名字就行了
上面那个例子中的commentarea的属性的名字就是用的我在下面列出的Python类的属性名
```python
class Paper(models.Model):
    title = models.CharField(max_length=255)
    path = models.CharField(max_length=255)

class ShortComment(models.Model):
    poster = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name = 'post_short_comment')
    post_time = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=255)
    rose_number = models.IntegerField(default=0)
    egg_number = models.IntegerField(default=0)
    rose_user_list = models.ManyToManyField('user.User', related_name='rose_short_comment')
    egg_user_list = models.ManyToManyField('user.User', related_name='egg_short_comment')

class LongComment(models.Model):
    poster = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name='post_long_comment')
    post_time = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length = 255)
    star_number = models.IntegerField(default=0)
    star_user_list = models.ManyToManyField('user.User', related_name='star_long_comment')
    content = models.TextField()
    short_comment_list = models.ManyToManyField(ShortComment)

class CreateRequest(models.Model):
    requestor = models.ForeignKey('user.User', on_delete=models.CASCADE)
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE)

class CommentArea(models.Model):
    name = models.CharField(max_length=255)
    master = models.ForeignKey('user.User', on_delete=models.CASCADE)
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE)
    long_comment_list = models.ManyToManyField(LongComment)
    short_comment_list = models.ManyToManyField(ShortComment)
    star_number = models.IntegerField(default = 0)
    star_user_list = models.ManyToManyField('user.User', related_name='star_comment_area')

```



## Codes

```json
CODE = {
    "success": 200,
    "error": 300,
}
```

## Response Body Fundamental
### 说明一下
为了让api文档更易懂，成功的response我都通过例子展示，而失败的response我就不细分失败原因了(因为格式都是一样的)，具体原因在"msg"里面都会写明

### CommentAreaPage

#### 获取讨论区内容

```json
// 获取讨论区内容
// 获取commentAreaId代表的讨论区内容
request.body = {
  	"commentAreaId": number,
}

// 成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success",
     	"comment_area": {
            "id": 2,
            "name": "Prime in P",
            "master": 1,
            "paper": 2,
            "long_comment_list": [
                1,
                2
            ],
            "short_comment_list": [],
            "star_number": 1,
            "star_user_list": [
                1,
                3,
                4,
                11
            ],
            "path": "/static/local",
            "star": true
        }
    }
}
```


#### 点赞评论

```json
// 点赞评论
// shortCommentId代表的评论
request.body = {
  	"shortCommentId": number,
}

// 成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}
```

#### 点踩评论

```json
// 点踩评论
// 踩shortCommentId代表的评论
request.body = {
  	"shortCommentId": number,
}

// 成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}


```

#### 收藏长评

```json
// 收藏长评
// 收藏longCommentId代表的长评
request.body = {
  	"longCommentId": number,
}

// 成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}
```

#### 收藏讨论区

```json
// 收藏讨论区
// 收藏commentAreaId代表的论文
response.body = {
  	"commentAreaId": number,
}

// 成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}


```

### ApproveCreateCommentAreaPage

#### 获取创建讨论区请求

```json
// 获取创建讨论区请求
request.body = {
}

// 成功
{
    "code": 200,
    "data": {
        "msg": "success",
        "createRequestList": [
            {
                "id": 5,
                "requestor": 1,
                "paper": 6
            },
            {
                "id": 6,
                "requestor": 2,
                "paper": 7
            }
        ]
    }
}
```

#### 批准创建讨论区

```json
// 批准创建讨论区
request.body = {
  	"requestId": number,
}

// 成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success",
    }
}


```
#### 拒绝创建讨论区
```json
//拒绝创建讨论区
request.body = {
    "requestId": number
}
//成功
response.body = {
    "code": 200,
    "data": {
        "msg": "success",
    }
}

### LongComment
#### 获取用户收藏的所有长评
```json
// 获取长评列表
request.body = {
}
//成功
{
    "code": 200,
    "data": {
        "msg": "success",
        "longCommentList": [
            {
                "id": 2
            },
            {
                "id": 1
            }
        ]
    }
}
```
#### 获取短评

```json
// 获取短评
// 获取shortCommentId代表的长评
request.body = {
      "shortCommentId": number,
}

// 成功
{
    "code": 200,
    "data": {
        "msg": "success",
        "comment": {
            "id": 1,
            "poster": 2,
            "post_time": "2020-12-12T05:17:19.199455Z",
            "content": "you are right",
            "rose_number": 2,
            "egg_number": 2,
            "rose_user_list": [
                2
            ],
            "egg_user_list": [
                2
            ],
            "egg": false,
            "rose": false
        }
    }
}
```

#### 获取长评

```json
// 获取长评
// 获取longCommentId代表的长评，根据是否在讨论区决定发送的内容
request.body = {
    "userId", number,
    "longCommentId": number,
    "inCommentArea": boolean
}


// 成功
inCommentArea = true:
{
    "code": 200,
    "data": {
        "msg": "success",
        "comment": {
            "id": 4,
            "poster": 11,
            "post_time": "2020-12-15T12:19:22.034612Z",
            "title": "long comment",
            "star_number": 0,
            "star": false,
            "create": true,
            "content": "user 11 post to commentarea 2"//只发前50个字符
        }
    }
}
inCommentArea = false:
{
    "code": 200,
    "data": {
        "msg": "success",
        "comment": {
            "id": 4,
            "poster": 11,
            "post_time": "2020-12-15T12:19:22.034612Z",
            "title": "long comment",
            "star_number": 0,
            "content": "user 11 post to commentarea 2",
            "short_comment_list": [],
            "star": false,
            "create": true
        }
    }
}

```

#### 发送短评

```json
// 发送短评
// 在commentAreaId代表的论文发送内容为content的短评
response.body = {
  	"commentAreaId": number,
  	"userId": number,
  	"content": string,
}

// 成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}
```
#### 发送长评

```json
// 发送长评
// 在commentAreaId代表的论文发送内容为content的长评，标题为title
response.body = {
  	"commentAreaId": number,
  	"content": string,
  	"title": string, 
}

// 成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}

```
#### 收藏长评

```json
// 收藏长评
// 收藏longCommentId代表的长评
request.body = {
  	"longCommentId": number,
}

response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}
```
#### 取消收藏长评
```json
//取消收藏长评
request.body = {
    "longCommentId": number,
}
//成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}
```
#### 取消收藏讨论区
```json
//取消收藏讨论区
request.body = {
    "commentAreaId": number,
}
//成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}
```
#### 取消赞评论
```json
//取消点赞评论
request.body = {
    "shortCommentId": number,
}
//成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}
```
#### 取消踩评论
```json
//取消点踩短评
request.body = {
    "shortCommentId": number,
}
//成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}
```


#### 为长评写短评

```json
// 为长评写短评
// 将shortComment代表的短评发送到longCommentId代表的长评下

request.body = {
  	"longCommentId": number,
  	"shortComment": ShortComment,
}

// 成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}
```

### RequestCreateCommentAreaPage

#### 提交申请

```json
// 提交申请
// 提交paperPdfInStr代表的论文，论文名为paperTitle
request.body = {
    "paperPdfInStr": string,
    "paperTitle": string, 
}
// 成功
response.body = {
  	"code": 200,
  	"data": {
        "msg": "success"
    }
}


```

### MyCommentAreaListPage

#### 获取讨论区列表

```json
// 获取评论区列表
// 获取当前用户关注的评论区列表
request.body = {
}

// 成功
{
    "code": 200,
    "data": {
        "msg": "success",
        "commentAreaList": [
            {
                "id": 2
            },
            {
                "id": 3
            }
        ]
    }
}


```





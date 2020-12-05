# PQper

## Codes

``` python
CODE = {
    "success": 200,
    "database_error": 300,
    "user_error": 400,
    "method_error": 600,
    "parameter_error": 700,
}
```

## Response Body Fudanmental

服务器响应body的基本数据格式  
其中data为json

``` json
// 通用：
{
    "code": xxx,
    "data": {
        "msg": string,
        xxx: xxx
    }
}

// 成功：
{
    "code": 200,
    "data": {
        "msg": "success"
    }
}

// 用户无权限
response.body = {
    "code": 400,
    "data": {
        "msg": "not authorized"
    }
}

// 用户未登录
response.body = {
    "code": 400,
    "data": {
        "msg": "user not logged in"
    }
}

// 方法错误：
{
    "code": 600,
    "data": {
        "msg": "wrong method"
    }
}

// 参数错误：
{
    "code": 700,
    "data": {
        "msg": "wrong parameter"
    }
}

```

## APIS

### 获得当前用户个人信息

``` json
response.body={
    "code":200,
    "data":{
        "msg":"Get information successfully",
        "name":string,
        "photo":graph,
        "email":string
    }
}
```

### 修改个人信息

```json
request.body={
    "name":string,
    "passsword":string,
    "photo":graph
}
//修改成功（如果修改了密码，不返回信息，直接退出登录，跳转到LoginPage）
response.body={
    "code":200,
    "data":{
        "msg":"Change information successfully"
    }
}
//修改失败（即密码错误)
response.body={
    "code":300,
    "data":{
        "msg":"Old password is wrong"
    }
}
```

### 登录

```json
request.body={
    "email":string,
    "password":string
}
//登录失败(用户不存在)
response.body={
    "code":300,
    "data":{
        "msg":"User does not exist"
    }
}
//登录失败(密码错误)
response.body={
    "code":300,
    "data":{
        "msg":"Password is wrong"
    }
}
```

### 注册

```json
request.body={
    "email":string,
    "password":string,
    "name":string
}
//失败（邮箱已注册）
response.body={
    "code":300,
    "data":{
        "msg":"Email has already registered"
    }
}
//失败（邮箱错误）
response.body={
    "code":300,
    "data":{
        "msg":"Email is wrong"
    }
}

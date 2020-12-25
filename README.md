# pQper
pQper is an online collaborative paper reading webapp

我把demo上传到了dev分支中
1. git clone -b dev https://github.com/wxzsan/pQper.git
2. 在front目录下运行 npm install npm
3. 在front目录下运行 npm run build
4. 在项目根目录下运行 python manage.py runserver
5. 浏览器中访问 localhost:8000

# 关于搜索引擎
* clone 下来之后要执行 python manage.py rebuild_index 重新建立索引
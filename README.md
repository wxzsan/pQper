# pQper
pQper is an online collaborative paper reading webapp

# 本地运行调试用服务器的方法
1. git clone https://github.com/wxzsan/pQper.git
2. 在front目录下运行 npm install npm
3. 在front目录下运行 npm run build
4. 创建python虚拟环境 python 版本选择3.8(重要！)
5. 运行 sudo pip install -r requirements.txt 安装需要的python包
6. 在项目根目录下运行 python manage.py runserver
7. 浏览器中访问 localhost:8000

# 关于搜索引擎
* clone 下来之后要执行 python manage.py rebuild_index 重新建立索引

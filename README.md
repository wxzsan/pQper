# pQper
pQper is an online collaborative paper reading webapp

# 本地运行调试用服务器的方法
1. git clone https://github.com/wxzsan/pQper.git
2. 在front目录下运行 npm install npm
3. 在front目录下运行 npm run build
4. 创建python虚拟环境 conda create -n pQper python=3.8
5. 激活虚拟环境 conda activate pQper
6. 运行 sudo pip install -r requirements.txt 安装需要的python包
7. 在项目根目录下运行 python manage.py runserver
8. 浏览器中访问 localhost:8000
9. python Crypto安装：首先pip install Crypto，然后pip uninstall crypto pycryptodome，再pip install pycryptodome，检查python3的安装目录..Lib/site-package中查看是否有Crypto文件夹(注意不是crypto文件夹)，若有则成功。

# 关于搜索引擎
* clone 下来之后要执行 python manage.py rebuild_index 重新建立索引

# 关于pdf渲染与markdown渲染
* 在本地运行调试用服务器前
1. pip install tools
2. npm install pdfjs
3. npm install showdown

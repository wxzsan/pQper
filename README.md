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

# 关于搜索引擎
* clone 下来之后要执行 python manage.py rebuild_index 重新建立索引

# 组员github账号
王昕兆 wxzsan

张弋丰 FrankZhang2000

龙晟 LgenHogns

曹立升 Leeson63

阎宇豪 infinityyyh

钱博翀 NovemberJay

郑元昊 Harris-pku

蒋康 JK7x2

# 测试用pQper账号
无管理权限的：
wangxz@pku.edu.cn
密码: 123456
makise.kurisu.a@gmail.com
密码: 000302
有管理权限的：
7@qq.com
密码: 000302

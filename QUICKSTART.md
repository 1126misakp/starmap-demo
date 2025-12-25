# 🚀 快速开始 - 数据星图 v2.0

## 📦 第一步:解压项目

```bash
tar -xzf data-constellation-v2.tar.gz
cd data-constellation
```

## ⚡ 第二步:选择部署方式

### 方式 1: 自动部署脚本(最快 ⭐⭐⭐)

```bash
./deploy.sh
```

**说明**: 脚本会自动完成所有步骤,你只需要按提示登录 Cloudflare 即可。

**预计时间**: 3-5 分钟

---

### 方式 2: Git + GitHub(推荐 ⭐⭐⭐⭐⭐)

```bash
# 1. 初始化 Git
git init
git add .
git commit -m "数据星图 v2.0 - 初始提交"

# 2. 推送到 GitHub
git remote add origin https://github.com/你的用户名/data-constellation.git
git branch -M main
git push -u origin main

# 3. 在 Cloudflare Dashboard 连接仓库
# 访问: https://dash.cloudflare.com/
# Workers & Pages > Create > Connect to Git
# 选择仓库并配置构建设置
```

**优势**: 
- 每次 git push 自动部署
- 支持版本回滚
- 团队协作友好

**预计时间**: 首次 10 分钟,后续自动

---

### 方式 3: Wrangler CLI(手动控制 ⭐⭐⭐⭐)

```bash
# 1. 安装 Wrangler
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login

# 3. 安装依赖并构建
npm install
npm run build

# 4. 部署
wrangler pages deploy dist --project-name=data-constellation
```

**预计时间**: 首次 8 分钟,更新 5 分钟

---

## 🎯 第三步:访问你的网站

部署成功后,你会得到类似这样的网址:
```
https://data-constellation.pages.dev
```

在浏览器打开即可看到你的 3D 数据星图!

---

## 💻 本地开发(可选)

如果想在本地预览:

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 浏览器访问
# http://localhost:5173
```

**热更新**: 修改代码后会自动刷新!

---

## 🆕 v2.0 新功能快速体验

### 查看项目里程碑
1. 点击任意项目节点(如"智慧园区升级改造")
2. 右侧详情面板会显示里程碑进度条
3. 彩色点表示各个里程碑节点
4. 鼠标悬停查看里程碑名称

### 使用项目筛选
1. 点击左侧"筛选"图标
2. 选择"延期"状态
3. 只显示延期的项目
4. 清除筛选返回全部

### 切换列表视图
1. 点击左侧"列表"图标
2. 查看所有项目卡片
3. 点击卡片查看详情
4. 点击"3D"返回图谱

---

## 📚 推荐阅读

- **README.md** - 项目完整说明
- **CHANGELOG.md** - v2.0 详细更新内容
- **DEPLOYMENT.md** - 完整部署指南(如需要)

---

## ❓ 常见问题

### Q: 部署失败怎么办?
**A**: 检查 Node.js 版本是否 >= 18,确保网络连接正常。

### Q: 本地运行报错?
**A**: 删除 node_modules 和 package-lock.json,重新 `npm install`。

### Q: 如何更新代码?
**A**: 
- Git 方式: `git push` 自动部署
- CLI 方式: `npm run build && wrangler pages deploy dist`

---

## 🎉 开始体验吧!

选择最适合你的部署方式,几分钟后就能看到炫酷的 3D 数据可视化!

有问题随时查看文档或反馈。祝你使用愉快! 🚀

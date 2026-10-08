# r3zound.github.io

个人项目站。把散在各处的自研项目收成一个可点的索引，第三方复刻的项目另做一页合集。

站点地址：<https://r3zound.github.io/>

---

## 这个仓库是什么

**纯静态站，没有构建框架、没有 Hexo 源码。** 页面的视觉外壳来自 `hexo-themes-yearn` 主题
（导航栏、配色、字体、卡片、时间线、代码高亮、暗色模式），但博客本体已被整体移除。

仓库里**没有**任何 `_config.yml` / `themes/` / `_posts/` / `package.json`——
历史原因：这个仓库原本是另一个 Hexo 博客的**生成产物**（只有 HTML/CSS/JS，没有源工程），
所以「改主题配置再重新生成」这条路走不通，所有页面都是手写 HTML 套用同一套 CSS。

导航栏、`style/main.css`、`js/main.js`、`vendor/`、`fancybox/` 这些是主题原样保留的部分；
`assets/site.css` 是本站自己叠加上去的样式；`index.html`、`projects/`、`third-party/` 是本站内容。

---

## 目录结构

```
/
├── index.html                    首页：10 个自研项目的时间线
├── third-party/index.html        第三方复刻项目合集（按主题分组）
├── projects/<日期>/<项目名>/      一个项目一个目录，各含一个 index.html
│   ├── 2023-11-25/openwrt-firmware/
│   ├── 2025-05-13/hass-addons/
│   ├── 2026-04-25/tank-battle/          ← 内嵌可玩，含 game.html + SPEC.md
│   ├── 2026-09-03/immortalwrt-ath79/
│   ├── 2026-09-05/openwrt-25.12-qca953x/
│   ├── 2026-09-07/os-easy-q100-e/
│   ├── 2026-09-15/iptv-desktop/
│   ├── 2026-09-22/openwrt-v50-builder/
│   ├── 2026-10-02/tenda-be12-pro-openwrt/
│   └── 2026-10-03/tenda-repo/
├── assets/
│   ├── site.css                  本站附加样式（叠在主题之上）
│   └── icons/                    左侧栏外链图标
├── style/main.css                主题主样式（hexo-themes-yearn 原样保留）
├── js/                           主题脚本 + 本站 my.js
├── images/                       站点图标
├── vendor/  fancybox/  styles/   主题资源
├── .nojekyll                     阻止 GitHub Pages 跑 Jekyll 过滤
└── .gitattributes                统一换行符
```

**URL 规则**：项目页地址 = `/projects/<建库日期>/<项目名>/`（一级日期，好记好手输）。

---

## 怎么加一个新项目

页面是脚本生成的，**不要手改生成的 HTML**，改数据再重新生成。

1. 在 `tools/build_site.py` 的 `PROJECTS` 列表里加一条记录：

   ```python
   {
       "date": "2026-10-10",           # 建库日期，决定 URL 和首页排序
       "slug": "my-new-project",        # URL 里的目录名
       "name": "my-new-project",
       "repo": "my-new-project",        # GitHub 上的仓库名
       "title": "项目标题",
       "tag": "路由器固件",              # 分类标签
       "kind": "own",                   # "own" 索引页 / "embed" 内嵌
       "summary": "一到两句话说清这是什么、解决什么问题。",
       "highlights": [
           "要点一",
           "要点二",
       ],
       # 可选：
       # "note": "补充说明，会显示成橙色标注框",
       # "archived": True,             # 显示「已归档」徽章
       # "kind": "embed",              # 内嵌模式需要下面两项
       # "embed_url": "game.html",     # 本地文件用相对路径；外部站直接用 https://
       # "embed_title": "内嵌标题",
       # "embed_height": 620,
   }
   ```

2. 跑生成脚本：

   ```powershell
   python tools/build_site.py
   ```

3. 提交推送。第三方合集要加东西就改 `THIRD_PARTY_GROUPS`。

> `tools/build_site.py` 不在仓库里（它放在仓库外面，用 `SITE_DIR` 环境变量指定输出目录）。
> 需要把脚本一起纳入版本管理时，把它拷进 `tools/` 即可。

---

## 内嵌 / iframe 的说明

- **tank-battle**：单文件 Canvas 游戏，零外部依赖、零路由，直接放进
  `projects/2026-04-25/tank-battle/game.html` 由页面 iframe 引用，永远可用。
- **openwrt-v50-builder** / **tenda-repo**：内嵌的是这两个仓库自己的 GitHub Pages。
  好处是随源仓库自动更新，不用同步；代价是**依赖访问者的网络能打开 github.io**，
  在部分网络环境下可能空白加载不出来。每页都给了「新窗口打开」兜底。

---

## 已知的样式坑（改样式前先看这里）

主题 `style/main.css` 有几个写法会咬人，`assets/site.css` 里已针对性覆盖，改动时别踩回去：

1. **`.info li { float: left }`** —— 所有 `.info` 里的 `li` 都浮动，会导致父 `<ul>` 高度塌陷，
   后面的 `<p>` 从头开始并绕排浮动元素（表现为「标签/日期/正文挤在一行」）。
   `assets/site.css` 给 `.item .info ul` 加了 `overflow: hidden` 建立 BFC 兜住；
   第三方列表则显式 `float: none` 让每条独占一行。
2. **`.item a { font-size: 18px; font-weight: bold }`** —— 会污染 `.item` 内部所有链接，
   正文小链接需要显式改回 12px / normal。
3. **`.article-title .article-info li { color: #666 }`** —— 主题假设 hero 是浅色底，
   但 hero 由 Trianglify 随机生成饱和渐变（每次刷新配色都不同），深灰小字对比不足。
   已给这些项加浅色药丸底。
4. **hero 画布宽度** —— 主题 JS 按加载瞬间的窗口宽度给 `canvas#pattern-placeholder`
   写内联像素宽度，窗口变窄后会撑出横向滚动条。已用 `!important` + `html,body{overflow-x:hidden}` 兜住。

---

## 视觉外壳的来源

导航栏、配色、字体、卡片、时间线、代码高亮等视觉表皮来自
[hexo-themes-yearn](https://github.com/Youthink/hexo-themes-yearn)（Hexo 主题）。
本仓库只保留其编译产物（CSS/JS/字体/图标），**已清理**原先第三方博客的以下内容：

- 全部文章页（`2018/`–`2023/` 年月路径，约 155 篇）
- `archives/`（含分页）、`tags/`（31 个标签页）、`categories/`
- `atom.xml`、`search.xml`（700KB 搜索索引）、`content.json`
- `img/`（334 个文件、40.2MB 文章配图）、`misc/`（1.77MB）
- 原作者私有的统计埋点与图片 CDN 引用（原 `js/my.js` 整体重写）

仓库体积：**约 40MB → 约 480KB**。

> 需要回看或回滚原来那套博客内容：
> `git checkout pre-rewrite-backup-20261008`（该 tag 指向重构前的 `main`）。

---

## 部署

GitHub Pages 从 `main` 分支根目录发布。改完内容提交推到 `main` 即可，几十秒后生效。
仓库根目录的 `.nojekyll` 必须保留，否则下划线开头的路径会被 Jekyll 吞掉。

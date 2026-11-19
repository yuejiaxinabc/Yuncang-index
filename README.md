# Yuncang-index

云仓（Yuncang）官网静态站。纯 HTML / CSS / JS，无构建步骤。

版本 1.5.3 · Apache License 2.0

## 页面

`index.html` 首页 · `features.html` 产品功能 · `desktop.html` 桌面客户端 ·
`install.html` 部署安装 · `manual.html` 用户手册 · `dev.html` 开发者手册 ·
`pricing.html` 部署服务 · `releases.html` 版本发布 · `changelog.html` 更新日志 ·
`security.html` 安全 · `privacy.html` 隐私 · `404.html`

## 安装说明（页面里也写着）

| 架构 | 脚本 |
| --- | --- |
| x86_64 | `install.sh` |
| ARM64 | `install-arm64.sh` |

## 本地预览

```bash
python3 -m http.server 8080
# http://127.0.0.1:8080/index.html
```

## 部署

丢到任意静态托管即可（GitHub Pages / Nginx / 对象存储），不需要 Node。

## 仓库

GitHub 与 Gitee 同名，路径一致只换域名：

- https://github.com/yuejiaxinabc/Yuncang-index
- https://gitee.com/yuejiaxinabc/Yuncang-index

其它仓库：[Yuncang](https://github.com/yuejiaxinabc/Yuncang) ·
[Yuncang-Update](https://github.com/yuejiaxinabc/Yuncang-Update) ·
[Yuncang-desktop](https://github.com/yuejiaxinabc/Yuncang-desktop) ·
[Yuncang-MiniProgram](https://github.com/yuejiaxinabc/Yuncang-MiniProgram) ·
[Yuncang-SDK](https://github.com/yuejiaxinabc/Yuncang-SDK)

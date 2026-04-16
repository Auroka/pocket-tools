# Pocket Tools 架构设计

## 目标
- 用最低维护成本承载多个轻量网页工具。
- 保持纯静态部署能力，支持本地直接打开或托管到静态站点。
- 通过共享设计令牌和通用脚本，保证工具间体验一致。
- 默认优先服务桌面浏览器，同时保证移动端可访问与基本可用。

## 目录结构

```text
pocket-tools/
  index.html
  AGENTS.md
  .editorconfig
  assets/
    icons/
  docs/
    architecture.md
    design-system.md
  src/
    data/
      tools.js
    styles/
      base.css
      components.css
      tokens.css
  tools/
    clock/
      index.html
      README.md
    pomodoro/
      index.html
      README.md
    todos/
      index.html
      README.md
```

## 分层说明
- `Design Tokens`：在 `src/styles/tokens.css` 中定义颜色、字体、间距、圆角、阴影、动效。
- `Base Styles`：在 `src/styles/base.css` 中处理页面基础布局、排版、背景和响应式规则。
- `Components`：在 `src/styles/components.css` 中沉淀按钮、输入框、卡片等通用组件。
- `Tool Pages`：在 `tools/` 下按工具拆分页面，聚焦具体业务交互。
- `Tool READMEs`：在每个工具目录中说明该工具的职责、功能范围和使用方式。

## 页面关系
- `index.html` 作为首页和工具分发入口。
- 每个工具都是独立页面，只从首页或直接链接进入，不做工具间底部切换。
- 后续新增工具时，只需新增页面目录、工具配置、说明文档和必要资源。

## 扩展原则
- 新工具优先复用共享卡片、按钮、表单等基础能力。
- 页面视觉差异主要通过设计令牌和轻量页面级样式表达，不新增独立样式体系。
- 工具页面与工具说明文档必须同步维护，避免页面行为与文档不一致。

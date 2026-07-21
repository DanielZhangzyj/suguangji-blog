## 项目结果：把两份 Excel 变成一个可持续更新的数据产品

这个项目的起点很具体：手里有 China Data.xlsx 和 Global Data.xlsx 两份 Mobility Global / IHS Markit 汽车产量预测文件，希望把它们做成一个能够在线筛选、比较和持续更新的数据看板。最终交付的不是一张固定截图，而是一套完整的数据产品链路：原始 Excel 经过 Python 清洗成统一长表，写入 Cloudflare D1 数据库，由 Pages Functions 提供 API，再由原生 JavaScript 和 ECharts 绘制全球地图、中国省份地图、年度产量、趋势、排名和 Program 矩阵。

截至这次复盘，当前版本包含 428,803 条有效产量记录，其中 China 88,151 条、Global 340,652 条。本地数据库完整性检查通过，16 项自动回归测试全部通过，线上版本运行在 [IHS 汽车产量数据看板](https://ihs-dashboard.pages.dev)。

这篇文章不会只罗列用了哪些工具。我更想完整讲清楚：为什么这样设计、数据怎样变形、数据库怎样建立、前后端怎样连接、项目怎样上线，以及以后每个月怎样安全地更新。

## 先画清楚整条数据链路

项目的主链路可以压缩成下面这张“文字架构图”：

```text
China / Global Excel
        ↓ Python + pandas + openpyxl
统一字段、宽表转长表、维度校验、生成导入 SQL
        ↓
本地 SQLite 完整性验证
        ↓ 分块导入
Cloudflare D1（生产数据库）
        ↓ SQL 聚合
Cloudflare Pages Functions（API）
        ↓ JSON
HTML + CSS + JavaScript + ECharts（交互看板）
        ↓
Cloudflare Pages（全球 CDN 部署）
```

这套架构的核心不是“云服务越多越好”，而是把职责切开：Excel 负责提供原始业务数据；ETL 负责把口径固定下来；数据库负责存储和查询；API 负责权限边界与聚合；前端只负责交互和展示。职责一旦混在一起，后面每个月更新都会变成一次手工救火。

## 技术栈分别解决了什么问题

### HTML、CSS 与原生 JavaScript

HTML 定义页面结构，CSS 负责深色科技风格、响应式布局和冻结列，JavaScript 管理筛选状态、请求 API、更新图表。这个项目没有引入 React 或 Vue，是因为页面本质上是单页分析看板，组件规模可控；原生方案依赖更少、构建更轻，也便于直接部署到 Pages。

“原生”不等于把所有逻辑写在一个文件里。项目仍然把请求封装、图表配置和页面状态拆开：API 模块统一处理参数和异常；charts 模块管理 ECharts；app 模块管理当前数据集、年份和联动筛选。真正需要避免的不是框架，而是没有边界的代码。

### ECharts

ECharts 是负责可视化的 JavaScript 图表库。它提供世界地图、中国地图、柱形图、折线图、视觉映射和自定义 tooltip。项目里最关键的改造，是把地图悬停提示从“累计产量数字”改成“逐年产量柱形图”。这样用户不需要离开地图，就能看出一个国家或省份在不同年份的产量变化。

趋势图开启数据标签；年度总产量卡片改为柱形图；Program 矩阵首列使用 CSS sticky 冻结。可视化设计的原则很简单：地图回答“在哪里”，趋势回答“什么时候”，排名回答“谁贡献最多”，矩阵回答“Program 在不同地区如何分布”。

### Python、pandas 与 openpyxl

Python 负责 ETL，也就是 Extract、Transform、Load：提取、转换、加载。pandas 适合处理表格、分组和宽长表转换，openpyxl 负责读取 Excel 工作簿结构和元数据。

原始工作表前几行不是正式数据，而是 Region、Forecast Release 等说明；真正的字段名在第 5 行。因此读取时使用 header=4，把前四行当作元数据跳过。随后把字段名统一为小写下划线，例如 Production Nameplate 变成 production_nameplate，Plant State/Province 变成 plant_state_province。

统一字段名并不是为了“好看”，而是为了让 Excel、Python、SQL 和 JavaScript 对同一概念使用同一个名字。如果字段口径在四层代码里各写一遍，迟早会出现品牌排名读错列、平台筛选仍用旧字段之类的问题。

### SQLite 与 Cloudflare D1

SQLite 是嵌入式关系型数据库，一个文件就是一套数据库；D1 是 Cloudflare 提供、兼容 SQLite SQL 方言的边缘数据库。项目先在本地构建 SQLite，再导入 D1，原因是本地校验速度快、成本低，而且失败不会影响线上。

关系型数据库的价值，在于能把“字段、关系、索引、查询”固化。Excel 很适合查看源数据，却不适合让网页在每次筛选时扫描几十万行。D1 可以通过索引快速完成按数据集、地区、年份、主机厂、Production Nameplate 和 Program 的聚合。

### Cloudflare Pages 与 Pages Functions

Pages 托管 HTML、CSS、JavaScript 和图片，并通过全球 CDN 分发。Pages Functions 是和页面一起部署的服务端函数：浏览器请求 API，函数在服务端查询 D1，再返回 JSON。这样原始数据库不会暴露给浏览器，SQL 也集中在服务端维护。

Cloudflare Wrangler 是命令行管理工具，负责创建 D1、执行 SQL、绑定数据库和发布 Pages。它把“在控制台里点很多次”变成可重复运行的命令，也是月度自动化流程的基础。

### Git 与 GitHub

Git 记录每次代码和配置变化，GitHub 保存远端仓库。它们不是单纯的云备份：一次可靠发布应该能回答“这次改了什么、什么时候改的、如何回到上一版”。源 Excel 含授权数据，所以不会提交 GitHub；仓库只保存代码、操作文档、数据指纹和少量前端兜底样本。

## 数据解析：为什么要把宽表转成长表

原始 Excel 中，每一行代表一个车型/工厂组合，Jan 2025、Feb 2025、Q1 2025、CY 2025 等时间都横向铺成很多列，这叫宽表。宽表适合人查看，但不适合通用查询。数据库更适合下面这样的长表：

```text
region | country | manufacturer | production_nameplate | program | period | period_type | volume
Asia   | China   | OEM A        | Model X              | P123    | 2026   | year        | 120000
Asia   | China   | OEM A        | Model X              | P123    | Jan-2026 | month     | 9800
```

pandas 的 melt 操作会保留地区、工厂、主机厂、品牌、Production Nameplate、Program 等维度，把所有时间列折叠成 period、period_type 和 volume 三列。之后，同一套 SQL 就能处理月度、季度和年度数据，而不需要为每一个年份写一组字段。

转换时还做了几项硬校验：

- China 和 Global 两份文件必须有相同的 Forecast Release。
- 必须存在 Region、Country/Territory、Production Plant、Manufacturer、Production Brand、Production Nameplate 和 Program。
- 必须同时包含月、季度和年度列。
- 清洗后的字段名不能重复。
- 只保留产量大于 0 的有效记录，减少数据库体积。
- JSON 空值必须输出为标准 null，不能出现 JavaScript 无法解析的 NaN。

## 数据库是怎样建立的

数据库主要有三张表：datasets 保存数据版本；production_records 保存长表明细；production_summary 保存部分预聚合结果。核心表可以抽象成下面的 SQL：

```sql
CREATE TABLE production_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dataset_id INTEGER NOT NULL,
  region TEXT,
  country_territory TEXT,
  production_plant TEXT,
  manufacturer TEXT,
  production_brand TEXT,
  production_nameplate TEXT,
  program TEXT,
  period TEXT NOT NULL,
  period_type TEXT NOT NULL,
  volume INTEGER DEFAULT 0
);

CREATE INDEX idx_prod_record
ON production_records(dataset_id, period_type, period, region, manufacturer);
```

索引可以理解成数据库的目录。没有索引时，筛选一个主机厂可能要从头扫描所有记录；有了组合索引，数据库能更快定位到指定数据集、期间和地区。索引并非越多越好，因为每次导入都要维护索引；应该围绕真实查询路径设计。

“全球数据”还有一个容易忽略的口径：China 文件是中国的更细数据，Global 文件本身也包含 Greater China。选择全部数据时，如果简单相加，中国会被计算两次。因此 API 使用 China 全量加 Global 排除 Greater China 的规则。数据看板最危险的错误通常不是页面报错，而是数字看起来合理、口径却重复。

## API 与联动筛选是怎样工作的

前端不会一次下载 42 万条明细，而是请求聚合接口。比如趋势接口按 period 求和，排名接口按 manufacturer、production_nameplate 或 program 分组，地图接口按 country_territory 或 plant_state_province 聚合。

所有筛选共享一个状态对象：数据集、地区、主机厂、品牌、Production Nameplate、省份和时间粒度。用户改变任意一项后，页面同时刷新图表数据和其他筛选项的可选值。

联动筛选需要注意一个细节：计算“品牌可选项”时要应用地区、主机厂等条件，但不能再用当前品牌过滤自己，否则用户选中一个品牌后，下拉框里只剩它自己，无法切换。后端生成每个筛选项时，会临时排除该字段自身，再应用其他条件。

国内页面额外显示省份筛选和中国地图。省份名称来自 Plant State/Province，但源数据中也可能存在拼写别名，因此服务端保留了别名映射。数据清洗不是一次性工作，真实数据中的别名、空值和历史命名都需要显式处理。

## 从需求到上线，功能是怎样迭代的

这个看板经历了多轮业务校准。最初地图只显示累计产量，后来改为逐年柱形 tooltip；国内页面补充了省份渲染和省份筛选；“全球数据”重复页面被移除，“全部数据”改名为“全球数据”；总产量卡片改为年度柱形图，而主机厂、工厂、国家/地区和车型总量继续保留数字卡片。

字段口径也经历了纠正：车型名称筛选和品牌产量排名统一使用 Production Nameplate；车型分类分布改为 Program 排名；Program 排名与 Production Nameplate 排名都支持年份筛选；平台矩阵也改为 Program 字段并冻结首列。

这里有一个值得复用的方法：业务方说“排名不对”时，不要先调整颜色或排序，要先把图表标题、分组字段、时间粒度和去重规则逐项写清楚。可视化只是查询结果的外观，正确性首先来自数据口径。

## D1 为什么需要分块导入

完整 SQL 文件很大，单条 INSERT 包含太多参数会触发 D1 的请求或变量限制。因此 ETL 先生成 SQL，再由 Node.js 脚本按固定记录数和批次拆成多个小文件。当前数据生成 China 18 个分块、Global 69 个分块。

SQL 分块还有一个隐藏坑：Excel 的可选字段为空时，不同行可能拥有不同的列集合。如果把列集合不同的行塞进同一条 INSERT，列数和数值数就会错位。修复方式是按“完全相同的列集合”分批，列发生变化时立即结束当前 INSERT。自动测试也会专门验证这一点。

## 上传与部署：从本地到 Cloudflare 与 GitHub

日常代码发布的基本顺序是：

```powershell
npm test
npm run build
npm run deploy
git add -A
git commit -m "feat: describe the change"
git push origin main
```

其中 npm test 检查筛选、字段口径、地图、排名、静态样本和 D1 分块；npm run build 检查需要发布的 HTML、CSS、JS、地图资源、函数和 Wrangler 配置；npm run deploy 把 src 和 Pages Functions 发布到 Cloudflare。

数据库更新比静态页面发布风险更高，所以不直接在旧库上清空重导，而是采用蓝绿发布：新建一个 D1，初始化 schema，导入全部分块，远端核对记录数，修改 wrangler.toml 的绑定，再部署 Pages。旧库继续保留，随时可以切回。

## 每月数据更新：现在已经变成标准流程

以后每个月只需用同名新文件覆盖旧文件：

- China Data.xlsx
- Global Data.xlsx

然后双击 ihs-dashboard 目录中的 monthly-update.bat。它默认只做本地预检，不会改线上。也可以在 PowerShell 执行：

```powershell
.\scripts\monthly-update.ps1
```

预检会读取源文件、校验字段和版本、执行 ETL、构建本地 SQLite、运行 quick_check、核对 JSONL 与数据库记录数、生成 D1 分块、执行 16 项回归测试并构建前端。结果写入 data/update-report.json。

确认报告无误后，正式发布：

```powershell
.\scripts\monthly-update.ps1 -Publish
```

脚本要求输入 PUBLISH 二次确认，然后创建全新的当月 D1。只有远端记录数、Forecast Release 和线上 API 全部核对成功，才会提交 GitHub 并报告完成。如果切换后健康检查失败，脚本会恢复旧 D1 绑定并重新部署。

这套流程也设置了一个数据漂移护栏：如果源数据行数比上一个成功版本变化超过 25%，默认停止。先确认不是拿错文件、漏导工作表或数据被截断；只有确认是正常业务变化后，才允许显式使用 AllowLargeChange 参数继续。

## 开发过程中最有价值的几个故障

第一个故障是 pandas 的 to_sql 在使用数据库 URI 时隐式要求 SQLAlchemy。这个项目其实只需要 SQLite，于是改为直接使用 Python 内置 sqlite3 连接，减少一个没有必要的安装依赖。可维护性的一条朴素原则是：能用标准库稳定完成，就不要让月度流程依赖一个隐式组件。

第二个故障是 pandas 浮点列里的空值，即使调用 where 替换，也可能继续保留为 NaN。Python 的 json 模块可以写出 NaN，但它不是标准 JSON，浏览器的 JSON.parse 会直接失败。修复是先把 DataFrame 转为 object 类型，再把缺失值替换为 None，并用前端测试真实解析输出文件。

第三个故障是 SQL 批量插入的列头使用了批次最后一行的字段，前面的行如果缺少省份字段，就可能和列头错位。解决它不能只“补一个 NULL”，因为未来还可能有其他可选字段缺失；更稳妥的办法是列集合变化就刷新批次。

第四个问题来自 Windows 路径、中文目录与凭据环境。脚本统一使用 LiteralPath 和绝对路径，避免把 & 或中文误解成命令；Cloudflare 与 GitHub 凭据不写入仓库，只复用本机已经授权的 Wrangler 和 Git 凭据。

## 后期维护应关注什么

- 每月先预检、看报告，再发布，不要把“覆盖 Excel”和“改线上数据库”合并成一步。
- 至少保留最近 2—3 个成功 D1 数据库，不要当天删除旧库。
- Excel 文件名、工作表名或前五行结构改变时，先更新并测试 ETL。
- 字段口径变化要同时检查 schema、ETL、API、筛选和图表标题。
- 升级 pandas、openpyxl、Node.js、Wrangler 或 ECharts 后跑完整回归。
- 源 Excel、JSONL、SQLite 和 D1 SQL 不提交 GitHub，避免泄露授权数据。
- 每次线上发布后检查版本标题、两个数据视图、联动筛选、地图 tooltip、三个排名、趋势、矩阵和 CSV 导出。

## 最后的复盘

从 Excel 做到线上看板，真正困难的并不是画一张世界地图，而是把数据口径、处理流程、查询边界、部署方法和后续维护一起设计出来。只完成页面，项目会在下个月收到新文件时重新变成一次性工程；把校验、数据库、测试、部署和回滚都写进流程，它才开始成为一个可以长期使用的数据产品。

这次项目让我再次确认：AI 辅助开发最有价值的地方，不只是更快地生成代码，而是能陪业务需求持续落到字段、查询、测试和运维上。页面上线是一个节点，可重复更新才是交付完成的标志。

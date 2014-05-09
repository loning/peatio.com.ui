peatio.com.ui
=============

貔貅([https://github.com/peatio/peatio](https://github.com/peatio/peatio "peatio"))前端设计以及代码


###设计部分
`docs/ui/` 目录下


###代码
`public/`下

###前后端交互接口

接口规范参见 “[前后端交互规范.md](前后端交互规范.md)”

###独立运行

为了实现在合作开发商的前后端分离，使前端的测试环境不依赖于貔貅的后端，特假定：

1. 所有和貔貅交互的接口均为 restful 接口
2. 前端代码无需在服务器端做渲染处理
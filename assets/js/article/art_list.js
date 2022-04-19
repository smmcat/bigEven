$(function () {
    // 提示框操作
    let layer = layui.layer;
    // 表单元素操作
    let form = layui.form;
    // 分页结构操作
    let laypage = layui.laypage;

    // 定义美化时间样式 template过滤器
    template.defaults.imports.dataFormat = function (data) {

        //定义补零的函数
        function padZero(n) {
            return n > 9 ? n : '0' + n;
        }

        // 实例化 时间对象 传入时间
        const dt = new Date(data);
        // 年月日
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());
        // 时分秒
        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义一个查询的参数对象 将来请求数据的时候 用于提交到服务器
    let q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示的数量
        cate_id: '', // 文章分类的 UID
        state: '' // 文章 发布状态
    }

    // 初始化 文章列表
    initTable();
    // 初始化 文章分类筛选
    initCate();

    // 获取文章列表数据 并 渲染样式
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败');
                } else {
                    console.log(res);
                    if (res.total !== 0) {
                        // 使用模板引擎渲染页面数据
                        let htmlStr = template('makeListTemp', res);
                        $('#putList').html(htmlStr);
                        // 传入文章总数 渲染分页
                        renderPage(res.total);
                    } else {
                        // 若内容为空 返回空样式
                        let htmlStr = template('zeroListTemp', res);
                        $('#putList').html(htmlStr);
                    }
                }
            }
        })
    }

    // 获取文章分类数据 并 赋值在 分类选框
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败');
                } else {
                    // 调用模板引擎拼接 分类模板 + 数据
                    let htmlStr = template('tpl-cate', res);
                    // 将分类栏目渲染到 选择框
                    $('[name=cate_id]').html(htmlStr);
                    // 由于初始化时某项表单区可选项为空 因此layui自动渲染了空样式
                    // 通知 layui 重新渲染表单区的 UI结构
                    form.render();
                }
            }
        })
    }

    // 提交筛选按钮 单击事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        // 根据最新的筛选 重新渲染表单数据
        initTable();
    });


    // 定义渲染分页的方法
    function renderPage(total) {
        // laypage.render() 渲染分页结构
        laypage.render({
            elem: 'pageBox', // 分页容器 ID
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示数据量
            curr: q.pagenum, // 设置默认选中的分页
            // 布局方式 左→右
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 指定分页数量
            limits: [2, 3, 4, 5],
            // 分页发生切换时 或 初始化 时 都会触发 jump回调 执行方法
            // 因此不能直接调用渲染页面函数 会不断发生 jump回调
            jump: function (obj, flist) {
                // 可以通过 first 值来判断是通过哪种方式触发的 jump回调
                console.log(flist);
                // 条目变化 直接赋值
                q.pagesize = this.limit;
                // curr 返回当前的页码值 赋值与 q.pagenum 实现同步请求
                q.pagenum = obj.curr;
                // 判断为哪种方式触发的 回调函数
                if (!flist) {
                    initTable();
                }
            }
        });
    }

    // 删除单击后
    $('#putList').on('click', '.layui-btn-del', function () {
        // 获取欲删除的文章的 Id
        let Id = $(this).attr('data-id');
        // 当前页 剩余的 文章数量
        let len = $('.layui-btn-del').length;
        // 弹出询问框
        layer.confirm('确定删除该文章？', { icon: 3, title: '提示' },
            function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + Id,
                    success: function (res) {
                        if (res.status !== 0) {
                            // 提示 并 返回
                            return layer.msg('删除失败');
                        } else {
                            // 提示
                            layer.msg('删除成功');
                            // 当该分页执行删除操作后 将不存在内容时
                            if (len === 1) {
                                // 初始化至 新分页
                                q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                            }
                            // 刷新 分页内容
                            initTable();
                        }
                    }
                })
                // 关闭询问框
                layer.close(index);
            });
    })

    // 发起编辑文章
    $('#putList').on('click', '.layui-btn-edit',function(){
        // 获取到按钮下的 文章id
        let editId=$(this).attr('data-id');
        // 跳转到发布文章 页面 并携带 文章id 参数
        location.href = '../article/art_pub.html?'+editId;
    });
    
});
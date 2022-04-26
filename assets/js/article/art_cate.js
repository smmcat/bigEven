$(function () {

    // 从 layui 中获取 layer 对象 该对象放置了 一些弹窗提示
    let layer = layui.layer;
    // 从 layui 中获取 from 对象
    let form = layui.form;

    // 获取所有文章的 id
    let allCate = [];
    // 初始化 预渲染
    getCatesList();

    // 初始化 弹出层下标 用于关闭 弹出层
    let layerIndex = null;
    // 添加类别 按钮 绑定 单击事件
    $('#btnAddCate').on('click', function () {
        autoCH = true;
        // 弹出层 提示框
        layerIndex = layer.open({
            // 类型 [0 信息框(默认), 1 页面层, 2 iframe层, 3 加载层, 4 tips层]
            type: 1,
            // 大小
            area: ['500px', '250px'],
            // 标题
            title: '添加文章分类',
            // 内容 获取 提示框模板
            content: $('#dialog-add').html()
        })
    })

    let autoCH = true;

    // 自动 填拼音
    function change_ch(autoCH, obj) {
        if (autoCH) {
            let text = obj.val();
            obj.parents('#form-add').find('#setZH').val(pinyin.getFullChars(text));
        }
    }

    $('body').on('keyup', '#catePut', function () {
        change_ch(autoCH, $(this));
    });


    // 开启 / 关闭 自动填拼音
    $('body').on('click', '#Elementauto', function () {
        if (autoCH) {
            $(this).removeClass('layui-form-onswitch').addClass('layui-form-offswitch');
            autoCH = false;
        } else {
            $(this).removeClass('layui-form-offswitch').addClass('layui-form-onswitch');
            autoCH = true;
        }
    });




    // 添加分类 表单提交事件
    // 通过代理方式 为 form-add 表单提交事件 绑定事件处理函数
    $('body').on('submit', '#form-add', function (e) {
        // 阻止默认行为
        e.preventDefault();
        let data = $(this).serialize();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('分类添加失败');
                } else {
                    getCatesList();
                    layer.msg('分类添加成功');
                    // 根据索引关闭弹出层
                    layer.close(layerIndex);
                }
            }
        });
    });

    // 编辑按钮单击事件
    // 通过代理方式 为 编辑按钮 添加绑定事件
    let indexEdit = null;
    $('#table_main').on('click', '#changeCate', function () {
        // 弹出 修改文章内容信息层 提示框
        indexEdit = layer.open({
            // 类型 [0 信息框(默认), 1 页面层, 2 iframe层, 3 加载层, 4 tips层]
            type: 1,
            // 大小
            area: ['500px', '250px'],
            // 标题
            title: '修改',
            // 内容 获取 提示框模板
            content: $('#dialog-edit').html()
        });
        let id = $(this).attr('index');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })
    });


    // 获取分类标签并渲染到界面
    function getCatesList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/',
            success: function (res) {
                // 模板函数生成 HTML结构字符串
                let htmlStr = template('tpl_table', res);
                $('#table_main').html(htmlStr);
                // 初始化
                allCate = [];
                // 赋值对象
                res.data.forEach(data => {
                    allCate.push(data.Id);
                });
            }
        });
    }


    // 编辑分类
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        let data = $(this).serialize();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败');
                } else {
                    layer.msg('更新成功');
                    layer.close(indexEdit);
                    getCatesList();
                }
            }
        })
    });


    // 删除分类 按钮 单击事件
    $('body').on('click', '#delCate', function () {
        // 获取对应的 id下标
        let id = $(this).attr('index');
        // 发起询问 传入三个参数 提示 内容 回调函数
        layer.confirm('确定删除？', { icon: 3, title: '提示' },
            //若 选中确定 执行 下方函数
            function (index) {
                // 发起 ajax 请求
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            layer.close(index);
                            return layer.msg('删除失败!');
                        } else {
                            layer.msg('删除成功');
                            // 关闭弹出窗
                            layer.close(index);
                            // 重新渲染页面
                            getCatesList();
                        }
                    }
                });
            });
    });

    // 一键删除
    $('#btnAddDel').on('click', function () {
        // 发起询问 传入三个参数 提示 内容 回调函数
        layer.confirm('确定全部删除？', { icon: 3, title: '提示' },
            //若 选中确定 执行 下方函数
            function (index) {
                let i = 0;
                let type = false;
                let delNum = 0;
                let allCateLen=allCate.length;
                // 发起 ajax 请求
                while (i<allCateLen) {
                    $.ajax({
                        method: 'GET',
                        url: '/my/article/deletecate/' + allCate[i],
                        success: function (res) {
                            if (res.status !== 0) {
                                // 操作次数
                                delNum++;
                                // 当完成总进度后 返回
                                if(i==allCate-1){
                                    checkOver();
                                }
                            } else {
                                // 是否成功
                                type = true;
                                // 操作次数
                                delNum++;
                                console.log(delNum);
                                // 当完成总进度后 返回
                                if(allCateLen==allCate.length){
                                    checkOver();
                                }
                            }
                        }
                    });
                    // 总进度
                    i++;
                }
                function checkOver() {
                    layer.msg('删除成功');
                    // 关闭弹出窗
                    layer.close(index);
                    // 重新渲染页面
                    getCatesList();
                }
            });
    })
});
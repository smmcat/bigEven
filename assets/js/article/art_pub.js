$(function () {

    // 提示框操作
    let layer = layui.layer;
    // 表单操作
    let form = layui.form;

    // 获取上个页面传送的 '?' 后面的字符串参数 若无 则 赋值空
    let tempId = Number((location.search).slice(1)) || '';

    // 初始化富文本
    initEditor();
    // 初始化分类
    initCateData();

    /*
    判断是否为编辑或发布状态: 若 tempId 有值 
    说明是有参数从 文章管理 的编辑项 传递过来的
    若 无 tempId 则为用户 点击 发布文章 所响应的
    因为只有 编辑按钮 会携带参数
    */
    // 判断发起的是否为 编辑
    if (tempId) {
        $('#biaoti').html('编辑文章');
        // 为界面填充内容
        getEditList();
    }



    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面按钮 单击事件
    $('#btnChooseImage').on('click', function () {
        // 模拟 上传按钮单击
        $('#coverFile').click();
    });

    // 预先将上传文件路径的值 设置为 空值
    let newImgUrl = '';
    // 上传按钮单击事件
    $('#coverFile').on('change', function (e) {
        // 获取用户选择的 文件数组
        let file = e.target.files[0];
        // 若用户未选择文件 则取消任何操作
        if (file.length === 0) {
            return
        }
        // 如果存在内容 清除上一个 文件路径
        newImgUrl && URL.revokeObjectURL(newImgUrl);
        // 根据选择的文件 创建一个 对应的 URL地址
        newImgUrl = URL.createObjectURL(file);
        // 1.销毁旧的裁剪区域 2.重新设置文件路径 3.创建新的裁剪区域
        $image
            .cropper('destroy')
            .attr('src', newImgUrl)
            .cropper(options);
    });



    // 加载分类数据
    function initCateData() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败');
                } else {
                    layer.msg('获取分页成功');
                    // 调用模板 拼接分类下拉菜单 模板 + 数据
                    let htmlStr = template('tpl-cate', res);
                    // 动态渲染下拉框 内容
                    $('#getCate').html(htmlStr);
                    // 通知 layui 重新渲染表单区的 UI结构
                    form.render();
                }
            }
        })
    }

    // 初始化默认发布状态
    let art_state = '已发布';
    // 存为草稿 按钮 单击事件
    $('#btnDraft').on('click', function () {
        // 修改 发布状态 为已发布
        art_state = '草稿';
    });

    // 监听 form-pub 页面提交表单事件 执行事件处理方法
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交事件
        e.preventDefault();
        // 创建 from对象
        let fd = new FormData($(this)[0]);
        // 将当前的 发布状态 赋值到 from对象
        fd.append('state', art_state);
        // 获取裁剪后的图片

        // 创建一个 Canvas 画布
        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            // 转换成 blob二进制 文件
            .toBlob(function (blob) {
                // 将 Canvas画布 上的内容 转换为文件对象 存在 fd 中
                fd.append('cover_img', blob);
                // 判断是否为发布 或 编辑
                if (!tempId) {
                    // 发布文章 传入 FormData数据
                    publishArticle(fd);
                } else {
                    // 引用对象 Id 存在 fd 中   
                    fd.append('Id', tempId);
                    // 编辑文章 传入 FormData数据
                    editArticle(fd);
                }
            });
    })

    // 发布文章
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如果向服务器提交的是FormData格式的数据
            //必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    // 若发布失败 弹出提示 并返回
                    return layer.msg('发布文章失败！')
                }
                window.parent.layer.msg('发布文章成功！');
                // 为父级对应的类 修改选中样式
                window.parent.$('#artic_admin').children('dd').eq(1).addClass('layui-this').siblings().removeClass('layui-this');
                // 发布文章成功后 跳转到文章列表页面
                location.href = '../article/art_list.html'
            }
        })
    }


    // 获取编辑内容
    function getEditList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + tempId,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取编辑内容信息失败');
                } else {
                    // 将返回的数据存在临时变量中
                    let temp = res.data;
                    // 建立 编辑文章 有效的表单成员
                    let cata = {
                        'title':temp.title,
                        // 若该 id 下的分类已删除 返回 默认序号
                        'cate_id': temp.cate_id || 1,
                        'content':temp.content
                    }
                    // 将对应的表单成员 使用form.val 依次赋值
                    form.val('form-pub', cata);
                    // 取得图片参数 为 接口地址 + url 
                    let editNewImg = 'http://www.liulongbin.top:3007' + temp.cover_img;
                    // 将 返回的图片 替换掉 默认图片
                    $image
                        .cropper('destroy')
                        .attr('src', editNewImg)
                        .cropper(options);
                }
            }
        })
    }

    // 编辑文章
    function editArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            //注意：如果向服务器提交的是FormData格式的数据
            //必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    // 若发布失败 弹出提示 并返回
                    return window.parent.layer.msg('编辑文章失败！')
                }
                window.parent.layer.msg('编辑文章成功！');
                // 初始化 对象
                window.parent.$('body').data('editList', '');
                // 为父级对应的类 修改选中样式
                window.parent.$('#artic_admin').children('dd').eq(1).addClass('layui-this').siblings().removeClass('layui-this');
                // 发布文章成功后 跳转到文章列表页面
                location.href = '../article/art_list.html'
            }
        })
    }


})

// 在该页面发生跳转时 清除父级残留 对象属性
// document.addEventListener('visibilitychange', function () {
//     window.parent.$('body').data('editList', '');
// });
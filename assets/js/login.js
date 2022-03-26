
// 入口函数
$(function () {

    // 跳转注册
    $('#link_reg').on('click', function () {
        $('.login_box').hide();
        $('.reg_box').show();
    });
    // 跳转登录
    $('#link_login').on('click', function () {
        $('.login_box').show();
        $('.reg_box').hide();
    });
    // -----------------------------
    // 从 layui 中获取 form 对象 该对象 放置了 默认的校验算法
    let form = layui.form;
    // 从 layui 中获取 layer 对象 该对象放置了 一些弹窗提示
    let layer = layui.layer;


    // 通过 form.verify() 添加 自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //校验两次密码是否一致 不采用正则表校验
        repwd: function (value) {
            // 采用属性选择器方法选中标签 []
            let pwd = $('.reg_box [name=password]').val();
            // 判断 校验传入的值 与 目标值 是否一致 
            if (value !== pwd) {
                return '密码输入不一致';
            }
        }
    });

    // 监听注册表单提交事件
    $('#from_reg').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 定义变量 data 用于 临时存储 接收到的 注册表单数据
        let data = { username: $('.reg_box [name=username]').val(), password: $('.reg_box [name=password]').val() };
        // 发起 post 请求 传入表单参数 接收返回值
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            } else {
                $('#link_login').click();
                layer.msg('注册成功!跳转登录');
            }
        })
    })

    // 监听登录表单提交事件
    $('#from_login').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 发起 ajax请求 为POST请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // serialize可以获取表单提交的值，以 ?name=值& 的字符串格式
            data: $(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('登录失败');
                }else{
                    layer.msg('登录成功');
                    // 获取登录后返回的 token 并进行 本地存储
                    localStorage.setItem('token',res.token);
                    // 跳转到主页
                    // location.href='index.html';
                }
            }
        })
    });
});
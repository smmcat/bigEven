$(function () {
    // 从 layui 中获取 form 对象 该对象 放置了 默认的校验算法
    let form = layui.form;
    // 从 layui 中获取 layer 对象 该对象放置了 一些弹窗提示
    let layer = layui.layer;
    // 通过 form.verify() 添加 自定义校验规则
    form.verify({
        // 校验规则 密码输入规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验规则 新密码不能与旧密码相同
        samePwd: function (value) {
            let pwd = $('.layui-form [name=oldpwd]').val();
            // 判断 校验传入的值 与 目标值 是否不一致 
            if (pwd === value) {
                return '新密码不能与旧密码相同'
            }
        },
        // 校验规则 密码与确认密码需一致
        repwd: function (value) {
            // 采用属性选择器方法选中标签 []
            let pwd = $('.layui-form [name=newpwd]').val();
            // 判断 校验传入的值 与 目标值 是否一致 
            if (value !== pwd) {
                return '密码输入不一致';
            }
        }
    })

    // 发起请求
    $('.layui-form').on('submit', function (e) {
        // 阻止默认事件提交
        e.preventDefault();
        // 获取数据
        let pwddata = { oldPwd: $('.layui-form [name=oldpwd]').val(), newPwd: $('.layui-form [name=newpwd]').val() }
        // 发起 ajax 请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: pwddata,
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('原密码校验失败');
                } else {
                    layer.msg('密码修改成功');
                    // 重置表单
                    $('.layui-form')[0].reset();
                }
            }
        });
    });
});
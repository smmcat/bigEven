$(function () {

    initUserInfo();

    // 重置表单存值
    let infoTemp=null;

    // 表单正则校验类
    let form = layui.form;
    // 提示框类
    let layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符';
            }
        }
    });

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                } else {
                    // putUserInfo(res.data);
                    // 调用 form.val() 快速为表单赋值
                    form.val('formUserInfo', res.data);
                    // 存值
                    infoTemp=res.data;
                }
            }
        })
    }

    // 重置表单数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        form.val('formUserInfo', infoTemp);
    })

    // 提交表单数据
    $('.layui-form').on('submit',function(e){
        // 阻止表单的默认重置行为
        e.preventDefault();  
        // 发起 ajax 请求  
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    layer.msg('更新用户信息失败');
                }else{
                    layer.msg('修改用户信息成功');
                    // 调用父页面中的方法 重新渲染用户头像和用户信息
                    window.parent.getUserInfo();
                }
            }
        })
    })

    // function putUserInfo(data) {
    //     $('.layui-card [name=username]').val(data.username);
    //     $('.layui-card [name=nickname]').val(data.nickname);
    //     $('.layui-card [name=email]').val(data.email);
    // }
})
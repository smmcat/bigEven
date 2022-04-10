$(function () {

    // 从 layui 中获取 layer 对象 该对象放置了 一些弹窗提示
    let layer = layui.layer;

    // 调用 getUserInfo 获取用户基本信息
    getUserInfo();
    // 退出按钮 事件绑定
    $('#btnLoginOut').on('click', function () {
        // 发起询问 传入三个参数 提示 内容 回调函数
        layer.confirm('确定退出登录吗？', { icon: 3, title: '提示' },
            //若 选中确定 执行 下方函数
            function (index) {  
                // 清空本地存储     
                localStorage.removeItem('token');
                // 跳转到登录页
                location.href = 'login.html';
            });
    });
});


// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败');
            } else {
                // 调用 renderAvatar 渲染用户头像
                renderAvatar(res.data);
            }
        },
    });
}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户名称
    let name = user.nickname || user.username;
    // 2.设置欢迎文本
    $('#wellocom').text(name);
    // 3.按需渲染用户头像
    if (user.user_pic) {
        // 若有头像 文字头像隐藏
        $('.text-avatar').hide();
        console.log(user.user_pic);
        // 返回的图片 是 base64 字符串 的形式
        // base64 它直接描述了一张图片 而不是文件路径 减少后续的网络请求
        // base64格式的文件 它要比源文件增大30% 不建议将大图转成 base64格式
        $('.userinfo img').attr('src',user.user_pic).show();
    } else {
        // 提取用户名称 首字
        let fistName = name[0];
        // 将 用户名称首字 加到 文字头像上
        $('.text-avatar').text(fistName.toUpperCase());
    }
}

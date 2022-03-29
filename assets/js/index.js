$(function () {

    // 从 layui 中获取 layer 对象 该对象放置了 一些弹窗提示
    let layer = layui.layer;

    // 调用 getUserInfo 获取用户基本信息
    getUserInfo();
    $('#btnLoginOut').on('click', function () {
        layer.confirm('确定退出登录吗？', { icon: 3, title: '提示' },
            //若 选中确定 执行 下方函数
            function (index) {
                // 清空本地存储     
                localStorage.removeItem('token');
                // 跳转到登录页
                location.href = 'login.html';
            });
    });
})


// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败');
            } else {
                console.log(res.data);
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
        $('.userinfo img').attr('src', user_pic).show();
    } else {
        // 提取用户名称 首字
        let fistName = name[0];
        // 将 用户名称首字 加到 文字头像上
        $('.text-avatar').text(fistName.toUpperCase());
    }
}
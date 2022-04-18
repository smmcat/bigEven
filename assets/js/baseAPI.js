
/*
    为方便管理 和维护 API接口文档
    我们需要将请求的 url 进行一个单独抽离

    该 $.ajaxPrefilter 包含了 所有的 ajax 请求的数据 并执行 预处理
    以下内容为 baseAPI.js 修改的内容

    1. 补全每次发起 ajax 请求时拼接链接的根路径
    2. 若发起需要权限的 /my/ 接口将补全 token
    3. 防止无 token 直接访问 index 页面 将跳转回登录界面
*/


// 当每次发起 ajax 请求时 会先调用 $.ajaxPrefilter 函数
// 该函数可 获得每次 ajax请求时 提供的配置对象
$(function(){
    $.ajaxPrefilter(function (options) {
        // 项目的请求根路径
        let url = 'http://www.liulongbin.top:3007';
        // 每次请求进行拼接
        options.url = url + options.url;
        // 若发起 需要权限的接口
        if (options.url.indexOf('/my/') !== -1) {
            // headers 请求头 预赋值 统一有权限接口
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }
        }
        // 无论请求成功还是失败 都会调用该函数
        options.complete = function (res) {
            // 在complete 回调函数中 可以使用 res.response.JSON 拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 清空本地存储     
                localStorage.removeItem('token');
                // 跳转到登录页
                location.href = 'login.html';
            }
        }
    });
})
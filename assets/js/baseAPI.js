
/*
    为方便管理 和维护 API接口文档
    我们需要将请求的 url 进行一个单独抽离
*/


// 当每次发起 ajax 请求时 会先调用 $.ajaxPrefilter 函数
// 该函数可 获得每次 ajax请求时 提供的配置对象
$.ajaxPrefilter(function (options) {
    // 项目的请求根路径
    let url = 'http://www.liulongbin.top:3007';
    // 每次请求进行拼接
    options.url = url + options.url;
}) 
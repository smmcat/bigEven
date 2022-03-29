
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
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                } else {
                    layer.msg('登录成功');
                    // 获取登录后返回的 token 并进行 本地存储
                    localStorage.setItem('token', res.token);
                    // 跳转到主页
                    location.href = 'index.html';
                }
            }
        })
    });

    // 阻止拖拽 单击事件 避免不必要麻烦
    $('.layui-main').on('mousedown click',function(e){
       e.preventDefault();
    });
    $('.FAmenu').on('mousedown click',function(e){
        e.preventDefault();
     });

    // 【预防 精神干扰】 禁止 在输入框区域  鼠标按下 键盘按下 的冒泡事件
    $('.login').on('mousedown keyup',function(e){
        e.stopPropagation();
    });

    // 预设旋律 打上FA火
    let FaMiuse = '12-13-15-11-12-13-15-11-12-13-15-16-12-13-06-11';
    // 进行乐器分组
    FaMiuse = FaMiuse.split('-');
    // 校验
    console.log(FaMiuse);

    // 起始位置
    let smmfa = 0;
    // 定时器
    let timer = null;
    let timer_2 = null;
    // 阀
    let autoFa = true;


    $(document).on('keyup', function (e) {
        ;
        if (e.keyCode == 70) {
            if (autoFa) {
                // 阀
                autoFa = false;
                // 提示信息
                layer.msg('自动播放中');
                // 阻止按钮单击事件 扰乱旋律
                $(document).off('mousedown');
                // 自动播放 间隔 5s
                timer_2 = setInterval(() => {
                    FAplay();
                }, 500);
            } else {
                layer.msg('关闭 FA');
                // 清除 定时器
                clearInterval(timer_2);
                // 初始化 阀
                autoFa = true;
                // 重新绑定 单击事件 播放 FA音
                $(document).on('mousedown', function () {
                    FAplay();
                });
            }
        }
    })

    // 播放 FA音
    $(document).on('mousedown', function () {
        FAplay();
    });

    //FA音 Jio本
    function FAplay() {
        // 循环曲谱
        smmfa == FaMiuse.length - 1 ? smmfa = 0 : smmfa = smmfa;
        // 防抖策略
        clearTimeout(timer);
        // 当前音调 显示
        $('.FAmenu').show();
        $('.FAmenu').text(formatFa(FaMiuse[smmfa]));
        // 提示 渐消
        timer = setTimeout(() => {
            $('.FAmenu').hide();
        }, 1000);
        // 播放
        $('#voice')[0].src = 'assets/video/' + FaMiuse[smmfa] + '.mp3';
        // 下一个 音调
        smmfa++;
    }

    // 格式化
    function formatFa(fa) {
        let temp = 0;
        switch (fa[0]) {
            case '1':
                temp = '+' + fa[1];
                break;
            case '0':
                temp = fa[1];
                break;

            case 'd':
                temp = '-' + fa[1];
                break;
            default:
                break;
        }
        return temp;
    }
    console.log(formatFa('12'));
});
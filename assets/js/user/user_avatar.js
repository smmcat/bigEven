$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options);

    // 模拟文件上传 为上传头像添加绑定事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    });

    // 提示框类
    let layer = layui.layer;

    // 初始化 URL对象
    let newImgUrl = null;
    // 文件改变
    $('#file').on('change', function (e) {
        // 获取 上传的文件 对象
        let fileList = e.target.files;
        if (fileList.length === 0) {
            // 若用户没有选择任何问题 显示提示
            return layer.msg('请选择照片!');
        } else {
            // 释放 上一个 URL对象
            newImgUrl && URL.revokeObjectURL(newImgUrl);
            // 获取 上传的文件地址
            newImgUrl = URL.createObjectURL(fileList[0]);
            // 重新渲染             
            $image
                .cropper('destroy') // 销毁裁剪区域
                .attr('src', newImgUrl) // 重新设置图片路径
                .cropper(options); // 重新初始化裁剪区域
        }
    });

    // 上传图片 绑定单击事件
    $('#btnUpload').on('click', function () {
        // 创建一个 Canvas 画布
        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        let dataURL = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/png');

        // 发起 ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function (res) {
                if(res.status!==0){
                    return layer.msg('更新头像失败!');
                }else{     
                    layer.msg('更新头像成功');
                    // 调用父页面中的方法 重新渲染用户头像和用户信息
                    window.parent.getUserInfo();
                }
            }
        })
    });
});


// parent 获取父级 窗口宽度
window.parent.addEventListener('resize', function () {
    console.log(window.parent.innerWidth);
});
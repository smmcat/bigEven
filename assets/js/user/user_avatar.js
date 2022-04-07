// $(function(){

// });



var obb = {
    x: 222,
    y: {
        x: '我是调用say的上文',
        obc: function f() {
            var x = '我是父级';
            var obj = {
                x: '我是兄弟',
                // 箭头函数没有this 箭头函数的this是继承父执行上下文里面的this 
                say: () => {
                    console.log(this.x);
                }
            }
            obj.say();
        }
    }
}
obb.y.obc();
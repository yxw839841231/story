/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'form','layedit','jquery','util','zjoin'], function(exports){
    var layer = layui.layer
        ,layedit = layui.layedit
        ,form = layui.form
        ,$=layui.jquery
        ,util = layui.util
        ,zjoin = layui.zjoin;

    var articleEdit = layedit.build('content');
    util.fixbar({
        bar1: '&#xe62f;'
        ,bar2: '&#xe6b2;'
        ,css: {right: 50, bottom: 100}
        ,bgcolor: '#393D49'
        ,click: function(type){
            if(type === 'bar1'){
                layer.msg('icon是可以随便换的')
            } else if(type === 'bar2') {

            }
        }
    });

    //自定义验证规则
    form.verify({
        title: function (value) {
            if (value.length < 2) {
                return '标题至少得2个字符';
            }
        } ,
        content: function (value) {
            layedit.sync(articleEdit);
        }
    });

    form.on("submit(addArticle)",function(data){
        $.ajax({
            url:'/story/article/add',
            type:'post',
            data:data.field,
            success:function(){
                layer.msg("发表成功！");
                window.location.reload();
            }
        });
        return false;
    });
    zjoin({image:$("#cover-image"),input:$("#cover")});
    exports('article', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});

layui.define(['layer', 'form', 'ZJOINS'], function (exports) {
    var layer = layui.layer,
        $ = layui.jquery,
        ZJOIN = layui.ZJOINS,
        ELEM = '.zjoin-upload',

        ZJOIN_default = {},
        Zjoin = function (options) {
            var that = this;
            ZJOIN_default = that.config = options || {};
            return that;
        };

    //全局设置
    Zjoin.prototype.set = function (options) {
        var that = this;
        $.extend(true, that.config, options);
        ZJOIN_default = that.config
        return that;
    };
    var upload = function () {
        var head = $("head").remove("script[role='reload']");
        $("<scri" + "pt>" + "</scr" + "ipt>").attr({ role: 'reload', src: '/layui/js/modules/qiniu.js', type: 'text/javascript' }).appendTo(head);

        layer.open({
            type: 1,
            id: 'fly-jie-upload',
            title: '插入图片',
            shade: 0.5,
            area: '300px',
            //skin: 'layui-layer-border',
            content: ['<div id="container" class="layui-form layui-form-pane" style="margin: 20px;"><p><div id="pickfiles" class="layui-btn" style="width:100%;padding:0!important"><div id="upload-progress" style="width:100%;height:100%;">上传文件</div></div></p></div>'].join(''),
            success: function (layero, index) {
                $.ajax({
                    type: "POST",
                    url: "/api/uptoken/",
                    dataType: "json",
                    success: function (data) {
                        if (data.code != 0) return layer.close(index), layer.msg('无效token', {
                            icon: 5
                        });
                        $("#upload-progress").css({
                            "background": "url(/layui/images/loading.png) no-repeat",
                            "background-size": "0% 100%"
                        });
                        var uploader = Qiniu.uploader({
                            runtimes: 'html5,flash,html4',
                            browse_button: 'pickfiles',
                            uptoken_url: '/api/uptoken/',
                            uptoken: data.value,
                            unique_names: false,
                            save_key: false,
                            domain: ZJOIN.domain,
                            get_new_uptoken: false,
                            container: 'container',
                            max_file_size: '1mb',
                            max_retries: 3,
                            dragdrop: !0,
                            drop_element: 'container',
                            chunk_size: '1mb',
                            filters: {
                                mime_types: [{
                                    title: "Image files",
                                    extensions: "jpg,gif,png,jpeg"
                                }]
                            },
                            auto_start: !0,
                            init: {
                                'FilesAdded': function (up, files) {
                                    $("#upload-progress").text("上传中......");
                                    plupload.each(files, function (file) {
                                    });
                                },
                                'BeforeUpload': function (up, file) {
                                },
                                'UploadProgress': function (up, file) {
                                    $("#upload-progress").css({
                                        "background-size": up.total.percent + "% 100%"
                                    })
                                },
                                'FileUploaded': function (up, file, info) {
                                    var z = JSON.parse(info.response);
                                    var img_domain = ZJOIN.domain;
                                    if (ZJOIN_default.image)ZJOIN_default.image.attr("src", img_domain + z.key);
                                    if (ZJOIN_default.input)ZJOIN_default.input.val(img_domain + z.key);
                                },
                                'Error': function (up, err, errTip) {
                                    layer.msg('上传失败', {
                                        icon: 5
                                    })
                                },
                                'UploadComplete': function (data) {
                                    $("#upload-progress").text("上传文件");
                                    layer.close(index);

                                },
                                'Key': function (up, file) {
                                    //var key = "";
                                    //return key
                                }
                            }
                        });
                    }
                });
            }
        });
    }


    var dom = $(document);
    dom.on('click', ELEM, upload);

    Zjoin.prototype.timetrans = function (date) {
        var date = new Date(date);//如果date为13位不需要乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
    }

    Zjoin.prototype.timetrans_ymd = function (date) {
        var date = new Date(date);//如果date为13位不需要乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        return Y + M + D;
    }

    window.zjoin = new Zjoin();
    exports('zjoin',new Zjoin()); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
}); 
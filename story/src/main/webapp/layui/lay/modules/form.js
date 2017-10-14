/**

 @Name：layui.form 表单组件
 @Author：贤心
 @License：MIT

 */

layui.define('layer', function (exports) {
    "use strict";

    var $ = layui.$
        , layer = layui.layer
        , hint = layui.hint()
        , device = layui.device()

        , MOD_NAME = 'form', ELEM = '.layui-form', THIS = 'layui-this', SHOW = 'layui-show', HIDE = 'layui-hide', DISABLED = 'layui-disabled', VALID = ('[lay-verify]')

        , Form = function () {
        this.config = {
            verify: {
                required: [
                    /[\S]+/
                    , '必填项不能为空'
                ]
                , phone: [
                    /^1\d{10}$/
                    , '请输入正确的手机号'
                ]
                , email: [
                    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
                    , '邮箱格式不正确'
                ]
                , url: [
                    /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/
                    , '链接格式不正确'
                ]
                , number: [
                    /^\d+$/
                    , '只能填写数字'
                ]
                , date: [
                    /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/
                    , '日期格式不正确'
                ]
                , identity: [
                    /(^\d{15}$)|(^\d{17}(x|X|\d)$)/
                    , '请输入正确的身份证号'
                ],
                password: [/^[\S]{6,16}$/
                    , "请填写6-16位字符，不能包含空格"
                ], //密码
                chinese: [/^[\u0391-\uFFE5]+$/
                    , "请填写中文字符"
                ],
                zipcode: [/^\d{6}$/
                    , "请检查邮政编码格式"
                ],
                time: [/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/
                    , "请填写有效的时间，00:00到23:59之间"
                ],
                letters: [/^[a-z]+$/i
                    , "请填写字母"
                ]
            }
        };
    };

    //全局设置
    Form.prototype.set = function (options) {
        var that = this;
        $.extend(true, that.config, options);
        return that;
    };

    //验证规则设定
    Form.prototype.verify = function (settings) {
        var that = this;
        $.extend(true, that.config.verify, settings);
        return that;
    };

    //表单事件监听
    Form.prototype.on = function (events, callback) {
        return layui.onevent.call(this, MOD_NAME, events, callback);
    };

    //表单控件渲染
    Form.prototype.render = function (type, filter) {
        var that = this
            , elemForm = $(ELEM + function () {
                return filter ? ('[lay-filter="' + filter + '"]') : '';
            }())
            , items = {

            //下拉选择框
            select: function () {
                var TIPS = '请选择', CLASS = 'layui-form-select', TITLE = 'layui-select-title'
                    , NONE = 'layui-select-none', initValue = '', thatInput

                    , selects = elemForm.find('select'), hide = function (e, clear) {
                    if (!$(e.target).parent().hasClass(TITLE) || clear) {
                        $('.' + CLASS).removeClass(CLASS + 'ed ' + CLASS + 'up');
                        thatInput && initValue && thatInput.val(initValue);
                    }
                    thatInput = null;
                }

                    , events = function (reElem, disabled, isSearch) {
                    var select = $(this)
                        , title = reElem.find('.' + TITLE)
                        , input = title.find('input')
                        , dl = reElem.find('dl')
                        , dds = dl.children('dd')


                    if (disabled) return;

                    //展开下拉
                    var showDown = function () {
                        var top = reElem.offset().top + reElem.outerHeight() + 5 - win.scrollTop()
                            , dlHeight = dl.outerHeight();
                        reElem.addClass(CLASS + 'ed');
                        dds.removeClass(HIDE);

                        //上下定位识别
                        if (top + dlHeight > win.height() && top >= dlHeight) {
                            reElem.addClass(CLASS + 'up');
                        }
                    }, hideDown = function (choose) {
                        reElem.removeClass(CLASS + 'ed ' + CLASS + 'up');
                        input.blur();

                        if (choose) return;

                        notOption(input.val(), function (none) {
                            if (none) {
                                initValue = dl.find('.' + THIS).html();
                                input && input.val(initValue);
                            }
                        });
                    };

                    //点击标题区域
                    title.on('click', function (e) {
                        reElem.hasClass(CLASS + 'ed') ? (
                            hideDown()
                        ) : (
                            hide(e, true),
                                showDown()
                        );
                        dl.find('.' + NONE).remove();
                    });

                    //点击箭头获取焦点
                    title.find('.layui-edge').on('click', function () {
                        input.focus();
                    });

                    //键盘事件
                    input.on('keyup', function (e) {
                        var keyCode = e.keyCode;
                        //Tab键
                        if (keyCode === 9) {
                            showDown();
                        }
                    }).on('keydown', function (e) {
                        var keyCode = e.keyCode;
                        //Tab键
                        if (keyCode === 9) {
                            hideDown();
                        } else if (keyCode === 13) { //回车键
                            e.preventDefault();
                        }
                    });

                    //检测值是否不属于select项
                    var notOption = function (value, callback, origin) {
                        var num = 0;
                        layui.each(dds, function () {
                            var othis = $(this)
                                , text = othis.text()
                                , not = text.indexOf(value) === -1;
                            if (value === '' || (origin === 'blur') ? value !== text : not) num++;
                            origin === 'keyup' && othis[not ? 'addClass' : 'removeClass'](HIDE);
                        });
                        var none = num === dds.length;
                        return callback(none), none;
                    };

                    //搜索匹配
                    var search = function (e) {
                        var value = this.value, keyCode = e.keyCode;

                        if (keyCode === 9 || keyCode === 13
                            || keyCode === 37 || keyCode === 38
                            || keyCode === 39 || keyCode === 40
                        ) {
                            return false;
                        }

                        notOption(value, function (none) {
                            if (none) {
                                dl.find('.' + NONE)[0] || dl.append('<p class="' + NONE + '">无匹配项</p>');
                            } else {
                                dl.find('.' + NONE).remove();
                            }
                        }, 'keyup');

                        if (value === '') {
                            dl.find('.' + NONE).remove();
                        }
                    };
                    if (isSearch) {
                        input.on('keyup', search).on('blur', function (e) {
                            thatInput = input;
                            initValue = dl.find('.' + THIS).html();
                            setTimeout(function () {
                                notOption(input.val(), function (none) {
                                    if (none && !initValue) {
                                        input.val('');
                                    }
                                }, 'blur');
                            }, 200);
                        });
                    }

                    //选择
                    dds.on('click', function () {
                        var othis = $(this), value = othis.attr('lay-value');
                        var filter = select.attr('lay-filter'); //获取过滤器

                        if (othis.hasClass(DISABLED)) return false;

                        if (othis.hasClass('layui-select-tips')) {
                            input.val('');
                        } else {
                            input.val(othis.text());
                            othis.addClass(THIS);
                        }

                        othis.siblings().removeClass(THIS);
                        select.val(value).removeClass('layui-form-danger')
                        layui.event.call(this, MOD_NAME, 'select(' + filter + ')', {
                            elem: select[0]
                            , value: value
                            , othis: reElem
                        });

                        hideDown(true);
                        return false;
                    });

                    reElem.find('dl>dt').on('click', function (e) {
                        return false;
                    });

                    //关闭下拉
                    $(document).off('click', hide).on('click', hide);
                }

                selects.each(function (index, select) {
                    if (select.options.length > 0) {
                    } else {
                        /**
                         * 组装外部数据
                         */
                        var sd = $(select).attr('lay-data');
                        try {
                            if (sd) {
                                select.options.add(new Option());
                                for (var da of eval(sd)) {
                                    for (var key in da) {
                                        select.options.add(new Option(key, da[key]));
                                    }
                                }
                            }
                        } catch (e) {
                            console.error(e)
                        }

                    }

                    var othis = $(this)
                        , hasRender = othis.next('.' + CLASS)
                        , disabled = this.disabled
                        , value = select.value
                        , selected = $(select.options[select.selectedIndex]) //获取当前选中项
                        , optionsFirst = select.options[0];
                    var layverify = '';
                    if (othis.attr('lay-verify') != undefined) layverify = ' lay-verify="' + othis.attr('lay-verify') + '"';
                    if (typeof othis.attr('lay-ignore') === 'string') return othis.show();

                    var isSearch = typeof othis.attr('lay-search') === 'string'
                        , placeholder = optionsFirst ? (
                        optionsFirst.value ? TIPS : (optionsFirst.innerHTML || TIPS)
                    ) : TIPS;

                    //替代元素
                    var reElem = $(['<div class="layui-unselect ' + CLASS + (disabled ? ' layui-select-disabled' : '') + '">'
                        , '<div class="' + TITLE + '"><input type="text" placeholder="' + placeholder + '" value="' + (value ? selected.html() : '') + '" ' + (isSearch ? '' : 'readonly') + layverify + ' class="layui-input layui-unselect' + (disabled ? (' ' + DISABLED) : '') + '">'
                        , '<i class="layui-edge"></i></div>'
                        , '<dl class="layui-anim layui-anim-upbit' + (othis.find('optgroup')[0] ? ' layui-select-group' : '') + '">' + function (options) {
                            var arr = [];
                            layui.each(options, function (index, item) {
                                if (index === 0 && !item.value) {
                                    arr.push('<dd lay-value="" class="layui-select-tips">' + (item.innerHTML || TIPS) + '</dd>');
                                } else if (item.tagName.toLowerCase() === 'optgroup') {
                                    arr.push('<dt>' + item.label + '</dt>');
                                } else {
                                    arr.push('<dd lay-value="' + item.value + '" class="' + (value === item.value ? THIS : '') + (item.disabled ? (' ' + DISABLED) : '') + '">' + item.innerHTML + '</dd>');
                                }
                            });
                            arr.length === 0 && arr.push('<dd lay-value="" class="' + DISABLED + '">没有选项</dd>');
                            return arr.join('');
                        }(othis.find('*')) + '</dl>'
                        , '</div>'].join(''));

                    hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
                    othis.after(reElem);
                    events.call(this, reElem, disabled, isSearch);
                });
            }
            //复选框/开关
            , checkbox: function () {
                var CLASS = {
                    checkbox: ['layui-form-checkbox', 'layui-form-checked', 'checkbox']
                    , _switch: ['layui-form-switch', 'layui-form-onswitch', 'switch']
                }
                    , checks = elemForm.find('input[type=checkbox]')

                    , events = function (reElem, RE_CLASS) {
                    var check = $(this);

                    //勾选
                    reElem.on('click', function () {
                        var filter = check.attr('lay-filter') //获取过滤器
                            , text = (check.attr('lay-text') || '').split('|');

                        if (check[0].disabled) return;

                        check[0].checked ? (
                            check[0].checked = false
                                , reElem.removeClass(RE_CLASS[1]).find('em').text(text[1])
                        ) : (
                            check[0].checked = true
                                , reElem.addClass(RE_CLASS[1]).find('em').text(text[0])
                        );

                        layui.event.call(check[0], MOD_NAME, RE_CLASS[2] + '(' + filter + ')', {
                            elem: check[0]
                            , value: check[0].value
                            , othis: reElem
                        });
                    });
                }

                checks.each(function (index, check) {
                    var othis = $(this), skin = othis.attr('lay-skin')
                        , text = (othis.attr('lay-text') || '').split('|'), disabled = this.disabled;
                    if (skin === 'switch') skin = '_' + skin;
                    var RE_CLASS = CLASS[skin] || CLASS.checkbox;

                    if (typeof othis.attr('lay-ignore') === 'string') return othis.show();

                    //替代元素
                    var hasRender = othis.next('.' + RE_CLASS[0]);
                    var reElem = $(['<div class="layui-unselect ' + RE_CLASS[0] + (
                        check.checked ? (' ' + RE_CLASS[1]) : '') + (disabled ? ' layui-checkbox-disbaled ' + DISABLED : '') + '" lay-skin="' + (skin || '') + '">'
                        , {
                            _switch: '<em>' + ((check.checked ? text[0] : text[1]) || '') + '</em><i></i>'
                        }[skin] || ((check.title.replace(/\s/g, '') ? ('<span>' + check.title + '</span>') : '') + '<i class="layui-icon">' + (skin ? '&#xe605;' : '&#xea7c;') + '</i>')
                        , '</div>'].join(''));

                    hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
                    othis.after(reElem);
                    events.call(this, reElem, RE_CLASS);
                });
            }
            //单选框
            , radio: function () {
                var CLASS = 'layui-form-radio', ICON = ['&#xe837;', '&#xea80;']
                    , radios = elemForm.find('input[type=radio]')

                    , events = function (reElem) {
                    var radio = $(this), ANIM = 'layui-anim-scaleSpring';

                    reElem.on('click', function () {
                        var name = radio[0].name, forms = radio.parents(ELEM);
                        var filter = radio.attr('lay-filter'); //获取过滤器
                        var sameRadio = forms.find('input[name=' + name.replace(/(\.|#|\[|\])/g, '\\$1') + ']'); //找到相同name的兄弟

                        if (radio[0].disabled) return;

                        layui.each(sameRadio, function () {
                            var next = $(this).next('.' + CLASS);
                            this.checked = false;
                            next.removeClass(CLASS + 'ed');
                            next.find('.layui-icon').removeClass(ANIM).html(ICON[1]);
                        });

                        radio[0].checked = true;
                        reElem.addClass(CLASS + 'ed');
                        reElem.find('.layui-icon').addClass(ANIM).html(ICON[0]);

                        layui.event.call(radio[0], MOD_NAME, 'radio(' + filter + ')', {
                            elem: radio[0]
                            , value: radio[0].value
                            , othis: reElem
                        });
                    });
                };

                radios.each(function (index, radio) {
                    var othis = $(this), hasRender = othis.next('.' + CLASS), disabled = this.disabled;

                    if (typeof othis.attr('lay-ignore') === 'string') return othis.show();

                    //替代元素
                    var reElem = $(['<div class="layui-unselect ' + CLASS + (radio.checked ? (' ' + CLASS + 'ed') : '') + (disabled ? ' layui-radio-disbaled ' + DISABLED : '') + '">'
                        , '<i class="layui-anim layui-icon">' + ICON[radio.checked ? 0 : 1] + '</i>'
                        , '<span>' + (radio.title || '未命名') + '</span>'
                        , '</div>'].join(''));

                    hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
                    othis.after(reElem);
                    events.call(this, reElem);
                });
            }
        };
        type ? (
            items[type] ? items[type]() : hint.error('不支持的' + type + '表单渲染')
        ) : layui.each(items, function (index, item) {
            item();
        });
        return that;
    };


    Form.prototype.valid = function ($tr) {
        if ($tr[0]) {
            var flag = true;
            for (var td of  $tr[0].children) {
                if ($(td).has('input').length) {
                    if (td.children[0].tagName == 'INPUT') {
                        var othis = $(td.children[0]), verify = form.config.verify;
                        if (!othis.attr('lay-verify')) continue
                        var ver = othis.attr('lay-verify').split('|');
                        for(var v of ver){
                            var ver2 = v.split(':');
                            for(var v2 in ver2){
                                var tips = '', value = othis.val();
                                if (verify[ver2[1]] && !verify[ver2[1]][0].test(value)) {
                                    layer.msg(tips || ver2[0]+"："+ verify[ver2[1]][1], {
                                        icon: 5
                                        , shift: 6
                                    });
                                    flag= false;
                                    break
                                }
                            }
                        }


                    }
                }else if ($(td).has('select').length) {
                    if (td.children[0].tagName == 'SELECT') {
                        var othis = $(td.children[0]), verify = form.config.verify;
                        if (!othis.attr('lay-verify')) continue
                        var ver = othis.attr('lay-verify').split('|');
                        var tips = '', value = othis.val();
                        for(var v of ver) {
                            var ver2 = v.split(':');
                            for (var v2 in ver2) {
                                if (verify[ver2[1]] && !verify[ver2[1]][0].test(value)) {
                                    layer.msg(tips || ver2[0]+"："+ verify[ver2[1]][1], {
                                        icon: 5
                                        , shift: 6
                                    });
                                    flag = false;
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
        return flag
    }
    //表单提交校验
    var submit = function () {
        var button = $(this), verify = form.config.verify, stop = null
            , DANGER = 'layui-form-danger', field = {}, elem = button.parents(ELEM)

            , verifyElem = elem.find('*[lay-verify]') //获取需要校验的元素
            , formElem = button.parents('form')[0] //获取当前所在的form元素，如果存在的话
            , fieldElem = elem.find('input,select,textarea') //获取所有表单域
            , filter = button.attr('lay-filter'); //获取过滤器

        //开始校验
        layui.each(verifyElem, function (_, item) {
            var othis = $(this), ver = othis.attr('lay-verify').split('|');
            var tips = '', value = othis.val();
            othis.removeClass(DANGER);
            layui.each(ver, function (_, thisVer) {
                var isFn = typeof verify[thisVer] === 'function';
                if (verify[thisVer] && (isFn ? tips = verify[thisVer](value, item) : !verify[thisVer][0].test(value))) {
                    /* layer.msg(tips || verify[thisVer][1], {
                     icon: 5
                     ,shift: 6
                     });*/
                    var html = '<span class="msg-box n-right" for="password">' +
                        '<span role="alert" class="msg-wrap n-error">' +
                        '<span class="n-icon"><i class="layui-icon n-msg">&#xe69c;</i>&nbsp;</span>' +
                        '<span class="n-msg">' + verify[thisVer][1] + '</span>' +
                        '</span>' +
                        '</span>';
                    othis.parent().find('.msg-box').remove();
                    othis.parent().append(html);
                    //非移动设备自动定位焦点
                    if (!device.android && !device.ios) {
                        item.focus();
                    }
                    othis.addClass(DANGER);
                    return stop = true;
                } else {
                    othis.parent().find('.msg-box').remove();
                }
            });
            if (stop) return stop;
        });

        if (stop) return false;

        layui.each(fieldElem, function (_, item) {
            if (!item.name) return;
            if (/^checkbox|radio$/.test(item.type) && !item.checked) return;
            field[item.name] = item.value;
        });

        //获取字段
        return layui.event.call(this, MOD_NAME, 'submit(' + filter + ')', {
            elem: this
            , form: formElem
            , field: field
        });
    };

    //字段失去焦点校验
    var blur = function () {
        var button = $(this), verify = form.config.verify, stop = null
            , DANGER = 'layui-form-danger',UNVALID = 'layui-form-unvalid',UNVALID_SELECT = 'layui-form-danger-unvalid-select'
            , filter = button.attr('lay-filter'); //获取过滤器
        var othis = button, ver = othis.attr('lay-verify').split('|');
        ver = ver[0];
        if(ver.split(":").length>1) ver = ver.split(':')[1].split('|')
        else  ver = ver.split('|')
        var tips = '', value = othis.val();
        othis.removeClass(DANGER);
        layui.each(ver, function (_, thisVer) {
            var isFn = typeof verify[thisVer] === 'function';
            if (verify[thisVer] && (isFn ? tips = verify[thisVer](value, othis) : !verify[thisVer][0].test(value))) {
                if (othis.parent().hasClass('datagrid-edit-td')) {
                    layer.msg(tips || verify[thisVer][1], {
                        icon: 5
                        , shift: 6
                    });
                } else {
                    var html = '<span class="msg-box n-right" for="password">' +
                        '<span role="alert" class="msg-wrap n-error">' +
                        '<span class="n-icon"><i class="layui-icon n-msg">&#xe69c;</i>&nbsp;</span>' +
                        '<span class="n-msg">' + verify[thisVer][1] + '</span>' +
                        '</span>' +
                        '</span>';
                    othis.parent().find('.msg-box').remove();
                    othis.parent().append(html);
                }
                if (!device.android && !device.ios) {
                    // othis.focus();
                }
                othis.addClass(DANGER);
                if (othis.attr('lay-verify') == 'date' || othis.attr('lay-verify') == 'time') {//如果是时间选择器则再获取值之后重新触发blur事件校验
                    setTimeout(function () {
                        othis.blur();
                    }, 10)
                }
                return false;
            } else {
                othis.parent().find('.msg-box').remove();
                othis.removeClass(UNVALID);
                othis.next('div').removeClass(UNVALID_SELECT);
            }

        });
        if (stop) return false;
    };

    var form = new Form()
        , dom = $(document), win = $(window);

    form.render();

    dom.on('reset', ELEM, function () {
        var filter = $(this).attr('lay-filter');
        setTimeout(function () {
            form.render(null, filter);
        }, 50);
    });

    dom.on('submit', ELEM, submit).on('click', '*[lay-submit]', submit);
    dom.on('blur', VALID, blur);

    exports(MOD_NAME, form);
});

 

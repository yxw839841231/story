layui.define('jquery', function (exports) {
    "use strict";
    var $ = layui.jquery;

    var BJUI = {
        JSPATH: 'BJUI/',
        PLUGINPATH: 'BJUI/plugins/',
        IS_DEBUG: false,
        KeyPressed: { //key press state
            ctrl: false,
            shift: false
        },
        keyCode: {
            ENTER: 13, ESC: 27, END: 35, HOME: 36,
            SHIFT: 16, CTRL: 17, TAB: 9,
            LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40,
            DELETE: 46, BACKSPACE: 8
        },
        eventType: {
            initUI: 'bjui.initUI',         // When document load completed or ajax load completed, B-JUI && Plugins init
            beforeInitUI: 'bjui.beforeInitUI',   // If your DOM do not init [add to DOM attribute 'data-noinit="true"']
            afterInitUI: 'bjui.afterInitUI',    //
            ajaxStatus: 'bjui.ajaxStatus',     // When performing ajax request, display or hidden progress bar
            resizeGrid: 'bjui.resizeGrid',     // When the window or dialog resize completed
            beforeAjaxLoad: 'bjui.beforeAjaxLoad', // When perform '$.fn.ajaxUrl', to do something...

            beforeLoadNavtab: 'bjui.beforeLoadNavtab',
            beforeLoadDialog: 'bjui.beforeLoadDialog',
            afterLoadNavtab: 'bjui.afterLoadNavtab',
            afterLoadDialog: 'bjui.afterLoadDialog',
            beforeCloseNavtab: 'bjui.beforeCloseNavtab',
            beforeCloseDialog: 'bjui.beforeCloseDialog',
            afterCloseNavtab: 'bjui.afterCloseNavtab',
            afterCloseDialog: 'bjui.afterCloseDialog'
        },
        formColWidth: {L: 900, M: 680, S: 360, SS: 240},
        pageInfo: {
            pageCurrent: 'pageCurrent',
            pageSize: 'pageSize',
            orderField: 'orderField',
            orderDirection: 'orderDirection'
        },
        alertMsg: {displayPosition: 'topcenter', alertTimeout: 6000}, //alertmsg display position && close timeout
        ajaxTimeout: 30000,
        statusCode: {ok: 200, error: 300, timeout: 301},
        keys: {statusCode: 'statusCode', message: 'message'},
        ui: {
            windowWidth: 0,
            showSideWidth: 990,
            sidenavWidth: 260,
            offsetWidth: 15,
            displayFirst: true,
            showSlidebar: true,      // After the B-JUI initialization, display slidebar
            clientPaging: true,      // Response paging and sorting information on the client
            overwriteHomeTab: false      // When open an undefined id of navtab, whether overwrite the home navtab
        },
        debug: function (msg) {
            if (this.IS_DEBUG) {
                if (typeof(console) != 'undefined') console.log(msg)
                else alert(msg)
            }
        },
        loginInfo: {
            url: 'login.html',
            title: 'Login',
            width: 420,
            height: 260,
            mask: true
        },
        loadLogin: function () {
            var login = this.loginInfo

            BJUI.dialog({
                id: 'bjui-login',
                url: login.url,
                title: login.title,
                width: login.width,
                height: login.height,
                mask: login.mask
            })
        },
        init: function (options) {
            var op = $.extend({}, options)
            $.extend(BJUI.keys, op.keys)
            $.extend(BJUI.statusCode, op.statusCode)
            $.extend(BJUI.pageInfo, op.pageInfo)
            $.extend(BJUI.formColWidth, op.formColWidth)
            $.extend(BJUI.alertMsg, op.alertMsg)
            $.extend(BJUI.loginInfo, op.loginInfo)
            $.extend(BJUI.ui, op.ui)

            if (op.JSPATH) this.JSPATH = op.JSPATH
            if (op.PLUGINPATH) this.PLUGINPATH = op.PLUGINPATH
            if (op.ajaxTimeout) this.ajaxTimeout = op.ajaxTimeout

            this.IS_DEBUG = op.debug || false
            this.initEnv()

            if ((!$.cookie || !$.cookie('bjui_theme')) && op.theme) $(this).theme('setTheme', op.theme)
        },
        initEnv: function () {
            $(window).resize(function () {
                BJUI.initLayout()

                setTimeout(function () {
                    $(this).trigger(BJUI.eventType.resizeGrid)
                }, 30)
            })

            setTimeout(function () {
                $(document).initui()

                var $collapse = $('#bjui-navbar-collapse'), left = $collapse.prev().width()

                $collapse.css('left', left).data('position.left', left)

                BJUI.initLayout()

                $('#bjui-top-collapse').on('click.theme', '.dropdown-toggle', function () {
                    var $dropdown = $(this).next(), $topcollapse = $('#bjui-top-collapse')

                    if (!$topcollapse.hasClass('navbar-show')) {
                        $topcollapse.attr('style', $dropdown.is(':visible') ? '' : 'overflow:visible !important;')
                    }
                })

                $('[data-toggle="collapsenavbar"]').click(function () {
                    var $this = $(this), $target = $($this.data('target')), $parent = $this.closest('.navbar-header')

                    if ($target.length) {
                        $target.toggleClass('navbar-show')
                        $parent.toggleClass('navbar-show')

                        $(document).on('click', function (e) {
                            if (!($target.has(e.target).length) && !($parent.has(e.target).length)) {
                                $target.removeClass('navbar-show')
                                $parent.removeClass('navbar-show')
                            }
                        })
                    }
                })
            }, 10)
        },
        initLayout: function () {
            var ww = $(window).width(), hh = $(window).height(),
                $top = $('#bjui-top'), $navbar = $('#bjui-navbar'), $collapse = $('#bjui-top-collapse, #bjui-navbar-collapse'),
                th = $top.height(), nh = parseInt($navbar.css('min-height'), 10),
                eventName = 'click.bjui.sidenav.hide', opts = {},
                $navtab = $('#bjui-navtab'), $sidenav = $('#bjui-sidenav'), $sidenavcol = $('#bjui-sidenav-col'),
                $sidenavarrow = $('#bjui-sidenav-arrow'), $sidenavbtn = $('#bjui-sidenav-btn'), $sidenavbox = $('#bjui-sidenav-box'),
                tnh = $sidenavbtn.outerHeight() - 2

            $('#bjui-navtab .tabsPageContent').height(hh - th - nh - tnh)
            $sidenav.height(hh - th - nh - 1)
            $sidenavcol.width(BJUI.ui.sidenavWidth)

            $collapse.scrollTop(5).eq(0).removeAttr('style')
            $collapse.each(function () {
                var $this = $(this), $collapsebtn = $this.prev().find('.navbar-toggle'), isCollapse = ($this.scrollTop() == 5 || $this.hasClass('navbar-show'))

                isCollapse && $this.scrollTop(0)

                $this.toggleClass('position', isCollapse)
                $collapsebtn.toggleClass('position', isCollapse)

                if ($this.data('position.left') && (ww / 2) < $this.data('position.left')) {
                    $this.prev().find('> .navbar-brand').hide()
                    $this.css('left', 0)
                } else {
                    $this.prev().find('> .navbar-brand').show()
                    $this.css('left', $this.data('position.left'))
                }
            })

            if (ww < BJUI.ui.showSideWidth) {
                $sidenavcol.css('left', -(BJUI.ui.sidenavWidth + BJUI.ui.offsetWidth)).addClass('autohide')
                $navtab.css('margin-left', 0)
                $sidenavbtn.show()
            } else {
                $sidenavcol.css('left', 0).removeClass('autohide')
                $navtab.css('margin-left', (BJUI.ui.sidenavWidth + BJUI.ui.offsetWidth))
                $sidenavbtn.hide()
            }

            $sidenavarrow.off(eventName).on(eventName, function () {
                $sidenavcol
                    .stop()
                    .animate({
                        left: -(BJUI.ui.sidenavWidth + BJUI.ui.offsetWidth)
                    }, 'fast', function () {
                        $sidenavbtn.show()

                        $(window).trigger(BJUI.eventType.resizeGrid)
                    })

                $navtab
                    .stop()
                    .animate({
                        'margin-left': 0
                    }, 'fast')
            })

            $sidenavbtn.off(eventName).on(eventName, function () {
                $sidenavbtn.hide()

                $sidenavcol
                    .stop()
                    .animate({
                        left: 0
                    }, 'fast', function () {
                        $(window).trigger(BJUI.eventType.resizeGrid)
                    })

                opts['margin-left'] = (BJUI.ui.sidenavWidth + BJUI.ui.offsetWidth)
                if (ww < BJUI.ui.showSideWidth)
                    opts['margin-left'] = 0

                $navtab
                    .stop()
                    .animate(opts, 'fast')
            })
        },
        regional: {},
        setRegional: function (key, value) {
            BJUI.regional[key] = value
        },
        getRegional: function (key) {
            if (String(key).indexOf('.') >= 0) {
                var msg, arr = String(key).split('.')

                for (var i = 0; i < arr.length; i++) {
                    if (!msg) msg = BJUI.regional[arr[i]]
                    else msg = msg[arr[i]]
                }

                return msg
            } else {
                return BJUI.regional[key]
            }
        },
        doRegional: function (frag, regional) {
            $.each(regional, function (k, v) {
                frag = frag.replaceAll('#' + k + '#', v)
            })

            return frag
        },
        // is ie browser
        isIE: function (ver) {
            var b = document.createElement('b')

            b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'

            return b.getElementsByTagName('i').length === 1
        },
        StrBuilder: function () {
            return new StrBuilder()
        }
    }

    function StrBuilder() {
        this.datas = new Array()
    }

    StrBuilder.prototype.add = function (str) {
        if (typeof str !== 'undefined') this.datas.push(str)
        return this
    }

    StrBuilder.prototype.toString = function (str) {
        var string = this.datas.join(str || '')

        this.clear()

        return string
    }

    StrBuilder.prototype.isEmpty = function () {
        return this.datas.length == 0
    }

    StrBuilder.prototype.clear = function () {
        this.datas = []
        this.datas.length = 0
    }
    window.BJUI = BJUI
    exports('BJUIcore', BJUI);
});


/* ========================================================================
 * B-JUI: bjui-navtab.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-navtab.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

layui.define('BJUIextends', function(exports){
    "use strict";
    var $ = layui.BJUIextends,BJUI=layui.BJUIcore;
    

    var currentIndex, $currentTab, $currentPanel, $box, $tabs, $panels, $prevBtn, $nextBtn, $moreBtn, $moreBox, $main, $mainLi,
        autorefreshTimer
    

    
    // NAVTAB CLASS DEFINITION
    // ======================
    
    var Navtab = function(options) {
        this.options  = options
        this.tools    = this.TOOLS()
    }

    Navtab.DEFAULTS = {
        id          : null,
        title       : 'New tab',
        url         : null,
        type        : 'GET',
        data        : {},
        loadingmask : true,
        fresh       : false,
        autorefresh : false,
        onLoad      : null,
        beforeClose : null,
        onClose     : null
    }
    
    Navtab.prototype.TOOLS = function() {
        var that = this
        var tools = {
            getDefaults: function() {
                return Navtab.DEFAULTS
            },
            getTabs: function() {
                return $tabs.find('> li')
            },
            getPanels: function() {
                return $panels.find('> div')
            },
            getMoreLi: function() {
                return $moreBox.find('> li')
            },
            getTab: function(tabid) {
                var index = this.indexTabId(tabid)
                
                if (index >= 0) return this.getTabs().eq(index)
            },
            getPanel: function(tabid) {
                var index = this.indexTabId(tabid)
                
                if (index >= 0) return this.getPanels().eq(index)
            },
            getTabsW: function(iStart, iEnd) {
                return this.tabsW(this.getTabs().slice(iStart, iEnd))
            },
            tabsW: function($tabs) {
                var iW = 0
                
                $tabs.each(function() {
                    iW += $(this).outerWidth(true)
                })
                
                return iW
            },
            indexTabId: function(tabid) {
                var iOpenIndex = -1
                
                if (!tabid) return iOpenIndex
                
                this.getTabs().each(function(index) {
                    if ($(this).data('options').id === tabid) {
                        iOpenIndex = index
                        return false
                    }
                })
                
                return iOpenIndex
            },
            getLeft: function() {
                return $tabs.position().left
            },
            getScrollBarW: function() {
                return $box.width() - 55
            },
            visibleStart: function() {
                var $tabs = this.getTabs(), iLeft = this.getLeft(), iW = 0, index = 0
                
                $tabs.each(function(i) {
                    if (iW + iLeft >= 0) {
                        index = i
                        return false
                    }
                    iW += $(this).outerWidth(true)
                })
                
                return index
            },
            visibleEnd: function() {
                var tools = this, $tabs = this.getTabs(), iLeft = this.getLeft(), iW = 0, index = $tabs.length
                
                $tabs.each(function(i) {
                    iW += $(this).outerWidth(true)
                    if (iW + iLeft > tools.getScrollBarW()) {
                        index = i
                        return false
                    }
                })
                
                return index
            },
            scrollPrev: function() {
                var iStart = this.visibleStart()
                
                if (iStart > 0)
                    this.scrollTab(- this.getTabsW(0, iStart - 1))
            },
            scrollNext: function() {
                var iEnd = this.visibleEnd()
                
                if (iEnd < this.getTabs().size())
                    this.scrollTab(- this.getTabsW(0, iEnd + 1) + this.getScrollBarW())
            },
            scrollTab: function(iLeft, isNext) {
                $tabs.animate({ left: iLeft }, 150, function() { that.tools.ctrlScrollBtn() })
            },
            scrollCurrent: function() { // auto scroll current tab
                var iW = this.tabsW(this.getTabs()), scrollW = this.getScrollBarW()
                
                if (iW <= scrollW)
                    this.scrollTab(0)
                else if (this.getLeft() < scrollW - iW)
                    this.scrollTab(scrollW-iW)
                else if (currentIndex < this.visibleStart())
                    this.scrollTab(- this.getTabsW(0, currentIndex))
                else if (currentIndex >= this.visibleEnd())
                    this.scrollTab(scrollW - this.getTabs().eq(currentIndex).outerWidth(true) - this.getTabsW(0, currentIndex))
            },
            ctrlScrollBtn: function() {
                var iW = this.tabsW(this.getTabs())
                
                if (this.getScrollBarW() > iW) {
                    $prevBtn.hide()
                    $nextBtn.hide()
                    $tabs.parent().removeClass('tabsPageHeaderMargin')
                } else {
                    $prevBtn.show().removeClass('tabsLeftDisabled')
                    $nextBtn.show().removeClass('tabsRightDisabled')
                    $tabs.parent().addClass('tabsPageHeaderMargin')
                    if (this.getLeft() >= 0)
                        $prevBtn.addClass('tabsLeftDisabled')
                    else if (this.getLeft() <= this.getScrollBarW() - iW)
                        $nextBtn.addClass('tabsRightDisabled')
                }
            },
            switchTab: function(iTabIndex) {
                var $tab = this.getTabs().removeClass('active').eq(iTabIndex).addClass('active'), $panels = this.getPanels(), $panel = $panels.eq(iTabIndex), onSwitch = that.options.onSwitch ? that.options.onSwitch.toFunc() : null
                var $ajaxBackground = $(FRAG.maskBackground)
                
                $panels.css({top:'-10000000px'})
                
                if ($tab.data('reloadFlag')) {
                    $panel.animate({top:0})
                    that.refresh($tab.data('options').id)
                } else {
                    if ($panel.find('.bjui-ajax-mask').length) {
                        $panel.css({top:0})
                    } else {
                        $panel
                            .css({top:0})
                            .append($ajaxBackground)
                        
                        $ajaxBackground.fadeOut('normal', function() {
                            $(this).remove()
                        })
                    }
                }
                
                this.getMoreLi().removeClass('active').eq(iTabIndex).addClass('active')
                currentIndex = iTabIndex
                this.scrollCurrent()
                $currentTab     = $tab
                $.CurrentNavtab = $currentPanel = $panel
                
                if (onSwitch) onSwitch.apply(that)
                
                // set current to body data
                var datas = $('body').data('bjui.navtab'), id = $tab.data('options').id
                
                if (id !== that.options.id)
                    datas.current = id
                else {
                    datas.current = that.options.id
                }
                
                // events
                $panel.trigger('switch.bjui.navtab')
            },
            closeTab: function(index, openTabid) {
                var $tab        = this.getTabs().eq(index),
                    $more       = this.getMoreLi().eq(index),
                    $panel      = this.getPanels().eq(index),
                    options     = $tab.data('options'),
                    beforeClose = options.beforeClose ? options.beforeClose.toFunc() : null,
                    onClose     = options.onClose ? options.onClose.toFunc() : null,
                    canClose    = true
                
                if (beforeClose) canClose = beforeClose.apply(that, [$panel])
                if (!canClose) {
                    that.tools.switchTab(index)
                    return
                }
                $tab.remove()
                $more.remove()
                $panel.trigger(BJUI.eventType.beforeCloseNavtab).remove()
                
                if (autorefreshTimer) clearInterval(autorefreshTimer)
                if (onClose) onClose.apply(that)
                if (currentIndex >= index) currentIndex--
                if (openTabid) {
                    var openIndex = this.indexTabId(openTabid)
                    
                    if (openIndex > 0) currentIndex = openIndex
                }
                
                // remove from body
                var datas = $('body').data('bjui.navtab')
                
                if (datas[options.id])
                    delete datas[options.id]
                
                this.scrollCurrent()
                this.switchTab(currentIndex)
            },
            closeOtherTab: function(index) {
                index = index || currentIndex
                
                this.getTabs().each(function(i) {
                    if (i > 0 && index != i) $(this).find('> .close').trigger('click')
                })
            },
            loadUrlCallback: function($panel) {
                $panel.find(':button.btn-close').click(function() { that.closeCurrentTab() })
            },
            updateTit: function(index, title) {
                this.getTabs().eq(index).find('> a').attr('title', title).find('> span').html(title)
                this.getMoreLi().eq(index).find('> a').attr('title', title).html(title)
            },
            reload: function($tab, flag) {
                flag = flag || $tab.data('reloadFlag')
                
                var options = $tab.data('options')
                
                if (flag) {
                    $tab.data('reloadFlag', false)
                    var $panel = that.tools.getPanel(options.id)
                    
                    if ($tab.hasClass('external')) {
                        that.openExternal(options.url, $panel, options.data)
                    } else {
                        that.tools.reloadTab($panel, options)
                    }
                }
            },
            reloadTab: function($panel, options) {
                var onLoad = options.onLoad ? options.onLoad.toFunc() : null,
                    arefre = options.autorefresh && (isNaN(String(options.autorefresh)) ? 15 : options.autorefresh)
                
                $panel
                    .trigger(BJUI.eventType.beforeLoadNavtab)
                    .ajaxUrl({
                        type:(options.type || 'GET'), url:options.url, data:options.data || {}, loadingmask:options.loadingmask, callback:function(response) {
                            that.tools.loadUrlCallback($panel)
                            if (onLoad) onLoad.apply(that, [$panel])
                            if (autorefreshTimer) clearInterval(autorefreshTimer)
                            if (arefre) autorefreshTimer = setInterval(function() { $panel.navtab('refresh') }, arefre * 1000)
                            if (BJUI.ui.clientPaging && $panel.data('bjui.clientPaging')) $panel.pagination('setPagingAndOrderby', $panel)
                        }
                    })
            }
        }
        
        return tools
    }
    
    Navtab.prototype.contextmenu = function($obj) {
        var that = this
        
        $obj.contextmenu({
            id: 'navtabCM',
            bindings: {
                reload: function(t, m) {
                    if (t.data('options').url)
                        that.refresh(t.data('options').id)
                },
                closeCurrent: function(t, m) {
                    var tabId = t.data('options').id
                    
                    if (tabId) that.closeTab(tabId)
                    else that.closeCurrentTab()
                },
                closeOther: function(t, m) {
                    if (!t.index()) {
                        that.closeAllTab()
                    } else {
                        var index = that.tools.indexTabId(t.data('options').id)
                        
                        that.tools.closeOtherTab(index > 0 ? index : currentIndex)
                    }
                },
                closeAll: function(t, m) {
                    that.closeAllTab()
                }
            },
            ctrSub: function(t, m) {
                var mReload = m.find('[rel="reload"]'),
                    mCur    = m.find('[rel="closeCurrent"]'),
                    mOther  = m.find('[rel="closeOther"]'),
                    mAll    = m.find('[rel="closeAll"]'),
                    $tabLi  = that.tools.getTabs()
                
                if (!t.index()) {
                    mCur.addClass('disabled')
                    if (!t.data('options').url) mReload.addClass('disabled')
                }
            }
        })
    }
    
    // if found tabid replace tab, else create a new tab.
    Navtab.prototype.openTab = function() {
        var that = this, options = this.options, tools = this.tools, iOpenIndex
        
        if (!options.url && options.href) options.url = options.href
        
        if (!options.url) {
            BJUI.debug('BJUI.Navtab: Error trying to open a navtab, url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh()
            
            if (!options.url.isFinishedTm()) {
                $('body').alertmsg('error', (options.warn || BJUI.regional.plhmsg))
                BJUI.debug('BJUI.Navtab: The new navtab\'s url is incorrect, url: '+ options.url)
                return
            }
            
            options.url = encodeURI(options.url)
        }
        
        iOpenIndex = options.id ? tools.indexTabId(options.id) : currentIndex
        
        if (iOpenIndex >= 0) {
            var $tab   = tools.getTabs().eq(iOpenIndex),
                $panel = tools.getPanels().eq(iOpenIndex),
                op     = $tab.data('options')
            
            if (options.fresh || options.url != op.url)
                that.reload(options)
            else if (options.title != op.title) {
                op.title = options.title
                tools.updateTit(iOpenIndex, options.title)
            }
            
            currentIndex = iOpenIndex
            
            if (options.id == 'main') {
                this.contextmenu($tab)
            }
        } else {
            var tabFrag = '<li><a href="javascript:" title="#title#"><span>#title#</span></a><span class="close">&times;</span></li>',
                $tab = $(tabFrag.replaceAll('#title#', options.title)),
                $panel = $('<div class="navtabPage unitBox"></div>'),
                $more  = $('<li><a href="javascript:" title="#title#">#title#</a></li>'.replaceAll('#title#', options.title))
            
            $tab.appendTo($tabs)
            $panel.appendTo($panels)
            $more.appendTo($moreBox)
            
            $tab.data('options', $.extend({}, options))
            
            if (options.external || (options.url && options.url.isExternalUrl())) {
                $tab.addClass('external')
                this.openExternal(options.url, $panel, options.data)
            } else {
                $tab.removeClass('external')
                tools.reloadTab($panel, options)
            }
            
            currentIndex = tools.getTabs().length - 1
            this.contextmenu($tab)
            
            //events
            $tab.on('click', function(e) {
                if (!$(this).hasClass('active'))
                    that.switchTab(options.id)
            }).on('click.bjui.navtab.close', '.close', function(e) {
                that.closeTab(options.id)
            }).on('mousedown.bjui.navtab.drag', 'a', function(e) {
                $tab.data('bjui.navtab.drag', true)
                
                setTimeout($.proxy(function () {
                    if ($tab.data('bjui.navtab.drag')) that.drag(e, $tab, $panel, $more)
                }, that), 150)
                
                e.preventDefault()
            }).on('mouseup.bjui.navtab.drag', 'a', function(e) {
                $tab.data('bjui.navtab.drag', false)
            })
            
            $more.on('click', function() {
                that.switchTab(options.id)
            })
        }
        
        tools.switchTab(currentIndex)
        tools.scrollCurrent()
    }
    
    Navtab.prototype.closeTab = function(tabid) {
        var index = this.tools.indexTabId(tabid)
        
        if (index > 0)
            this.tools.closeTab(index)
    }
    
    Navtab.prototype.closeCurrentTab = function(openTabid) { //openTabid can be empty. close current tab by default, and open the last tab
        if (currentIndex > 0)
            this.tools.closeTab(currentIndex, openTabid)
    }
    
    Navtab.prototype.closeAllTab = function() {
        this.tools.getTabs().find('> .close').trigger('click')
    }
    
    Navtab.prototype.reloadFlag = function(tabids) {
        var arr = tabids.split(',')
        
        for (var i = 0; i < arr.length; i++) {
            var $tab = this.tools.getTab(arr[i].trim())
            
            if ($tab) {
                if (this.tools.indexTabId(arr[i]) == currentIndex) this.tools.reload($tab, true)
                else $tab.data('reloadFlag', true)
            }
        }
    }
    
    Navtab.prototype.switchTab = function(tabid) {
        var index = this.tools.indexTabId(tabid)
        
        this.tools.switchTab(index)
    }
    
    Navtab.prototype.scrollPrev = function() {
        this.tools.scrollPrev()
    }
    
    Navtab.prototype.scrollNext = function() {
        this.tools.scrollNext()
    }
    
    Navtab.prototype.refresh = function(tabid) {
        var $tab, $panel
        
        if (!tabid) {
            $tab = $currentTab
        } else if (typeof tabid === 'string') {
            $tab = this.tools.getTab(tabid)
        } else {
            $tab = tabid
        }
        
        if ($tab && $tab.length) {
            $panel = this.tools.getPanel($tab.data('options').id)
            $panel.removeData('bjui.clientPaging')
            
            this.reload($tab.data('options'))
        }
    }
    
    Navtab.prototype.reload = function(option) {
        var that    = this,
            options = $.extend({}, typeof option === 'object' && option),
            $tab    = options.id ? this.tools.getTab(options.id) : this.tools.getTabs().eq(currentIndex)
        
        if ($tab) {
            var op      = $tab.data('options')
            var _reload = function() {
                if (options.title && options.title != op.title) {
                    that.tools.updateTit($tab.index(), options.title)
                }
                $tab.data('options', $.extend({}, op, options))
                that.tools.reload($tab, true)
            }
            
            if (op.reloadWarn) {
                $('body').alertmsg('confirm', op.reloadWarn, {
                    okCall: function() {
                        _reload()
                    }
                })
            } else {
                _reload()
            }
        }
    }
    
    Navtab.prototype.reloadForm = function(clearQuery, option) {
        var options = $.extend({}, typeof option === 'object' && option),
            $tab    = options.id ? this.tools.getTab(options.id) : $currentTab,
            $panel  = options.id ? this.tools.getPanel(options.id) : $currentPanel
        
        if ($tab && $panel) {
            var op         = $tab.data('options'),
                data       = {},
                pageData   = {},
                $pagerForm = options.form
            
            if ($pagerForm && $pagerForm.length) {
                options.type = options.type || $pagerForm.attr('method') || 'POST'
                options.url  = options.url || $pagerForm.attr('action')
                
                pageData = $pagerForm.serializeJson()
                
                if (clearQuery) {
                    var pageInfo = BJUI.pageInfo
                    
                    for (var key in pageInfo) {
                        data[pageInfo[key]] = pageData[pageInfo[key]]
                    }
                } else {
                    data = pageData
                }
            }
            
            options.data = $.extend({}, options.data || {}, data)
            
            if (!$tab.hasClass('external')) {
                this.tools.reloadTab($panel, options)
            } else {
                this.openExternal(options.url, $panel, options.data)
            }
        }
    }
    
    Navtab.prototype.getCurrentPanel = function() {
        return this.tools.getPanels().eq(currentIndex)
    }
    
    Navtab.prototype.checkTimeout = function() {
        var json = JSON.parse($currentPanel.html())
        
        if (json && json[BJUI.keys.statusCode] == BJUI.statusCode.timeout) this.closeCurrentTab()
    }
    
    Navtab.prototype.openExternal = function(url, $panel, data) {
        var ih = $panel.closest('.navtab-panel').height()
        
        if (data && !$.isEmptyObject(data)) {
            url.indexOf('?') ? url += '&' : '?'
            url += $.param(data)
        }
        
        $panel.html(FRAG.externalFrag.replaceAll('{url}', url).replaceAll('{height}', ih +'px'))
    }
    
    Navtab.prototype.drag = function(e, $tab, $panel, $more) {
        var that  = this,
            $lis  = that.tools.getTabs(), $panels = that.tools.getPanels(), $mores = that.tools.getMoreLi(),
            $drag = $tabs.next('.bjui-navtab-drag'),
            $prev = $tab.prev(), $next  = $tab.next(),
            index = $tab.index(), width = $tab.width(),
            oleft = $tab.position().left,
            leftarr = [], newArr = [], newIndex
        
        if ($lis.length <= 2) return
        
        if (!$drag.length) {
            $drag = $('<div class="bjui-navtab-drag" style="position:absolute; top:0; left:1px; width:2px; height:25px; background:#ff6600; display:none;"></div>')
            $drag.insertAfter($tabs)
        }
        
        $drag.css('left', oleft - 2)
        
        $tabs.find('> li').each(function() {
            leftarr.push($(this).position().left)
        })
        
        $tab.find('> a').basedrag({
            move:'horizontal',
            oleft    : oleft,
            drag     : function($target, e, left, top) {
                $tab.addClass('navtab-drag')
                
                newArr = [left]
                $.merge(newArr, leftarr)
                newArr.sort(function(a, b) { return a - b })
                
                newIndex = $.inArray(left, newArr)
                if (!newIndex) newIndex = 1
                if (newIndex == $lis.length)
                    $drag.css('left', leftarr[newIndex - 1] - 2 + $lis.last().width())
                else
                    $drag.css('left', leftarr[newIndex] - 2)
                    
                $drag.show()
            },
            stop     : function() {
                $tab.removeClass('navtab-drag')
                $drag.hide()
                
                if (index != newIndex) {
                    if (newIndex == $lis.length) {
                        if (index != $lis.length - 1) {
                            $tab.insertAfter($lis.eq(newIndex - 1))
                            $panel.insertAfter($panels.eq(newIndex - 1))
                            $more.insertAfter($mores.eq(newIndex - 1))
                        }
                    } else {
                        $tab.insertBefore($lis.eq(newIndex))
                        $panel.insertBefore($panels.eq(newIndex))
                        $more.insertBefore($mores.eq(newIndex))
                    }
                }
            },
            event    : e,
            nounbind : true
        })
    }
    
    // NAVTAB PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments,
            property = option,
            navtab   = 'bjui.navtab',
            $body    = $('body'),
            datas    = $body.data(navtab) || {}
        
        return this.each(function () {
            var $this   = $(this),
                options = $.extend({}, Navtab.DEFAULTS, typeof option === 'object' && option),
                id      = options && options.id,
                data    = datas && datas[datas.current]
            
            if (typeof property === 'string' && $.isFunction(data[property])) {
                if (!data) return
                
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                if (!id) {
                    id = datas ? datas.current : 'main'
                    
                    if (!BJUI.ui.overwriteHomeTab && id === 'main')
                        id = 'navtab'
                } else {
                    if (!id.isNormalID()) {
                        BJUI.debug('BJUI.Navtab: ID ['+ id +'] '+ BJUI.regional.idChecked)
                        
                        return
                    }
                }
                
                options.id = id
                
                if (!datas[id]) {
                    datas[id] = (data = new Navtab(options))
                } else {
                    data = datas[id]
                    if (typeof option === 'object' && option)
                        $.extend(data.options, option)
                }
                
                $body.data(navtab, datas)
                
                data.openTab()
            }
        })
    }
    
    var old = $.fn.navtab
    
    $.fn.navtab             = Plugin
    $.fn.navtab.Constructor = Navtab
    
    // NAVTAB NO CONFLICT
    // =================
    
    $.fn.navtab.noConflict = function () {
        $.fn.navtab = old
        return this
    }
    
    // NOT SELECTOR
    // ==============
    
    BJUI.navtab = function() {
        Plugin.apply($('body'), arguments)
    }
    
    // NAVTAB DATA-API
    // ==============
    
    $(document).on('click.bjui.navtab.data-api', '[data-toggle="navtab"]', function(e) {
        e.preventDefault()
        
        var $this = $(this), href = $this.attr('href'), data = $this.data(), options = data.options
        
        if (options) {
            if (typeof options === 'string') options = options.toObj()
            if (typeof options === 'object')
                $.extend(data, options)
        }
        
        if (!data.title) data.title = $this.text()
        if (href && !data.url) data.url = href
        
        Plugin.call($this, data)
    })

    $(function() {
        var INIT_NAVTAB = function() {
            currentIndex = 0
            $box         = $('#bjui-navtab')
            $tabs        = $box.find('> .tabsPageHeader > .tabsPageHeaderContent > .navtab-tab')
            $panels      = $box.find('> .navtab-panel')
            $prevBtn     = $box.find('> .tabsPageHeader > .tabsLeft')
            $nextBtn     = $box.find('> .tabsPageHeader > .tabsRight')
            $moreBtn     = $box.find('> .tabsPageHeader > .tabsMore')
            $moreBox     = $box.find('> .tabsMoreList')
            $main        = $tabs.find('li:first')
            $mainLi      = $moreBox.find('li:first')

            $prevBtn.click(function() { $(this).navtab('scrollPrev') })
            $nextBtn.click(function() { $(this).navtab('scrollNext') })
            $moreBtn.click(function() {
                $moreBox.show()

                var hh = $(window).height(), mh = $moreBox.height(), th = $('#bjui-top').height() + $('#bjui-navbar').height(), sh = hh - th - 26

                if (sh < mh)
                    $moreBox.height(sh - 10)
                else
                    $moreBox.height('')
            })

            $(document).on('click.bjui.navtab.switchtab', function(e) {
                var $target = e.target.tagName == 'I' ? $(e.target).parent() : $(e.target)

                if ($moreBtn[0] != $target[0]) $moreBox.hide()
            })

            var mainTit, options = $.extend({}, Navtab.DEFAULTS, $main.data(), {id:'main', title:mainTit}), mainTab = new Navtab(options)

            $('body').data('bjui.navtab', {main:mainTab, current:'main'})

            if ($main.attr('data-url')) {
                $(document).one(BJUI.eventType.initUI, function(e) {
                    $main.removeAttr('data-url').navtab('reload', options)
                })
            }

            $main
                .data('options', $.extend({}, options))
                .navtab('contextmenu', $main)
                .click(function() { if (!$(this).hasClass('active')) BJUI.navtab('switchTab', 'main') })
                .find('> a > span').html(function(n, c) { return (mainTit = c.replace('#maintab#', BJUI.regional.maintab)) })

            if ($main.attr('data-url')) {
                $(document).one(BJUI.eventType.initUI, function(e) {
                    $main.removeAttr('data-url').navtab('reload', options)
                })
            }

            setTimeout(function() {
                $main.trigger('click')
            }, 100)

            $mainLi
                .click(function() {
                    if ($(this).hasClass('active')) $moreBox.hide()
                    else BJUI.navtab('switchTab', 'main')
                })
                .find('> a').html(function(n, c) { return c.replace('#maintab#', BJUI.regional.maintab) })

            $.CurrentNavtab = $panels.find('> .navtabPage').eq(0)
        }

        INIT_NAVTAB()
    })

    exports('BJUInavtab');
});
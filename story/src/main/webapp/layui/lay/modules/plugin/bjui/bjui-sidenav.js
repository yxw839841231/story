
/* ========================================================================
 * B-JUI: bjui-sidenav.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-sidenav.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // SLIDEBAR CLASS DEFINITION
    // ======================
    
    var Sidenav = function(element, options) {
        this.$element = $(element)
        this.options  = options
    }
    
    Sidenav.prototype.ajaxHnav = function() {
        var that = this, options = that.options, childKey = options.childKey || 'children', $li = that.$element.parent(), $box = $('#bjui-sidenav-box'), html = BJUI.StrBuilder(),
            $sidenavbtn = $('#bjui-sidenav-btn')
        var createA = function(data) {
            var liHtml = BJUI.StrBuilder(), target = data.target || 'navtab'
            
            liHtml.add('<a href="'+ (data.url || 'javascript:;') +'" ')
            
            if (data.url && (target === 'dialog' || target === 'navtab')) {
                liHtml.add('data-toggle="'+ target +'" data-options="{id:\''+ data.id +'\', title:\''+ (data.title || data.name) +'\'')
                
                if (data.width)  liHtml.add(', width:'+ data.width)
                if (data.height) liHtml.add(', height:'+ data.height)
                if (data.fresh)  liHtml.add(', fresh:'+ data.fresh)
                if (data.mask)   liHtml.add(', mask:'+ data.mask)
                
                liHtml.add('}"')
            } else if (data.url)
                liHtml.add('target="'+ target +'"')
            
            if (data[childKey])
                liHtml.add(' class="right-arrow"')
            
            liHtml.add('><i class="fa fa-'+ (data.icon || 'caret-right') +'"></i>&nbsp;'+ data.name)
            
            if (data[childKey])
                liHtml.add('<b><i class="fa fa-angle-right"></i></b>')
            
            liHtml
                .add('</a>')
                .add(createChild(data))
            
            return liHtml.toString()
        }
        var createChild = function(data) {
            var childHtml = BJUI.StrBuilder()
            
            if (data[childKey]) {
                childHtml.add('<ul class="nav">')
                
                $.each(data[childKey], function(i, m) {
                    var target = m.target || 'navtab', id = m.id && String(m.id).isNormalID && m.id
                    
                    childHtml.add('<li')
                    
                    if (target === 'navtab' && id && m.url)
                        childHtml.add(' class="'+ target +'-'+ id +'"')
                    
                    childHtml
                        .add('>')
                        .add(createA(m))
                        .add('</li>')
                })
                
                childHtml.add('</ul>')
            }
            
            return childHtml.toString()
        }
        var okCallback = function(json) {
            if (!$.isArray(json)) {
                json = [json]
            }
            
            html.add('<ul class="nav">')
            
            $.each(json, function(i, n) {
                var target = n.target || 'navtab', id = n.id && String(n.id).isNormalID && n.id
                
                html.add('<li')
                
                if (target === 'navtab' && id && n.url)
                    html.add(' class="'+ target +'-'+ id +'"')
                
                html.add('>')
                    .add(createA(n))
                    .add('</li>')
            })
            
            html.add('</ul>')
            
            $box.html(html.toString())
                .off('click').on('click', '.nav > li > a', function(e) {
                    var $this = $(this), $nav = $this.next('.nav'), $li = $this.closest('li'), $other = $li.siblings()
                    
                    if ($nav.length) {
                        $nav.stop().slideToggle(function() {
                            $li.toggleClass('open', $nav.is(':visible'))
                        })
                        
                        if (!$li.hasClass('open')) {
                            $other.find('> .nav').stop().slideUp(function() {
                                $(this).closest('li').removeClass('open')
                            })
                        }
                    }
                })
            
            $li.data('bjui.sidenav.hnav.panels', $box.find('> ul'))
            
            $(document).on('switch.bjui.navtab', function(e) {
                var datas = $('body').data('bjui.navtab'), $lis
                
                if (datas && datas.current) {
                    $box.find('li').removeClass('active').filter('.navtab-'+ datas.current).addClass('active')
                }
            })
            
            if (BJUI.ui.displayFirst)
                $box.find('> .nav > li:first > a').trigger('click')
            
            !$('body').data('bjui.sidenav.init') && $sidenavbtn.is(':visible') && ($sidenavbtn.trigger('click'))
        }
        var treeCallback = function(json) {
            var single = (typeof options.single === 'undefined' || single), $ul, html = BJUI.StrBuilder()
            
            $box.empty()
            
            if (single) {
                $ul = 
                    $('<ul class="ztree" data-toggle="ztree" id="bjui-sidenav-ztree-0"></ul>')
                    .data('options', options.treeOptions)
                    .data('nodes', json)
                
                $box.append($ul).initui()
            } else {
                if (!$.isArray(json))
                    json = [json]
                
                $.each(json, function(i, n) {
                    $ul = 
                        $('<ul class="ztree" data-toggle="ztree" id="bjui-sidenav-ztree-'+ i +'"></ul>')
                        .data('options', options.treeOptions)
                        .data('nodes', json)
                    
                    $box.append($ul)
                })
                
                $box.initui()
            }
            
            !$('body').data('bjui.sidenav.init') && $sidenavbtn.is(':visible') && ($sidenavbtn.trigger('click'))
        }
        
        BJUI.ajax('doajax', {
            url         : options.url,
            loadingmask : false,
            target      : $box,
            okCallback  : options.tree ? treeCallback : okCallback
        })
    }
    
    Sidenav.prototype.initHnav = function() {
        var that = this, options = that.options, childKey = options.childKey || 'children', targetKey = options.targetKey || 'target', idKey = options.idKey || 'id',
            $li = that.$element.parent(), $box = $('#bjui-sidenav-box'), $sidenavbtn = $('#bjui-sidenav-btn'),
            html = BJUI.StrBuilder(), json
        var createA = function(data) {
            if (!data) data = {}
            
            var liHtml = BJUI.StrBuilder(), target = data[targetKey] || 'navtab'
            
            liHtml.add('<a href="'+ (data.url || 'javascript:;') +'" ')
            
            if (data.url && (target === 'dialog' || target === 'navtab')) {
                liHtml.add('data-toggle="'+ target +'" data-options="{id:\''+ data[idKey] +'\', title:\''+ (data.title || data.name) +'\'')
                
                if (data.width)  liHtml.add(', width:'+ data.width)
                if (data.height) liHtml.add(', height:'+ data.height)
                if (data.fresh)  liHtml.add(', fresh:'+ data.fresh)
                if (data.mask)   liHtml.add(', mask:'+ data.mask)
                
                liHtml.add('}"')
            } else if (data.url)
                liHtml.add('target="'+ target +'"')
            
            if (data[childKey])
                liHtml.add(' class="right-arrow"')
            
            liHtml.add('><i class="fa fa-'+ (data.icon || 'caret-right') +'"></i>&nbsp;'+ data.name)
            
            if (data[childKey])
                liHtml.add('<b><i class="fa fa-angle-right"></i></b>')
            
            liHtml
                .add('</a>')
                .add(createChild(data))
            
            return liHtml.toString()
        }
        
        var createChild = function(data) {
            var childHtml = BJUI.StrBuilder()
            
            if (data[childKey]) {
                childHtml.add('<ul class="nav">')
                
                $.each(data[childKey], function(i, m) {
                    var target = m.target || 'navtab', id = m[idKey] && String(m[idKey]).isNormalID && m[idKey]
                    
                    childHtml.add('<li')
                    
                    if (target === 'navtab' && id && m.url)
                        childHtml.add(' class="'+ target +'-'+ id +'"')
                    
                    childHtml
                        .add('>')
                        .add(createA(m))
                        .add('</li>')
                })
                
                childHtml.add('</ul>')
            }
            
            return childHtml.toString()
        }
        var okCallback = function(json) {
            if (!$.isArray(json)) {
                json = [json]
            }
            
            html.add('<ul class="nav">')
            
            $.each(json, function(i, n) {
                var target = n.target || 'navtab', id = n[idKey] && String(n[idKey]).isNormalID && n[idKey]
                
                html.add('<li')
                
                if (target === 'navtab' && id && n.url)
                    html.add(' class="'+ target +'-'+ id +'"')
                
                html.add('>')
                    .add(createA(n))
                    .add('</li>')
            })
            
            html.add('</ul>')
            
            $box.html(html.toString())
                .off('click').on('click', '.nav > li > a', function(e) {
                    var $this = $(this), $nav = $this.next('.nav'), $li = $this.closest('li'), $other = $li.siblings()
                    
                    if ($nav.length) {
                        $nav.stop().slideToggle(function() {
                            $li.toggleClass('open', $nav.is(':visible'))
                        })
                        
                        if (!$li.hasClass('open')) {
                            $other.find('> .nav').stop().slideUp(function() {
                                $(this).closest('li').removeClass('open')
                            })
                        }
                    }
                })
            
            $li.data('bjui.sidenav.hnav.panels', $box.find('> ul'))
            
            $(document).on('switch.bjui.navtab', function(e) {
                var datas = $('body').data('bjui.navtab'), $lis
                
                if (datas && datas.current) {
                    $box.find('li').removeClass('active').filter('.navtab-'+ datas.current).addClass('active')
                }
            })
            
            if (BJUI.ui.displayFirst)
                $box.find('> .nav > li:first > a').trigger('click')
            
            !$('body').data('bjui.sidenav.init') && $sidenavbtn.is(':visible') && ($sidenavbtn.trigger('click'))
        }
        var treeCallback = function(json) {
            var single = (typeof options.single === 'undefined' || single), $ul, html = BJUI.StrBuilder()
            
            $box.empty()
            
            if (single) {
                $ul = 
                    $('<ul class="ztree" data-toggle="ztree" id="bjui-sidenav-ztree-0"></ul>')
                    .data('options', options.treeOptions)
                    .data('nodes', json)
                
                $box.append($ul).initui()
            } else {
                if (!$.isArray(json))
                    json = [json]
                
                $.each(json, function(i, n) {
                    $ul = 
                        $('<ul class="ztree" data-toggle="ztree" id="bjui-sidenav-ztree-'+ i +'"></ul>')
                        .data('options', options.treeOptions)
                        .data('nodes', json)
                    
                    $box.append($ul)
                })
                
                $box.initui()
            }
            
            !$('body').data('bjui.sidenav.init') && $sidenavbtn.is(':visible') && ($sidenavbtn.trigger('click'))
        }
        
        json = that.$element.next('.items').html()
        if (json) {
            json = $.parseJSON(json)
            options.tree ? treeCallback(json) : okCallback(json)
        }
    }
    
    // SLIDEBAR PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, $this.data(), typeof option === 'object' && option)
            var data    = $this.data('bjui.sidenav')
            
            if (!data) $this.data('bjui.sidenav', (data = new Sidenav(this, options)))
            
            if (typeof property === 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            }
        })
    }

    var old = $.fn.sidenav

    $.fn.sidenav             = Plugin
    $.fn.sidenav.Constructor = Sidenav
    
    // SLIDEBAR NO CONFLICT
    // =================
    
    $.fn.basedrag.noConflict = function () {
        $.fn.sidenav = old
        return this
    }
    
    // SLIDEBAR DATA-API
    // ==============
    $(function() {
        $('#bjui-sidenav-col').on('click.bjui.sidenav', '.nav > li > a', function() {
            var $this = $('#bjui-sidenav-col')
            
            if ($(this).hasClass('right-arrow'))
                return false
            
            if ($this.hasClass('autohide'))
                $('#bjui-sidenav-arrow').trigger('click')
        })
    })
    
    $(document).on('click.bjui.sidenav.data-api', '[data-toggle="sidenav"]', function(e) {
        e.preventDefault()
        
        var $body = $('body'), $this = $(this), href = $this.data('url') || $this.attr('href'), cache = $this.data('cache'),
            $li   = $(this).parent(), $box = $('#bjui-sidenav-box'), $panels = $li.data('bjui.sidenav.hnav.panels')
        
        if (typeof $body.data('bjui.sidenav.init') === 'undefined')
            $body.data('bjui.sidenav.init', true)
        else
            $body.data('bjui.sidenav.init', false)
        
        $li.addClass('active').siblings().removeClass('active')
        
        if (href && !(href.startsWith('#') || href.startsWith('javascript'))) {
            if (cache && $panels && $panels.length) {
                $box.append($panels)
            } else {
                $this.data('url', href)
                Plugin.call($this, 'ajaxHnav')
            }
        } else {
            $box.find('> .nav').detach()
            
            if ($panels && $panels.length) {
                $box.append($panels)
            } else {
                Plugin.call($this, 'initHnav')
            }
        }
    })
    
}(jQuery);
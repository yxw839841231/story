
/* ========================================================================
 * B-JUI: bjui-theme.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-theme.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // THEME GLOBAL ELEMENTS
    // ======================
    
    var $themeLink, $themeLis, $fontLis
    
    $(function() {
        var INIT_THEME = function() {
            $themeLink = $('#bjui-link-theme')
            $themeLis  = $('#bjui-themes')
            $fontLis   = $('#bjui-fonts')
            
            if ($.cookie) {
                var themeName = $.cookie('bjui_theme') || 'blue'
                var $li = $themeLis.find('a.theme_'+ themeName)
                
                $li.theme({})
                
                /* font */
                var fontSize = $.cookie('bjui_font') || 'bjui-font-c'
                var $fontLi  = $fontLis.find('a.'+ fontSize)
                
                $fontLi.theme('setFont', fontSize)
            }
        }
        
        INIT_THEME()
    })
    
    // THEME CLASS DEFINITION
    // ======================
    var Theme = function(element, options) {
        this.$element = $(element)
        this.options  = options
    }
    
    Theme.DEFAULTS = {
        theme: 'purple'
    }
    
    Theme.prototype.init = function() {
        if (!$themeLink.length) return
        var themeHref = $themeLink.attr('href')
        
        themeHref = themeHref.substring(0, themeHref.lastIndexOf('/'))
        themeHref = themeHref.substring(0, themeHref.lastIndexOf('/'))
        themeHref += '/'+ this.options.theme +'/core.css'
        $themeLink.attr('href', themeHref)
        
        var $themeA = this.$element.closest('li').filter('.active')
        var classA  = $themeA.data('theme') || 'default'
        
        classA      = classA.replace(/(theme[\s][a-z]*)/g, '')
        $themeA.removeClass().addClass(classA).addClass('theme').addClass(this.options.theme)
        $themeLis.find('li').removeClass('active')
        this.$element.parent().addClass('active')
        this.cookie()
    }
    
    Theme.prototype.setTheme = function(themeName) {
        $themeLis.find('a.theme_'+ themeName).trigger('click')
    }
    
    Theme.prototype.setFont = function(fontSize) {
        $('html').removeClass().addClass(fontSize)
        
        this.$element.closest('ul').prev().html(this.$element.html()).removeClass().addClass('dropdown-toggle bjui-fonts-tit '+ fontSize)
        
        $('body').find('table').each(function() {
            var $table = $(this), datagrid = $table.data('bjui.datagrid')
            
            if (datagrid) {
                datagrid.needfixedWidth = true
                $table.datagrid('fixedWidth')
                datagrid.needfixedWidth = false
            }
        })
        
        $(window).trigger(BJUI.eventType.resizeGrid)
        
        if ($.cookie) $.cookie('bjui_font', fontSize, { path: '/', expires: 30 });
    }
    
    Theme.prototype.cookie = function() {
        var theme = this.options.theme
        
        if ($.cookie) $.cookie('bjui_theme', theme, { path: '/', expires: 30 });
    }
    
    // THEME PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Theme.DEFAULTS, $this.data(), typeof option === 'object' && option)
            var data    = $this.data('bjui.theme')
            
            if (!data) $this.data('bjui.theme', (data = new Theme(this, options)))
            if (typeof property === 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }
    
    var old = $.fn.theme
    
    $.fn.theme             = Plugin
    $.fn.theme.Constructor = Theme
    
    // THEME NO CONFLICT
    // =================
    
    $.fn.theme.noConflict = function () {
        $.fn.theme = old
        return this
    }
    
    // THEME DATA-API
    // ==============

    $(document).on('click.bjui.theme.data-api', '[data-toggle="theme"]', function(e) {
        Plugin.call($(this))
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.fonts.data-api', '[data-toggle="fonts"]', function(e) {
        Plugin.call($(this), 'setFont', $(this).attr('class'))
        
        e.preventDefault()
    })

}(jQuery);
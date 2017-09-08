
/* ========================================================================
 * B-JUI: bjui-suggest.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-suggest.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
 // FINDGRID GLOBAL ELEMENTS
    // ======================
    
    var group, suffix, keys, include, autofill, onSelect, $box, $currentSuggest
    
    // FINDGRID CLASS DEFINITION
    // ======================
    
    var Suggest = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.$findBtn = null
    }
    
    Suggest.DEFAULTS = {
        keys      : null,
        group     : null,
        suffix    : null,
        include   : null,
        context   : null,
        eventType : 'change',
        autofill  : false
    }
    
    Suggest.EVENTS = {
        afterChange : 'afterchange.bjui.suggest'
    }
    
    Suggest.getField = function(key) {
        return (group ? (group +'.') : '') + (key) + (suffix ? suffix : '')
    }
    
    Suggest.setSingle = function(datas) {
        var that   = this, items, menus = [], $parents, inputs = []
        var replacePlh = function(val, data) {
            return val.replace(/#\/?[^#]*#/g, function($1) {
                var key = $1.replace(/[##]+/g, ''), val = data[key]
                
                if (typeof val === 'undefined')
                    return $1
                
                if (typeof val === 'undefined' || val === 'null' || val === null)
                    val = ''
                
                return val
            })
        }
        var createMenu = function($input, value, label) {
            items = []
            
            var $suggest = $input.data('suggest.menu'), val, lab
            
            if (!$suggest || !$suggest.length) {
                $suggest = $('<ul class="bjui-suggest-menu"></ul>')
            }
            
            $.each(datas, function(i, n) {
                val = value
                lab = label
                val = replacePlh(val, n)
                lab = replacePlh(lab, n)
                
                if (val || lab)
                    items.push('<li data-value="'+ val +'">'+ lab +'</li>')
            })
            
            if (items.length) {
                $suggest
                    .html(items.join(''))
                    .appendTo('body').css({position:'absolute', top:$input.offset().top + $input.outerHeight(), left:$input.offset().left})
                    .on('click.bjui.suggest', 'li', function() {
                        $input.val($(this).attr('data-value'))
                    })
                    .on('mouseover.bjui.suggest', 'li', function() {
                        $(this).addClass('menu-highlight')
                    })
                    .on('mouseout.bjui.suggest', 'li', function() {
                        $(this).removeClass('menu-highlight')
                    })
                
                $input.addClass('bjui-suggest-input').attr('autocomplete', false).data('suggest.menu', $suggest).off('focus.bjui.suggest').on('focus.bjui.suggest', function() {
                    $suggest.css({top:$input.offset().top + $input.outerHeight(), left:$input.offset().left}).show()
                }).off('destroy.bjui.suggest').on('destroy.bjui.suggest', function() {
                    $suggest.remove()
                })
                
                menus.push($suggest)
            }
        }
        
        $.each(keys, function(k, v) {
            var name = that.getField(k), $input = $box.find('input[name="'+ name +'"], select[name="'+ name +'"], textarea[name="'+ name +'"]'), arr = v ? v.split('/') : ['#'+ k +'#'], item, value, label
            
            if ($input && $input.length) {
                if (arr.length > 1) {
                    value = arr[0]
                    label = arr[1]
                } else {
                    value = label = arr[0]
                }
                
                if (($input.isTag('select') || $input.isTag('textarea')) && autofill) {
                    $input.val(datas[0] ? datas[0][k] : '')
                    if ($input.isTag('select')) {
                        $input.selectpicker('refresh')
                    }
                }
                else {
                    createMenu($input, value, label)
                    if (autofill)
                        $input.val(datas[0] ? datas[0][k] : '')
                }
                
                inputs.push($input)
                
                if (!$parents)
                    $parents = $input.parents()
            }
        })
        
        $(document).on('click.bjui.suggest', function(e) {
            var $suggest = $(e.target).data('suggest.menu')
            
            if (!$suggest || !$suggest.length)
                $('body').find('> .bjui-suggest-menu').hide()
            else
                $suggest.siblings('.bjui-suggest-menu').hide()
        })
        
        $parents.on('scroll.bjui.suggest', function() {
            $.each(inputs, function(i, n) {
                var $suggest = n.data('suggest.menu')
                
                if ($suggest && $suggest.is(':visible')) {
                    $suggest.css({top:n.offset().top + n.outerHeight(), left:n.offset().left})
                }
            })
        })
        
        $currentSuggest.data('menus', menus)
    }
    
    Suggest.prototype.init = function() {
        var that = this, options = this.options, tools = this.tools
        
        keys            = options.keys     || null
        group           = options.group    || null
        suffix          = options.suffix   || null
        autofill        = options.autofill || false
        $currentSuggest = that.$element
        $box            = null
        
        if (options.context) {
            if (options.context instanceof jQuery)
                $box = options.context
            else
                $box = $(options.context)
        }
        if (!$box || !$box.length)
            $box = that.$element.closest('.unitBox')
        if (suffix)
            suffix = suffix.trim()
        
        if (!options.keys) {
            BJUI.debug('BJUI.Suggest: options -> keys is not defined!')
            return
        }
        if (!options.url) {
            BJUI.debug('BJUI.Suggest: options -> url is not defined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($box)
            
            if (!options.url.isFinishedTm()) {
                BJUI.alertmsg('error', (options.warn || BJUI.regional.plhmsg))
                BJUI.debug('BJUI.Suggest: options -> url is incorrect: '+ options.url)
                return
            }
            
            options.url = encodeURI(options.url)
        }
        
        that.$element.on(options.eventType || 'change', function() {
            var val = $(this).val()
            
            if (val)
                that.load(val)
        })
    }
    
    Suggest.prototype.load = function(value) {
        var that = this, options = this.options, url = options.url
        
        if (url.indexOf('#val#') != -1) {
            url = url.replaceAll('#val#', value)
        }
        
        BJUI.ajax('doajax', {
            url   : url,
            data  : {value : value},
            type  : options.type,
            cache : options.cache,
            okCallback: function(json) {
                Suggest.setSingle(json)
            }
        })
    }
    
    Suggest.prototype.destroyMenu = function() {
        var menus = $currentSuggest.data('menus') || []
        
        if (menus.length) {
            $.each(menus, function(i, n) {
                n.remove()
            })
        }
    }
    
    // FINDGRID PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this),
                options = {},
                data
            
            $.extend(true, options, Suggest.DEFAULTS, typeof option === 'object' && option)
            
            data = new Suggest(this, options)
            
            if (typeof property === 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }
    
    var old = $.fn.suggest
    
    $.fn.suggest             = Plugin
    $.fn.suggest.Constructor = Suggest
    
    // FINDGRID NO CONFLICT
    // =================
    
    $.fn.suggest.noConflict = function () {
        $.fn.suggest = old
        return this
    }
    
    // FINDGRID DATA-API
    // ==============
    
    $(document).on(BJUI.eventType.initUI, function(e) {
        $(e.target).find('input[data-toggle="suggest"]').each(function() {
            var $this = $(this), data = $this.data(), options = data.options
            
            if (options) {
                if (typeof options === 'string') {
                    if (options.trim().startsWith('{')) 
                        options = options.toObj()
                    else
                        options = options.toFunc()
                }
                if (typeof options === 'function') {
                    options = options.apply()
                }
                if (typeof options === 'object') {
                    delete data.options
                    
                    $.extend(data, options)
                }
            }
            
            Plugin.call($this, data)
        })
    })
    
    $(document).on('click.bjui.suggest.data-api', '[data-toggle="suggestbtn"]', function(e) {
        var $this = $(this), opts = $this.data('bjui.suggest.options')
        
        if (!opts) {
            var data = $this.data(), options = data.options
            
            if (options) {
                if (typeof options === 'string') {
                    if (options.trim().startsWith('{')) 
                        options = options.toObj()
                    else
                        options = options.toFunc()
                }
                if (typeof options === 'function') {
                    options = options.apply()
                }
                if (typeof options === 'object') {
                    delete data.options
                    
                    $.extend(data, options)
                }
            }
            opts = data
        }
        
        delete opts['bjui.suggest.options']
        
        Plugin.call($this, opts)
        
        e.preventDefault()
    })
    
}(jQuery);
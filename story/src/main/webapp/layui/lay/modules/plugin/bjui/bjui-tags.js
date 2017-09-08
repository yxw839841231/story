

/* ========================================================================
 * B-JUI: bjui-tags.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-tags.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // TAGS CLASS DEFINITION
    // ======================
    var Tags = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
        this.$box     = $('<div></div>')
        this.timeout  = null
        this.$tagsArr = {}
        this.tags     = []
        
        if (options.istag) {
            this.$element.addClass('tag-input')
            this.$box.addClass('bjui-tags')
        } else {
            this.$box.addClass('bjui-autocomplete')
            if (!this.$element.attr('size'))
                this.$box.addClass('fluid')
        }
        
        this.$element.after(this.$box)
        this.$element.appendTo(this.$box)
    }
    
    Tags.DEFAULTS = {
        width     : 300,
        url       : '',
        global    : false,
        type      : 'GET',
        term      : 'term',
        tagname   : 'tag',     // Appended "<input type='hidden'>" name attribute
        max       : 0,         // The maximum allowable number of tags(0=unlimited)
        clear     : false,     // If not found, clear the input characters
        lightCls  : 'tags-highlight',
        istag     : true,      // If only need auto complete, set false
        data      : {},
        container : '',
        keys      : {
            value : 'value',
            label : 'label'
        }
    }
    
    Tags.EVENTS = {
        afterCreated : 'aftercreated.bjui.tags'
    }
    
    Tags.prototype.TOOLS = function() {
        var that  = this, options = this.options
        var tools = {
            keyDown: function(e) {
                if (e.which == 13) {
                    return false
                }
            },
            keyUp: function(e) {
                switch(e.which) {
                case BJUI.keyCode.BACKSPACE:
                    if (!$.trim(that.$element.val()).length) {
                        that.tools.removeMenu()
                        return false
                    }
                    break
                case BJUI.keyCode.ESC:
                    that.tools.removeMenu()
                    break
                case BJUI.keyCode.DOWN:
                    if (!that.$menu || !that.$menu.length) return
                    
                    var $highlight = that.$menu.find('> .'+ options.lightCls),
                        $first     = that.$menu.find('> li:first-child')
                    
                    if (!$highlight.length) {
                        $first.addClass(options.lightCls)
                    } else {
                        var $hight_next = $highlight.removeClass(options.lightCls).next()
                        
                        if ($hight_next.length) {
                            $hight_next.addClass(options.lightCls)
                        } else {
                            $first.addClass(options.lightCls)
                        }
                    }
                    return false
                    break
                case BJUI.keyCode.UP:
                    if (!that.$menu || !that.$menu.length) return
                    var $highlight = that.$menu.find('> .'+ options.lightCls),
                        $last      = that.$menu.find('> li:last-child')
                    
                    if (!$highlight.length) {
                        $last.addClass(options.lightCls)
                    } else {
                        var $hight_prev = $highlight.removeClass(options.lightCls).prev()
                        
                        if ($hight_prev.length) {
                            $hight_prev.addClass(options.lightCls)
                        } else {
                            $last.addClass(options.lightCls)
                        }
                    }
                    return false
                    break
                case BJUI.keyCode.ENTER:
                    if (options.max > 0 && that.$tagsArr.length >= options.max) return false
                    
                    var label = false, value = false, item = null
                    var $selectedItem = that.$menu && that.$menu.find('> .'+ options.lightCls)
                    
                    if ($selectedItem && $selectedItem.length) {
                        label = $selectedItem.text()
                        item  = $selectedItem.data('item')
                        value = item[options.keys.value]
                    } else {
                        label = $.trim(that.$element.val())
                        
                        if (!label.length) return false
                        if (options.clear) {
                            if ($.inArray(label, that.tags) == -1) {
                                options.istag && (that.$element.val(''))
                                return false
                            }
                        }
                        value = label
                    }
                    if (!label) return
                    
                    /* Check the repeatability */
                    var isRepeat = false
                    
                    that.$tagsArr.length && that.$tagsArr.each(function() {
                        if ($(this).val() == value) {
                            isRepeat = true
                            return
                        }
                    })
                    
                    if (isRepeat) {
                        options.istag && (that.$element.val(''))
                        return false
                    }
                    
                    that.tools.createTag(label, value)
                    that.tools.removeMenu()
                    options.istag && (that.$element.val(''))
                    
                    //events
                    $.proxy(that.tools.onAfterCreated(item, value), that)
                    
                    return false
                    break
                }
            },
            query: function() {
                if (that.timeout) clearTimeout(that.timeout)
                
                that.timeout = setTimeout(that.tools.doQuery, 300)
            },
            doQuery: function() {
                var options = that.options
                
                if (options.max > 0 && that.$tagsArr.length >= options.max) return
                
                var term = that.$element.val(), $menu = that.$menu, tags = [], $item = null
                var $parentBox = that.$element.closest('.navtab-panel').length ? $.CurrentNavtab : $.CurrentDialog
                var postData = {} 
                
                if (that.$element.closest('.bjui-layout').length) $parentBox = that.$element.closest('.bjui-layout')
                if (!term.length) return
                
                that.$element.one('ajaxStart', function() {
                    $parentBox.trigger('bjui.ajaxStart')
                }).one('ajaxStop', function() {
                    $parentBox.trigger('bjui.ajaxStop')
                })
                
                postData[options.term] = term
                $.extend(postData, typeof options.data === 'object' && options.data)
                
                options.url = decodeURI(options.url).replacePlh(that.$element.closest('.unitBox'))
                
                if (!options.url.isFinishedTm()) {
                    BJUI.alertmsg('error', (options.warn || BJUI.regional.plhmsg))
                    BJUI.debug('BJUI.Tags: The query tags url is incorrect, url: '+ options.url)
                    return
                }
                
                options.url = encodeURI(options.url)
                
                $.ajax({
                    url      : options.url,
                    global   : options.global,
                    type     : options.type,
                    data     : postData,
                    dataType : 'json',
                    success  : function(json) {
                        if (json.length != 0) {
                            if (!$menu || !$menu.length) $menu = $('<ul class="bjui-tags-menu"></ul>')
                            
                            $menu.empty().hide();
                            
                            if (options.container)
                                $menu.css('position', 'absolute').appendTo(options.container)
                            else
                                $menu.appendTo(that.$box)
                            
                            for (var i = 0; i < json.length; i++) {
                                var obj = json[i]
                                
                                if (typeof obj === 'string') {
                                    obj = {}
                                    obj[options.keys.label] = json[i]
                                    obj[options.keys.value] = json[i]
                                }
                                
                                $item = $('<li class="tags-item">'+ obj[options.keys.label] + '</li>').data('item', obj)
                                $item.appendTo($menu)
                                
                                tags.push(obj[options.keys.label])
                            }
                            
                            that.tags = tags
                            
                            var h = $(window).height() - that.$element.offset().top - 50, top = 0, left = 0
                            
                            if (options.container) {
                                top  = that.$element.offset().top + that.$element.outerHeight()
                                left = that.$element.offset().left
                            } else {
                                top  = that.$element.position().top + that.$element.outerHeight()
                                left = that.$element.position().left
                            }
                            
                            $menu
                                .css({'top':top, 'left':left})
                                .fadeIn()
                                .find('> li')
                                    .hover(function() {
                                        $(this).addClass(options.lightCls).siblings().removeClass(options.lightCls)
                                    }, function() {
                                        $(this).removeClass(options.lightCls)
                                    })
                                    .click(function() {
                                        var label    = $(this).text()
                                        var item     = $(this).data('item')
                                        var value    = item[options.keys.value]
                                        var isRepeat = false
                                        
                                        that.$box.find('input:hidden').each(function() {
                                            if ($(this).val() == value) {
                                                isRepeat = true
                                                return
                                            }
                                        })
                                        
                                        if (isRepeat) {
                                            options.istag && (that.$element.val(''))
                                            $menu.remove()
                                            return
                                        }
                                        
                                        $.proxy(that.tools.createTag(label, value), that)
                                        
                                        $menu.remove()
                                        options.istag && (that.$element.val(''))
                                        
                                        //events
                                        $.proxy(that.tools.onAfterCreated(item, value), that)
                                    })
                            
                            if ($menu.height() > h) {
                                $menu.height(h - 10).css('overflow-y', 'scroll')
                            }
                            
                            that.$menu = $menu
                        }
                    }
                })
            },
            createTag: function(label, value) {
                if (!that.options.istag) {
                    that.$element.val(label)
                    
                    return
                }
                var $btn = $('<span class="label label-tag" data-value="' + value +'" style="margin-left: 1px; margin-top: 1px;"><i class="fa fa-tag"></i> ' + label + '&nbsp;&nbsp;<a href="#" class="close">&times;</a></span>')
                
                $btn
                    .insertBefore(that.$element)
                    .find('a.close')
                    .click(function() {
                        var value = $btn.data('value')
                        
                        that.$box.find('input:hidden').each(function() {
                            if ($(this).val() == value) {
                                $(this).remove()
                            }
                        })
                        
                        $btn.remove()
                        that.$tagsArr = that.$box.find('input[name="'+ that.options.tagname +'"]')
                    })
                
                var $hidden = $('<input type="hidden" name="'+ that.options.tagname +'">').val(value)
                
                $hidden.appendTo(that.$box)
                that.$tagsArr = that.$box.find('input[name="'+ that.options.tagname +'"]')
            },
            removeMenu: function() {
                if (that.$menu) that.$menu.remove()
            },
            onAfterCreated: function(item, value) {
                var alltags = []
                
                that.$tagsArr.length && that.$tagsArr.each(function() {
                    alltags.push($(this).val())
                })
                
                that.$element.trigger(Tags.EVENTS.afterCreated, {item:item, value:value, tags:alltags.join(',')})
            }
        }
        
        return tools
    }
    
    Tags.prototype.init = function() {
        var that     = this
        var $element = this.$element
        var options  = this.options
        
        if (!(options.url)) {
            BJUI.debug('BJUI.Tags: Do query tags, url is undefined!')
            return
        }
        if (isNaN(this.options.max)) {
            BJUI.debug('BJUI.Tags: Parameter \'max\' is non-numeric type!')
            return
        }
        
        that.$box.on('click', function() {
            $element.focus()
        })
        
        if (options.istag)
            that.$box.css('width', options.width)
        
        $element
            //.on('blur', $.proxy(this.tools.removeMenu, this))
            .on('keydown', $.proxy(this.tools.keyDown, this))
            .on('keyup', $.proxy(this.tools.keyUp, this))
        
        if (!$.support.leadingWhitespace) { // for ie8
            $element.on('propertychange', $.proxy(this.tools.query, this))
        } else {
            $element.on('input', $.proxy(this.tools.query, this))
        }
        
        $(document).on('click.bjui.tags', $.proxy(function(e) {
            if (!$(e.target).closest(this.$box).length) this.tools.removeMenu()
        }, this))
    }
    
    Tags.prototype.destroy = function() {
        if (this.$tags) {
            this.$element.upwrap()
            $tags.remove()
        }
    }
    
    // TAGS PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments,
            property = option
        
        return this.each(function () {
            var $this   = $(this),
                options = {},
                data
            
            $.extend(true, options, Tags.DEFAULTS, typeof option === 'object' && option)
            
            data = new Tags(this, options)
            
            if (typeof property === 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }
    
    var old = $.fn.tags
    
    $.fn.tags             = Plugin
    $.fn.tags.Constructor = Tags
    
    // TAGS NO CONFLICT
    // =================
    
    $.fn.tags.noConflict = function () {
        $.fn.tags = old
        return this
    }
    
    // TAGS DATA-API
    // ==============
    
    $(document).on(BJUI.eventType.initUI, function(e) {
        $(e.target).find('input[data-toggle="tags"]').each(function() {
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
            } else {
                if (data.keys)
                    data.keys = data.keys.toObj()
                if (data.data)
                    data.data = data.data.toObj()
            }
            
            Plugin.call($this, data)
        })
    })

}(jQuery);
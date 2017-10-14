
/* ========================================================================
 * B-JUI: bjui-pagination.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-pagination.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

layui.define('BJUIextends', function(exports){
    "use strict";
    var $ = layui.BJUIextends,BJUI=layui.BJUIcore;
    
    // PAGINATION CLASS DEFINITION
    // ======================
    
    var Pagination = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
    }
    
    Pagination.DEFAULTS = {
        width          : '100%',
        pageSize       : 30,
        selectPageSize : '30,60,90',
        pageCurrent    : 1,
        total          : 0,
        showpageCurrent    : 5,
        form           : null,
        callback       : null,
        page            :'页'
    }
    
    Pagination.prototype.TOOLS = function() {
        var that    = this
        var tools   = {
            getPageCount: function(pageSize, total) {
                return Math.ceil(total / pageSize)
            },
            getPageInterval: function(count, pageCurrent, showpageCurrent) {
                var half  = Math.ceil(showpageCurrent / 2), limit = count - showpageCurrent,
                    start = pageCurrent > half ? Math.max(Math.min(pageCurrent - half, limit), 0) : 0,
                    end   = pageCurrent > half ? Math.min((pageCurrent + half), count) : Math.min(showpageCurrent, count)
                
                if (end - start == showpageCurrent) end = end + 1
                if (end < showpageCurrent) end = end + 1
                if (start + 1 == end) end = end + 1
                
                return {start:start + 1, end:end}
            },
            // jump to page
            jumpPage: function(pageCurrent, pageSize) {
                var callback = that.options.callback
                
                if (typeof callback === 'string')
                    callback = callback.toFunc()
                
                if (pageCurrent) {
                    that.options.pageCurrent = pageCurrent
                }
                if (pageSize) {
                    that.options.pageSize = pageSize
                    that.pageCount = this.getPageCount(pageSize, that.options.total)
                    
                    if (that.options.pageCurrent > that.pageCount)
                        that.options.pageCurrent = that.pageCount
                }
                
                if (callback && typeof callback === 'function') {
                    callback.call(that, that.options.pageCurrent, pageSize)
                } else {
                    this.setPaging(that.options.pageCurrent, pageSize, true)
                }
                
                that.$element.trigger('bjui.pagination.jump')
            },
            setPaging: function(pageCurrent, pageSize, isSubmit) {
                var $form = that.options.form, paging = {}
                
                if ($form) {
                    if (!($form instanceof jQuery)) {
                        $form = $($form)
                    }
                    if (!$form || !$form.length) {
                        BJUI.debug('BJUI.Pagination: The options \'form\' is not incorrect!')
                        return
                    }
                    
                    paging[BJUI.pageInfo.pageCurrent] = pageCurrent
                    paging[BJUI.pageInfo.pageSize]    = pageSize
                    
                    $form.data('bjui.paging', paging)
                    
                    if (isSubmit)
                        $form.trigger('submit')
                }
            }
        }
        return tools
    }
    
    Pagination.prototype.jumpPage = function(pageCurrent, pageSize) {
        var that = this, options = that.options, pageCount = that.pageCount
        
        if (pageCurrent && isNaN(pageCurrent)) return
        if (pageSize && isNaN(pageSize))       return
        if (pageCurrent) {
            pageCurrent = parseInt(pageCurrent, 10)
            
            if (pageCurrent < 1)         pageCurrent = 1
            if (pageCurrent > pageCount) pageCurrent = pageCount
            if (pageCurrent == options.pageCurrent) return
        }
        if (pageSize) {
            pageSize = parseInt(pageSize, 10)
        }
        
        that.tools.jumpPage(pageCurrent || options.pageCurrent, pageSize || options.pageSize)
    }
    
    Pagination.prototype.init = function() {
        var that = this, tools = that.tools, options = that.options, pr = BJUI.regional.pagination, btnpaging = FRAG.gridPaging, pageCurrents = [], interval, selectPages = [], pagingHtml = BJUI.StrBuilder()
        
        that.pageCount = tools.getPageCount(options.pageSize, options.total)
        
        interval = tools.getPageInterval(that.pageCount, options.pageCurrent, options.showpageCurrent)
        
        for (var i = interval.start; i < interval.end; i++) {
            pageCurrents.push(FRAG.gridpageCurrent.replace('#num#', i).replace('#active#', (options.pageCurrent == i ? ' active' : '')))
        }
        
        btnpaging = BJUI.doRegional(btnpaging.replaceAll('#pageCurrent#', options.pageCurrent).replaceAll('#count#', options.total +'/'+ parseInt((that.pageCount || 0), 10)), pr)
        
        pagingHtml
            .add('<div class="paging-content">')
            .add('<span></span><div class="paging-pagesize"><button type="button" class="btn-default btn-refresh" title="'+ pr.refresh +'" data-icon="refresh"></button>')
            .add('<select data-toggle="selectpicker"></select>')
            .add('</div>')
            .add('<div class="paging-box">')
            .add(btnpaging.replace('#pageCurrentFrag#', pageCurrents.join('')))
            .add('</div>')
            .add('</div>')
        
        that.$element.addClass('bjui-paging-box').html(pagingHtml.toString())
        that.$element.find('> .paging-content').width(options.width).initui()
        
        tools.setPaging(options.pageCurrent, options.pageSize)
        
        //events
        var $select    = that.$element.find('div.paging-pagesize > select'),
            $pageCurrent   = that.$element.find('ul.pagination'),
            $pagetotal = $pageCurrent.find('> li.page-total'),
            $jumpto    = $pagetotal.next(),
            $first     = $jumpto.next(),
            $prev      = $first.next(),
            $next      = $prev.nextAll('.page-next'),
            $last      = $next.next()
        
        var disablePrev = function() {
            $first.addClass('disabled')
            $prev.addClass('disabled')
        }
        var enablePrev = function() {
            $first.removeClass('disabled')
            $prev.removeClass('disabled')
        }
        var disableNext = function() {
            $next.addClass('disabled')
            $last.addClass('disabled')
        }
        var enableNext = function() {
            $next.removeClass('disabled')
            $last.removeClass('disabled')
        }
        var pageFirst = function() {
            disablePrev()
            enableNext()
        }
        var pageLast = function() {
            enablePrev()
            disableNext()
        }
        var setPageSize = function(pageSize) {
            $select.empty()
            
            if (!pageSize) pageSize = that.options.pageSize
            
            selectPages = options.selectPageSize.split(',')
            selectPages.push(String(pageSize))
            
            $.unique(selectPages).sort(function(a, b) { return a - b })
            
            var opts = []
            
            $.each(selectPages, function(i, n) {
                opts.push('<option value="'+ n +'"'+ (n == options.pageSize && 'selected') +'>'+ n +'/'+ pr.page +'</option>')
            })
            
            $select.html(opts.join('')).selectpicker('refresh')
        }
        
        if (options.pageCurrent == 1) pageFirst()
        if (options.pageCurrent == that.pageCount) {
            pageLast()
            if (options.pageCurrent == 1) disablePrev()
        }
        if (!options.total) disableNext()
        setPageSize()
        
        that.$element.on('click.bjui.pagination.pageCurrent', 'li.page-num', function(e) {
            var $num = $(this)
            
            if (!$num.hasClass('active')) {
                that.jumpPage($num.text())
            }
            
            e.preventDefault()
        }).on('click.bjui.pagination.refresh', 'button.btn-refresh', function() {
            that.jumpPage()
        }).on('bjui.pagination.jump', function(e) {
            var pageCurrent = that.options.pageCurrent, interval = tools.getPageInterval(that.pageCount, pageCurrent, options.showpageCurrent), pageCurrents = []
            
            for (var i = interval.start; i < interval.end; i++) {
                pageCurrents.push(FRAG.gridpageCurrent.replace('#num#', i).replace('#active#', (pageCurrent == i ? ' active' : '')))
            }
            
            $pageCurrent.find('> li.page-num').remove()
            $prev.after(pageCurrents.join(''))
            
            if (pageCurrent == 1) {
                pageFirst()
                if (pageCurrent == that.pageCount) disableNext()
                if (!that.options.total) disableNext()
            } else if (pageCurrent == that.pageCount) {
                pageLast()
            } else {
                enablePrev()
                enableNext()
            }
            
            $jumpto.find('input').val(pageCurrent)
            $pagetotal.find('> span').html(that.options.total +'/'+ that.pageCount)
        }).on('bjui.pagination.pageSize', function(e, pageSize) {
            setPageSize(pageSize)
        }).on('change', 'div.paging-pagesize > select', function() {
            var pageSize = $(this).val()
            
            that.pageCount = tools.getPageCount(pageSize, options.total)
            
            that.jumpPage(null, pageSize)
        })
        
        $jumpto.find('input').on('keyup', function(e) {
            if (e.which === BJUI.keyCode.ENTER) {
                var page = $(this).val()
                
                if (page) that.jumpPage(page)
            }
        })
        
        $first.on('click', function() {
            if (that.options.pageCurrent > 1)
                that.jumpPage(1)
        })
        
        $prev.on('click', function() {
            if (that.options.pageCurrent > 1)
                that.jumpPage(that.options.pageCurrent - 1)
        })
        
        $next.on('click', function() {
            if (that.options.pageCurrent < that.pageCount)
                that.jumpPage(that.options.pageCurrent + 1)
        })
        
        $last.on('click', function() {
            if (that.options.pageCurrent < that.pageCount)
                that.jumpPage(that.pageCount)
        })
    }
    
    Pagination.prototype.destroy = function() {
        this.$element.removeData('bjui.pagination').empty()
    }
    
    // PAGINATION PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments,
            property = option
        
        return this.each(function () {
            var $this   = $(this),
                options = $.extend({}, Pagination.DEFAULTS, $this.data(), typeof option === 'object' && option),
                data    = $this.data('bjui.pagination')
            
            if (!data) $this.data('bjui.pagination', (data = new Pagination(this, options)))
            if (typeof property === 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }
    
    var old = $.fn.pagination
    
    $.fn.pagination             = Plugin
    $.fn.pagination.Constructor = Pagination
    
    // PAGINATION NO CONFLICT
    // =================
    
    $.fn.pagination.noConflict = function () {
        $.fn.pagination = old
        return this
    }
    
    // PAGINATION DATA-API
    // ==============
    
    $(document).on(BJUI.eventType.initUI, function(e) {
        $(e.target).find('[data-toggle="pagination"]').each(function() {
            var $this = $(this), data = $this.data(), options = data.options
            
            if (options) {
                if (typeof options === 'string') options = options.toObj()
                if (typeof options === 'object') {
                    delete data.options
                    $.extend(data, options)
                }
            }
            
            Plugin.call($this, data)
        })
    })

    exports('BJUIpagination',new Pagination());
});
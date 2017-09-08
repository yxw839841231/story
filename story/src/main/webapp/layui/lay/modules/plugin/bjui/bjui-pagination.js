
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
        pageNum    : 1,
        total          : 0,
        showPagenum    : 5,
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
            getPageInterval: function(count, pageNum, showPageNum) {
                var half  = Math.ceil(showPageNum / 2), limit = count - showPageNum,
                    start = pageNum > half ? Math.max(Math.min(pageNum - half, limit), 0) : 0,
                    end   = pageNum > half ? Math.min((pageNum + half), count) : Math.min(showPageNum, count)
                
                if (end - start == showPageNum) end = end + 1
                if (end < showPageNum) end = end + 1
                if (start + 1 == end) end = end + 1
                
                return {start:start + 1, end:end}
            },
            // jump to page
            jumpPage: function(pageNum, pageSize) {
                var callback = that.options.callback
                
                if (typeof callback === 'string')
                    callback = callback.toFunc()
                
                if (pageNum) {
                    that.options.pageNum = pageNum
                }
                if (pageSize) {
                    that.options.pageSize = pageSize
                    that.pageCount = this.getPageCount(pageSize, that.options.total)
                    
                    if (that.options.pageNum > that.pageCount)
                        that.options.pageNum = that.pageCount
                }
                
                if (callback && typeof callback === 'function') {
                    callback.call(that, that.options.pageNum, pageSize)
                } else {
                    this.setPaging(that.options.pageNum, pageSize, true)
                }
                
                that.$element.trigger('bjui.pagination.jump')
            },
            setPaging: function(pageNum, pageSize, isSubmit) {
                var $form = that.options.form, paging = {}
                
                if ($form) {
                    if (!($form instanceof jQuery)) {
                        $form = $($form)
                    }
                    if (!$form || !$form.length) {
                        BJUI.debug('BJUI.Pagination: The options \'form\' is not incorrect!')
                        return
                    }
                    
                    paging[BJUI.pageInfo.pageNum] = pageNum
                    paging[BJUI.pageInfo.pageSize]    = pageSize
                    
                    $form.data('bjui.paging', paging)
                    
                    if (isSubmit)
                        $form.trigger('submit')
                }
            }
        }
        return tools
    }
    
    Pagination.prototype.jumpPage = function(pageNum, pageSize) {
        var that = this, options = that.options, pageCount = that.pageCount
        
        if (pageNum && isNaN(pageNum)) return
        if (pageSize && isNaN(pageSize))       return
        if (pageNum) {
            pageNum = parseInt(pageNum, 10)
            
            if (pageNum < 1)         pageNum = 1
            if (pageNum > pageCount) pageNum = pageCount
            if (pageNum == options.pageNum) return
        }
        if (pageSize) {
            pageSize = parseInt(pageSize, 10)
        }
        
        that.tools.jumpPage(pageNum || options.pageNum, pageSize || options.pageSize)
    }
    
    Pagination.prototype.init = function() {
        var that = this, tools = that.tools, options = that.options, pr = BJUI.regional.pagination, btnpaging = FRAG.gridPaging, pageNums = [], interval, selectPages = [], pagingHtml = BJUI.StrBuilder()
        
        that.pageCount = tools.getPageCount(options.pageSize, options.total)
        
        interval = tools.getPageInterval(that.pageCount, options.pageNum, options.showPagenum)
        
        for (var i = interval.start; i < interval.end; i++) {
            pageNums.push(FRAG.gridPageNum.replace('#num#', i).replace('#active#', (options.pageNum == i ? ' active' : '')))
        }
        
        btnpaging = BJUI.doRegional(btnpaging.replaceAll('#pageNum#', options.pageNum).replaceAll('#count#', options.total +'/'+ parseInt((that.pageCount || 0), 10)), pr)
        
        pagingHtml
            .add('<div class="paging-content">')
            .add('<span></span><div class="paging-pagesize"><button type="button" class="btn-default btn-refresh" title="'+ pr.refresh +'" data-icon="refresh"></button>')
            .add('<select data-toggle="selectpicker"></select>')
            .add('</div>')
            .add('<div class="paging-box">')
            .add(btnpaging.replace('#pageNumFrag#', pageNums.join('')))
            .add('</div>')
            .add('</div>')
        
        that.$element.addClass('bjui-paging-box').html(pagingHtml.toString())
        that.$element.find('> .paging-content').width(options.width).initui()
        
        tools.setPaging(options.pageNum, options.pageSize)
        
        //events
        var $select    = that.$element.find('div.paging-pagesize > select'),
            $pagenum   = that.$element.find('ul.pagination'),
            $pagetotal = $pagenum.find('> li.page-total'),
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
        
        if (options.pageNum == 1) pageFirst()
        if (options.pageNum == that.pageCount) {
            pageLast()
            if (options.pageNum == 1) disablePrev()
        }
        if (!options.total) disableNext()
        setPageSize()
        
        that.$element.on('click.bjui.pagination.pagenum', 'li.page-num', function(e) {
            var $num = $(this)
            
            if (!$num.hasClass('active')) {
                that.jumpPage($num.text())
            }
            
            e.preventDefault()
        }).on('click.bjui.pagination.refresh', 'button.btn-refresh', function() {
            that.jumpPage()
        }).on('bjui.pagination.jump', function(e) {
            var pageNum = that.options.pageNum, interval = tools.getPageInterval(that.pageCount, pageNum, options.showPagenum), pageNums = []
            
            for (var i = interval.start; i < interval.end; i++) {
                pageNums.push(FRAG.gridPageNum.replace('#num#', i).replace('#active#', (pageNum == i ? ' active' : '')))
            }
            
            $pagenum.find('> li.page-num').remove()
            $prev.after(pageNums.join(''))
            
            if (pageNum == 1) {
                pageFirst()
                if (pageNum == that.pageCount) disableNext()
                if (!that.options.total) disableNext()
            } else if (pageNum == that.pageCount) {
                pageLast()
            } else {
                enablePrev()
                enableNext()
            }
            
            $jumpto.find('input').val(pageNum)
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
            if (that.options.pageNum > 1) 
                that.jumpPage(1)
        })
        
        $prev.on('click', function() {
            if (that.options.pageNum > 1)
                that.jumpPage(that.options.pageNum - 1)
        })
        
        $next.on('click', function() {
            if (that.options.pageNum < that.pageCount)
                that.jumpPage(that.options.pageNum + 1)
        })
        
        $last.on('click', function() {
            if (that.options.pageNum < that.pageCount)
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
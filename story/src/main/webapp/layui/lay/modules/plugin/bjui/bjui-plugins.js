/* ========================================================================
 * B-JUI: bjui-plugins.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-plugins.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

layui.define('BJUIextends', function(exports){
    "use strict";
    var $ = layui.jquery,BJUI=layui.BJUIcore;


    $(document).on(BJUI.eventType.initUI, function (e) {
        var $box = $(e.target)

        // UI init begin...

        /* i-check */
        if ($.fn.iCheck) {
            var $icheck = $box.find('input[data-toggle="icheck"]')

            $icheck.each(function (i) {
                var $element = $(this),
                    id = $element.attr('id'),
                    name = $element.attr('name'),
                    label = $element.data('label')

                if (label) $element.after('<label for="' + id + '" class="ilabel">' + label + '</label>')

                $element
                    .on('ifCreated', function (e) {
                        /* Fixed validate msgbox position */
                        var $parent = $(this).closest('div'),
                            $ilabel = $parent.next('[for="' + id + '"]')

                        $parent.attr('data-icheck', name)
                        $ilabel.attr('data-icheck', name)
                    })
                    .iCheck({
                        checkboxClass: 'datagrid-icheck',
                        radioClass: 'datagrid-icheck',
                        increaseArea: '20%' // optional
                    })
                    .on('ifChanged', function () {
                        $.fn.validator && $(this).trigger('validate')
                    })

                if ($element.prop('disabled')) $element.iCheck('disable')
            })
            /* i-check check all */
            $icheck.filter('.checkboxCtrl').on('ifChanged', function (e) {
                var checked = e.target.checked == true ? 'check' : 'uncheck'
                var group = $(this).data('group')

                $box.find(':checkbox[name="' + group + '"]').iCheck(checked)
            })
        }

        /* fixed ui style */
        $box.find('button').each(function () {
            var $element = $(this), icon = $element.data('icon')

            $element.addClass('btn')

            if (icon && !$element.find('> i').length) {
                icon = 'fa-' + icon.replace('fa-', '')

                if (!$element.data('bjui.icon')) {
                    $element.html('<i class="fa ' + icon + '"></i> ' + $element.html()).data('bjui.icon', true)
                }
            }
        })

        $box.find('input:text, input:password').each(function () {
            var $element = $(this).addClass('form-control'), size = $element.attr('size') || 0, width = size * 10

            width && $element.css('width', width)
        })

        $box.find('textarea').each(function () {
            var $element = $(this).addClass('form-control'), cols = $element.attr('cols') || 0, width = cols * 10, toggle = $element.attr('data-toggle')

            width && $element.css('width', width)

            if (toggle && toggle == 'autoheight' && $.fn.autosize)
                $element.addClass('autosize').autosize()
        })

        $box.find('a.btn').each(function () {
            var $element = $(this), icon = $element.data('icon')

            if (icon && !$element.find('> i').length) {
                icon = 'fa-' + icon.replace('fa-', '')

                if (!$element.data('bjui.icon')) {
                    $element.html('<i class="fa ' + icon + '"></i> ' + $element.html()).data('bjui.icon', true)
                }
            }
        })

        /* form validate */
        if ($.fn.validator) {
            $box.find('form[data-toggle="validate"]').each(function () {
                var $element = $(this)

                $(this)
                    .validator({
                        valid: function (form) {
                            $(form).bjuiajax('_ajaxform', $(form), $(form).data())
                        },
                        validClass: 'ok',
                        msgClass: 'n-bottom',
                        theme: 'red_bottom_effect_grid'
                    })
                    .on('invalid.form', function (e, form, errors) {
                        if ($(form).data('alertmsg')) $(form).alertmsg('error', BJUI.regional.validatemsg.replaceMsg(errors.length))
                    })
            })
        }

        /* moreSearch */
        $box.find('[data-toggle="moresearch"]').each(function () {
            var $element = $(this),
                $parent = $element.closest('.bjui-pageHeader'),
                $more = $parent && $parent.find('.bjui-moreSearch'),
                name = $element.data('name')

            if (!$element.attr('title')) $element.attr('title', '更多查询条件')
            $element.click(function (e) {
                if (!$more.length) {
                    BJUI.debug('Not created \'moresearch\' box[class="bjui-moreSearch"]!')
                    return
                }
                $more.css('top', $parent.outerHeight() - 1)
                if ($more.is(':visible')) {
                    $element.html('<i class="fa fa-angle-double-down"></i>')
                    if (name) $('body').data('moresearch.' + name, false)
                } else {
                    $element.html('<i class="fa fa-angle-double-up"></i>')
                    if (name) $('body').data('moresearch.' + name, true)
                }
                $more.fadeToggle('slow', 'linear')

                e.preventDefault()
            })

            if (name && $('body').data('moresearch.' + name)) {
                $more.css('top', $parent.outerHeight() - 1).fadeIn()
                $element.html('<i class="fa fa-angle-double-up"></i>')
            }
        })

        /* bootstrap - select */
        if ($.fn.selectpicker) {
            var $selectpicker = $box.find('select[data-toggle="selectpicker"]')
            var bjui_select_linkage = function ($obj, $next) {
                if (!$next || !$next.length) return

                var refurl = $obj.data('refurl')
                var _setEmpty = function ($select) {
                    var $_nextselect = $($select.data('nextselect'))

                    if ($_nextselect && $_nextselect.length) {
                        var emptytxt = $_nextselect.data('emptytxt') || '&nbsp;'

                        $_nextselect.html('<option>' + emptytxt + '</option>').selectpicker('refresh')
                        _setEmpty($_nextselect)
                    }
                }

                if (($next && $next.length) && refurl) {
                    var val = $obj.data('val'), nextVal = $next.data('val'), keys = $obj.data('keys')

                    if (keys && typeof keys === 'string')
                        keys = keys.toObj()
                    if (!keys)
                        keys = {}

                    if (typeof val === 'undefined') val = $obj.val()
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: refurl.replace('{value}', encodeURIComponent(val)),
                        cache: false,
                        data: {},
                        success: function (json) {
                            if (!json) return

                            var html = '', selected = ''

                            $.each(json, function (i) {
                                var value, label

                                if (json[i] && json[i].length) {
                                    value = json[i][0]
                                    label = json[i][1]
                                } else {
                                    value = json[i][keys.value || 'value']
                                    label = json[i][keys.label || 'label']
                                }
                                if (typeof nextVal !== 'undefined') selected = value == nextVal ? ' selected' : ''
                                html += '<option value="' + value + '"' + selected + '>' + label + '</option>'
                            })

                            $obj.removeAttr('data-val').removeData('val')
                            $next.removeAttr('data-val').removeData('val')

                            if (!html) {
                                html = $next.data('emptytxt') || '&nbsp;'
                                html = '<option>' + html + '</option>'
                            }

                            $next.html(html).selectpicker('refresh')
                            _setEmpty($next)
                        },
                        error: BJUI.ajaxError
                    })
                }
            }

            $selectpicker.each(function () {
                var $element = $(this)
                var options = $element.data()
                var $next = $(options.nextselect)

                $element.addClass('show-tick')
                if (!options.style) $element.data('style', 'btn-default')
                if (!options.width) $element.data('width', 'auto')
                if (!options.container) $element.data('container', 'body')
                else if (options.container == true) $element.attr('data-container', 'false').data('container', false)

                $element.selectpicker()

                if ($next && $next.length && (typeof $next.data('val') != 'undefined'))
                    bjui_select_linkage($element, $next)
            })

            /* bootstrap - select - linkage && Trigger validation */
            $selectpicker.change(function () {
                var $element = $(this)
                var $nextselect = $($element.data('nextselect'))

                bjui_select_linkage($element, $nextselect)

                /* Trigger validation */
                if ($element.attr('aria-required')) {
                    $.fn.validator && $element.trigger('validate')
                }
            })
        }

        /* tooltip */
        $box.find('[data-toggle="tooltip"]').each(function () {
            $(this).tooltip()
        });

        $box.find('[data-toggle="popover"]').each(function () {
            var $element = $(this), target = $element.data('target')

            if (target && $(target).length) {
                $element.attr('data-content', $(target).html())
            }

            $element.popover()
        });
    })

    exports('BJUIplugins');
});
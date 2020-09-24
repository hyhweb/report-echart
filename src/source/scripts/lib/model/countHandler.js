(function ($) {
    $.fn.CountHandler = function (param) {
        $.fn.CountHandler.defaultParams = {
            start: 0,
            end: 0,
            delay: 100,
            length: 8,
            interval: 3,
            split: true,
            autoCount: true,
            ajaxData: null,
            ajaxType: "post",
            ajaxUrl: null,
            ajaxSpeed: 3 * 1000

        }
        var p = $.extend({}, $.fn.CountHandler.defaultParams, param);
        var g = $(this);
        g.start = p.start;
        g.end = p.end;
        g.index = 0;
        g.nowCount = 0;
        g.beforeCount = 0;
        g.diff = 0;
        g.ajaxCount = 0;
        g.render = function () {
            var box = $("<div class='counter-box'></div>");
            $(".counter-box").attr("num", g.start);
            var startArr = g.startSplit();
            if (p.length >= startArr.length) {
                startArr.map(function (item, index) {
                    var itemHtml = g.createItem(item);
                    box.prepend(itemHtml);
                })
                for (var i = startArr.length; i < p.length; i++) {
                    box.prepend(g.diff(startArr.length, p.length));
                }
            }
            g.append(box);
            if (p.split) {
                if (p.length > p.interval) {
                    var count = parseInt(p.length / p.interval);
                    for (var i = 1; i <= count; i++) {
                        var key = i * p.interval;
                        $(".counter-box-item[itemid=" + key + "]").before("<div class='counter-box-item-split'></div>");
                    }
                }

            }

        };
        g.createItem = function (num, uncount) {
            if (p.length) {
                g.index++;
                var item = $("<div num=" + num + " itemid=" + g.index + " class='counter-box-item'>" + num + "</div>");
                if (uncount) {
                    item.addClass("uncount");
                }
                return item;
            }
        };
        g.diff = function (from, to) {
            if (to > from) {
                return g.createItem(0, true);
            }
        };
        g.startSplit = function () {
            return g.start.toString().split("").reverse();
        };
        g.startCount = function () {
            if (p.autoCount) {
                // g.nowCount = g.start;
                if (g.end > g.start) {
                    var setIntervalHandler = setInterval(function () {
                        if (g.end != g.start) {
                            g.start++;
                            $(".counter-box").attr("num", g.start);
                            if (g.start.toString().length != 0) {
                                for (var i = 0; i < g.start.toString().length; i++) {
                                    var key = i + 1;
                                    var num = $(".counter-box-item[itemid=" + key + "]").html();
                                    var numArr = g.start.toString().split("").reverse();
                                    if (numArr[i] != num) {
                                        $(".counter-box-item[itemid=" + key + "]").html(numArr[i]);
                                        $(".counter-box-item[itemid=" + key + "]").attr("num", numArr[i]);
                                    }
                                    if (num != "0" && $(".counter-box-item[itemid=" + key + "]").hasClass("uncount")) {
                                        $(".counter-box-item[itemid=" + key + "]").removeClass('uncount');
                                    }
                                }
                            }
                        } else {
                            clearInterval(setIntervalHandler);
                        }
                    }, p.delay)
                }
            }
        };
        g.ajaxHandler = function () {
            if (p.ajaxUrl) {
                var param = {
                    url: p.ajaxUrl,
                    type: p.ajaxType,
                    data: p.ajaxData,
                    success: function (res) {
                        if (res.success) {
                            if (g.ajaxCount == 0) {
                                g.end = g.start = res.data;
                                g.render();
                            } else {
                                g.end = res.data;
                            }
                            g.ajaxCount++;
                            g.startCount();
                        }

                    },
                    fail: function () {
                        //alert("网络请求异常");
                    },

                };
                common.ajax(param);

            }
        };
        g.init = function () {

            if (p.ajaxUrl) {
                g.ajaxHandler();
                setInterval(function () {
                    g.ajaxHandler();
                }, p.ajaxSpeed)

            } else {
                g.render();
                g.startCount();
            }
        };
        g.init();
    }
})(jQuery)

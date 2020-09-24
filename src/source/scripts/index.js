(function ($) {
    var countHomeDataCenterWH = function () {
        $(".data-show").width($(".data-show").height());
        var width = $(".data-show").width();
        $('.total').width(($(".center-wrapper").width() - width) / 2);
        $(".center-r-t,.center-r-b").find(".total-inner").css({"margin-left": width});
    }
    $.fn.computeMapPosition = function () {
        //地图位置计算
        var w = $('.map-bg-wrapper').width(), h = $('.map-bg-wrapper').height();
        if (w >= h) {
            $('.map-bg').width(h);
            $('.map-bg').height(h);
        } else {
            $('.map-bg').width(w);
            $('.map-bg').height(w);

        }
        var dottedWidth = $(".dotted.bg1").width() / 2;

        for (var i = 1; i < 6; i++) {
            var startTop = $(".dotted.bg" + i).offset().top + dottedWidth,
                startLeft = $(".dotted.bg" + i).offset().left + dottedWidth,
                endTop = $(".circle-line" + i).offset().top - 1,
                endLeft = $(".circle-line" + i).offset().left;
            var diffX = startLeft - endLeft;
            var diffY = startTop - endTop;
            var length = Math.sqrt(diffX * diffX + diffY * diffY); //计算连线长度
            var c = 360 * Math.atan2(diffY, diffX) / (2 * Math.PI); //弧度值转换为角度值
            var deg = c <= -90 ? (360 + c) : c;  //负角转换为正角
            if ($(".line" + i).length != 0) {
                $(".line" + i).remove();
            }
            var html = "<div class=line" + i + " style='position: fixed;  top:" + endTop + "px;left:" + endLeft
                + "px;width:" + length + "px;transform:rotate(" + deg + "deg);transform-origin:left bottom;z-index: 9999;'>"
                + "</div>";
            $("body").append(html);
        }

    }
    var onresizeHandler = function () {
        $.fn.ContainerHandler(true);
        $.fn.CooperationHandler(true);
        $.fn.GoodsTypeHandler(true);
        // countHomeDataCenterWH();
        $(".line1,.line2,.line3,.line4,.line5,.circle-line1,.circle-line2,.circle-line3,.circle-line4,.circle-line5").css({visibility: "hidden"});
        setTimeout(function () {
            $.fn.computeMapPosition();
            $(".line1,.line2,.line3,.line4,.line5,.circle-line1,.circle-line2,.circle-line3,.circle-line4,.circle-line5").css({visibility: "visible"});
        }, 1000)
    }
    var init = function () {
        var datetime = $(".time-count").DateTime();
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal', // 垂直切换选项
            /*loop: true, // 循环模式选项*/
            /*autoplay:true,*/
            delay: 4000,
            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        });

        $(".count-box-counter").CountHandler({
            ajaxUrl: "/forwarder/foreign/statistics/salesmanContainerNum/total",
            ajaxSpeed: 60 * 1000
        });
        setTimeout(function () {
            $.fn.computeMapPosition();
        }, 1000)
        window.onresize = onresizeHandler;
        /*    window.onresize = function () {
                location.reload();
            };*/
        var a = 0;
        $(".full-screen-inner").on('click', function () {
            a++;
            a % 2 == 1 ? common.fullScreenHandler.enter() : common.fullScreenHandler.exit();
        })

    }
    init();
})(jQuery)






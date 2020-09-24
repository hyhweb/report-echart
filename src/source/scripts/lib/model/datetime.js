(function ($) {
    $.fn.DateTime= function (params) {
        var g = $(this);
        $.fn.DateTime.options ={
            auto:true,//开启自动计时
        }
        var p = $.fn.extend({},$.fn.DateTime.options,params)
        this.render =function(){
            var box =$("<div class='datetime-box'>" +
                "<p class='time'><span class='noon-text'></span><span class='time-text'></span></p>" +
                "<p class='date'><span class='date-text'></span> <span class='date-split'></span> <span class='week-text'></span></p>"+
                "</div>");
            if(!g.hasClass("datetime-box")){
                g.append(box);
                this.count(box)
            }
        };
        this.count = function () {
            var noon = $('.noon-text',g),
                time = $('.time-text',g),
                date = $('.date-text',g),
                week = $('.week-text',g);
            var dateTimeData = this.getDateTime();
            noon.html(dateTimeData.noon);
            time.html(dateTimeData.fullHours);
            date.html(dateTimeData.fullDate);
            week.html(dateTimeData.week);
        };
        this.getDateTime =function(){
            var now = new Date();
            var getWeek=function(num){
                switch (num) {
                    case 0 : return  "星期日";
                    break;
                    case 1 : return  "星期一";
                        break;
                    case 2 : return  "星期二";
                        break;
                    case 3 : return  "星期三";
                        break;
                    case 4 : return  "星期四";
                        break;
                    case 5 : return  "星期五";
                        break;
                    case 6 : return  "星期六";
                        break;
                }

            }
            var nowInfo = {
                year:now.getFullYear(),
                month:now.getMonth()+1,
                date:now.getDate(),
                hours: now.getHours(),
                minute:now.getMinutes(),
                seconds:now.getSeconds(),
                week:now.getDay()
            }
            return {
                noon:nowInfo.hours<=12?'上午':'下午',
                week:getWeek(nowInfo.week),
                fullDate:nowInfo.year+"-"+(nowInfo.month<10?'0'+nowInfo.month:nowInfo.month)+"-"+(nowInfo.date<10?'0'+nowInfo.date:nowInfo.date),
                fullHours:nowInfo.hours+":"+(nowInfo.minute<10?'0'+nowInfo.minute:nowInfo.minute)+":"+(nowInfo.seconds<10?'0'+nowInfo.seconds:nowInfo.seconds)
            }
        };
        this.init =function(){
            this.render();
            if(p.auto){
                var that = this;
                setInterval(function () {
                    that.count()
                },1000)
            }
        };

        this.init();
    }

})(jQuery);

var common = {
    baseUrl: "http://10.1.1.53:8082",
    ajax: function (param) {
        var defaultParam = {
            url: this.baseUrl + param.url,
            type: param.type,
            contentType: "json/application;charset=UTF-8",
            data: JSON.stringify(param.data),
            success: param.success,
            fail: param.fail
        };
        return $.ajax(defaultParam);
    },
    fullScreenHandler: {
        enter: function () {
            var doc = document.documentElement;
            //W3C
            if (doc.requestFullscreen) {
                doc.requestFullscreen();
            }
            //FireFox
            else if (doc.mozRequestFullScreen) {
                doc.mozRequestFullScreen();
            }
            //Chrome等
            else if (doc.webkitRequestFullScreen) {
                doc.webkitRequestFullScreen();
            }
            //IE11
            else if (doc.msRequestFullscreen) {
                doc.msRequestFullscreen();
            }
        },
        exit: function () {
            if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
}

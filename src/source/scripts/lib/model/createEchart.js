var page = 1, pageSize = 10;
(function ($) {
    $.fn.ContainerHandler = function (reload) {
        var statisticsType = $(".container-total").find(".selected").index();
        common.ajax({
            url: "/forwarder/foreign/statistics/salesmanContainerNum/queryList",
            data: {statisticsType: statisticsType},
            type: "post"
        }).then(function (res) {
            var data = res.data;
            if (res.success) {
// 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('container-wrapper'));

// 指定图表的配置项和数据
                var option = null;
                if (statisticsType == 0) {
                    option = {
                        tooltip: {},
                        color: ['#d8303d', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#c23531', '#2f4554'],
                        grid: {
                            bottom: '9%'
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: data.axisData,
                            axisLine: {
                                lineStyle: {
                                    color: "#3c6fdd",
                                }
                            }
                        },
                        yAxis: {
                            type: 'value',
                            min: function (value) {
                                return value.min;
                            },
                            name: '单位：TU',
                            axisLine: {
                                lineStyle: {
                                    color: "#3c6fdd",
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: "#366cd7",
                                    type: "dotted"
                                }
                            }
                        },
                        series: [{
                            data: data.seriesData,
                            type: 'line',
                            itemStyle: {
                                borderWidth: 5,
                                color: "#d8303d"
                            },
                            label: {
                                show: false,
                            },
                            areaStyle: {
                                opacity: 0.5,
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: '#d8303d' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: 'transparent' // 100% 处的颜色
                                    }],
                                    global: false // 缺省为 false
                                }
                            }
                        }]
                    };

                } else if (statisticsType == 1) {
                    /* option = {
                         title: {
                             text: ''
                         },
                         tooltip: {},
                         legend: {
                             data: []
                         },

                         color: ['#3c6fdd', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#c23531', '#2f4554'],
                         xAxis: {
                             type: 'category',
                             data: data.axisData,
                             axisLine: {
                                 lineStyle: {
                                     color: "#3c6fdd",
                                 }
                             },
                         },
                         yAxis: {
                             axisLine: {
                                 lineStyle: {
                                     color: "#3c6fdd",
                                 }
                             },
                             splitLine: {
                                 lineStyle: {
                                     color: "#366cd7",
                                     type: "dotted"
                                 }
                             }
                         },
                         series: [
                             {
                                 name: '数量',
                                 type: 'bar',
                                 barWidth: '60%',
                                 data: data.seriesData,
                                 label: {
                                     normal: {
                                         show: true,
                                         position: "top",
                                         color: "#fff"
                                     }
                                 }
                             }
                         ]
                     };*/
// 绘制左侧面
                    const CubeLeft = echarts.graphic.extendShape({
                        shape: {
                            x: 0,
                            y: 0
                        },
                        buildPath: function (ctx, shape) {
                            // 会canvas的应该都能看得懂，shape是从custom传入的
                            const xAxisPoint = shape.xAxisPoint
                            console.log(shape)
                            const c0 = [shape.x + 17, shape.y]
                            const c1 = [shape.x - 23, shape.y - 6]
                            const c2 = [xAxisPoint[0] - 23, xAxisPoint[1] - 13]
                            const c3 = [xAxisPoint[0] + 17, xAxisPoint[1]]
                            ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
                        }
                    })
// 绘制右侧面
                    const CubeRight = echarts.graphic.extendShape({
                        shape: {
                            x: 0,
                            y: 0
                        },
                        buildPath: function (ctx, shape) {
                            const xAxisPoint = shape.xAxisPoint
                            const c1 = [shape.x + 17, shape.y]
                            const c2 = [xAxisPoint[0] + 17, xAxisPoint[1]]
                            const c3 = [xAxisPoint[0] + 35, xAxisPoint[1] - 15]
                            const c4 = [shape.x + 35, shape.y - 15]
                            ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
                        }
                    })
// 绘制顶面
                    const CubeTop = echarts.graphic.extendShape({
                        shape: {
                            x: 0,
                            y: 0
                        },
                        buildPath: function (ctx, shape) {
                            const c1 = [shape.x + 17, shape.y]
                            const c2 = [shape.x + 35, shape.y - 15] //右点
                            const c3 = [shape.x - 5, shape.y - 20]
                            const c4 = [shape.x - 23, shape.y - 6]
                            ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
                        }
                    })
// 注册三个面图形
                    echarts.graphic.registerShape('CubeLeft', CubeLeft)
                    echarts.graphic.registerShape('CubeRight', CubeRight)
                    echarts.graphic.registerShape('CubeTop', CubeTop)

                    option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            },
                            formatter: function (params, ticket, callback) {
                                const item = params[1]
                                return item.name + ' : ' + item.value;
                            }
                        },
                        grid: {
                            bottom: '9%'
                        },
                        xAxis: {
                            type: 'category',
                            data: data.axisData,
                            axisLine: {
                                lineStyle: {
                                    color: "#3c6fdd",
                                }
                            },
                            boundaryGap: true
                        },
                        yAxis: {
                            name: '单位：TU',
                            axisLine: {
                                lineStyle: {
                                    color: "#3c6fdd",
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: "#366cd7",
                                    type: "dotted"
                                }
                            }
                        },
                        series: [{
                            type: 'custom',
                            renderItem: (params, api) => {
                                const location = api.coord([api.value(0), api.value(1)])
                                return {
                                    type: 'group',
                                    children: [{
                                        type: 'CubeLeft',
                                        shape: {
                                            api,
                                            xValue: api.value(0),
                                            yValue: api.value(1),
                                            x: location[0],
                                            y: location[1],
                                            xAxisPoint: api.coord([api.value(0), 0])
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 1,
                                                color: '#3c71e1'
                                            },
                                                {
                                                    offset: 1,
                                                    color: '#3c71e1'
                                                }
                                            ])
                                        }
                                    }, {
                                        type: 'CubeRight',
                                        shape: {
                                            api,
                                            xValue: api.value(0),
                                            yValue: api.value(1),
                                            x: location[0],
                                            y: location[1],
                                            xAxisPoint: api.coord([api.value(0), 0])
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 1,
                                                color: '#404077'
                                            },
                                                {
                                                    offset: 1,
                                                    color: '#404077'
                                                }
                                            ])
                                        }
                                    }, {
                                        type: 'CubeTop',
                                        shape: {
                                            api,
                                            xValue: api.value(0),
                                            yValue: api.value(1),
                                            x: location[0],
                                            y: location[1],
                                            xAxisPoint: api.coord([api.value(0), 0])
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 1,
                                                color: '#528aff'
                                            },
                                                {
                                                    offset: 1,
                                                    color: '#528aff'
                                                }
                                            ])
                                        }
                                    }]
                                }
                            },
                            data: data.seriesData,
                        }, {
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',

                                    fontSize: 16,
                                    color: '#fff',
                                    offset: [2, -25]
                                }
                            },
                            itemStyle: {
                                color: 'transparent'
                            },
                            tooltip: {},
                            data: data.seriesData,
                        }]
                    }
                } else if (statisticsType == 2) {
                    /*option = {
                        title: {
                            text: ''
                        },
                        tooltip: {},
                        legend: {
                            data: []
                        },

                        color: ['#3fcb89', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#c23531', '#2f4554'],
                        xAxis: {
                            type: 'category',
                            data: data.axisData,
                            axisLine: {
                                lineStyle: {
                                    color: "#3c6fdd",
                                }
                            },
                        },
                        yAxis: {
                            axisLine: {
                                lineStyle: {
                                    color: "#3c6fdd",
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: "#366cd7",
                                    type: "dotted"
                                }
                            }
                        },
                        series: [
                            {
                                name: '数量',
                                type: 'bar',
                                barWidth: '60%',
                                data: data.seriesData,
                                label: {
                                    normal: {
                                        show: true,
                                        position: "top",
                                        color: "#fff"
                                    }
                                }
                            }
                        ]
                    };*/
                    // 绘制左侧面
                    const CubeLeft = echarts.graphic.extendShape({
                        shape: {
                            x: 0,
                            y: 0
                        },
                        buildPath: function (ctx, shape) {
                            // 会canvas的应该都能看得懂，shape是从custom传入的
                            const xAxisPoint = shape.xAxisPoint
                            console.log(shape)
                            const c0 = [shape.x + 17, shape.y]
                            const c1 = [shape.x - 23, shape.y - 6]
                            const c2 = [xAxisPoint[0] - 23, xAxisPoint[1] - 13]
                            const c3 = [xAxisPoint[0] + 17, xAxisPoint[1]]
                            ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
                        }
                    })
// 绘制右侧面
                    const CubeRight = echarts.graphic.extendShape({
                        shape: {
                            x: 0,
                            y: 0
                        },
                        buildPath: function (ctx, shape) {
                            const xAxisPoint = shape.xAxisPoint
                            const c1 = [shape.x + 17, shape.y]
                            const c2 = [xAxisPoint[0] + 17, xAxisPoint[1]]
                            const c3 = [xAxisPoint[0] + 35, xAxisPoint[1] - 15]
                            const c4 = [shape.x + 35, shape.y - 15]
                            ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
                        }
                    })
// 绘制顶面
                    const CubeTop = echarts.graphic.extendShape({
                        shape: {
                            x: 0,
                            y: 0
                        },
                        buildPath: function (ctx, shape) {
                            const c1 = [shape.x + 17, shape.y]
                            const c2 = [shape.x + 35, shape.y - 15] //右点
                            const c3 = [shape.x - 5, shape.y - 20]
                            const c4 = [shape.x - 23, shape.y - 6]
                            ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
                        }
                    })
// 注册三个面图形
                    echarts.graphic.registerShape('CubeLeft', CubeLeft)
                    echarts.graphic.registerShape('CubeRight', CubeRight)
                    echarts.graphic.registerShape('CubeTop', CubeTop)

                    option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            },
                            formatter: function (params, ticket, callback) {
                                const item = params[1]
                                return item.name + ' : ' + item.value;
                            }
                        },
                        grid: {
                            bottom: '9%'
                        },
                        xAxis: {
                            type: 'category',
                            data: data.axisData,
                            axisLine: {
                                lineStyle: {
                                    color: "#3c6fdd",
                                }
                            },
                            boundaryGap: true
                        },
                        yAxis: {
                            name: '单位：TU',
                            axisLine: {
                                lineStyle: {
                                    color: "#3c6fdd",
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: "#366cd7",
                                    type: "dotted"
                                }
                            }
                        },
                        series: [{
                            type: 'custom',
                            renderItem: (params, api) => {
                                const location = api.coord([api.value(0), api.value(1)])
                                return {
                                    type: 'group',
                                    children: [{
                                        type: 'CubeLeft',
                                        shape: {
                                            api,
                                            xValue: api.value(0),
                                            yValue: api.value(1),
                                            x: location[0],
                                            y: location[1],
                                            xAxisPoint: api.coord([api.value(0), 0])
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 1,
                                                color: '#3eca88'
                                            },
                                                {
                                                    offset: 1,
                                                    color: '#3eca88'
                                                }
                                            ])
                                        }
                                    }, {
                                        type: 'CubeRight',
                                        shape: {
                                            api,
                                            xValue: api.value(0),
                                            yValue: api.value(1),
                                            x: location[0],
                                            y: location[1],
                                            xAxisPoint: api.coord([api.value(0), 0])
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 1,
                                                color: '#237876'
                                            },
                                                {
                                                    offset: 1,
                                                    color: '#237876'
                                                }
                                            ])
                                        }
                                    }, {
                                        type: 'CubeTop',
                                        shape: {
                                            api,
                                            xValue: api.value(0),
                                            yValue: api.value(1),
                                            x: location[0],
                                            y: location[1],
                                            xAxisPoint: api.coord([api.value(0), 0])
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 1,
                                                color: '#50df9c'
                                            },
                                                {
                                                    offset: 1,
                                                    color: '#50df9c'
                                                }
                                            ])
                                        }
                                    }]
                                }
                            },
                            data: data.seriesData,
                        }, {
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',

                                    fontSize: 16,
                                    color: '#fff',
                                    offset: [2, -25]
                                }
                            },
                            itemStyle: {
                                color: 'transparent'
                            },
                            tooltip: {},
                            data: data.seriesData,
                        }]
                    }
                }


// 使用刚指定的配置项和数据显示图表。
                if (reload) {
                    myChart.dispose();
                    //$("#container-wrapper").attr("style", "");
                    setTimeout(function () {
                        myChart = echarts.init(document.getElementById('container-wrapper'));
                        myChart.setOption(option);
                        $.fn.computeMapPosition();
                    }, 1000)

                    /* myChart.resize({width: null, height: null})*/
                } else {
                    if (myChart) {
                        myChart.clear();
                    }
                    myChart.setOption(option);
                }

            }
        })


    }
    $.fn.CooperationHandler = function (reload) {
        common.ajax({
            url: "/forwarder/foreign/statistics/customerNum/queryList",
            data: {statisticsType: $(".cooperation-total").find(".selected").index()},
            type: "post"
        }).then(function (res) {
            var data = res.data;
            if (res.success) {
                //客户总量统计
// 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('cooperation-wrapper'));

// 指定图表的配置项和数据
                var option = {
                    tooltip: {},
                    color: ['#ae52e3', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#c23531', '#2f4554'],
                    grid: {
                        left: '15%',
                        top: '15%',
                        bottom: '9%'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: data.axisData,
                        axisLine: {
                            lineStyle: {
                                color: "#3c6fdd",
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '单位：个',
                        min: function (value) {
                            return value.min;
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#3c6fdd",
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#366cd7",
                                type: "dotted"
                            }
                        }
                    },
                    series: [{
                        data: data.seriesData,
                        type: 'line',
                        itemStyle: {
                            borderWidth: 5,
                            color: "#eab44f"
                        },
                        areaStyle: {
                            opacity: 0.5,
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#eab44f' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'transparent' // 100% 处的颜色
                                }],
                                global: false // 缺省为 false
                            }
                        }
                    }]
                };

// 使用刚指定的配置项和数据显示图表。
                if (reload) {
                    myChart.dispose();
                    // $("#cooperation-wrapper").attr("style", "");
                    setTimeout(function () {
                        myChart = echarts.init(document.getElementById('cooperation-wrapper'));
                        myChart.setOption(option);
                        $.fn.computeMapPosition();
                    }, 1000)

                    /*myChart.resize({width: null, height: null})*/
                } else {
                    if (myChart) {
                        myChart.clear();
                    }
                    myChart.setOption(option);
                }

            }
        })


    }
    $.fn.GoodsTypeHandler = function (reload) {
        common.ajax({
            url: "/forwarder/foreign/statistics/goodsNum/queryList",
            type: "post",
            data: {page: page, pageSize: pageSize}
        }).then(function (res) {
            var data = res.data;
            if (res.success) {
                if (data.seriesData != null && data.seriesData.length < pageSize) {
                    page = 1;
                } else {
                    page++;
                }
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('goodsType-wrapper'));

// 指定图表的配置项和数据
                var option = {
                    title: {
                        text: '',
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    color: ['#ae52e3', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#c23531', '#2f4554'],
                    grid: {
                        left: '16%',
                        top: '15%',
                        bottom: '9%'
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        max: function (value) {
                            return Math.ceil(value.max * 1.2);
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#3c6fdd",
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#366cd7",
                                type: "dotted"
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        name: '单位：TU',
                        data: data.axisData,
                        axisLine: {
                            lineStyle: {
                                color: "#3c6fdd",
                            }
                        }
                    },
                    series: [
                        {
                            name: '数量',
                            type: 'bar',
                            data: data.seriesData,
                            label: {
                                normal: {
                                    show: true,
                                    position: "right",
                                    color: "#fff"
                                }
                            },
                            itemStyle: {
                                barBorderRadius: [0, 20, 20, 0], // 圆角（左上、右上、右下、左下）
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    '#ae52e3', '#ae52e3'
                                ].map((color, offset) => ({
                                    color,
                                    offset
                                }))), // 渐变
                            },
                            barCategoryGap: "50%"
                        }
                    ]
                };

// 使用刚指定的配置项和数据显示图表。
                if (reload) {
                    myChart.dispose();
                    // $("#goodsType-wrapper").attr("style", "");
                    setTimeout(function () {
                        myChart = echarts.init(document.getElementById('goodsType-wrapper'));
                        myChart.setOption(option);
                        $.fn.computeMapPosition();
                    }, 1000)

                    /* myChart.clear();
                     myChart.setOption(option);*/
                } else {
                    if (myChart) {
                        myChart.clear();
                    }
                    myChart.setOption(option);

                }


            }

        })
    }
    $.fn.HarborHandler = function () {
        common.ajax({
            url: "/forwarder/foreign/statistics/harborNum/queryList",
            type: "post"
        }).then(function (res) {
            if (res.success) {
                var harborData = res.data.harborData;
                var harborNum = res.data.harborNum;
                //华北片区
                if (harborData.hbpq) {
                    $(".map-data-title-box.bg1 .total").html(harborData.hbpq.all || 0);
                    $(".map-data-title-box.b1 .add").html(harborData.hbpq.mon || 0);
                }

                //东北片区
                if (harborData.dbpq) {
                    $(".map-data-title-box.bg2 .total").html(harborData.dbpq.all || 0);
                    $(".map-data-title-box.bg2 .add").html(harborData.dbpq.mon || 0);
                }

                //山东片区
                if (harborData.sdpq) {
                    $(".map-data-title-box.bg3 .total").html(harborData.sdpq.all || 0);
                    $(".map-data-title-box.bg3 .add").html(harborData.sdpq.mon || 0);
                }

                //华东片区
                if (harborData.hdpq) {
                    $(".map-data-title-box.bg4 .total").html(harborData.hdpq.all || 0);
                    $(".map-data-title-box.bg4 .add").html(harborData.hdpq.mon || 0);
                }

                //华南片区
                if (harborData.hnpq) {
                    $(".map-data-title-box.bg5 .total").html(harborData.hnpq.all || 0);
                    $(".map-data-title-box.bg5 .add").html(harborData.hnpq.mon || 0);
                }

                $(".harbor-total-text").html(harborNum);


            }

        });
    }
})(jQuery)
$(".container-total .btn").each(function (index, item) {
    $(item).click(function () {
        $(item).addClass("selected").siblings().removeClass("selected");
        $.fn.ContainerHandler();
    })
})
$(".cooperation-total .btn").each(function (index, item) {
    $(item).click(function () {
        $(item).addClass("selected").siblings().removeClass("selected");
        $.fn.CooperationHandler();
    })
})
$(".container-total .btn").eq(0).trigger("click");
$(".cooperation-total .btn").eq(0).trigger("click");
$.fn.ContainerHandler();
$.fn.CooperationHandler();
$.fn.GoodsTypeHandler();
$.fn.HarborHandler();
setInterval(function () {
    $.fn.GoodsTypeHandler();
}, 20000)

setInterval(function () {
    $.fn.ContainerHandler();
    $.fn.CooperationHandler();
    $.fn.HarborHandler();
}, 60000)

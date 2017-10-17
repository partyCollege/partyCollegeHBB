({
    baseUrl: '../',
    optimize: 'none',
    name: 'echarts',
    packages: [
        {
            main: 'echarts',
            location: 'http://localhost:8080/Echarts/js/echarts',
            name: 'echarts'
        },
        {
            main: 'zrender',
            location: 'http://localhost:8080/Echarts/js/zrender',
            name: 'zrender'
        }
    ],
    include:[
        'echarts/chart/line',
        'echarts/chart/bar',
        'echarts/component/grid',
        'echarts/chart/pie',
        'echarts/chart/scatter',
        'echarts/component/tooltip',
        'echarts/component/polar',
        'echarts/chart/radar',

        'echarts/component/legend',

        'echarts/chart/map',
        'echarts/chart/treemap',
        'echarts/chart/graph',
        'echarts/chart/gauge',
        'echarts/chart/funnel',
        'echarts/chart/parallel',
        'echarts/chart/sankey',
        'echarts/chart/boxplot',
        'echarts/chart/candlestick',
        'echarts/chart/effectScatter',
        'echarts/chart/lines',
        'echarts/chart/heatmap',

        'echarts/component/geo',
        'echarts/component/parallel',

        'echarts/component/title',

        'echarts/component/dataZoom',
        'echarts/component/visualMap',

        'echarts/component/markPoint',
        'echarts/component/markLine',

        'echarts/component/timeline',
        'echarts/component/toolbox',

        'http://localhost:8080/Echarts/js/zrender/vml/vml'
    ],
    out: 'http://localhost:8080/Echarts/js/echarts/dist/echarts.js'
})
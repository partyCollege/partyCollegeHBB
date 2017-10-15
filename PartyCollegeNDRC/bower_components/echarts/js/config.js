require.config({
    paths: {
        'geoJson': '../geoData/geoJson',
        'theme': '../theme',
        'data': './data',
        'map': '../map',
        'extension': '../extension'
    },
    packages: [
        {
            main: 'echarts',
            location: '../bower_components/echarts/js/echarts',
            name: 'echarts'
        },
        {
            main: 'zrender',
            location: '../bower_components/echarts/js/zrender',
            name: 'zrender'
        }
    ]
    // urlArgs: '_v_=' + +new Date()
});
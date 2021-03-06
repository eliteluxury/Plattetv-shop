var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
    navigateFallback: '/index.html',
    navigateFallbackWhitelist: [],
    stripePrefix: 'dist/en',
    root: 'dist/en/',
    plugins:[
        new SWPrecacheWebpackPlugin({
            cacheId: 'ng-pwa',
            filename: 'service-worker.js',
            staticFileGlobs: [
                'dist/en/index.html',
                'dist/en/**.js',
                'dist/en/**.css'
            ],

        })
    ],
    stripePrefix: 'dist/en/assets',
    mergeStaticsConfig: true
};

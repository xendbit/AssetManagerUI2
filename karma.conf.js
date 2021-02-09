// // Karma configuration file, see link for more information
// // https://karma-runner.github.io/1.0/config/configuration-file.html

// module.exports = function (config) {
//   config.set({
//     basePath: '',
//     frameworks: ['jasmine', '@angular-devkit/build-angular'],
//     plugins: [
//       require('karma-jasmine'),
//       require('karma-chrome-launcher'),
//       require('karma-jasmine-html-reporter'),
//       require('karma-coverage'),
//       require('@angular-devkit/build-angular/plugins/karma')
//     ],
//     client: {
//       clearContext: false, // leave Jasmine Spec Runner output visible in browser
//       jasmine: {
//         timeoutInterval: 10000
//       }
//     },
//     // coverageReporter: {
//     //   dir: require('path').join(__dirname, './coverage/ArtExchange-reports'),
//     //   subdir: '.',
//     //   reporters: [
//     //     { type: 'html' },
//     //     { type: 'text-summary' }
//     //   ]
//     // },
//     coverageIstanbulReporter: {
//       dir: require('path').join(__dirname, './coverage/artxexchange-unit-reports'),
//       reports: ['html', 'lcovonly', 'text-summary'],
//       fixWebpackSourcePaths: true
//     },
//     reporters: ['progress', 'kjhtml'],
//     port: 9876,
//     colors: true,
//     logLevel: config.LOG_INFO,
//     autoWatch: true,
//     browsers: ['Chrome'],
//     singleRun: false,
//     restartOnFileChange: true
//   });
// };

// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        timeoutInterval: 15000
      }
    },
    // reporters: ['progress', 'html'],
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/artxexchange-unit-reports'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    jasmineHtmlReporter: {
      suppressAll: true, // Suppress all messages (overrides other suppress settings)
      suppressFailed: true // Suppress failed messages
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
        ChromeHeadlessCI: {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox']
        }
    },
    singleRun: false,
    restartOnFileChange: true
  });
};


module.exports = function (grunt) {
    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt'
                },
                src: ['test/**/*.js']
            }
        },
        eslint: {
            all: ["Gruntfile.js", "test/**/*.jsx", "src/**/*.js"]
        }
    });

    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
    grunt.loadNpmTasks("grunt-mocha-test");

    grunt.registerTask("test", ["eslint:all", "mochaTest:test"]);
};

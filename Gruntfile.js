module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.initConfig({
        uglify: {
            options: {
                sourceMap: true
            },
            target1: {
                src: 'ga.js',
                dest: 'ga.min.js'
            },
            target2: {
                src: 'plugins.js',
                dest: 'plugins.min.js'
            }
        }
    });
    grunt.registerTask('default', ['uglify']);
};

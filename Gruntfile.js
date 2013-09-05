module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.coffee',
          dest: './',
          ext: '.js'
        }]
      },

    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');

  // Default task(s).
  grunt.registerTask('default', ['coffee']);

};
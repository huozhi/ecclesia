'use strict';
/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  require('jit-grunt')(grunt);
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    express: {
      options: {
        // Override defaults here
        port: process.env.PORT || 3000,
        script: 'app.js',
        livereload: true
      },
      dev: {
        options: {
          script: 'app.js',
          debug: true,
          livereload: true,
        }
      },
      prod: {
        options: {
          script: 'app.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'app.js',
          node_env: 'development'
        }
      }
    },
    open: {
      server: {
        url: 'https://localhost:3000',
      },
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      options: {
        nospawn: true,
        livereload: {
          port: 35728,
          key: grunt.file.read('sslcert/privatekey.pem'),
          cert: grunt.file.read('sslcert/certificate.pem'),
        },
      },
      html: {
        files: ['./views/**/*.html'],
      },
      css: {
        files: ['*.css', '**/*.css'],
      },
      js: {
        files: [
          '**/*.js', '!**/node_modules/**', '!**/bower_components/**'
        ],
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        // tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        // tasks: ['jshint:lib_test', 'qunit']
      },
      express: {
        files: [
          '**/*.js',
          '!**/node_modules/**',
          '!**/bower_components/**',
          '**/*.html',
          '**/*.css',
        ],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-keepalive');
  grunt.loadNpmTasks('grunt-open');
  // Default task.

  grunt.registerTask('serve', ['express:dev', 'open', 'watch']);
};

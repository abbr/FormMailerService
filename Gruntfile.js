// Generated on 2013-12-04 using generator-angular-fullstack 1.0.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman : {
      // configurable paths
      app : require('./bower.json').appPath || 'app',
      dist : 'public',
      views : 'views'
    },
    express : {
      options : {
        port : process.env.PORT || 9000
      },
      dev : {
        options : {
          script : 'server.js',
          debug : true
        }
      },
      prod : {
        options : {
          script : 'server.js',
          node_env : 'production'
        }
      }
    },
    open : {
      server : {
        url : 'http://localhost:<%= express.options.port %>'
      }
    },
    watch : {
      js : {
        files : ['{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js'],
        tasks : ['newer:jshint:all']
      },
      jsTest : {
        files : ['test/spec/{,*/}*.js'],
        tasks : ['newer:jshint:test', 'karma']
      },
      compass : {
        files : ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks : ['compass:server', 'autoprefixer']
      },
      livereload : {
        files : ['<%= yeoman.app %>/<%= yeoman.views %>/{,*//*}*.{html,jade}', '{.tmp,<%= yeoman.app %>}/styles/{,*//*}*.css', '{.tmp,<%= yeoman.app %>}/scripts/{,*//*}*.js', '<%= yeoman.app %>/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'],
        options : {
          livereload : true
        }
      },
      express : {
        files : ['server.js', 'lib/{,*//*}*.{js,json}'],
        tasks : ['express:dev'],
        options : {
          livereload : true,
          nospawn : true
          // Without this option specified express won't be reloaded
        }
      },
      styles : {
        files : ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks : ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile : {
        files : ['Gruntfile.js']
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint : {
      options : {
        jshintrc : '.jshintrc',
        reporter : require('jshint-stylish')
      },
      all : ['<%= yeoman.app %>/scripts/{,*/}*.js'],
      test : {
        options : {
          jshintrc : 'test/.jshintrc'
        },
        src : ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean : {
      dist : {
        files : [{
          dot : true,
          src : ['.tmp', '<%= yeoman.views %>/*', '<%= yeoman.dist %>/*', '!<%= yeoman.dist %>/.git*']
        }]
      },
      heroku : {
        files : [{
          dot : true,
          src : ['heroku/*', '!heroku/.git*', '!heroku/Procfile']
        }]
      },
      server : '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer : {
      options : {
        browsers : ['last 1 version']
      },
      dist : {
        files : [{
          expand : true,
          cwd : '.tmp/styles/',
          src : '{,*/}*.css',
          dest : '.tmp/styles/'
        }]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass : {
      options : {
        sassDir : '<%= yeoman.app %>/styles',
        cssDir : '.tmp/styles',
        generatedImagesDir : '.tmp/images/generated',
        imagesDir : '<%= yeoman.app %>/images',
        javascriptsDir : '<%= yeoman.app %>/scripts',
        fontsDir : '<%= yeoman.app %>/styles/fonts',
        importPath : '<%= yeoman.app %>/bower_components',
        httpImagesPath : '/images',
        httpGeneratedImagesPath : '/images/generated',
        httpFontsPath : '/styles/fonts',
        relativeAssets : false,
        assetCacheBuster : false
      },
      dist : {
        options : {
          generatedImagesDir : '<%= yeoman.dist %>/images/generated'
        }
      },
      server : {
        options : {
          debugInfo : true
        }
      }
    },

    // Renames files for browser caching purposes
    rev : {
      dist : {
        files : {
          src : ['<%= yeoman.dist %>/scripts/{,*/}*.js', '<%= yeoman.dist %>/styles/{,*/}*.css', '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}', '<%= yeoman.dist %>/styles/fonts/*']
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that
    // automatically
    // concat, minify and revision files. Creates configurations in memory
    // so
    // additional tasks can operate on them
    useminPrepare : {
      html : ['<%= yeoman.app %>/<%= yeoman.views %>/index.html', '<%= yeoman.app %>/<%= yeoman.views %>/index.jade'],
      options : {
        dest : '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin : {
      html : ['<%= yeoman.views %>/{,*/}*.html', '<%= yeoman.views %>/{,*/}*.jade'],
      css : ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options : {
        assetsDirs : ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin : {
      dist : {
        files : [{
          expand : true,
          cwd : '<%= yeoman.app %>/images',
          src : '{,*/}*.{png,jpg,jpeg,gif}',
          dest : '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin : {
      dist : {
        files : [{
          expand : true,
          cwd : '<%= yeoman.app %>/images',
          src : '{,*/}*.svg',
          dest : '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin : {
      dist : {
        options : {
          // Optional configurations that you can uncomment to use
          // removeCommentsFromCDATA: true,
          // collapseBooleanAttributes: true,
          // removeAttributeQuotes: true,
          // removeRedundantAttributes: true,
          // useShortDoctype: true,
          // removeEmptyAttributes: true,
          // removeOptionalTags: true*/
        },
        files : [{
          expand : true,
          cwd : '<%= yeoman.app %>/<%= yeoman.views %>',
          src : ['*.html', 'partials/*.html'],
          dest : '<%= yeoman.views %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin : {
      dist : {
        files : [{
          expand : true,
          cwd : '.tmp/concat/scripts',
          src : '*.js',
          dest : '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify : {
      dist : {
        html : ['<%= yeoman.views %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy : {
      dist : {
        files : [{
          expand : true,
          dot : true,
          cwd : '<%= yeoman.app %>',
          dest : '<%= yeoman.dist %>',
          src : ['*.{ico,png,txt}', '.htaccess', 'bower_components/**/*', 'images/{,*/}*.{webp}', 'fonts/*']
        }, {
          expand : true,
          dot : true,
          cwd : '<%= yeoman.app %>/<%= yeoman.views %>',
          dest : '<%= yeoman.views %>',
          src : '**/*.jade',
        }, {
          expand : true,
          cwd : '.tmp/images',
          dest : '<%= yeoman.dist %>/images',
          src : ['generated/*']
        }]
      },
      heroku : {
        options : {
          processContent : function(c, fp) {
            switch(fp) {
              case 'views/partials/users.html':
                return c.replace("ng-click=\"editUser(user)\"", "ng-click=\"editUser(user)\" ng-if=\"user.username != 'admin'\"").replace("ng-if=\"cu.username != user.username", "ng-if=\"cu.username != user.username && user.username != 'admin'");
                break;
              case 'views/index.html':
                return c.replace(/UA-XXXXX-X/g, "UA-46881637-1");
                break;
              default:
                return c;
            }
          },
          processContentExclude : ['**', '!views/**']
        },

        files : [{
          expand : true,
          dot : true,
          dest : 'heroku',
          src : ['<%= yeoman.dist %>/**', '<%= yeoman.views %>/**']
        }, {
          expand : true,
          dest : 'heroku',
          src : ['package.json', 'server.js', 'lib/**/*']
        }, {
          expand : true,
          dest : 'heroku',
          src : ['data/**/*']
        }]
      },
      styles : {
        expand : true,
        cwd : '<%= yeoman.app %>/styles',
        dest : '.tmp/styles/',
        src : '{,*/}*.css'
      }
    },

    // make a zipfile
    compress : {
      main : {
        options : {
          archive : 'FormMailer-service.zip'
        },
        files : [{
          src : ['data/**', 'public/**', 'lib/**', 'views/**', 'package.json', 'server.js', 'README.md']
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent : {
      server : ['compass:server', 'copy:styles'],
      test : ['compass', 'copy:styles'],
      dist : ['compass:dist', 'copy:styles', 'imagemin', 'svgmin', 'htmlmin']
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of
    // minification. These next options are pre-configured if you do not
    // wish
    // to use the Usemin blocks.
    // cssmin: {
    // dist: {
    // files: {
    // '<%= yeoman.dist %>/styles/main.css': [
    // '.tmp/styles/{,*/}*.css',
    // '<%= yeoman.app %>/styles/{,*/}*.css'
    // ]
    // }
    // }
    // },
    // uglify: {
    // dist: {
    // files: {
    // '<%= yeoman.dist %>/scripts/scripts.js': [
    // '<%= yeoman.dist %>/scripts/scripts.js'
    // ]
    // }
    // }
    // },
    // concat: {
    // dist: {}
    // },

    // Test settings
    karma : {
      unit : {
        configFile : 'karma.conf.js',
        singleRun : true
      }
    }
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'express:prod', 'open', 'express-keepalive']);
    }

    grunt.task.run(['clean:server', 'concurrent:server', 'autoprefixer', 'express:dev', 'open', 'watch']);
  });

  grunt.registerTask('server', function() {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('heroku-git', function() {
    var done = this.async();
    var exec = require('child_process').exec;
    exec('git --git-dir=heroku/.git --work-tree=heroku add .', function(error, stdout, stderr) {
      grunt.log.write(stdout);
      grunt.log.write(stderr);
      exec('git --git-dir=heroku/.git --work-tree=heroku commit -a -m "updated"', function(error, stdout, stderr) {
        grunt.log.write(stdout);
        grunt.log.write(stderr);
        exec('git --git-dir=heroku/.git --work-tree=heroku push heroku master', function(error, stdout, stderr) {
          grunt.log.write(stdout);
          grunt.log.write(stderr);
          done();
        });
      });
    });
  });

  grunt.registerTask('test', ['clean:server', 'concurrent:test', 'autoprefixer', 'karma']);

  grunt.registerTask('build', ['clean:dist', 'useminPrepare', 'concurrent:dist', 'autoprefixer', 'concat', 'ngmin', 'copy:dist', 'cdnify', 'cssmin', 'uglify', 'rev', 'usemin', 'compress:main']);

  grunt.registerTask('heroku', ['build', 'clean:heroku', 'copy:heroku', 'heroku-git']);

  grunt.registerTask('default', ['newer:jshint', 'test', 'build']);
};

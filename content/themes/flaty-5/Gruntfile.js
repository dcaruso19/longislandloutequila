module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-frontend');
    grunt.loadNpmTasks('grunt-csso');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.initConfig({
        frontend: {
            force: false,
            webroot: './build/assets/'
        },
        'frontend-js': {
            main: {
                options: {
                    minify: true,
                    uglify: {}
                },
                files: {
                    'assets/js/main.min.js': [
						'assets/js/bootstrap.min.js',
						'assets/js/jquery.fitvids.js',
						'assets/js/imagesloaded.pkgd.min.js',
                        'assets/js/jquery.flickr.js',
                        'assets/js/jribbble.js',
                        'assets/js/jquery.instagram.js',
                        'assets/js/jquery.magnific-popup.min.js',                        
                        'assets/js/jqBootstrapValidation.js',
                        'assets/js/jquery.placeholder.js',                        
                        'assets/js/jquery.easing.1.3.js',
                        'assets/js/jquery.flippy.min.js',
                        'assets/js/jquery.ticker.js',
                        'assets/js/jquery.isotope.min.js',
                        'assets/js/jquery.infinitescroll.js',
                        'assets/js/sscr.js',
                        'assets/js/syntaxhighlighter/shCore.js',
                        'assets/js/syntaxhighlighter/shAutoloader.js',
						'assets/js/main.js',
                    ]
                }
            }
        },
        'frontend-css': {
            main: {
                options: {
                    minify: true
                },
                files: [
                    {
                        src: 'assets/css/*.css',
                        dest: 'assets/css/style.min.css'
                    }
                ]
            },
        },
        less: {
            main: {
                options: {
                    clean_css: false
                },
                files: {
                    "assets/css/style.css": "assets/less/style.less"
                }
            }
        },
        clean: {          
            main: {
                files: [{
                    dot: true,
                    src: [
                        'assets/js/main.min.js',
                        'assets/css/style.min.css'
                    ]
                }]
            }
        }        
    });

    grunt.registerTask('default', ['clean', 'frontend-js', 'frontend-css']);
};
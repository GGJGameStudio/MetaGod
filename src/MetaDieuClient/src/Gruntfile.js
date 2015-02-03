module.exports = function(grunt) {

    grunt.initConfig({
      typescript: {
        base: {
          src: ['./ts/**/*.ts'],
          dest: './js',
          options: {
            /*watch: true,*/
            module: 'amd',
            target: 'es5'
          }
        }
      },
        watch: {
          scripts: {
            files: ['./ts/**/*.ts'],
            tasks: ['typescript'],
            options: {
              spawn: false,
            },
          },
        },
    });
    
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['typescript']);
    grunt.registerTask('watch', ['typescript', 'watch']);
    
}
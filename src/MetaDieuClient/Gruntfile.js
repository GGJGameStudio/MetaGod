module.exports = function(grunt) {

    grunt.initConfig({
      nodewebkit: {
        options: {
            platforms: ['win'],
            buildDir: './build',
        },
        src:  ['./src/**', './src/package.json'] 
      },
      
    });
    
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    
    grunt.registerTask('default', ['nodewebkit']);
    
}
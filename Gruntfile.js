module.exports = function (grunt) {
	grunt.initConfig({
		typson: {
			dist: {
				files: [{
					expand: true,
					flatten: false,
					cwd: 'schema',
					src: ['{,**/}*.ts'],
					dest: 'output',
					ext: '.json',
				}]
			}
		}
	});

	grunt.loadTasks('tools');
	grunt.registerTask('default', ['typson']);
}
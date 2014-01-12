module.exports = function (grunt) {
	grunt.initConfig({
		typson: {
			dist: {
				files: [{
					expand: true,
					flatten: false,
					cwd: 'schema',
					src: [
						'{,**/}*.ts',
						'!common.ts'
					],
					dest: 'schema_json',
					ext: '.json',
				}]
			}
		},
		shell: {
      validate: {
        options: {
            stdout: true
        },
        command: 'python validation/validate.py project'
      }
		}
	});

	grunt.loadTasks('tools');
	grunt.loadNpmTasks('grunt-shell')	
	grunt.registerTask('validate', ['shell:validate']);
	grunt.registerTask('default', ['typson', 'shell:validate']);
}
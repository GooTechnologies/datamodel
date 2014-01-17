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
		clean: {
			schema: [
				'schema_json/'
			]
		},

		shell: {
      validate: {
        options: {
            stdout: true
        },
        command: 'python validation/validate.py'
      }
		}
	});

	grunt.loadTasks('tools');
	grunt.loadNpmTasks('grunt-shell')	
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('compile', ['typson']);
	grunt.registerTask('validate', ['shell:validate']);
	grunt.registerTask('default', ['typson', 'shell:validate']);
}
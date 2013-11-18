module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    cafemocha: {
      plist: {
        src: 'tests/plist.js',
        options: {
          reporter: grunt.option('reporter') || 'spec',
          colors: true,
          ui: 'bdd'
        }
      },
      utils: {
        src: 'tests/utils.js',
        options: {
          reporter: grunt.option('reporter') || 'spec',
          colors: true,
          ui: 'bdd'
        }
      }
    },
    
    modverify: {
      all: {
        options: {}
      }
    }
  })
  
  grunt.loadNpmTasks('grunt-modverify')
  grunt.loadNpmTasks('grunt-cafe-mocha')
  
  
  grunt.registerTask('coverage', 'Verify test coverage', function() {
    var done = this.async()
      , dox  = require('dox')
      , fs   = require('fs')
    
    fs.readFile('./lib/index.js', 'utf8', function(err, contents) {
      if (err) grunt.fail.fatal(err)
      var obj = dox.parseComments(contents, { raw: false })
        , functionNames = []
        , missingFunctions = []
      
      grunt.log.write('Parsing ./lib/index.js...')
      for (var i=0; i<obj.length; i++) {
        var o = obj[i]
        if (o.hasOwnProperty('ctx')) {
          var ctx = o.ctx
          if (ctx.type === 'method') {
            functionNames.push(ctx.name)
          }
        }
      }
      
      grunt.log.ok()
      
      grunt.log.write('Reading ./tests/plist.js...')
      var testFile = fs.readFileSync('./tests/plist.js', 'utf8')
      grunt.log.ok()
      grunt.log.writeln('Generating code coverage...')
      functionNames.forEach(function(n) {
        grunt.verbose.write('Looking for '+n+'...   ')
        if (~testFile.indexOf(n)) {
          grunt.verbose.ok()
        } else {
          grunt.verbose.error('MISSING')
          missingFunctions.push(n)
        }
      })
      grunt.log.ok('Done generating code coverage')
      var written = (functionNames.length - missingFunctions.length)
      var total = functionNames.length
      var per = written / total
      per = (per*100).toFixed(2)
      grunt.log.subhead('['+written+'/'+total+']')
      grunt.log.subhead('Code coverage: '+per+'%')
      done()
    })
  })
  
  grunt.registerTask('test', ['cafemocha'])
  grunt.registerTask('default', ['modverify', 'test'])
}
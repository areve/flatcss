// this script is invoked by webpack after the build is complete
const fs = require('fs')
const copyfiles = require('copyfiles')
const cssnano = require('cssnano')
const rimraf = require('rimraf')
const verbose = false

if (verbose) console.log('Cleaning extras')
rimraf('docs/*.js', (err) => {
  if (err) throw err
})

if (verbose) console.log('Creating dist')
copyfiles([
  'docs/flat.css', 
  '.'], { verbose, up: 1 }, () =>{
  minify('flat.css')
})

function minify(path) {
  if (verbose) console.log('Minify ' + path)
  const css = fs.readFileSync(path)
  cssnano.process(css, {
    from: undefined
  }, {}).then((minified) => {
    fs.writeFileSync(path.replace(/\.css$/m, '.min.css'), minified.css)
  })
}

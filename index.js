var request = require('request'),
    transform_tools = require('browserify-transform-tools');

var cwd = process.cwd();

function compile(fn, content, done) { 
    request.post({
        url: 'http://localhost:5002/devel/compile/'+fn, 
        qs: {format: fn.indexOf('.html') == -1 ? '' : 'html'},
        form: {body: content}
    }, function(err, response, body) { 
        if( err ) { 
            done(err); 
        } else if( response.statusCode != 200 ) { 
            done(body);
        } else { 
            done(null, body);
        }
    });
}

var needs_compile = /(\s*%|\$\{|<%)/;

module.exports = transform_tools.makeStringTransform('remote-compile', {
    //includeExtensions: ['.html']
}, function(content, options, done) { 
    var fn = options.file.replace(cwd, '');

    if( needs_compile.test(content) ) { 
        console.error(fn, 'compiling..');
        compile(fn, content, done);
    } else { 
        done(null, content);
    }

});

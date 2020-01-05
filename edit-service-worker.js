(function () {
    const fs = require('fs');
    fs.chmod('./dist', '775', function (err) {
        if (err) {
            console.log(err);
        }
    });
    fs.readFile('./dist/ngsw-worker.js', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        const replacementString = "this.scope.addEventListener('fetch', (event) => {if (event.request.method === 'POST') {return;} this.onFetch(event)});";
        var editedFile = data.toString().replace("this.scope.addEventListener('fetch', (event) => this.onFetch(event));", replacementString);
        fs.writeFile('./dist/ngsw-worker.js', editedFile, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });

})();
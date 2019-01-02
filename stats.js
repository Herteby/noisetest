Stats = function() {
    var that = this;
    this.statsbar = $('<div id="stats"></div>');
    this.displays = [];
    $('body').append(this.statsbar);
    window.onerror = function(msg, url, line) {
        that.log('<div style="color:#f00">' + msg + "</div>File: " + url + "<br>line: " + line);
    };
};
Stats.prototype.track = function(object, name, exclude) {
    var display = {};
    display.html =  $('<dl></dl>');
    display.object = object;
    display.name = name;
    display.exclude = exclude || [];
    this.statsbar.append(display.html);
    this.displays.push(display);
};
Stats.prototype.update = function() {
    var i, key, object, display, html;
    for(i = 0; i < this.displays.length; i++) {
        display = this.displays[i];
        object = display.object;
        html = display.html;
        html.empty();
        if(display.name){
            html.append('<dt>' + display.name + '</dt>');
        }
        if(typeof object === 'object') {
            for (key in object) {
                if (!object.hasOwnProperty(key)){ continue;}
                if (equalsOneOf(key, display.exclude)){ continue;}
                    html.append('<dt>' + key + ':</dt><dd>' + object[key] + '</dd>');
            }
        } else if (typeof object === 'function') {
            html.append('<dd>' + object() + '</dd>');
        } else {
            html.append('<dt>Type</dt>');
            html.append('<dd>' + typeof object + '</dd>');
            html.append('<dt>Value</dt>');
            html.append('<dd>' + object + '</dd>');
            html.append('<dt>Updates only work on objects and functions!</dt>');
        }
    }
};
Stats.prototype.log = function(line, color) {
    if (!color){
        color = 'inherit';
    }
    if(!this.logbox){
        this.logbox = $('<div id="log"></div>');
        this.statsbar.append(this.logbox);
    }
    this.logbox.append('<div style="color:' + color + '">' + line + '</div>');
    this.logbox.scrollTop(100000);
};
define(function(require, exports, module) {

    Date.prototype.format = function(format) {
        var o = {
            "M+": this.getMonth() + 1, // month
            "d+": this.getDate(), // day
            "h+": this.getHours(), // hour
            "m+": this.getMinutes(), // minute
            "s+": this.getSeconds(), // second
            "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
            "S": this.getMilliseconds()
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };

    var lunar = require('./lunar.js');
    Date.prototype.toLunar = function(format) {
        return lunar.solarToLunar(this, format);
    };

    require('./dialog.js');

    (function(config) {
        config['lock'] = true;
        config['fixed'] = true;
        config['opacity'] = 0.25;
        config['padding'] = '0px';
    })(art.dialog.defaults);

    var showMessage = function(resp, text) {
        art
            .dialog({
                'id': 'error',
                'lock': true
            })
            .content(
                '<div style="color:#B22D00;background:#FBF7E4;padding:10px;padding-right:40px;">' + text + '</div>');
    };

    var Ext = function() {
        this.texts = {};
        this.handles = {
            showMessage: showMessage
        };
    };

    Ext.prototype.showMessage = showMessage;

    Ext.prototype.text = function(code, text) {
        if (typeof(text) == 'undefined') {
            return this.texts[code] || '服务器开小差了哦 >_< ';
        }

        this.texts[code] = text;
    };

    Ext.prototype.handle = function(code, handle) {
        if (typeof(handle) == 'undefined') {
            return this.handles[code];
        }

        this.handles[code] = handle;
    };

    Ext.prototype.handlerror = function(resp, text) {
        var code = resp.data ? resp.data.code : undefined;

        if (code && typeof(text) == 'undefined') {
            text = this.text(code);
        }

        if (code) {
            var handle = this.handle(code);
            if (!handle) {
                handle = this.showMessage.bind(this);
            }
            handle(resp, text, code);
        } else {
            if (text) {
                this.showMessage(resp, text);
            }
        }
    };

    // Ext.prototype.constructor = Ext;

    var ext = new Ext();

    return {
        Ext: Ext,
        handlerror: ext.handlerror.bind(ext),
        text: ext.text.bind(ext),
        handle: ext.handle.bind(ext)
    };
});

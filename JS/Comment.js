"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
var Comment = /** @class */ (function () {
    function Comment(post_id, content, user) {
        this.post_id = post_id;
        this.content = content;
        this.user = user;
        var newdate = new Date;
        var minutes = newdate.getMinutes();
        var hour = newdate.getHours();
        var year = newdate.getFullYear();
        var month = newdate.getMonth(); // beware: January = 0; February = 1, etc.
        var day = newdate.getDate();
        var dateAll = hour + ':' + minutes + ' ' + day + '.' + month + '.' + year;
        this.date = dateAll;
    }
    return Comment;
}());
exports.Comment = Comment;

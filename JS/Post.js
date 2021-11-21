"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
var Post = /** @class */ (function () {
    function Post(title, content, user) {
        this.ID = Post.counter;
        Post.counter++;
        this.title = title;
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
        this.comments = [];
    }
    Post.counter = 1;
    return Post;
}());
exports.Post = Post;

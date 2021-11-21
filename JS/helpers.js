"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginDummy = exports.findPost = exports.displayPosts = void 0;
function displayPosts(element, posts, render, loggedInUser) {
    element.innerHTML = '';
    for (var _i = 0, posts_1 = posts; _i < posts_1.length; _i++) {
        var post = posts_1[_i];
        element.innerHTML += render({ "post": post, "loggedInUser": loggedInUser });
    }
}
exports.displayPosts = displayPosts;
function findPost(id, posts) {
    var foundPost = null;
    for (var _i = 0, posts_2 = posts; _i < posts_2.length; _i++) {
        var post = posts_2[_i];
        if (id == post.ID) {
            foundPost = post;
            break;
        }
    }
    return foundPost;
}
exports.findPost = findPost;
function loginDummy(users, username, password) {
    var foundUser = null;
    for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
        var user = users_1[_i];
        if (user.password == password && user.userName == username) {
            foundUser = user;
            break;
        }
    }
    console.log(foundUser);
    return foundUser;
}
exports.loginDummy = loginDummy;

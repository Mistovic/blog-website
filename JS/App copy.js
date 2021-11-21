"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = __importStar(require("handlebars"));
/* Klase */
var Post_1 = require("./Post");
var Admin_1 = require("./Admin");
var Comment_1 = require("./Comment");
var User_1 = require("./User");
/* Funkcije */
var helpers_1 = require("./helpers");
var helpers_2 = require("./helpers");
var helpers_3 = require("./helpers");
function main() {
    var loggedInUser = null;
    var usersAll = [
        new Admin_1.Admin("Vuk", "Mistovic", "vukmist", "123"),
        new User_1.User("Ksenija", "Gledovic", "ksenija", "123")
    ];
    //loggedInUser = usersAll[0]; // Samo dok editujemo da je neki user logovan
    var publishedPosts = [
        new Post_1.Post("Danas se desila neverovatna stvar!", "Dok sam sjedio kuci i ne radio nista kao i po obicaju. Sinula mi je ideja za sto to ne bih promjenio i od svog zivota napravio nesto??. Dakle uspjeli smo da ga implementiramo. Budi srecan", usersAll[0]),
        new Post_1.Post("Koliko kosta jedna noc u hotelu?", "Ovo je tekst drugog posta, takodje budi srecan", usersAll[0])
    ];
    publishedPosts[0].comments = [
        new Comment_1.Comment(publishedPosts[0].ID, "Comment No.1", usersAll[0]),
        new Comment_1.Comment(publishedPosts[0].ID, "Comment No.2", usersAll[1])
    ];
    // --> | Elementi u kojima se serviraju renderovani podaci | <--
    var postPLace = document.getElementById('posts');
    var adminPLace = document.getElementById('admin-bar');
    var nav = document.getElementById('nav');
    var modalLogin = document.getElementById('login-modal');
    var modalRegister = document.getElementById('register-modal');
    // --> | input elemnti iz za logovanje | <--
    var inputUsername = document.getElementById('username');
    var inputPass = document.getElementById('password');
    // --> | input elemnti za registraciju | <--
    var inputUsernameRegister = document.getElementById('username-register');
    var inputPassRegister = document.getElementById('password-register');
    var inputNameRegister = document.getElementById('name');
    var inputSurnameRegister = document.getElementById('surname');
    // --> | Template elemnti iz kojih se podaci kompajliraju | <--
    var tplPost = document.getElementById('post-template').innerHTML;
    var tplAdmin = document.getElementById('admin-template').innerHTML;
    var tplLoginControl = document.getElementById('nav-tpl').innerHTML;
    // --> | Funkcije za kompajliranje templejta | <--
    var renderPostTpl = Handlebars.compile(tplPost); // Uzimamo template za post
    var renderAdminTpl = Handlebars.compile(tplAdmin); // Uzimamo template za admin control panel
    var renderNavTpl = Handlebars.compile(tplLoginControl);
    // --> | Ovdje prikazujemo sve postove koji su do sada publishovani. Odma po ucitavanju strane | <--
    helpers_1.displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);
    // --> | Da bismo renderovali kompajliran tekst, moramo pozvati funkciju | <--
    // --> | gore definisanu koja ce prikazati elemnte | <--
    // --> | Loaduj templejt u admin bar za publishovanje POSTOVA | <--
    adminPLace.innerHTML = renderAdminTpl({
        "names": {
            "title": "admin-post-title",
            "content": "admin-post-content",
            "submit": "post-submit"
        }, "logedInUser": loggedInUser
    });
    // --> | Loaduj templejt u navigaciju | <--
    nav.innerHTML = renderNavTpl({
        "names": {
            "login": "login",
            "logout": "logout",
            "register": "register"
        }, "loggedInUser": loggedInUser
    });
    window.addEventListener('click', function (e) {
        var el = e.target;
        // * Event za postavljanje komentara
        if (el && el.classList.contains('btn-comment')) {
            var post_id = Number(el.getAttribute('data-postid'));
            var textArea = document.querySelector("textarea[data-postid='" + post_id + "']");
            console.log(textArea.value);
            var post = helpers_2.findPost(post_id, publishedPosts); // Ova Funkcija vraca pronadjeni post i uporedjuje prosledjeni ID sa IDjevima prosledjenog niza postova
            if (post) {
                post.comments.push(new Comment_1.Comment(post_id, textArea.value, loggedInUser));
                helpers_1.displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);
            }
        }
        // ** Event za postavljanje novog posta
        if (el && el.id == 'post-submit') {
            var postContent = document.querySelector('#admin-post-content').value;
            var postTitle = document.querySelector('#admin-post-title').value;
            console.log(postContent, postTitle);
            publishedPosts.unshift(new Post_1.Post(postTitle, postContent, loggedInUser));
            helpers_1.displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);
        }
        // *** Event za login i logout
        if (el && el.id == 'login') {
            modalLogin.style.display = 'flex';
        }
        if (el && el.id == 'submit-login') {
            var username = inputUsername.value;
            var password = inputPass.value;
            loggedInUser = helpers_3.loginDummy(usersAll, username, password);
            helpers_1.displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);
            if (loggedInUser) {
                if (loggedInUser instanceof Admin_1.Admin) {
                    console.log('Logovo se admin!', loggedInUser.firstName);
                    adminPLace.innerHTML = renderAdminTpl({
                        "names": {
                            "title": "post-title",
                            "content": "post-content",
                            "submit": "post-submit"
                        }
                    });
                }
                modalLogin.style.display = 'none';
                console.log('Logovo se user!', loggedInUser.firstName);
                nav.innerHTML = renderNavTpl({
                    "names": {
                        "login": "login",
                        "logout": "logout",
                        "register": "register"
                    }, "loggedInUser": loggedInUser
                });
            }
        }
        if (el && el.id == 'register') {
            modalRegister.style.display = 'flex';
        }
        if (el && el.id == 'submit-register') {
            var newUsername = inputUsernameRegister.value;
            var newName = inputNameRegister.value;
            var newPassword = inputPassRegister.value;
            var newSurname = inputSurnameRegister.value;
            // let msgPlace = <HTMLParagraphElement>document.getElementById('message-register');
            // msgPlace.innerHTML = `Registrovali ste se kao korisnik <br> 
            //                     <a href="#" id="close-register" class="btn"> Idi na postove</a>` ;
            // let closeRegister = <HTMLAnchorElement>document.getElementById('close-register');
            // closeRegister.addEventListener('click', function (e) {
            //    
            // });
            helpers_1.displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);
            usersAll.push(new User_1.User(newName, newSurname, newUsername, newPassword));
            modalRegister.style.display = 'none';
            modalLogin.style.display = 'flex';
        }
        if (el && el.id == 'logout') {
            loggedInUser = null;
            helpers_1.displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);
            nav.innerHTML = renderNavTpl({
                "names": {
                    "login": "login",
                    "logout": "logout",
                    "register": "register"
                }, "loggedInUser": loggedInUser
            });
            adminPLace.innerHTML = "";
        }
    });
}
main();

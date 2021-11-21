import * as Handlebars from 'handlebars';
/* Klase */
import { Post } from './Post';
import { Admin } from './Admin';
import { Comment } from './Comment';
import { User } from './User';
/* Funkcije */
import { displayPosts } from './helpers';
import { findPost } from './helpers';
import { loginDummy } from './helpers';

function main() {
    let loggedInUser: Admin | User = null;

    const usersAll = [
        new Admin("Vuk", "Mistovic", "vukmist", "123"),
        new User("Ksenija", "Gledovic", "ksenija", "123")
    ];

    //loggedInUser = usersAll[0]; // Samo dok editujemo da je neki user logovan

    const publishedPosts = [
        new Post("Danas se desila neverovatna stvar!", "Dok sam sjedio kuci i ne radio nista kao i po obicaju. Sinula mi je ideja za sto to ne bih promjenio i od svog zivota napravio nesto??. Dakle uspjeli smo da ga implementiramo. Budi srecan", usersAll[0]),
        new Post("Koliko kosta jedna noc u hotelu?", "Ovo je tekst drugog posta, takodje budi srecan", usersAll[0])
    ];

    publishedPosts[0].comments = [
        new Comment(publishedPosts[0].ID, "Comment No.1", usersAll[0]),
        new Comment(publishedPosts[0].ID, "Comment No.2", usersAll[1])
    ];
    // --> | Elementi u kojima se serviraju renderovani podaci | <--
    const postPLace = <HTMLDivElement>document.getElementById('posts');
    const adminPLace = <HTMLDivElement>document.getElementById('admin-bar');
    const nav = <HTMLDivElement>document.getElementById('nav');
    const modalLogin = <HTMLDivElement>document.getElementById('login-modal');
    const modalRegister = <HTMLDivElement>document.getElementById('register-modal');

    // --> | input elemnti iz za logovanje | <--
    const inputUsername = <HTMLInputElement>document.getElementById('username');
    const inputPass = <HTMLInputElement>document.getElementById('password');

    // --> | input elemnti za registraciju | <--
    const inputUsernameRegister = <HTMLInputElement>document.getElementById('username-register');
    const inputPassRegister = <HTMLInputElement>document.getElementById('password-register');
    const inputNameRegister = <HTMLInputElement>document.getElementById('name');
    const inputSurnameRegister = <HTMLInputElement>document.getElementById('surname');

    // --> | Template elemnti iz kojih se podaci kompajliraju | <--
    const tplPost = (<HTMLTemplateElement>document.getElementById('post-template')).innerHTML;
    const tplAdmin = (<HTMLTemplateElement>document.getElementById('admin-template')).innerHTML;
    const tplLoginControl = (<HTMLTemplateElement>document.getElementById('nav-tpl')).innerHTML;

    // --> | Funkcije za kompajliranje templejta | <--
    const renderPostTpl = Handlebars.compile(tplPost); // Uzimamo template za post
    const renderAdminTpl = Handlebars.compile(tplAdmin); // Uzimamo template za admin control panel
    const renderNavTpl = Handlebars.compile(tplLoginControl);

    // --> | Ovdje prikazujemo sve postove koji su do sada publishovani. Odma po ucitavanju strane | <--
    displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);

    // --> | Da bismo renderovali kompajliran tekst, moramo pozvati funkciju | <--
    // --> | gore definisanu koja ce prikazati elemnte | <--
    // --> | Loaduj templejt u admin bar za publishovanje POSTOVA | <--
    adminPLace.innerHTML = renderAdminTpl({
        "names": {
            "title": "admin-post-title",
            "content": "admin-post-content",
            "submit": "post-submit"
        }, "logedInUser": loggedInUser
    })

    // --> | Loaduj templejt u navigaciju | <--
    nav.innerHTML = renderNavTpl({
        "names": {
            "login": "login",
            "logout": "logout",
            "register": "register"
        }, "loggedInUser": loggedInUser
    });

    window.addEventListener('click', function (e) {
        const el = <HTMLElement>e.target;

        // * Event za postavljanje komentara
        if (el && el.classList.contains('btn-comment')) {
            const post_id = Number(el.getAttribute('data-postid'));
            const textArea = <HTMLTextAreaElement>document.querySelector(`textarea[data-postid='${post_id}']`);
            console.log(textArea.value);
            const post = findPost(post_id, publishedPosts); // Ova Funkcija vraca pronadjeni post i uporedjuje prosledjeni ID sa IDjevima prosledjenog niza postova

            if (post) {
                post.comments.push(new Comment(post_id, textArea.value, loggedInUser));
                displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);
            }
        }

        // ** Event za postavljanje novog posta
        if (el && el.id == 'post-submit') {
            const postContent = (<HTMLTextAreaElement>document.querySelector('#admin-post-content')).value;
            const postTitle = (<HTMLInputElement>document.querySelector('#admin-post-title')).value;
            console.log(postContent, postTitle)
            publishedPosts.unshift(new Post(postTitle, postContent, loggedInUser));

            displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);
        }

        // *** Event za login i logout
        if (el && el.id == 'login') {
            modalLogin.style.display = 'flex';
        }


        if (el && el.id == 'submit-login') {
            let username = inputUsername.value;
            let password = inputPass.value;
            loggedInUser = loginDummy(usersAll, username, password);
            displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);

            if (loggedInUser) {

                if (loggedInUser instanceof Admin) {
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
            let newUsername = inputUsernameRegister.value;
            let newName = inputNameRegister.value;
            let newPassword = inputPassRegister.value;
            let newSurname = inputSurnameRegister.value;

            // let msgPlace = <HTMLParagraphElement>document.getElementById('message-register');
            // msgPlace.innerHTML = `Registrovali ste se kao korisnik <br> 
            //                     <a href="#" id="close-register" class="btn"> Idi na postove</a>` ;
            // let closeRegister = <HTMLAnchorElement>document.getElementById('close-register');
            // closeRegister.addEventListener('click', function (e) {
            //    
            // });
            displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);
            usersAll.push(new User(newName, newSurname, newUsername, newPassword));
            modalRegister.style.display = 'none';
            modalLogin.style.display = 'flex';
        }


        if (el && el.id == 'logout') {
            loggedInUser = null;
            displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);
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



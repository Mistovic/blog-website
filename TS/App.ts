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
        // U ovaj niz stavljamo korisnike, ovaj dio bi trebao da bude kontaktiran iz baze podataka
        // Ovdje kreiramo Usera i Admina preko (Admin) i (User) klase, i  smijestamo ih u niz *bazu podataka*
        new Admin("Vuk", "Mistovic", "vukmist", "123"),
        new User("Ksenija", "Gledovic", "ksenija", "123"),
    ];


    const publishedPosts = [
        // U ovaj niz stavljamo POSTOVE, ovaj dio bi trebao da bude kontaktiran iz baze podataka
        // Ovdje  kreiramo POSTOVE preko (Post) klase, i smjestamo ih u niz * Bazu podataka * 
        new Post("Nemam kad", "Ovo je sadrzaj drugog posta. Moze biti veoma dug ali nema kad.", usersAll[0]),
        new Post("Naslov drugog posta", "Ovo je tekst drugog posta, ", usersAll[0])
    ];

    publishedPosts[0].comments = [
        // U ovaj niz stavljamo sacuvane KOMENTARE, ovaj dio bi trebao da bude kontaktiran iz baze podataka
        // Ovdje kreiramo komentare preko (Comment) klase,  njih smijestamo u niz koji se nalazi u (POst) klasi *baza podataka*;
        new Comment(publishedPosts[0].ID, "Prvi KOnetar Admina", usersAll[0]),
        new Comment(publishedPosts[0].ID, "Komentar korisnika", usersAll[1])
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
    const checkAdmin = <HTMLInputElement>document.getElementById('wb-admin')

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

    //loggedInUser = usersAll[0];  Samo dok editujemo da je neki user logovan
    if (loggedInUser != null) {
        adminPLace.innerHTML = renderAdminTpl({
            "names": {
                "title": "admin-post-title",
                "content": "admin-post-content",
                "submit": "post-submit"
            }
        });
        displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);
    }
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
            e.preventDefault();
            const post_id = Number(el.getAttribute('data-postid'));
            const textArea = <HTMLTextAreaElement>document.querySelector(`textarea[data-postid='${post_id}']`);
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
            publishedPosts.unshift(new Post(postTitle, postContent, loggedInUser));

            displayPosts(postPLace, publishedPosts, renderPostTpl, loggedInUser);
        }

        // *** Event za login i logout formu
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
                    // console.log('Logovo se admin!', loggedInUser.firstName);
                    adminPLace.innerHTML = renderAdminTpl({
                        "names": {
                            "title": "admin-post-title",
                            "content": "admin-post-content",
                            "submit": "post-submit"
                        }
                    });
                }
                
                modalLogin.style.display = 'none';
                // console.log('Logovo se user!', loggedInUser.firstName);
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

        if (el && el.id == 'submit-register') {
            let newUsername = inputUsernameRegister.value;
            let newName = inputNameRegister.value;
            let newPassword = inputPassRegister.value;
            let newSurname = inputSurnameRegister.value;

            let msgPlace = <HTMLParagraphElement>document.getElementById('message-register');

            if (checkAdmin.checked) {
                usersAll.push(new Admin(newName, newSurname, newUsername, newPassword));
                msgPlace.innerHTML = `Registrovali ste se kao ADMIN!`;

            } else {
                usersAll.push(new User(newName, newSurname, newUsername, newPassword));
                msgPlace.innerHTML = `Registrovali ste se kao korisnik!`;
            }
            console.log('All users: ', usersAll);
            modalRegister.style.display = 'none';
            modalLogin.style.display = 'flex';
        }


    });




}

main();



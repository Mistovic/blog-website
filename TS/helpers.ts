import { Post } from './Post';
import { User } from './User';
import { Admin } from './Admin';

export function displayPosts(element: HTMLDivElement, posts: Array<Post>, render: HandlebarsTemplateDelegate, loggedInUser: Admin | User) {
    element.innerHTML = '';
    for (let post of posts) {
        element.innerHTML += render({ "post": post, "loggedInUser": loggedInUser });
    }
}

export function findPost(id: number, posts: Array<Post>): Post {
    let foundPost = null;
    for (let post of posts) {
        if (id == post.ID) {
            foundPost = post;
            break;
        }
    }

    return foundPost;
}

export function loginDummy(users: Array<User>, username: string, password: string) {
    let foundUser = null;
    for (let user of users) {
        if (user.password == password && user.userName == username) {
            foundUser = user;
            break
        }
    }
    console.log(foundUser);
    return foundUser;
}







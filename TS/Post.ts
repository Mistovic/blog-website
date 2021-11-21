import { Admin } from './Admin';
import { Comment } from './Comment';

export class Post {

    public static counter = 1;

    public ID: number;
    public title: string;
    public content: string;
    public user: Admin;
    public date: String;
    public comments: Array<Comment>;

    public constructor(title: string, content: string, user: Admin) {

        this.ID = Post.counter;
        Post.counter++;

        this.title = title;
        this.content = content;
        this.user = user;

        let newdate = new Date;

        let minutes = newdate.getMinutes();
        let hour = newdate.getHours();
        let year = newdate.getFullYear();
        let month = newdate.getMonth(); // beware: January = 0; February = 1, etc.
        let day = newdate.getDate();

        let dateAll = hour + ':' + minutes + ' ' + day + '.' + month + '.' + year;
        this.date = dateAll;
        this.comments = [];

    }


}
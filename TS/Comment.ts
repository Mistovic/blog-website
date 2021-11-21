import { Admin } from './Admin';
import { User } from './User';

export class Comment {
    public post_id: number;
    public content: string;
    public user: User | Admin;
    public date: string;

    public constructor(post_id: number, content: string, user: User | Admin) {
        this.post_id = post_id;
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
    }
}
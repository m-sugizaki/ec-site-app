export class LoginHistory {
  user_id: string;
  login_dt: Date;

  //  constructor(key, name, pass) {
  constructor(user_id) {
    this.user_id = user_id;
    this.login_dt = new Date();
  }
}

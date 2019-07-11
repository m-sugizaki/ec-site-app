export class UserStorePK{
  userId:String;
  constructor(userId)
  {
    this.userId=userId;
  }
}


export class UserStore {
  password: string;
  primaryKey: UserStorePK;

  //  constructor(key, name, pass) {
  constructor(user_id,password) {
      this.password=password;
      this.primaryKey = new  UserStorePK(user_id);
  }
}


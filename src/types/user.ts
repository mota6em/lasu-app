interface User {
  email: string;
  name?: string;
  image?: string;
  selectedLanguages: string[];
  translationType: string;
  createdAt: Date;
}

export default User;

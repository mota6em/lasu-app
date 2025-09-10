interface CommunityUser {
  userId: string;
  joinedAt: Date;
  showName: boolean;
  showPicture: boolean;
  shareTranslations: boolean;
  xp: number;
  streak: number;
  topWords: string[];
  badges: string[];
  lastActive: Date;
  rank: number;
  level: number;
}

export default CommunityUser;

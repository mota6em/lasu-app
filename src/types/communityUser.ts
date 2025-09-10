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
  dailyTranslations: number;
  monthlyTranslations: number;
  allTimeTranslations: number;
}

export default CommunityUser;

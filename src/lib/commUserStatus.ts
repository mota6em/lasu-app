import CommunityUser from "@/models/communityUser";

export async function addXPtoUser(userId: string, xpGained: number) {
  const user = await CommunityUser.findOne({ userId });
  if (!user) {
    console.log("User not found", userId);
    return;
  }

  user.dailyTranslations += 1;
  user.monthlyTranslations += 1;
  user.allTimeTranslations += 1;

  user.xp += xpGained;

  user.level = getLevelFromXP(user.xp);

  const today = new Date().setHours(0, 0, 0, 0);
  const last = user.lastActive
    ? new Date(user.lastActive).setHours(0, 0, 0, 0)
    : null;

  if (!last || today - last > 86400000) {
    user.streak = 1;
  } else if (today - last === 86400000) {
    user.streak += 1;
  }
  user.lastActive = new Date();

  await user.save();
  console.log("user and xp", user, user.xp);
  return { xp: user.xp, level: user.level, streak: user.streak };
}

function getLevelFromXP(xp: number) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

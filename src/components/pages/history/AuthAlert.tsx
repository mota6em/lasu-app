"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AuthAlertProps {
  title?: string;
  description?: string;
}

export default function AuthAlert({
  title = "You're not logged in!",
  description = "To save your translation history and access it anytime, please sign in with your Google account. It only takes a few seconds — and we'll remember your progress for you 😊",
}: AuthAlertProps) {
  return (
    <div className="px-4 lg:px-0">
      <Alert
        variant="destructive"
        className="mb-5 bg-red-100 dark:bg-red-300/10"
      >
        <AlertTitle className="flex items-center font-bold text-lg">
          {title}
        </AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  );
}

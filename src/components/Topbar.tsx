import { UserMenu } from "./UserMenu";

export function Topbar() {
  return (
    <header className="w-full px-6 py-4 border-b bg-white flex justify-between items-center">
      <h3 className="text-xl font-bold">Wellcome to LaSu, Porro!</h3>
      <UserMenu />
    </header>
  );
}

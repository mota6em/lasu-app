export default function Loading() {
  return (
    <div className="flex items-center gap-x-1 md:gap-x-2 justify-center min-h-[300px] animate-pulse">
      <h1 className="text-ls md:text-2xl font-bold">Wellcome to the LaSu Community!</h1>
      <span className="loading loading-dots loading-lg md:loading-xl"></span>
    </div>
  );
}

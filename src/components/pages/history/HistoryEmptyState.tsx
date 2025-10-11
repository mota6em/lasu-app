"use client";

export default function HistoryEmptyState() {
  return (
    <div className="px-4 py-10 w-full justify-center items-center flex flex-col">
      <p className="text-muted-foreground text-sm my-5 ms-x">
        No translation history found, start a translation to see it here.
      </p>
      <button
        className="btn btn-primary mx-5"
        onClick={() => (window.location.href = "/dashboard")}
      >
        Start a translation
      </button>
    </div>
  );
}

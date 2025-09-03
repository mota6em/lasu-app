import { useEffect, useState } from "react";

export function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const q = matchMedia("(max-width: 640px)");
    const h = () => setM(q.matches);
    h();
    q.addEventListener("change", h);
    return () => q.removeEventListener("change", h);
  }, []);
  return m;
}

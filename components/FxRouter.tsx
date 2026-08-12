"use client";

import { usePathname } from "next/navigation";
import Fx from "./Fx";

/* Remounts the motion layer on every route change so observers and
   ScrollTriggers bind to the new page's elements. */
export default function FxRouter() {
  const pathname = usePathname();
  return <Fx key={pathname} />;
}

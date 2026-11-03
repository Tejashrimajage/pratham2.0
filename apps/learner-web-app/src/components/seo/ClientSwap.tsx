'use client';

import React, { useEffect, useState } from 'react';

/**
 * Renders `fallback` in the server HTML, then swaps to `children` once the
 * client bundle mounts. The interactive widgets are all `ssr: false`, so
 * without this a crawler sees an empty page.
 */
export default function ClientSwap({
  fallback,
  children,
}: {
  fallback: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return <>{mounted ? children : fallback}</>;
}

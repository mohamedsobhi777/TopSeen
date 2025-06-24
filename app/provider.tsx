"use client";

import React, { useEffect, useState } from "react";
import { Provider } from "rxdb-hooks";
import { RxDatabase } from "rxdb";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { initialize } from "@/db/initialize";

export const LocalDBProvider = ({ children }) => {
  const [db, setDb] = useState<RxDatabase>();

  useEffect(() => {
    initialize().then(setDb);
  }, []);

  // Until db becomes available, consumer hooks that
  // depend on it will still work, absorbing the delay
  // by setting their state to isFetching:true
  return (
    <NuqsAdapter>
      <Provider db={db}>{children}</Provider>
    </NuqsAdapter>
  );
};

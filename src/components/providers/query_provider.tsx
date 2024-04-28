"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};

const QueryProvider = ({ children }: Props) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export default QueryProvider;
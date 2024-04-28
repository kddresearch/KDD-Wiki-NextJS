import QueryProvider from "@/components/providers/query_provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>{children}</QueryProvider>
  );
}
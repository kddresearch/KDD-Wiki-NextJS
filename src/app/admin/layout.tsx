import { auth } from "@/auth";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import Link from "next/link";
// import { useRouter } from "next/router";
// import React, { useState, useEffect } from "react";
import { notFound, redirect } from "next/navigation";
import LegacyUser from "@/models/legacy-user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user == undefined) {
    return redirect("/login");
  }

  const user = new LegacyUser(session?.user);

  if (!user.admin) {
    return redirect("/login");
  }

  return (
    <StripeBackDrop>
      <Card title="Admin Dashboard"></Card>

      <div className="flex flex-row w-full container space-x-8">
        <div className="w-1/4">
          <Card className="h-max-fit" title="Nav">
            <ul className="text-2xl font-bold text-black mt-2">
              <li>
                <Link
                  href="/admin/"
                  className="hover:underline hover:text-purple"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/page"
                  className="hover:underline hover:text-purple"
                >
                  Pages
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/user"
                  className="hover:underline hover:text-purple"
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/settings"
                  className="hover:underline hover:text-purple"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </Card>
        </div>
        {children}
      </div>
    </StripeBackDrop>
  );
}

import Navbar from "@/components/Navbar";
import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const RootLayout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) redirect("/sign-in");

    const user = isUserAuthenticated ? await getCurrentUser() : null;

    return (
        <div className="root-layout">
            <Navbar username={user?.name} photo={user?.photoUrl} />
            {children}
        </div>
    );
};

export default RootLayout;

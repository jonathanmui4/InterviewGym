"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NavbarProps } from "@/types";
import { signOut } from "@/lib/actions/auth.action";

const Navbar = ({ username, photo }: NavbarProps) => {
    const shortenedUsername = username
        ? username
              .split(" ")
              .map((name, index, arr) =>
                  index === 0 // First name
                      ? name[0].toUpperCase()
                      : index === arr.length - 1 // Last name
                      ? name[name.length - 1].toUpperCase()
                      : ""
              )
              .join("")
        : "U";

    return (
        <nav className="flex justify-between items-center p-4 bg-dark-900">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="logo" width={38} height={32} />
                <h2 className="text-primary-100">Interview Gym</h2>
            </Link>
            <div className="relative">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="cursor-pointer focus:outline-none">
                            <Avatar className="w-10 h-10">
                                <AvatarImage
                                    src={photo || ""}
                                    alt="User Avatar"
                                />
                                <AvatarFallback>
                                    {shortenedUsername}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                                console.log("Go to Profile Settings")
                            }
                        >
                            Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
};

export default Navbar;

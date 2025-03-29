"use client";

// import { signOut } from "@/lib/actions/auth.action";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
    // Props
    // { user }: { user: { name: string; image: string } }

    // const router = useRouter();

    return (
        <nav className="relative flex justify-between items-center p-4 bg-dark-900">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="logo" width={38} height={32} />
                <h2 className="text-primary-100">Interview Gym</h2>
            </Link>

            {/* Profile Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                        <AvatarImage
                            src={"/default-avatar.png"}
                        />
                        <AvatarFallback>
                            {"FL"}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="bg-dark-800 text-white z-50 absolute"
                >
                    <DropdownMenuItem
                        onClick={() => {
                            console.log("Profile pressed");
                        }}
                    >
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            console.log("Settings pressed");
                        }}
                    >
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            console.log("Signout pressed");
                        }}
                    >
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    );
};

export default Navbar;

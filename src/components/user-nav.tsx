
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings as SettingsIcon, UserCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function UserNav() {
  const [userName, setUserName] = useState("Kunwer Sachdev");
  const [userEmail, setUserEmail] = useState("kunwer.sachdev@example.com");
  const [userAvatar, setUserAvatar] = useState("https://placehold.co/40x40.png"); // Assuming avatar isn't in localStorage for now

  useEffect(() => {
    const storedFullName = localStorage.getItem("settings_fullName");
    if (storedFullName) {
      setUserName(storedFullName);
    }

    const storedEmail = localStorage.getItem("settings_email");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
    // Placeholder for avatar logic if we decide to store/retrieve it
    // For now, the placeholder avatar might have initials based on the name
    const initials = (storedFullName || userName).split(' ').map(n => n[0]).join('').substring(0,2) || 'KS';
    setUserAvatar(`https://placehold.co/40x40.png?text=${initials}`);


  }, [userName]); // Re-run if userName changes to update avatar initials potentially

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} alt={userName} data-ai-hint="user avatar" />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard#overview">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

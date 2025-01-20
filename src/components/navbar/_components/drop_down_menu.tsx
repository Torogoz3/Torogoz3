"use client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Accordion } from "../../ui/accordion";

interface DropDownMenuProps {
  onClose: () => void;
  userInfo: string;
}

const DropdownMenu: React.FC<DropDownMenuProps> = ({ onClose, userInfo }) => {
  return (
    <div className="w-screen h-screen bg-white px-2 absolute right-0 xl:hidden z-50">
      <Accordion defaultValue="item-1" type="single" collapsible>
        <Link href="/" onClick={onClose} className="py-4 border-b">
          Home
        </Link>
        <Link href="/verify-credentials" onClick={onClose} className="py-4 border-b">
          Verify Credentials
        </Link>
      </Accordion>
      <div className="pt-12 space-y-4 flex flex-col px-4">
        {userInfo === "Loading..." ? (
          <p>Loading user info...</p>
        ) : userInfo === "User exists" ? (
          <Link href="/dashboard">
            <Button className="w-full">Dashboard</Button>
          </Link>
        ) : (
          <Link href="/onboard">
            <Button variant="outline" className="w-full">
              Get
            </Button>
          </Link>
        )}
        <Button variant="outline" onClick={onClose} className="w-full">
          Close Menu
        </Button>
      </div>
    </div>
  );
};

export default DropdownMenu;

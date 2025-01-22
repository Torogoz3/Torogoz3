"use client";

import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../../ui/button";
import { X, AlignJustify } from "lucide-react";
import Link from "next/link";
import DropdownMenu from "../_components/drop_down_menu";

const ActionButtons = () => {
  const { authenticated, login, logout } = usePrivy();

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [userInfo] = useState<string>("Loading...");

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  return (
    <div className="pr-2">
      <div className="items-center justify-center flex">
        <div className="flex xl:space-x-4">
          {authenticated && userInfo === "User exists" ? (
            <Link href="/dashboard" className="lg:flex items-center hidden">
              <div>Dashboard</div>
            </Link>
          ) : authenticated ? (
            <Link
              href="/onboard"
              className="lg:flex items-center hidden text-gray-600 hover:text-black transition-all  text-base font-russo"
            >
              <div className="-ml-9">Get</div> {/* Ajuste para mover el "Get" */}
            </Link>
          ) : null}
        </div>
        <div className="flex lg:space-x-6 items-center pr-4">
          {/* Ajuste del espacio general entre "Get" y el botón */}
          {authenticated ? (
            <Button className="hidden lg:block" onClick={logout}>
              Disconnect
            </Button>
          ) : (
            <Button className="hidden lg:block" onClick={login}>
              Connect
            </Button>
          )}
        </div>
      </div>

      {isDropdownVisible && (
        <div onClick={toggleDropdown} className="rounded-full xl:hidden">
          <X className="h-5 w-5 items-center justify-center rounded-full" />
        </div>
      )}

      {!isDropdownVisible && (
        <div onClick={toggleDropdown} className="flex lg:hidden">
          <AlignJustify className="h-6 w-6 items-center justify-center mr-2" />
        </div>
      )}

      {isDropdownVisible && <DropdownMenu userInfo={userInfo} onClose={closeDropdown} />}
    </div>
  );
};

export default ActionButtons;

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

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  return (
    <div className="pr-2">
      <div className="items-center justify-center flex">
        {/* Mostrar botones para desktop */}
        <div className="flex xl:space-x-8 text-base font-russo hidden lg:flex">
          {authenticated && (
            <>
              <Link href="/dashboard">
                <Button className="hover:scale-105 transition-transform duration-300 ml-2">Dashboard</Button>
              </Link>
              <Link href="/onboard">
                <Button className="hover:scale-105 transition-transform duration-300 ml-0.5">
                  Get
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Botón conectar para desktop */}
        <div className="flex lg:space-x-6 items-center pr-4 ml-8">
          {!authenticated ? (
            <Button className="hidden lg:block" onClick={login}>
              Connect
            </Button>
          ) : (
            <Button className="hidden lg:block" onClick={logout}>
              Disconnect
            </Button>
          )}
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      {!isDropdownVisible && (
        <div onClick={toggleDropdown} className="flex lg:hidden">
          <AlignJustify className="h-6 w-6 items-center justify-center mr-2" />
        </div>
      )}
      {isDropdownVisible && (
        <div onClick={toggleDropdown} className="rounded-full xl:hidden">
          <X className="h-5 w-5 items-center justify-center rounded-full" />
        </div>
      )}

      {isDropdownVisible && (
        <DropdownMenu
          userInfo={authenticated ? "User exists" : "Loading..."}
          onClose={closeDropdown}
          login={login}
          logout={logout} 
        />
      )}
    </div>
  );
};

export default ActionButtons;

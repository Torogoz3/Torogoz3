"use client";

import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../../ui/button";
import { X, AlignJustify } from "lucide-react";
import Link from "next/link";
import DropdownMenu from "../_components/drop_down_menu";

const ActionButtons = () => {
  const { authenticated, login, logout } = usePrivy();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<string>("Loading...");

  useEffect(() => {
    if (authenticated) {
      // Aquí podrías obtener más detalles del usuario si es necesario
      setUserInfo("User exists");
    } else {
      setUserInfo("Loading...");
    }
  }, [authenticated]);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  return (
    <div className="pr-2">
      <div className="items-center justify-center flex">
        {/* Botón para Desktop */}
        <div className="flex xl:space-x-4 text-base font-russo">
          {authenticated && userInfo === "User exists" ? (
            <Link href="/dashboard" className="lg:flex items-center hidden">
              <div>Dashboard</div>
            </Link>
          ) : authenticated ? (
            <Link
              href="/onboard"
              className="lg:flex items-center hidden text-gray-600 hover:text-black transition-all text-base font-russo"
            >
              <div className="-ml-9">Get</div>
            </Link>
          ) : null}
        </div>
        <div className="flex lg:space-x-6 items-center pr-4">
          {/* Botón de conectar/desconectar */}
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
          userInfo={userInfo}
          onClose={closeDropdown}
          login={login}
        />
      )}
    </div>
  );
};

export default ActionButtons;

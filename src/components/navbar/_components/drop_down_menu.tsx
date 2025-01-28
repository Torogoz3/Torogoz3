"use client";

import React from "react";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Accordion } from "../../ui/accordion";

interface DropDownMenuProps {
  onClose: () => void;
  userInfo: string;
  login: () => void;
  logout: () => void;
}

const DropdownMenu: React.FC<DropDownMenuProps> = ({ onClose, userInfo, login, logout }) => {
  return (
    <div className="w-screen h-screen bg-white px-2 absolute right-0 xl:hidden z-50">
      {/* Acordeón con enlaces */}
      <Accordion defaultValue="item-1" type="single" collapsible>
        <Link href="/" onClick={onClose} className="py-4 border-b">
          Home
        </Link>
        <Link href="/verify-credentials" onClick={onClose} className="py-4 border-b">
          Verify Credentials
        </Link>
      </Accordion>

      {/* Sección de usuario y botones */}
      <div className="pt-12 space-y-4 flex flex-col px-4">
        {/* Estado del usuario */}
        {userInfo === "Loading..." ? (
          <p>Loading user info...</p>
        ) : (
          <>
            <Link href="/dashboard" onClick={onClose}>
              <Button className="w-full hover:scale-105 transition-transform duration-300">
                Dashboard
              </Button>
            </Link>
            <Link href="/onboard" onClick={onClose}>
              <Button className="w-full hover:scale-105 transition-transform duration-300">
                Get
              </Button>
            </Link>
          </>
        )}

        {/* Botones "Connect" y "Disconnect" basados en el estado */}
        {!userInfo || userInfo === "Loading..." ? (
          <div className="flex justify-center">
            <Button onClick={login} className="w-full hover:scale-105 transition-transform duration-300">
              Connect
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button onClick={logout} className="w-full hover:scale-105 transition-transform duration-300">
              Disconnect
            </Button>
          </div>
        )}

        {/* Botón para cerrar el menú */}
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full hover:scale-105 transition-transform duration-300"
          >
            Close Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;

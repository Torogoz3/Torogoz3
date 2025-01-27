"use client";

import React from "react";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Accordion } from "../../ui/accordion";

interface DropDownMenuProps {
  onClose: () => void;
  userInfo: string;
  login: () => void;
}

const DropdownMenu: React.FC<DropDownMenuProps> = ({ onClose, userInfo, login }) => {
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
        ) : userInfo === "User exists" ? (
          <Link href="/dashboard">
            <Button className="w-full">
              <span className="text-base font-russo -ml-2">Go to Dashboard</span>
            </Button>
          </Link>
        ) : (
          <Link href="/onboard">
            <Button variant="outline" className="w-full">
              <span className="text-base font-russo -ml-2">Get Started</span>
            </Button>
          </Link>
        )}

        {/* Botón de conectar */}
        <div className="flex justify-center">
          <Button onClick={login} className="w-full">
            Connect
          </Button>
        </div>

        {/* Botón para cerrar el menú */}
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onClose} className="w-full">
            Close Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;

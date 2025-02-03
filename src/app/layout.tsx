/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { defineChain } from "viem";
import { Roboto } from "next/font/google";
import "./globals.css";
import { PrivyProvider } from "@privy-io/react-auth";
import React from "react";


const font = Roboto({
  subsets: ["latin"],
  weight: "100",
});

const Base = defineChain({
  id: 84532,
  name: "Base-Sepolia",
  network: "Base-Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Base-Sepolia",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.base.org"],
    },
  } as any,
  blockExplorers: {
    default: { name: "Explorer", url: "https://sepolia.basescan.org" },
  },
}) as any;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
     
      
      <body className={font.className}>
        <PrivyProvider
          appId="cm3q1swmn00hlyml9gr6ij0z8"
          config={{
            appearance: {
              theme: "light",
              accentColor: "#676FFF",
              logo: "/cabezatorogoz22.png",
            },
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
            defaultChain: Base,
            supportedChains: [Base],
          }}
        >
          {children}
        </PrivyProvider>
      </body>
    </html>
  );
}

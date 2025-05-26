"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import  Link from "next/link";

export const Heading = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center">
        Write, Read & Share.<br />
        Welcome to <span className="underline">Hotion</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Hotion is the connected workspace where <br />
        better, faster work happens.
    </h3>
    
      <Button asChild>
        <Link href="/documents">
          Enter Hotion
        <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
    </div>
  );
};
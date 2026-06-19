'use client';

import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function DevelopmentBadge() {
  return (
     
    <Tooltip >
      <TooltipTrigger delay={100} render={
<div className="fixed bottom-4 right-4 z-40 cursor-help">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-full px-2 py-1 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 whitespace-nowrap">
              <span className="hidden md:inline">
                Development
              </span>
              <span className="inline md:hidden">
                Dev
              </span>
            </span>
          </div>
        </div>
      }/>
        
      <TooltipContent>
          <span className="inline-block w-fit">
            This application is a development concept and is not intended for production use. Data may be lost at any time. Use at your own risk.
          </span>
      </TooltipContent>
    </Tooltip>
  );
}

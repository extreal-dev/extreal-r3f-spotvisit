"use client";

import { useEffect } from "react";
import VConsole from "vconsole";

const VConsoleComp = () => {
  let vConsole: VConsole;
  useEffect(() => {
    vConsole = new VConsole();
    return () => {
      if (vConsole) {
        vConsole.destroy();
      }
    };
  }, []);

  return <></>;
};
export default VConsoleComp;

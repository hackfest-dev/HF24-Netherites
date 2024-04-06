import { Button } from '../../components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"

import { FiGithub } from 'react-icons/fi';
import { LuArrowLeftToLine } from "react-icons/lu";
import { LuArrowRightToLine } from "react-icons/lu";

//@ts-ignore
function SideBar({ setisCollapsed, isCollapsed }) {
  return (

    isCollapsed ? (<div className="flex flex-col items-center justify-between py-6 h-screen">
      <div className="flex flex-col w-full items-center justify-center">
        <div className="flex items-center justify-center">
          <img src="/logo.png" className="h-8 inline mr-2" />
        </div>
        <div className=" mt-7 w-full flex items-center justify-center">

        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <LuArrowRightToLine className="w-6 h-6 hover:text-purple cursor-pointer" onClick={() => {
              setisCollapsed(false)
            }} />

          </TooltipTrigger>
          <TooltipContent>
            <p>Expand</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

    </div>) : (
      <div className="flex flex-col items-center justify-between py-6 h-screen">
        <div className="flex flex-col w-full items-center justify-center">
          <div className="flex items-center justify-center">
            <img src="/logo.png" className="h-8 inline mr-2" />
            <div className="noto-sans inline-block text-2xl">vChar</div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className='pl-6 pt-1' > <LuArrowLeftToLine className="w-6 h-6 hover:text-purple cursor-pointer" onClick={() => {
                    setisCollapsed(true)
                  }} /></div>

                </TooltipTrigger>
                <TooltipContent>
                  <p>Collapse</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </div>
          <div className=" mt-7 w-full flex items-center justify-center">
            <Button
              className="space-grotesk  rounded-full text-lg w-3/4 h-11 flex items-center justify-center text-gray-400 border bg-vcharBlack border-e border-gray-500 hover:border-purple"
              variant="outline"
            >
              New Thread
            </Button>
          </div>
        </div>

        <a href="https://github.com/hackfest-dev/HF24-Netherites">
          <FiGithub size="25" className="hover:text-purple cursor-pointer" />
        </a>
      </div>
    )



  );
}

export default SideBar;

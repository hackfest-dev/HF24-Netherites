import { Button } from '../../components/ui/button';

import { FiGithub } from 'react-icons/fi';

function SideBar() {
  return (
    <div className="flex flex-col items-center justify-between py-6 h-screen">
      <div className="flex flex-col w-full items-center justify-center">
        <div className="flex items-center justify-center">
          <img src="/logo.png" className="h-8 inline mr-2" />
          <div className="noto-sans inline-block text-2xl">vChar</div>
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
  );
}

export default SideBar;

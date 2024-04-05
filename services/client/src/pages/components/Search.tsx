import { Textarea } from '../../components/ui/textarea';

import { GoFilter } from 'react-icons/go';
import { FaArrowRight } from 'react-icons/fa';

function Search() {
  return (
    <div className="py-4 h-full w-full">
      <div className="w-full h-full bg-vcharBlack rounded-lg border-1 border-gray-100 flex items-center justify-center">
        <div className="-translate-y-1/2  w-full flex items-center justify-center flex-col">
          <div className="noto-sans text-4xl">Let's dive deeper</div>
          <div
            className="mt-10 border border-e border-gray-500/20 rounded py-2 px-4 w-2/5"
            style={{
              backgroundColor: '#202222',
            }}
          >
            <Textarea
              style={{
                background: 'transparent',
              }}
              placeholder="Search for anything about stocks, companies or markets..."
              className="text-md noto-sans resize-none "
              rows={1}
            />
            <div className="w-full flex items-center justify-between">
              <div className="px-3 py-2 max-w-fit rounded-full flex items-center justify-between cursor-pointer text-white/60 roboto-regular hover:bg-white/5">
                <GoFilter className="mr-1.5" /> Filter
              </div>
              <div className="px-3 py-2 max-w-fit rounded-full flex items-center justify-between cursor-pointer text-white/80 roboto-regular hover:bg-white/10">
                <FaArrowRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;


import { useMyContext } from '../pages/utils/SideBarContext';
import OutputContainer from './components/OutputContainer';

function SearchPage() {
    //@ts-ignore
    const { isCollapsed, setisCollapsed } = useMyContext();
    return (
        <div className="flex w-full">
            <div
                style={{
                    width: isCollapsed ? '94%' : '87%',
                    transition: 'width 0.2s ease-in-out',
                }}
            >
                <OutputContainer />
            </div>
        </div>
    )
}

export default SearchPage

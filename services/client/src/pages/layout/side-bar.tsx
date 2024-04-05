import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Searchbar from '../components/search-bar';

export function SideBar({ }: React.HTMLAttributes<HTMLElement>) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="flex h-screen">
            <div className="w-64 bg-gray-200 border-r">
                <div className="p-4 border-b">
                    <nav className="space-y-2 ">
                        <div className='flex flex-col justify-center items-center' > <p className='text-lg font-bold'>vChar</p></div>

                        <Searchbar />
                        <NavLink to="/" location={location}>Home</NavLink>
                        <NavLink to="/discovery" location={location}>Discovery</NavLink>
                        <NavLink to="/discovery" location={location}>Library</NavLink>
                        <NavLink to="/discovery" location={location}>Sign in</NavLink>

                    </nav>
                </div>
                <div className="p-3 border-t flex justify-center">
                    <Button className='w-full rounded-3xl' onClick={() => navigate('/')}>Sign Up</Button>
                </div>
            </div>
            <div className="flex-grow">
                <Outlet />
            </div>
        </div>
    );
}

function NavLink({ to, children, location }: { to: string, children: React.ReactNode, location: any }) {
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`block py-2 px-4 text-sm font-medium transition-colors ${isActive ? 'font-bold text-primary' : 'text-muted-foreground hover:text-primary'}`}
        >
            {children}
        </Link>
    );
}

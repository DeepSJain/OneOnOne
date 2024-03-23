import logo from "../../assets/images/logo.png";
import ThemeSelector from "./theme_selector/theme_selector";

function Header({home_url="/events/", is_nav=true}) {
    return (
        <header className="navbar bg-base-100 text-base-content sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] shadow-sm">
            <div className="flex-none">
                {is_nav ? <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost drawer-button lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label> : ""}
            </div>
            <div className="flex-1">
                <a href={home_url} className="btn btn-ghost text-xl">
                    <img src={logo} className="logo" alt="logo" />
                </a>
            </div>
            <div className="flex-none">
                <ThemeSelector />
            </div>
        </header>
    );
}

export default Header;
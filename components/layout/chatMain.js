
'use client'
import { useEffect, useState } from "react"
import AddClassBody from "../elements/AddClassBody"
import BackToTop from '../elements/BackToTop'
import Sidebar from "./Sidebar"
import Footer2 from './footer/Footer2'
import Header3 from "./header/Header3"
import { useRouter } from 'next/navigation';

export default function ChatAdmin({ headerStyle, footerStyle, fixedfooter, children }) {
    const [scroll, setScroll] = useState(0)
    const [isMobileMenu, setMobileMenu] = useState(false)
    const handleMobileMenu = () => {
        setMobileMenu(!isMobileMenu)
        !isMobileMenu ? document.body.classList.add("mobile-menu-visible") : document.body.classList.remove("mobile-menu-visible");
    }
    const router = useRouter();
    const [isSidebar, setSidebar] = useState(false)
    const [islogin, setLogin] = useState(true)
    const handleSidebar = () => setSidebar(!isSidebar)
    //const userDetail12 = JSON.parse(localStorage.getItem('user'));
    

    useEffect(() => {
        // const loggedInStatus = localStorage.getItem('isLoggedIn');
        // if (loggedInStatus) {
        // 	setLogin(false);
        // }

        const WOW = require('wowjs')
        window.wow = new WOW.WOW({
            live: false
        })
        window.wow.init()

        document.addEventListener("scroll", () => {
            const scrollCheck = window.scrollY > 100
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck)
            }
        })
    }, [])
    // // console.log(islogin)
    // if(islogin){
    // 	router.push('/');
    // 	return true;
    // }

    return (
        <><div id="top" />
            <AddClassBody />
            <div id="wrapper">
                <div id="page" className="clearfix">
                    <div className={`layout-wrap ${isSidebar ? "full-width" : ""}`}>
                        <Header3 scroll={scroll} isSidebar={isSidebar} handleSidebar={handleSidebar} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu}/>
                        <Sidebar isSidebar={isSidebar} handleSidebar={handleSidebar} />

                        <div className="main-content">
                            <div className="main-content-inner" style={{padding:"0px 0px"}}>
                                <div className="button-show-hide show-mb" onClick={handleSidebar}>
                                    <span className="body-1">Show Dashboard</span>
                                </div>
                                {children}
                            </div>
                            {/* < Footer2 fixedfooter={fixedfooter}/> */}
                            <div className={`footer-dashboard ${fixedfooter ? "footer-dashboard-2" : ""}`}>
                                <p className="text-variant-2"></p>
                            </div>
                        </div>
                        <div className="overlay-dashboard" onClick={handleSidebar} />
                    </div>
                </div>
            </div>
            <BackToTop target="#top" />
        </>
    )
}

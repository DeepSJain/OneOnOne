import React from 'react';

import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import Nav from '../../components/nav/nav';
import { AlertBox } from '../../components/alert_box/alert_box';

function BaseApp({main, home_url, is_nav=true, is_theme=true}) {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <div className="min-h-screen flex flex-col">
                    <Header home_url={home_url} is_nav={is_nav} is_theme={is_theme} />
                    {main}
                    <AlertBox />
                    <Footer />
                </div>
            </div>
            {is_nav ? <Nav /> : ""}
        </div>
    );
}

export default BaseApp;
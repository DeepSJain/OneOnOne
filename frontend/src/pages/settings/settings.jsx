import TitleInstructions from '../../components/title_instructions/title_instructions';
import BaseApp from '../../components/base_app/base_app';
import { NavigationButtons, back } from '../../components/navigation_buttons/navigation_buttons';

import Settings from '../../components/settings/settings';

function Main() {
    return (
        <main classNameName="prose p-4">
            <TitleInstructions title="Settings" instructions="Change your account settings" />
            <div classNameName="divider"></div>
            <Settings />
            <div classNameName="divider"></div>
            <NavigationButtons back={{label: "Back", onClick: back}} />
        </main>
    );
}

function App() {
    return (
        <BaseApp main={<Main />} home_url="/events/" is_nav={true} />
    );
}

export default App;

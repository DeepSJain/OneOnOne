import TitleInstructions from '../../components/title_instructions/title_instructions';
import { NavigationButtons, back } from '../../components/navigation_buttons/navigation_buttons';
import BaseApp from '../../components/base_app/base_app';

import Contacts from '../../components/contacts/contacts';

function Main() {
    return (
        <main className="prose p-4">
            <TitleInstructions title="Contacts" instructions="Update your contacts list" />
            <div className="divider"></div>
            <Contacts />
            <div className="divider"></div>
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
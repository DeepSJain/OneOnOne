import TitleInstructions from '../../components/title_instructions/title_instructions';
import { NavigationButtons, back } from '../../components/navigation_buttons/navigation_buttons';
import BaseApp from '../../components/base_app/base_app';

import CreateEvent from '../../components/create_event/create_event';

function Main() {
    function next() {
        document.getElementById("submit-create-form").click();
    }

    return (
        <main className="prose p-4">
            <TitleInstructions title="Create Event" instructions="Enter the event name and deadline." />
            <div className="divider"></div>
            <CreateEvent />
            <div className="divider"></div>
            <NavigationButtons back={{label: "Back", onClick: back}} next={{label: "Next", onClick: next}} />
        </main>
    );
}

function App() {
    return (
        <BaseApp main={<Main />} home_url="/events/" is_nav={true} />
    );
}

export default App;
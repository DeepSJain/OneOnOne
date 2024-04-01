import TitleInstructions from '../../components/title_instructions/title_instructions';
import BaseApp from '../../components/base_app/base_app';
import { NavigationButtons, back } from '../../components/navigation_buttons/navigation_buttons';

import Summary from '../../components/summary/summary';

function Main() {
    return (
        <main className="prose p-4">
            <TitleInstructions title="Summary" instructions="Here is a summary of all your meetings." />
            <div className="divider"></div>
            <Summary />
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

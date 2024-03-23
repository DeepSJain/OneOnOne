import BaseApp from '../../components/base_app/base_app';
import TitleInstructions from '../../components/title_instructions/title_instructions';
import { NavigationButtons, back } from '../../components/navigation_buttons/navigation_buttons';

function Main() {
    return (
        <main className="prose p-4">
            <TitleInstructions title="Page Not Found" instructions="The page you are looking for does not exist." />
            <div className="divider"></div>
            <NavigationButtons back={{label: "Back", onClick: back}} />
        </main>
    );
}

function App() {
    return (
        <BaseApp main={<Main />} home_url="/" is_nav={false} />
    );
}

export default App;
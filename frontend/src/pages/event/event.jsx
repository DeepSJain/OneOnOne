import { useParams } from 'react-router-dom';
import TitleInstructions from '../../components/title_instructions/title_instructions';
import { NavigationButtons, back, get_param } from '../../components/navigation_buttons/navigation_buttons';
import BaseApp from '../../components/base_app/base_app';

import Event from '../../components/event/event';

import { useNavigate } from 'react-router-dom';


function Main() {
    let { event_id } = useParams();
    let navigate = useNavigate();

    return (
        <main className="prose p-4">
            <TitleInstructions title="" instructions="Event details" />
            <div className="divider"></div>
            <Event event_id={event_id} />
            <div className="divider"></div>
            {/* {get_param("next") !== null ? <NavigationButtons back={{label: "Back", onClick: back}} next={{label: "Next", onClick: () => window.location.href = get_param("next")}} /> : <NavigationButtons back={{label: "Back", onClick: back}} />} */}
            {get_param("next") !== null ? <NavigationButtons back={{label: "Back", onClick: back}} next={{label: "Next", onClick: () => navigate(get_param("next"))}} /> : <NavigationButtons back={{label: "Back", onClick: back}} />}
        </main>
    );
}

function App() {
    return (
        <BaseApp main={<Main />} home_url="/events/" is_nav={true} />
    );
}

export default App;
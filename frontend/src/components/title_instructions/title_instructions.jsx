function TitleInstructions({title="", instructions=""}) {
    return (
        <div className="title-instructions">
            <h1 id="title" className="font-bold">{title}</h1>
            <p id="instructions" className="text-gray-500">{instructions}</p>
        </div>
    );
}

export default TitleInstructions;
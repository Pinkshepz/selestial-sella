export function paragraph(text: string) {
    if (typeof text === "string") {
        const parsed_text = text.split('\\n');
        let paragraphs: React.ReactNode[] = [];

        parsed_text.map((fragment, index) => {
            paragraphs.push(<div key={index}>{fragment}</div>);
        });

        return (<div className="flex flex-col gap-4">{paragraphs}</div>);
    } else {
        (<div>{text}</div>);
    }
}

export default function formatQuizText(text: any) {
    if (typeof text === "string") {
        if ((text[0] == "[") && (text[text.length - 1] == "]")) {
            const parsed_text = text.slice(1, -1).split(", ");
            let chips: Array<React.ReactNode> = [];
            parsed_text.map((_text) => {
                chips.push(
                    <div className="px-2" key={_text}>
                        {_text}
                    </div>
                );
            })
            return chips;
        } else {
            return paragraph(text);
        }
    } else {
        return paragraph(text);
    }
}

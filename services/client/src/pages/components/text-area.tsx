import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react';
function TextArea() {

    const [text, setText] = useState('');


    const handleInputChange = (event: any) => {
        setText(event.target.value);
    };


    return (
        <div>
            <Textarea value={text}
                onChange={handleInputChange}

                placeholder="Ask Anything ..."
                rows={3} />
        </div>
    )
}

export default TextArea

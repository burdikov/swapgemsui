import {Button} from "@telegram-apps/telegram-ui";
import {useState} from "react";


export default function StatedButton({formName: fieldName, formValue, f, ...args}) {
    const [pressedState, setPressedState] = useState(false)
    return (
        <div>
            <input type={'checkbox'} checked={pressedState} style={{display: 'none'}}
                   name={fieldName} value={formValue}
            />
            <Button
                {...args}
                mode={pressedState ? 'bezeled' : 'outline'}
                onClick={() => {
                    // window.Telegram.WebApp.HapticFeedback.impactOccurred('soft')
                    setPressedState((b) => !b)
                    if (f) f()
                }}
            ></Button>
        </div>
    )
}
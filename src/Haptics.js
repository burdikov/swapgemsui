import {Button, Switch} from "@telegram-apps/telegram-ui";

export default function HapticSwitch({onChange, ...props}) {
        return <Switch {...props} onChange={(e) =>{
            window.Telegram.WebApp.HapticFeedback.selectionChanged()
            onChange(e)
        }}/>;
}

export function HapticButton({onClick, ...props}) {
    return <Button {...props} onClick={(e)=> {
        window.Telegram.WebApp.HapticFeedback.selectionChanged()
        onClick(e)
    }}/>;
}
import {SegmentedControl} from "@telegram-apps/telegram-ui";
import React, {useState} from "react";


export default function LabeledSegmentedControl({labels, name, ...args}) {
    const [selected, setSelected] = useState(labels[0].value)

    return <SegmentedControl {...args}>
        {labels.map(({value, label, f}) => (
            <SegmentedControl.Item
                type={'button'}
                key={value}
                selected={selected === value}
                onClick={() => {
                    if (selected !== value) {
                        window.Telegram.WebApp.HapticFeedback.selectionChanged()
                    }
                    setSelected(value)
                    if (f) f()
                }}
            >
                <input type={'radio'} name={name} value={value} checked={selected === value}
                       style={{display: 'none'}}
                />
                {label}
            </SegmentedControl.Item>
        ))}
    </SegmentedControl>
}
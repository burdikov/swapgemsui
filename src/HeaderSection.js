import {Section, SegmentedControl} from "@telegram-apps/telegram-ui";
import React from "react";

export default function HeaderSection(
    {
        labels,
        current,
        onClick
    }) {
    return (
        <Section header={'Хочу'}>
            <SegmentedControl>
                {labels.map((verb, i) => {
                    let selected = verb === current
                    return (
                        <SegmentedControl.Item
                            key={i}
                            type={'button'}
                            selected={selected}
                            onClick={() => {
                                // plink only when selection actually changes
                                if (!selected) {
                                    window.Telegram.WebApp.HapticFeedback.selectionChanged()
                                }
                                onClick(verb)
                            }}
                        >
                            <input type={'radio'} name={'buyOrSell'}
                                   value={verb} checked={selected}
                                   readOnly={true} hidden={true}
                            />
                            {verb}
                        </SegmentedControl.Item>
                    )
                })}
            </SegmentedControl>
        </Section>
    )
}
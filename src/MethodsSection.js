import StatedButton from "./StatedButton";
import React from "react";
import {Input, Section} from "@telegram-apps/telegram-ui";

const divStyle = {display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr'}

export default function MethodsSection(
    {
        methods,
        selectedMethods,
        setSelectedMethods,
        more,
        setMore,
        moreVal,
        setMoreVal,
        ...args
    }
) {
    return (
        <Section {...args}>
            <div style={divStyle}>
                {
                    methods.map(method => (
                        <StatedButton
                            size={'m'} stretched={true}
                            state={method}
                            pressed={selectedMethods.includes(method)}
                            onPress={(method) => setSelectedMethods(selectedMethods.concat(method))}
                            onDepress={(method) => setSelectedMethods(selectedMethods.filter(m => m !== method))}
                        >
                            {method}
                        </StatedButton>))
                }
                <StatedButton size={'m'} stretched={true}
                              pressed={more}
                              onPress={() => setMore(true)}
                              onDepress={() => setMore(false)}
                >...</StatedButton>
            </div>
            {more && <div style={{gridTemplateColumns: '1fr'}}>
                <Input placeholder={'дополнительные способы'} required={true} maxLength={40}
                       value={moreVal} onChange={e => setMoreVal(e.target.value)}
                title={'Максимум 40 символов.'}/>
            </div>}
        </Section>
    )
}
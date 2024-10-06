import {Cell, Input, Section} from "@telegram-apps/telegram-ui";
import React from "react";
import HapticSwitch from "./Haptics";

const labelStyle = {gridTemplateColumns: '1fr'}

export default function RateSection(
    {
        cb,
        setCb,
        rate,
        setRate
    }
) {
    return <Section header={'Курс'}>
        <Cell Component="label" after={
            <HapticSwitch name={'cb'} checked={cb} onChange={() => setCb(!cb)}/>}>
            По текущему (ЦБ, Google, etc.)
        </Cell>
        {!cb &&
            <label style={labelStyle}>
                <Input placeholder={'ваш курс'}
                       title={'Только цифры, точка или запятая, один или два десятичных знака.'}
                       pattern={'\\d{1,12}([.,]\\d{1,2})?'}
                       required={true}
                       inputMode={'decimal'}
                       name={'rate'}
                       value={rate}
                       onChange={(e) => {
                           setRate(e.target.value)
                       }}
                />
            </label>}
    </Section>
}
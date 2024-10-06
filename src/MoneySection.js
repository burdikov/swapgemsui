import {Button, Caption, Cell, Input, Section, Tappable} from "@telegram-apps/telegram-ui";
import {Icon16Cancel} from "@telegram-apps/telegram-ui/dist/icons/16/cancel";
import React from "react";
import HapticSwitch from "./Haptics";

const tappableStyle = {
    display: 'flex',
    alignSelf: 'center',
    paddingRight: '7px'
}

const captionStyle = {
    fontStyle: 'italic',
    display: 'flex',
    alignSelf: 'center',
    color: 'var(--tgui--hint_color)',
}

const inputAfterStyle = {display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}

const quickMoneyStyle = {display: 'flex', gap: '8px'}

export default function MoneySection(
    {
        selling,
        sum,
        setSum,
        inParts,
        setInParts,
        sellingCurr,
        buyingCurr,
    }
) {
    const quickMoneys = {
        EUR: [2000, 1000, 500, 200],
        USD: [2000, 1000, 500, 200],
        RUB: [200000, 100000, 50000, 20000],
    }

    const activeCurr = selling ? sellingCurr : buyingCurr;
    const moneys = quickMoneys[activeCurr] ?? [];

    return (
        <Section header={selling ? 'Сумма продажи' : 'Сумма покупки'}>
            <div>
                <Input placeholder={'сумма'} inputMode={'decimal'} value={sum}
                       title={'Только цифры, точка или запятая, один или два десятичных знака.'}
                       pattern={'\\d{1,12}([.,]\\d{1,2})?'}
                       name={'our-sum'} required={true}
                       onChange={(e) => {
                           setSum(e.target.value)
                       }}
                       after={
                           <div style={inputAfterStyle}>
                               <Caption style={captionStyle}>{activeCurr}</Caption>
                               <div/>
                               <Tappable Component="div" style={tappableStyle} onClick={() => setSum('')}>
                                   <Icon16Cancel/>
                               </Tappable>
                           </div>
                       }
                />
            </div>


            {sum === '' ?
                <div style={quickMoneyStyle}>
                    {moneys.map(sum => (
                        <Button size={'s'} mode={'plain'} value={sum} stretched
                                onClick={function (e) {
                                    setSum(e.target.closest('button').value)
                                }} key={activeCurr + sum}>
                            {sum}
                        </Button>
                    ))}
                </div> : ''}

        </Section>
    )
}
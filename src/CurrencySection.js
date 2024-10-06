import {Section, Select} from "@telegram-apps/telegram-ui";
import React from "react";
import {
    SectionFooter
} from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionFooter/SectionFooter";
import {BUY, CURRENCIES, SELL} from "./const";

const footerStyle = {
    paddingTop: '1px',
    paddingBottom: '1px',
    fontStyle: 'italic',
}

const divStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr  1fr'
}

function CurrencySelect(
    {
        footerText,
        setCurrencies,
        ownSelected,
        anotherSelected,
    }
) {
    return (
        <Section footer={
            <SectionFooter centered={true} style={footerStyle}>
                {footerText}
            </SectionFooter>
        }><Select
            value={ownSelected}
            onChange={(e) => {
                let own = e.target.value;
                let anothers = anotherSelected === e.target.value ? ownSelected : anotherSelected;

                setCurrencies(own, anothers);
            }}
        >
            {CURRENCIES.map((curr, i) => <option key={i} value={curr}>{curr}</option>)}
        </Select></Section>
    )
}

export default function CurrencySection(
    {
        setCurrencies,
        buyingCurr,
        sellingCurr,
    }
) {
    return (
        <Section header={'Валюты'}>
            <div style={divStyle}>
                <CurrencySelect
                    footerText={SELL}
                    ownSelected={sellingCurr}
                    anotherSelected={buyingCurr}
                    setCurrencies={(selling, buying) => setCurrencies(selling, buying)}
                />
                <CurrencySelect
                    footerText={BUY}
                    ownSelected={buyingCurr}
                    anotherSelected={sellingCurr}
                    setCurrencies={(buying, selling) => setCurrencies(selling, buying)}
                />
            </div>
        </Section>
    )
}
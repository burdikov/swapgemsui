import {Select} from "@telegram-apps/telegram-ui";

export default function CurrencySelect({spanClass, selectedValue, ...args}) {
    const currencies = [
        'EUR',
        'RUB',
        'USD',
        'HUF',
        'TRY'
    ]
    return (
        <Select
            {...args}
            onChange={(e) => {
                document.querySelectorAll('.' + spanClass)
                    .forEach((el) => el.innerHTML = e.target.value)
            }}
        >
            {currencies.map((cur) => {
                return <option value={cur} selected={cur === selectedValue}>{cur}</option>
            })}
        </Select>
    )
}
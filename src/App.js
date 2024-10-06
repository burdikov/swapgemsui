import '@telegram-apps/telegram-ui/dist/styles.css';

import {AppRoot, Button, Cell, IconButton, Input, List, Section, Textarea, Tooltip} from '@telegram-apps/telegram-ui';
import React, {useEffect, useState} from "react";
import CurrencySection from "./CurrencySection";
import MethodsSection from "./MethodsSection";
import HeaderSection from "./HeaderSection";
import MoneySection from "./MoneySection";
import {BUY, EUR, RUB, SELL} from "./const";
import {figureOutColors} from "./utils";
import RateSection from "./RateSection";
import HapticSwitch from "./Haptics";
import {editId, keeping, state} from "./index";
import {Icon20QuestionMark} from "@telegram-apps/telegram-ui/dist/icons/20/question_mark";

function form1OnSubmit(editId, keeping, fields) {
    return (event) => {
        event.preventDefault()
        let form = event.target;
        if (form.checkValidity()) {
            let msg =
                `${editId ? 'Редактировать' : 'Опубликовать'} объявление о ${
                    fields.buyOrSell === SELL ?
                        `продаже ${fields.sum} ${fields.sellingCurr}?` :
                        `покупке ${fields.sum} ${fields.buyingCurr}?`}`
            if (!window.confirm(msg)) {
                return;
            }
        } else {
            form.reportValidity();
        }
        window.Telegram.WebApp.MainButton.showProgress()

        const payload = JSON.stringify(fields)

        let params = {}
        if (editId) {
            params.edit_id = editId
        }
        if (fields.reportId) {
            params.report_id = fields.reportId
        }

        params.keeping = keeping;

        fetch(event.target.action + '?' + new URLSearchParams(params).toString(),
            {
                method: 'POST',
                contentType: 'application/json',
                body: payload,
                headers: {
                    'X-Telegram-Init-Data': window.Telegram.WebApp.initData,
                }
            }).then(
            async (response) => {
                let text = await response.text();

                window.Telegram.WebApp.MainButton.hideProgress()

                if (!response.ok) {
                    throw new Error(`${response.status}: ${text}`);
                }

                if (!keeping) return;

                const [msgId, reportId] = text.split(',')

                // alert(`msgId=${msgId}, reportId=${reportId}`)

                fields.reportId = reportId;
                let state = JSON.stringify(fields);
                window.Telegram.WebApp.CloudStorage.setItem(msgId, state, (err, value) => {
                    alert(`err=${err.message()}, value=${value}`);
                });

                if (!editId) {
                    window.Telegram.WebApp.CloudStorage.setItem('latest', state);
                }
            }).then(() => {
            window.Telegram.WebApp.close()
        }).catch((error) => {
            window.Telegram.WebApp.MainButton.hideProgress()
            alert(error.message); // todo friendly error msg
        });
    }
}

export default function App() {
    let botDomain = 'https://swapgems.io'

    const [settings, setSettings] = useState(false)

    let [keep, setKeep] = useState(keeping)

    const [fields, setFields] = useState(state ?? {
        buyOrSell: SELL,
        sellingCurr: EUR,
        buyingCurr: RUB,
        sum: '',
        inParts: false,
        cb: true,
        rate: '',
        euMethods: [],
        euMore: false,
        euMethodsStr: '',
        ruMethods: [],
        ruMore: false,
        ruMethodsStr: '',
        comment: '',
        cash: false,
        cashOnly: false,
        location: '',
        reportId: null,
    });

    useEffect(() => {
        window.Telegram.WebApp.MainButton
            .setText(editId ? 'Редактировать' : 'Опубликовать')
            .onClick(function () {
                let form = document.forms['form1']
                form.requestSubmit()
            })
            .setParams({
                is_visible: true,
                has_shine_effect: false,
            });

        window.Telegram.WebApp.SettingsButton
            .onClick(function () {
                setSettings(true)
            })
            .show();

        window.Telegram.WebApp.ready()
    }, [])


    let selling = fields.buyOrSell === SELL;

    return (
        <AppRoot style={figureOutColors()}>
            {settings ?
                <List>
                    <Section>
                        <Cell after={<HapticSwitch
                            checked={keep}
                            onChange={(e) => {
                                e.target.active = false;
                                keep = !keep
                                window.Telegram.WebApp.CloudStorage.setItem('keeping', keep ? 'yes' : 'no',
                                    (err) => {
                                        if (!err) setKeep(keep)
                                        e.target.active = true;
                                    })
                            }}/>} Component={'label'}
                        before={<IconButton mode="plain" size="s"
                        ><Icon20QuestionMark/></IconButton>}>
                            Запоминать данные форм
                        </Cell>
                    </Section>
                    <Button
                        stretched={true}
                        type={'button'}
                        onClick={() => setSettings(false)}>
                        Закрыть
                    </Button>
                </List> :
                <div>
                    <form id={'form1'}
                          action={`${botDomain}/bot/form`}
                          method={'POST'}
                          onSubmit={form1OnSubmit(editId, keep, fields)}
                    >
                        <List>
                            <HeaderSection
                                labels={[SELL, BUY]}
                                current={fields.buyOrSell}
                                onClick={(verb) => setFields({...fields, buyOrSell: verb})}
                            />

                            <CurrencySection
                                buyingCurr={fields.buyingCurr}
                                sellingCurr={fields.sellingCurr}
                                setCurrencies={(selling, buying) => setFields({
                                    ...fields,
                                    sellingCurr: selling,
                                    buyingCurr: buying
                                })}
                            />

                            <MoneySection
                                selling={selling}
                                sellingCurr={fields.sellingCurr}
                                buyingCurr={fields.buyingCurr}
                                sum={fields.sum}
                                setSum={(sum) => setFields({...fields, sum})}
                                setInParts={(inParts) => setFields({...fields, inParts})}
                            />

                            <RateSection
                                cb={fields.cb}
                                setCb={(cb) => setFields({...fields, cb})}
                                rate={fields.rate}
                                setRate={(rate) => setFields({...fields, rate})}
                            />

                            <Section header={'Опции'}>
                                <Cell Component="label"
                                      after={<HapticSwitch checked={fields.inParts}
                                                           onChange={() => setFields({
                                                               ...fields,
                                                               inParts: !fields.inParts
                                                           })}/>}>
                                    Можно частями
                                </Cell>
                                <Cell Component="label"
                                      after={<HapticSwitch checked={fields.cash}
                                                           onChange={() => {
                                                               if (fields.cash) {
                                                                   fields.cashOnly = false;
                                                               }
                                                               setFields({
                                                                   ...fields,
                                                                   cash: !fields.cash,
                                                                   cashOnly: fields.cashOnly,
                                                               })
                                                           }}/>}>
                                    Наличными
                                </Cell>
                                {fields.cash && <Cell Component="label"
                                                      after={<HapticSwitch checked={fields.cashOnly}
                                                                           onChange={() => setFields({
                                                                               ...fields,
                                                                               cashOnly: !fields.cashOnly
                                                                           })}/>}>
                                    И только наличными
                                </Cell>}
                            </Section>

                            {fields.cash &&
                                <Section header={'Передача наличных'}>
                                    <Input placeholder={'локация'} required={true} maxLength={40}
                                           value={fields.location} onChange={e => setFields({
                                        ...fields,
                                        location: e.target.value
                                    })}
                                           title={'Максимум 40 символов.'}/>
                                </Section>
                            }

                            {!fields.cashOnly && <MethodsSection header={'Отправка валюты'}
                                                                 methods={['Bizum', 'Revolut', 'IBAN', 'Wise']}
                                                                 selectedMethods={fields.euMethods}
                                                                 setSelectedMethods={(euMethods) => setFields({
                                                                     ...fields,
                                                                     euMethods
                                                                 })}
                                                                 more={fields.euMore}
                                                                 setMore={(more) => setFields({
                                                                     ...fields,
                                                                     euMore: more
                                                                 })}
                                                                 moreVal={fields.euMethodsStr}
                                                                 setMoreVal={(val) => setFields({
                                                                     ...fields,
                                                                     euMethodsStr: val
                                                                 })}
                            />}

                            {!fields.cashOnly && (fields.sellingCurr === RUB || fields.buyingCurr === RUB) &&
                                <MethodsSection header={'Отправка рублей'}
                                                methods={['Сбер', 'Tinkoff', 'Raif', 'СБП']}
                                                selectedMethods={fields.ruMethods}
                                                setSelectedMethods={(ruMethods) => setFields({
                                                    ...fields,
                                                    ruMethods
                                                })}
                                                more={fields.ruMore}
                                                setMore={(more) => setFields({...fields, ruMore: more})}
                                                moreVal={fields.ruMethodsStr}
                                                setMoreVal={(val) => setFields({...fields, ruMethodsStr: val})}
                                />}

                            <Section header={'Комментарий'}>
                                <Textarea placeholder={'макс. 140 символов'} name={'comment'} maxLength={140}
                                          value={fields.comment}
                                          onChange={e => setFields({...fields, comment: e.target.value})}/>
                            </Section>
                        </List>
                    </form>
                </div>}
        </AppRoot>
    )
}



import './App.css';

import '@telegram-apps/telegram-ui/dist/styles.css';

import {AppRoot, Button, Cell, Input, List, Section, Switch, Tappable, Textarea} from '@telegram-apps/telegram-ui';
import React, {useState} from "react";
import StatedButton from "./StatedButton";
import LabeledSegmentedControl from "./LabeledSegmentedControl";
import CurrencySelect from "./CurrencySelect";
import {Icon24Close} from "@telegram-apps/telegram-ui/dist/icons/24/close";

export default function App() {
    const euButtonNames = [['Bizum', 'Revolut', 'IBAN', 'Wise']]

    const ruButtons = [['Сбер', 'Tinkoff', 'Raif', 'СБП']]
    const quickMoneys = [2000, 1000, 500, 200]

    let appDomain = ''
    const [ourMonInpVal, setOurMonInpVal] = useState('');
    return (
        <AppRoot style={{background: 'var(--tgui--secondary_bg_color)'}}>
            <div>
                <form id={'form1'}
                      action={`https://${appDomain}/bot/form`}
                      method={'POST'}
                      onSubmit={event => {
                          event.preventDefault()
                          fetch(event.target.action, {
                              method: 'POST',
                              body: new URLSearchParams(new FormData(event.target))
                          }).then((response) => {
                              window.Telegram.WebApp.MainButton.hideProgress()
                              if (!response.ok) {
                                  throw new Error(`HTTP error! Status: ${response.status}`);
                              }
                              return response.text();
                          }).then((body) => {
                              window.Telegram.WebApp.switchInlineQuery(body)
                          }).catch((error) => {
                              // TODO handle error
                          });
                      }
                      }
                >
                    <List>
                        <Section id={'our-money'}>
                            <LabeledSegmentedControl
                                labels={[{label: 'Продам', value: 'sell'}, {label: 'Куплю', value: 'buy'}]}
                                required={true} name={'buy-or-sell'}
                            >
                            </LabeledSegmentedControl>
                            <div style={{display: 'grid', gridTemplateColumns: '3fr 2fr'}}>
                                <Input id={'our-money-inp'} placeholder={'сумма'} inputMode={'decimal'}
                                       value={ourMonInpVal}
                                       style={{fontWeight: "bold"}}
                                       name={'our-sum'}
                                       onChange={(e) => {
                                           setOurMonInpVal(e.target.value)
                                       }}
                                       after={
                                           <Tappable Component="div" style={{display: 'flex'}}
                                                     onClick={() => setOurMonInpVal('')}>
                                               <Icon24Close/>
                                           </Tappable>
                                       }
                                />
                                <CurrencySelect name={'our-curr'} spanClass={'top-curr'}/>
                            </div>

                            {!ourMonInpVal ?
                                <div id={'quick-moneys-btns'} style={{display: 'flex', gap: '8px'}}>
                                    {quickMoneys.map(sum => (
                                        <Button size={'s'} mode={'plain'} value={sum} stretched
                                                onClick={function (e) {
                                                    setOurMonInpVal(e.target.closest('button').value)
                                                }}
                                        >
                                            {sum}
                                        </Button>
                                    ))}
                                </div> : ''}

                            <label style={{display: 'grid', gridTemplateColumns: '3fr 2fr'}}>
                                <Cell>За</Cell>

                                <CurrencySelect id={'bot-cur-sel'} spanClass={'bot-curr'} selectedValue={'RUB'}
                                                f name={'their-curr'}/>
                            </label>

                            <Cell
                                Component="label"
                                after={<Switch
                                    name={'cb'}
                                    defaultChecked
                                    onChange={() => {
                                        window.Telegram.WebApp.HapticFeedback.selectionChanged()
                                        let x = document.getElementById('their-money')
                                        if (x.style.display === 'block') {
                                            x.style.display = 'none'
                                        } else {
                                            x.style.display = 'block'
                                        }
                                    }}
                                />}
                            >
                                По ЦБ
                            </Cell>


                        </Section>
                        <Section
                            id={'their-money'}
                            style={{display: 'none'}}
                        >
                            <LabeledSegmentedControl
                                name={'sum-or-rate'}
                                labels={[
                                    {
                                        label: 'За сумму', value: 'sum',
                                        f: () => {
                                            document.getElementById('rate-row').style.display = 'none'
                                            document.getElementById('sum-row').style.display = 'grid'
                                        }
                                    }, {
                                        label: 'По курсу', value: 'rate',
                                        f: () => {
                                            document.getElementById('sum-row').style.display = 'none'
                                            document.getElementById('rate-row').style.display = 'grid'
                                        }
                                    }]}
                            >
                            </LabeledSegmentedControl>

                            <label id={'rate-row'} style={{display: 'none', gridTemplateColumns: '3fr 2fr'}}>
                                <Input placeholder={'курс'} style={{fontWeight: "bold"}} inputMode={'decimal'}
                                       name={'rate'}/>
                                <Cell><span className={'bot-curr'}>RUB</span> / <span
                                    className={'top-curr'}>EUR</span></Cell>
                            </label>
                            <label id={'sum-row'} style={{display: 'grid', gridTemplateColumns: '3fr 2fr'}}>
                                <Input name={'their-sum'} placeholder={'сумма'} style={{fontWeight: "bold"}}
                                       inputMode={'decimal'}/>
                                <Cell className={'bot-curr'}>RUB</Cell>
                            </label>
                        </Section>

                        <div style={{display: 'flex', gap: 8}}>{
                            euButtonNames.map(row => (
                                row.map(name => (
                                    <StatedButton size={'s'} formName={'eu-methods'} formValue={name}>
                                        {name}
                                    </StatedButton>))
                            ))}
                            <StatedButton size={'s'} f={() => {
                                let el = document.getElementById('eu-other-div')
                                if (el.style.display === 'none') {
                                    el.style.display = 'grid'
                                } else {
                                    el.style.display = 'none'
                                }
                            }}>...</StatedButton>
                        </div>
                        <div id={'eu-other-div'} style={{display: 'none', gridTemplateColumns: '1fr'}}>
                            <Input name={'eu-methods-str'} placeholder={'через запятую'} maxLength={40}/>
                        </div>

                        <div style={{display: 'flex', gap: 8}}>
                            {ruButtons.map(row => (
                                row.map(name => (
                                    <StatedButton size={'s'} formName={'ru-methods'} formValue={name}>
                                        {name}
                                    </StatedButton>))
                            ))}
                            <StatedButton size={'s'} f={() => {
                                let el = document.getElementById('ru-other-div')
                                if (el.style.display === 'none') {
                                    el.style.display = 'grid'
                                } else {
                                    el.style.display = 'none'
                                }
                            }}>...</StatedButton>
                        </div>
                        <div id={'ru-other-div'} style={{display: 'none', gridTemplateColumns: '1fr'}}>
                            <Input name={'ru-methods-str'} placeholder={'через запятую'} maxLength={40}/>
                        </div>
                        <Section>
                            <Cell
                                Component="label"
                                after={<Switch
                                    onChange={() => {
                                        let x = document.getElementById('location')
                                        if (x.style.display === 'block') {
                                            x.style.display = 'none'
                                        } else {
                                            x.style.display = 'block'
                                        }
                                    }}
                                />}
                            >
                                Наличные
                            </Cell>
                            <div style={{display: 'none'}} id={'location'}>
                                <Input style={{}} name='location' placeholder={'локация'} maxLength={40}/>
                            </div>
                        </Section>

                        <Section>
                            <Textarea placeholder={'ваш комментарий'} name={'comment'} maxLength={140}/>
                        </Section>
                    </List>
                </form>
            </div>
        </AppRoot>
    )
}



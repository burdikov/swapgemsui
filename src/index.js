import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {getStorageItem, setStorageItem} from './utils'

window.Telegram.WebApp.setBackgroundColor('secondary_bg_color');

export var keeping = false;
export var state = null;

const parsedUrl = new URL(window.location.href);
export const editId = parsedUrl.searchParams.get("edit");

await getStorageItem('keeping').then(async (keep) => {
    if (keep === 'yes') {
        keeping = true;
        if (editId) {
            await getStorageItem(editId).then(someOldMsg => {
                state = JSON.parse(someOldMsg)
            }).catch((error) => {
                alert('Не вышло загрузить запрошенное объявление: ' + error.message);
            })
        } else {
            await getStorageItem('latest').then(async (latestMsg) => {
                state = JSON.parse(latestMsg)
            });
        }
    }
}).catch(() => {
    setStorageItem('keeping', 'no');
})

// alert(`keeping: ${keeping}`)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

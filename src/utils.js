export function figureOutColors() {
    let tertiary_bg_color = ''
    let segmented_control_active_bg = ''
    if (window.Telegram.WebApp.colorScheme === "dark") {
        tertiary_bg_color = '#2a2a2a'
        segmented_control_active_bg = '#2f2f2f'
    } else if (window.Telegram.WebApp.colorScheme === "light") {
        tertiary_bg_color = 'rgb(244, 244, 247)'
        segmented_control_active_bg = '#ffffff'
    }

    return {
        background: 'var(--tgui--secondary_bg_color)',
        '--tgui--tertiary_bg_color': tertiary_bg_color,
        '--tgui--segmented_control_active_bg': segmented_control_active_bg
    }
}

export const setStorageItem = (key, value) => {
    window.Telegram.WebApp.CloudStorage.setItem(key, value);
}

export const getStorageItem = (key) => {
    return new Promise((resolve, reject) => {
        window.Telegram.WebApp.CloudStorage.getItem(key, (err, value) => {
            if (err || !value) {
                return reject(new Error('Data is not stored'));
            }

            resolve(value);
        });
    });
}
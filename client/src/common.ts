const popupS = require('popups');

export function popupBasic(message: string, onClose?: () => void): void {
    popupS.modal({ 
        content:  `<div>${message}</div>`, 
        onClose: onClose
    });
}
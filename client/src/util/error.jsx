export const ERR_LEVEL = Object.freeze({
    LOW: Symbol(0),
    HIGH: Symbol(1)
});

export function log(message, errorLevel, obj = null) {
    let _returnStr = '';

    // handle error level
    if (errorLevel == ERR_LEVEL.LOW){
        _returnStr += '[LOW]: '
    }else if(errorLevel == ERR_LEVEL.HIGH){
        _returnStr += '[HIGH]: '
    }

    // text
    _returnStr += 'Error ';

    // handle custom message
    _returnStr += `with message "${message}"`;

    // handle obj
    if(obj)
    {
        _returnStr += ' and with the problem object';
        _returnStr += ' ' + obj + ' ';
    }

    // text
    _returnStr += '.';

    // output
    console.log(_returnStr);
}
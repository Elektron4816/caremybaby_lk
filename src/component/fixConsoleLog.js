console.log = (function (oldLog) {
    return function (message) {
        oldLog.apply(console, arguments);
        fetch('/log', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ location: document.location.pathname, message: message }),
        }).catch(error => {
            console.error('Ошибка при отправке сообщения на сервер:', error);
        });

    };
})(console.log);
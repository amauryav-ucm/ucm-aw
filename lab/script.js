document.addEventListener('keydown', (e) => {
    if (e.altKey)
        switch (e.key.toLowerCase()) {
            case 'r':
                document.location.href = '#reservas';
                break;
            case 'v':
                document.location.href = '#vehiculos';
            default:
                break;
        }
});

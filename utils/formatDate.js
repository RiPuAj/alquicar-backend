export const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }
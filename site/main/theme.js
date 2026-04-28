document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('dark-theme');

    try {
        localStorage.setItem('theme', 'dark');
    } catch (error) {
        console.warn('Theme preference could not be saved.', error);
    }
});

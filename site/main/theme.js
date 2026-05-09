document.addEventListener('DOMContentLoaded', () => {
    // Theme setup
    document.body.classList.add('dark-theme');
    try {
        localStorage.setItem('theme', 'dark');
    } catch (error) {
        console.warn('Theme preference could not be saved.', error);
    }

    // Interactive background blob
    const interactiveBlob = document.getElementById('interactive-blob');
    if (interactiveBlob) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Show blob on first movement
            interactiveBlob.style.opacity = '1';
            
            // Move blob with a slight delay effect (via CSS transition)
            interactiveBlob.style.left = `${x}px`;
            interactiveBlob.style.top = `${y}px`;
        });

        // Hide blob when mouse leaves the window
        document.addEventListener('mouseleave', () => {
            interactiveBlob.style.opacity = '0';
        });
    }
});

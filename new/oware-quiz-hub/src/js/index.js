/**
 * Main JavaScript file for the homepage
 * Handles animations and additional functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Animate elements as they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature, .button');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animated');
            }
        });
    };

    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);

    // Initial check for elements in view
    animateOnScroll();

    // Handle demo button click (show popup warning that it's just a demo)
    const demoButton = document.querySelector('.button.demo');
    if (demoButton) {
        demoButton.addEventListener('click', function(event) {
            // Prevent default navigation
            event.preventDefault();

            // Create confirmation dialog
            const dialog = document.createElement('div');
            dialog.className = 'dialog-overlay';
            dialog.innerHTML = `
                <div class="dialog-content">
                    <h3>Demo Mode</h3>
                    <p>You're about to enter the platform in demo mode. No data will be saved permanently.</p>
                    <div class="dialog-buttons">
                        <button id="dialog-cancel" class="dialog-button cancel">Cancel</button>
                        <button id="dialog-continue" class="dialog-button continue">Continue to Demo</button>
                    </div>
                </div>
            `;

            // Add dialog to the document
            document.body.appendChild(dialog);

            // Handle dialog buttons
            document.getElementById('dialog-cancel').addEventListener('click', () => {
                document.body.removeChild(dialog);
            });

            document.getElementById('dialog-continue').addEventListener('click', () => {
                // Proceed to demo page
                window.location.href = demoButton.getAttribute('href');
            });

            // Add styles for dialog
            const style = document.createElement('style');
            style.textContent = `
                .dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }

                .dialog-content {
                    background-color: var(--card-bg-color);
                    padding: 2rem;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px var(--shadow-color);
                    max-width: 450px;
                    width: 90%;
                    animation: scaleIn 0.3s ease;
                }

                .dialog-content h3 {
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                }

                .dialog-content p {
                    margin-bottom: 1.5rem;
                }

                .dialog-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }

                .dialog-button {
                    padding: 0.7rem 1.2rem;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .dialog-button.cancel {
                    background-color: transparent;
                    color: var(--text-color);
                }

                .dialog-button.continue {
                    background-color: var(--primary-color);
                    color: white;
                }

                .dialog-button:hover {
                    transform: translateY(-2px);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `;

            document.head.appendChild(style);
        });
    }

    // Check browser support for backdrop-filter and apply fallback if needed
    if (!CSS.supports('backdrop-filter', 'blur(10px)')) {
        const container = document.querySelector('.container');
        if (container) {
            container.style.backgroundColor = 'var(--card-bg-color)';
        }
    }
});

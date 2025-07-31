/**
 * Interactive Elements Controller
 * Handles all UI interactions and real-time updates
 */

class EngagementController {
    constructor() {
        this.init();
    }

    init() {
        // Initialize all event listeners when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            this.setupButtonHandlers();
            this.setupInputHandlers();
            this.setupSliderHandlers();
            this.setupCheckboxRadioHandlers();
            this.setupSelectHandlers();
            this.setupRealTimeUpdates();
            
            // Initialize the display
            this.updateOutput();
        });
    }

    setupButtonHandlers() {
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
        });
    }

    setupInputHandlers() {
        const inputs = ['name', 'email', 'message'];
        
        inputs.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.handleInputChange(inputId, e.target.value);
                });
            }
        });
    }

    setupSliderHandlers() {
        const sliders = document.querySelectorAll('input[type="range"]');
        
        sliders.forEach(slider => {
            const valueDisplay = document.getElementById(slider.id + '-value');
            
            slider.addEventListener('input', (e) => {
                this.handleSliderChange(slider.id, e.target.value, valueDisplay);
            });
        });
    }

    setupCheckboxRadioHandlers() {
        // Handle checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleCheckboxChange(e.target.id, e.target.checked);
            });
        });
        
        // Handle radio buttons
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.handleRadioChange(e.target.value);
                }
            });
        });
    }

    setupSelectHandlers() {
        const countrySelect = document.getElementById('country');
        
        if (countrySelect) {
            countrySelect.addEventListener('change', (e) => {
                this.handleSelectChange(e.target);
            });
        }
    }

    setupRealTimeUpdates() {
        const interactiveElements = document.querySelectorAll('input, select, textarea');
        
        interactiveElements.forEach(element => {
            element.addEventListener('input', () => this.updateOutput());
            element.addEventListener('change', () => this.updateOutput());
        });
    }

    // Event handler methods
    handleButtonClick(button) {
        const message = `Button "${button.textContent.trim()}" clicked`;
        console.log(message);
        
        // Show subtle feedback instead of alert
        this.showFeedback(message);
    }

    handleInputChange(inputId, value) {
        console.log(`${inputId} changed to: ${value}`);
    }

    handleSliderChange(sliderId, value, valueDisplay) {
        if (valueDisplay) {
            valueDisplay.textContent = value;
        }
        console.log(`${sliderId} changed to: ${value}`);
    }

    handleCheckboxChange(checkboxId, isChecked) {
        console.log(`${checkboxId} is ${isChecked ? 'checked' : 'unchecked'}`);
    }

    handleRadioChange(value) {
        console.log(`Radio selected: ${value}`);
    }

    handleSelectChange(selectElement) {
        console.log('Selected country:', selectElement.value);
        
        if (selectElement.value) {
            const selectedText = selectElement.options[selectElement.selectedIndex].text;
            this.showFeedback(`Selected: ${selectedText}`);
        }
    }

    updateOutput() {
        // Safely get element values with fallbacks
        const getValue = (id, fallback = '') => {
            const element = document.getElementById(id);
            return element ? element.value : fallback;
        };

        const getChecked = (id) => {
            const element = document.getElementById(id);
            return element ? element.checked : false;
        };

        // Get all current values
        const values = {
            name: getValue('name') || 'Not entered',
            email: getValue('email') || 'Not entered',
            volume: getValue('volume', '50'),
            country: getValue('country') || 'Not selected'
        };

        // Get checkbox states
        const checkboxes = {
            option1: getChecked('option1'),
            option2: getChecked('option2')
        };

        // Get radio selection
        const selectedChoice = document.querySelector('input[name="choice"]:checked');
        const choice = selectedChoice ? selectedChoice.value : 'None selected';

        // Update the display
        this.renderOutput(values, checkboxes, choice);
    }

    renderOutput(values, checkboxes, choice) {
        const display = document.getElementById('values-display');
        
        if (!display) return;

        display.innerHTML = `
            <div class="output-section">
                <p><strong>Name:</strong> <span class="value">${values.name}</span></p>
                <p><strong>Email:</strong> <span class="value">${values.email}</span></p>
                <p><strong>Volume:</strong> <span class="value">${values.volume}</span></p>
                <p><strong>Country:</strong> <span class="value">${values.country}</span></p>
                <p><strong>Option 1:</strong> <span class="value ${checkboxes.option1 ? 'active' : ''}">${checkboxes.option1}</span></p>
                <p><strong>Option 2:</strong> <span class="value ${checkboxes.option2 ? 'active' : ''}">${checkboxes.option2}</span></p>
                <p><strong>Choice:</strong> <span class="value">${choice}</span></p>
            </div>
        `;
    }

    showFeedback(message) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.className = 'feedback-message';
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 0, 204, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            font-family: "IBM Plex Mono", monospace;
            font-size: 12px;
            z-index: 2000;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(feedback);

        // Remove after 2 seconds
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 2000);
    }
}

// Initialize the controller
new EngagementController();
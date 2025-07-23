// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    // Get all buttons
    const buttons = document.querySelectorAll('button');
    
    // Add click event to each button
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.textContent);
            alert('You clicked: ' + this.textContent);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Get input elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Listen for changes in real-time
    nameInput.addEventListener('input', function() {
        console.log('Name changed to:', this.value);
    });
    
    emailInput.addEventListener('input', function() {
        console.log('Email changed to:', this.value);
    });
    
    messageInput.addEventListener('input', function() {
        console.log('Message changed to:', this.value);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Get all sliders
    const sliders = document.querySelectorAll('input[type="range"]');
    
    sliders.forEach(slider => {
        // Get the corresponding value display
        const valueDisplay = document.getElementById(slider.id + '-value');
        
        // Update value display when slider changes
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
            console.log(`${this.id} changed to: ${this.value}`);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Handle checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log(`${this.id} is ${this.checked ? 'checked' : 'unchecked'}`);
        });
    });
    
    // Handle radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                console.log(`Selected: ${this.value}`);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('country');
    
    countrySelect.addEventListener('change', function() {
        console.log('Selected country:', this.value);
        if (this.value) {
            alert(`You selected: ${this.options[this.selectedIndex].text}`);
        }
    });
});

function updateOutput() {
    // Get all current values
    const name = document.getElementById('name').value || 'Not entered';
    const email = document.getElementById('email').value || 'Not entered';
    const volume = document.getElementById('volume').value;
    const country = document.getElementById('country').value || 'Not selected';
    
    // Get checkbox states
    const option1 = document.getElementById('option1').checked;
    const option2 = document.getElementById('option2').checked;
    
    // Get radio selection
    const selectedChoice = document.querySelector('input[name="choice"]:checked');
    const choice = selectedChoice ? selectedChoice.value : 'None selected';
    
    // Update the display
    const display = document.getElementById('values-display');
    display.innerHTML = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Volume:</strong> ${volume}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Option 1:</strong> ${option1}</p>
        <p><strong>Option 2:</strong> ${option2}</p>
        <p><strong>Choice:</strong> ${choice}</p>
    `;
}

// Add event listeners to all interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('input, select, textarea');
    
    interactiveElements.forEach(element => {
        element.addEventListener('input', updateOutput);
        element.addEventListener('change', updateOutput);
    });
    
    // Initialize the display
    updateOutput();
});
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector(".form-wizard");
    const stepIndicators = document.querySelectorAll(".progress-container li");
    const stepsContainer = document.querySelector(".steps-container");
    const nameInput = document.querySelector("#name");
    const enteredNameDisplay = document.querySelector("p.summary-name-content");
    const emailInput = document.querySelector("#email");
    const enteredEmailDisplay = document.querySelector("p.summary-email-content");
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const ul = document.querySelector('ul.summary-topics-content');
    const steps = document.querySelectorAll(".step");
    const progressText = document.querySelector("p.progress-text");
    const continueButton = document.querySelector(".continue");
    const confirmButtom = document.querySelector(".confirm");

    // current step tracking
    let currentStep = 0;

    // initialize the array of checked checkboxes values
    let checkedValues = [];

    const updateProgress = () => {

        // making the steps container height dynamic
        stepsContainer.style.height = steps[currentStep].offsetHeight + "px";

        // attaches classes to progress indicators
        stepIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('current', currentStep === index)
            indicator.classList.toggle('done', currentStep > index)
        });

        // changes the text of the progress indicator to show which step we are on
        progressText.textContent = `Step ${currentStep + 1} of 3`;

        // attahces class to each content container and adjusts its x position
        steps.forEach((step, index) => {
            step.style.transform = `translateX(-${currentStep * 100}%)`
            step.classList.toggle("current", currentStep === index);
        });
    }

    // function to update the checked values array and prints in an ul
    function updateCheckedValues() {
        // variable that has an array of checked checkbox values as a value
        checkedValues = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        
        // clear existing list items in the ul
        ul.innerHTML = '';
        
        // create and append new list items for each checked value
        checkedValues.forEach(value => {
            const listItem = document.createElement('li');
            listItem.textContent = value;
            ul.appendChild(listItem);
        });
    }

    // valdiation function for the current step
    const isValidStep = () => {
        // select all of the input elements from the active step
        const fields = steps[currentStep].querySelectorAll('input:not([type="checkbox"])');
        // convert the fields to an array
        const textInputsValid = [...fields].every(field => field.reportValidity());

        // ff it's the checkbox step, add checkbox validation
        if (currentStep === 1) {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const isCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

            if (!isCheckboxChecked) {
                alert ('Please select at least one topic');
                return false;
            }
            // Return true only if both text inputs are valid and at least one checkbox is checked
            return textInputsValid && isCheckboxChecked;
        }

        // For other steps, just return text input validity
        return textInputsValid;

    }

    // continue button event listeners
    continueButton.addEventListener("click", (e) => {
        e.preventDefault(); // prevent form submission

        // prevent the next step if the current step is not valid
        if(!isValidStep()) return;

        // displays the name input in the Summary step
        enteredNameDisplay.textContent = nameInput.value;

        // displays the email input in the Summary step
        enteredEmailDisplay.textContent = emailInput.value;

        // increases the currentStep number and runs the updateProgress function 
        if(currentStep < stepIndicators.length - 1) {
            currentStep++;
            updateProgress();
        }

        // switches out the continue button to submit button
        if(currentStep === 2) {
            continueButton.hidden = true;
            confirmButtom.hidden = false;
        }   
    });

    // event listener to all of the checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCheckedValues);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault(); //prevent form submission

        // prevent the form submission if it's not valid
        if(!form.checkValidity()) return;

        // collecting the form data
        const formData = new FormData(form);

        // retrieve all checked checbox values with name="mycheckboxes"
        const selectedTopics = formData.getAll('topics');

        // convert formData to an object and add the checked values
        const formDataObj = Object.fromEntries(formData);
        formDataObj.topics = selectedTopics;

        // send the data somewhere
        console.log(formDataObj);

        // disbles the submit button
        confirmButtom.disabled = true;
        confirmButtom.textContent = 'Submitting';

        // mimic a server request
        setTimeout(() => {
            alert("Successfully submitted!");
        }, 3000);
    });

    updateProgress();
})
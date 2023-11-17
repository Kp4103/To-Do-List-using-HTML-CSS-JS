const taskinput = document.getElementById('inputtxt');
const addbtn = document.getElementById('add');
const tasklist = document.getElementById('task');
const prioritySelect = document.getElementById('prioritySelect');
const includeDatesCheckbox = document.getElementById('includeDates');
const dueDateInput = document.getElementById('dueDate');
const reminderTimeInput = document.getElementById('reminderTime');
const dueDateLabel = document.getElementById('dueDateLabel');
const reminderTimeLabel = document.getElementById('reminderTimeLabel');

// Array to keep track of added tasks in the current session
const addedTasks = [];

let taskToUpdate = null; // Variable to store the task being updated

function addTask() {
    const text = taskinput.value.trim(); // Original task name
    const lowercaseText = text.toLowerCase(); // Convert to lowercase for comparison
    const priority = prioritySelect.value; // Define priority here

    if (text !== "") {
        // Check if the task already exists in the current session (case-insensitive)
        if (addedTasks.some(task => task.toLowerCase() === lowercaseText)) {
            alert('Task already exists!');
            return;
        }

        // Add the lowercase version to the array for comparison
        addedTasks.push(lowercaseText);

        const listitem = document.createElement('li');

        const taskspan = document.createElement('span');
        taskspan.textContent = text; // Display the original task name
        taskspan.classList.add('text');

        const priorityBadge = document.createElement('span');
        priorityBadge.textContent = `[${priority}]`;
        priorityBadge.classList.add('priority');

        const dueDateBadge = document.createElement('span');
        dueDateBadge.textContent = includeDatesCheckbox.checked ? `Due: ${dueDateInput.value}` : '';
        dueDateBadge.classList.add('due-date');

        const reminderBadge = document.createElement('span');
        reminderBadge.textContent = includeDatesCheckbox.checked ? `Reminder: ${reminderTimeInput.value}` : '';
        reminderBadge.classList.add('reminder');

        const updateBtn = document.createElement('button');
        updateBtn.textContent = 'Update';
        updateBtn.classList.add('updateBtn');

        const deletebtn = document.createElement('button');
        deletebtn.textContent = 'Delete';
        deletebtn.classList.add('deleteBtn');

        listitem.appendChild(priorityBadge);
        listitem.appendChild(taskspan);
        listitem.appendChild(dueDateBadge);
        listitem.appendChild(reminderBadge);
        listitem.appendChild(updateBtn);
        listitem.appendChild(deletebtn);

        tasklist.appendChild(listitem);

        taskinput.value = '';
        dueDateInput.value = '';
        reminderTimeInput.value = '';
        includeDatesCheckbox.checked = false;
        updateDateFieldsVisibility();
    }
}

function updateTask() {
    if (taskToUpdate) {
        const text = taskinput.value.trim(); // Original task name
        const lowercaseText = text.toLowerCase(); // Convert to lowercase for comparison
        const priority = prioritySelect.value; // Define priority here

        if (text !== "") {
            // Check if the updated task already exists in the current session (case-insensitive)
            const isDuplicate = addedTasks.some(task => task.toLowerCase() === lowercaseText && task !== taskToUpdate.querySelector('.text').textContent.toLowerCase());
            if (isDuplicate) {
                alert('Task already exists!');
                return;
            }

            // Remove the original task from the array
            const originalTaskIndex = addedTasks.findIndex(task => task === taskToUpdate.querySelector('.text').textContent.toLowerCase());
            if (originalTaskIndex !== -1) {
                addedTasks.splice(originalTaskIndex, 1);
            }

            // Add the updated lowercase version to the array for comparison
            addedTasks.push(lowercaseText);

            // Update the task details in the listitem
            taskToUpdate.querySelector('.text').textContent = text;
            taskToUpdate.querySelector('.priority').textContent = `[${priority}]`;
            taskToUpdate.querySelector('.due-date').textContent = includeDatesCheckbox.checked ? `Due: ${dueDateInput.value}` : '';
            taskToUpdate.querySelector('.reminder').textContent = includeDatesCheckbox.checked ? `Reminder: ${reminderTimeInput.value}` : '';

            // Reset the taskToUpdate variable
            taskToUpdate = null;

            taskinput.value = '';
            dueDateInput.value = '';
            reminderTimeInput.value = '';
            includeDatesCheckbox.checked = false;
            updateDateFieldsVisibility();
            addbtn.textContent = 'Add task'; // Change button text back to "Add task" after updating
        }
    }
}

function updateDateFieldsVisibility() {
    const includeDates = includeDatesCheckbox.checked;
    dueDateInput.style.display = includeDates ? 'block' : 'none';
    reminderTimeInput.style.display = includeDates ? 'block' : 'none';

    dueDateLabel.style.display = includeDates ? 'inline-block' : 'none';
    reminderTimeLabel.style.display = includeDates ? 'inline-block' : 'none';
}

includeDatesCheckbox.addEventListener('change', updateDateFieldsVisibility);

addbtn.addEventListener('click', function () {
    if (taskToUpdate) {
        // If a task is being updated, call the updateTask function
        updateTask();
    } else {
        // If no task is being updated, call the addTask function
        addTask();
    }
});

taskinput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        if (taskToUpdate) {
            // If a task is being updated, call the updateTask function
            updateTask();
        } else {
            // If no task is being updated, call the addTask function
            addTask();
        }
    }
});

tasklist.addEventListener('click', function (event) {
    if (event.target.classList.contains('deleteBtn')) {
        const listitem = event.target.parentNode;
        const taskText = listitem.querySelector('.text').textContent; // Original task name
        const lowercaseTaskText = taskText.toLowerCase(); // Convert to lowercase for comparison

        // Remove the lowercase version from the array
        const taskIndex = addedTasks.findIndex(task => task === lowercaseTaskText);
        if (taskIndex !== -1) {
            addedTasks.splice(taskIndex, 1);
        }

        tasklist.removeChild(listitem);
    } else if (event.target.classList.contains('updateBtn')) {
        // If the Update button is clicked, set the taskToUpdate variable and update the button text
        taskToUpdate = event.target.parentNode;
        taskinput.value = taskToUpdate.querySelector('.text').textContent;
        prioritySelect.value = taskToUpdate.querySelector('.priority').textContent.replace(/\[|\]/g, '');
        dueDateInput.value = taskToUpdate.querySelector('.due-date').textContent.replace('Due: ', '');
        reminderTimeInput.value = taskToUpdate.querySelector('.reminder').textContent.replace('Reminder: ', '');
        includeDatesCheckbox.checked = dueDateInput.value !== '' || reminderTimeInput.value !== '';
        updateDateFieldsVisibility();
        addbtn.textContent = 'Update task';
    }
});

updateDateFieldsVisibility();

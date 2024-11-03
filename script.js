document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('task-list');
    const taskModal = document.getElementById('task-modal');
    const addTaskBtn = document.getElementById('add-task-btn');
    const closeModal = document.querySelector('.close');
    const taskFormModal = document.getElementById('task-form-modal');

    // Load tasks on page load
    loadTasks();

    // Open modal
    addTaskBtn.addEventListener('click', function () {
        taskModal.style.display = 'block';
    });

    // Close modal
    closeModal.addEventListener('click', function () {
        taskModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.onclick = function (event) {
        if (event.target === taskModal) {
            taskModal.style.display = 'none';
        }
    };

    // Add a new task
    taskFormModal.addEventListener('submit', function (e) {
        e.preventDefault();
        const description = document.getElementById('description').value;
        const timestamp = document.getElementById('timestamp').value;

        if (description && timestamp) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'create_task.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function () {
                loadTasks();
                taskFormModal.reset();
                taskModal.style.display = 'none'; // Close modal after submission
            };
            xhr.send(`description=${description}&timestamp=${timestamp}`);
        }
    });

    // Load tasks
    function loadTasks() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'get_tasks.php', true);
        xhr.onload = function () {
            const tasks = JSON.parse(this.responseText);
            let todayTasks = '';
            let tomorrowTasks = '';
            let upcomingTasks = '';

            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            
            tasks.forEach(task => {
                const taskDate = new Date(task.timestamp);
                const taskClass = task.status == 1 ? 'completed' : 'incomplete';
                const taskItem = `
                    <li class="${taskClass}">
                        <input 
                            type="checkbox" 
                            onclick="updateTask(${task.id}, ${task.status == 1 ? 0 : 1})" 
                            ${task.status == 1 ? 'checked' : ''} 
                        />
                        ${task.description} 
                        <span onclick="deleteTask(${task.id})" style="cursor: pointer; color:darkred; font-weight: bold;">&times;</span>
                    </li>
                `;

                if (taskDate.toDateString() === today.toDateString()) {
                    todayTasks += taskItem;
                } else if (taskDate.toDateString() === tomorrow.toDateString()) {
                    tomorrowTasks += taskItem;
                } else {
                    upcomingTasks += taskItem;
                }
            });

            taskList.innerHTML = `
                <h3>Today</h3>
                <ul>${todayTasks || '<li>No tasks for today</li>'}</ul>
                <h3>Tomorrow</h3>
                <ul>${tomorrowTasks || '<li>No tasks for tomorrow</li>'}</ul>
                <h3>Upcoming</h3>
                <ul>${upcomingTasks || '<li>No upcoming tasks</li>'}</ul>
            `;
        };
        xhr.send();
    }

    // Delete task
    window.deleteTask = function (id) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'delete_task.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            loadTasks();
        };
        xhr.send(`id=${id}`);
    };

    // Update task
    window.updateTask = function (id, status) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'update_task.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            loadTasks();
        };
        xhr.send(`id=${id}&status=${status}`);
    };
});

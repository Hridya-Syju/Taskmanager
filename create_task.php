<?php
$mysqli = new mysqli("localhost", "root", "", "task_db");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $description = $_POST['description'];
    $timestamp = $_POST['timestamp']; // Get the timestamp from the form

    if (!empty($description) && !empty($timestamp)) {
        // Prepare the SQL statement to include the timestamp
        $stmt = $mysqli->prepare("INSERT INTO tasks (description, timestamp) VALUES (?, ?)");
        $stmt->bind_param("ss", $description, $timestamp); // Bind both description and timestamp
        $stmt->execute();

        // Check if the task was added successfully
        if ($stmt->affected_rows > 0) {
            echo json_encode(["message" => "Task added successfully"]);
        } else {
            echo json_encode(["error" => "Failed to add task"]);
        }
        
        $stmt->close(); // Close the statement
    } else {
        echo json_encode(["error" => "Description and timestamp cannot be empty"]);
    }
}

$mysqli->close();
?>

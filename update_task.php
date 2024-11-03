<?php
$mysqli = new mysqli("localhost", "root", "", "task_db");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $task_id = $_POST['id'];
    $status = $_POST['status'];
    $stmt = $mysqli->prepare("UPDATE tasks SET status = ? WHERE id = ?");
    $stmt->bind_param("ii", $status, $task_id);
    $stmt->execute();
    echo json_encode(["message" => "Task updated"]);
}

$mysqli->close();
?>

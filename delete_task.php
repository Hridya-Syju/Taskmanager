<?php
$mysqli = new mysqli("localhost", "root", "", "task_db");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $task_id = $_POST['id'];
    $stmt = $mysqli->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->bind_param("i", $task_id);
    $stmt->execute();
    echo json_encode(["message" => "Task deleted"]);
}

$mysqli->close();
?>

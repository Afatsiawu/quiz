<?php
// Connect to MySQL server
$mysqli = new mysqli("localhost", "root", "");

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS quiz_db";
if ($mysqli->query($sql) === TRUE) {
    echo "Database checked/created successfully<br>";
} else {
    echo "Error creating database: " . $mysqli->error . "<br>";
}

// Select the database
$mysqli->select_db("quiz_db");

// Create a test table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS test_table (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    test_field VARCHAR(30) NOT NULL
)";

if ($mysqli->query($sql) === TRUE) {
    echo "Test table checked/created successfully<br>";
} else {
    echo "Error creating table: " . $mysqli->error . "<br>";
}

// Test inserting data
$sql = "INSERT INTO test_table (test_field) VALUES ('test data')";
if ($mysqli->query($sql) === TRUE) {
    echo "Test data inserted successfully<br>";
} else {
    echo "Error inserting test data: " . $mysqli->error . "<br>";
}

// Close connection
$mysqli->close();

echo "Database initialization complete. Check phpMyAdmin to verify the database exists.";
?> 
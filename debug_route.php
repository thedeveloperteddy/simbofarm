<?php

echo "=== Route Debug Test ===\n\n";

// Test direct access to the asset route
$url = 'http://127.0.0.1:8000/build/assets/main-BcAMXATU.js';

$context = stream_context_create([
    'http' => [
        'timeout' => 5,
        'method' => 'GET'
    ]
]);

echo "Testing: $url\n";

$response = @file_get_contents($url, false, $context);

if ($response === false) {
    echo "✗ Failed to get response\n";
} else {
    echo "✓ Got response (length: " . strlen($response) . " bytes)\n";
    
    // Check if it's the JavaScript file
    if (strpos($response, 'export') !== false || strpos($response, 'import') !== false) {
        echo "✓ Response appears to be JavaScript content\n";
    } else {
        echo "✗ Response doesn't appear to be JavaScript\n";
        echo "First 200 chars: " . substr($response, 0, 200) . "...\n";
    }
}

echo "\n=== Test Complete ===\n";

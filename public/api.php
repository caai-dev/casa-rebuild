<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Locate persistent data directory outside the web root (survives Git redeployments on Hostinger)
$dataDir = __DIR__ . '/../casa_data';

// Fallback to local web folder if parent directory is not writable (for local dev)
if (!is_writable(dirname(__DIR__)) && !file_exists($dataDir)) {
    $dataDir = __DIR__ . '/data';
}

if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$videosFile = $dataDir . '/videos.json';
$docsFile = $dataDir . '/documents.json';

// Auto-generate default .env on the server if it doesn't exist in the persistent dir
$envFile = $dataDir . '/.env';
if (!file_exists($envFile)) {
    file_put_contents($envFile, "VITE_SUPER_ADMIN_KEY=CASA57\nVITE_COMMON_ACCESS_KEY=443357\n");
}

// Load keys from server-side .env file
$adminKey = 'CASA57';
$commonKey = '443357';
$envContent = file_get_contents($envFile);
if (preg_match('/VITE_SUPER_ADMIN_KEY\s*=\s*(.*)/', $envContent, $matches)) {
    $adminKey = trim($matches[1]);
}
if (preg_match('/VITE_COMMON_ACCESS_KEY\s*=\s*(.*)/', $envContent, $matches)) {
    $commonKey = trim($matches[1]);
}

// Default videos fallback
$defaultVideos = [
  [
    "id" => "active-1",
    "youtubeId" => "yK7nC1E8u4g",
    "title" => "CASA Auditing Standards & Checklist Walkthrough",
    "category" => "Audit & Assurance",
    "duration" => "14:22",
    "description" => "Detailed internal training detailing the compliance checklists, field audit standards, and working paper templates required for Q3 client audits."
  ],
  [
    "id" => "active-2",
    "youtubeId" => "P_o22QzO1qg",
    "title" => "Corporate Tax Schedules & Compliance Guidance",
    "category" => "Tax & Legal",
    "duration" => "18:45",
    "description" => "A walkthrough of filing procedures, local compliance schedules, and advisory templates for corporate enterprise reviews."
  ],
  [
    "id" => "active-3",
    "youtubeId" => "z1S_Cy9zdjQ",
    "title" => "Client Information Security & GDPR Compliance",
    "category" => "Security",
    "duration" => "10:15",
    "description" => "Protocols for managing confidential client database access, cloud vault security compliance, and staff encryption guidelines."
  ],
  [
    "id" => "active-4",
    "youtubeId" => "9g2967_4kqc",
    "title" => "Intranet CRM Systems & Timesheet Submission Guides",
    "category" => "Systems",
    "duration" => "08:30",
    "description" => "Training guide for our internal CRM, client record updates, and submitting weekly project hours via the staff portal."
  ]
];

// Default documents fallback
$defaultDocs = [
  ["name" => "CASA Audit Audit Working Papers Template", "type" => "Word (DOCX)", "size" => "2.4 MB", "date" => "Jan 12, 2026"],
  ["name" => "Corporate Compliance Calendar Q3-Q4", "type" => "PDF Document", "size" => "1.8 MB", "date" => "May 25, 2026"],
  ["name" => "Client Onboarding & Intake Checklist", "type" => "PDF Document", "size" => "850 KB", "date" => "Jun 02, 2026"],
  ["name" => "Staff Travel Reimbursement Form", "type" => "Excel (XLSX)", "size" => "1.2 MB", "date" => "Mar 10, 2026"]
];

// Initialize database files on first load
if (!file_exists($videosFile)) {
    file_put_contents($videosFile, json_encode($defaultVideos, JSON_PRETTY_PRINT));
}
if (!file_exists($docsFile)) {
    file_put_contents($docsFile, json_encode($defaultDocs, JSON_PRETTY_PRINT));
}

// 1. GET Operation (Load Database)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $videos = json_decode(file_get_contents($videosFile), true);
    $docs = json_decode(file_get_contents($docsFile), true);
    echo json_encode([
        "videos" => $videos,
        "documents" => $docs
    ]);
    exit;
}

// 2. POST Operations (Save / Delete content / Login)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    
    if (!$input || !isset($input['action'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid request parameters"]);
        exit;
    }
    
    $action = $input['action'];
    
    // Server-side login verification (does not require admin_key verification beforehand)
    if ($action === 'login') {
        if (!isset($input['username']) || !isset($input['access_key'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing username or access key"]);
            exit;
        }
        $username = trim($input['username']);
        $accessKey = trim($input['access_key']);
        
        $isAdminUser = (
            strcasecmp($username, 'sagar') === 0 || 
            strcasecmp($username, 'dev') === 0 || 
            strcasecmp($username, 'admin') === 0
        );
        
        if ($isAdminUser && $accessKey === $adminKey) {
            echo json_encode(["success" => true, "role" => "admin"]);
            exit;
        }
        
        // Standard user checks
        if (preg_match('/^CASA\d+$/i', $username) && $accessKey === $commonKey) {
            echo json_encode(["success" => true, "role" => "member"]);
            exit;
        }
        
        echo json_encode(["success" => false, "error" => "Invalid Username or Access Key"]);
        exit;
    }
    
    // Enforce admin validation for all writing CRUD requests
    if (!isset($input['admin_key'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing admin verification key"]);
        exit;
    }
    
    if ($input['admin_key'] !== $adminKey) {
        http_response_code(403);
        echo json_encode(["error" => "Unauthorized access key"]);
        exit;
    }
    
    // Save video (Add or Edit)
    if ($action === 'save_video') {
        if (!isset($input['video'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing video data"]);
            exit;
        }
        $newVideo = $input['video'];
        $videos = json_decode(file_get_contents($videosFile), true);
        
        $found = false;
        foreach ($videos as &$v) {
            if ($v['id'] === $newVideo['id']) {
                $v = $newVideo;
                $found = true;
                break;
            }
        }
        if (!$found) {
            $videos[] = $newVideo;
        }
        
        file_put_contents($videosFile, json_encode($videos, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "videos" => $videos]);
        exit;
    }
    
    // Delete video
    if ($action === 'delete_video') {
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing video ID"]);
            exit;
        }
        $id = $input['id'];
        $videos = json_decode(file_get_contents($videosFile), true);
        $filtered = array_filter($videos, function($v) use ($id) {
            return $v['id'] !== $id;
        });
        $filtered = array_values($filtered); // Reindex array
        
        file_put_contents($videosFile, json_encode($filtered, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "videos" => $filtered]);
        exit;
    }
    
    // Save Document
    if ($action === 'save_doc') {
        if (!isset($input['document'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing document data"]);
            exit;
        }
        $newDoc = $input['document'];
        $docs = json_decode(file_get_contents($docsFile), true);
        $docs[] = $newDoc;
        
        file_put_contents($docsFile, json_encode($docs, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "documents" => $docs]);
        exit;
    }
    
    // Delete Document
    if ($action === 'delete_doc') {
        if (!isset($input['index'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing document index"]);
            exit;
        }
        $index = (int)$input['index'];
        $docs = json_decode(file_get_contents($docsFile), true);
        
        if (isset($docs[$index])) {
            unset($docs[$index]);
            $docs = array_values($docs);
        }
        
        file_put_contents($docsFile, json_encode($docs, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "documents" => $docs]);
        exit;
    }
    
    http_response_code(400);
    echo json_encode(["error" => "Unknown action"]);
    exit;
}
?>

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

$librariesFile = $dataDir . '/libraries.json';
$progressFile = $dataDir . '/progress.json';
$uploadsDir = $dataDir . '/uploads';
$usersFile = $dataDir . '/users.json';

// Initialize uploads directory
if (!file_exists($uploadsDir)) {
    mkdir($uploadsDir, 0755, true);
}

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

// Default users fallback (keeps CASA241 / 443357 functioning seamlessly)
$defaultUsers = [
  [
    "username" => "CASA241",
    "name" => "Default Member",
    "password" => "443357",
    "role" => "member",
    "status" => "active"
  ]
];

// Default libraries fallback
$defaultLibraries = [
  [
    "id" => "excel",
    "name" => "Excel",
    "description" => "Advanced Excel formulas, formatting guidelines, dynamic modeling, and financial templates.",
    "resources" => [
      [
        "id" => "excel-v1",
        "type" => "video",
        "youtubeId" => "yK7nC1E8u4g",
        "title" => "Excel Formulas & Financial Modeling Walkthrough",
        "category" => "Excel Basics",
        "duration" => "14:22",
        "description" => "Learn key financial formulas, formatting standards, and modeling methodologies for client file reviews."
      ],
      [
        "id" => "excel-d1",
        "type" => "doc",
        "name" => "Staff Travel & Expense Reimbursement Sheet",
        "format" => "Excel Spreadsheet",
        "size" => "1.2 MB",
        "date" => "Mar 10, 2026"
      ]
    ]
  ],
  [
    "id" => "ai",
    "name" => "AI",
    "description" => "AI tools guidelines, accounting prompts, and compliance standards for AI automation.",
    "resources" => []
  ],
  [
    "id" => "formattings",
    "name" => "Formattings",
    "description" => "Standard layout templates, font styling, and report structure guidelines for Word and Excel.",
    "resources" => []
  ],
  [
    "id" => "income-tax",
    "name" => "Income Tax",
    "description" => "Tax return scheduling, compliance guidances, and corporate client advisory reviews.",
    "resources" => [
      [
        "id" => "tax-v1",
        "type" => "video",
        "youtubeId" => "P_o22QzO1qg",
        "title" => "Corporate Tax Schedules & Compliance Guidance",
        "category" => "Tax & Legal",
        "duration" => "18:45",
        "description" => "A walkthrough of filing procedures, local compliance schedules, and advisory templates for corporate enterprise reviews."
      ],
      [
        "id" => "tax-d1",
        "type" => "doc",
        "name" => "Corporate Compliance Calendar Q3-Q4",
        "format" => "PDF Document",
        "size" => "1.8 MB",
        "date" => "May 25, 2026"
      ]
    ]
  ],
  [
    "id" => "gst",
    "name" => "GST",
    "description" => "GST invoice verification, audit standards, tax reconciliation, and ledger templates.",
    "resources" => []
  ],
  [
    "id" => "accounting",
    "name" => "Accounting",
    "description" => "Core double-entry accounting tutorials, staff invoicing templates, and balance sheet calculators.",
    "resources" => []
  ],
  [
    "id" => "audit",
    "name" => "Audit",
    "description" => "Auditing standards, client information security, and working paper checksheets.",
    "resources" => [
      [
        "id" => "audit-v1",
        "type" => "video",
        "youtubeId" => "z1S_Cy9zdjQ",
        "title" => "Client Information Security & GDPR Compliance",
        "category" => "Security",
        "duration" => "10:15",
        "description" => "Protocols for managing confidential client database access, cloud vault security compliance, and staff encryption guidelines."
      ],
      [
        "id" => "audit-v2",
        "type" => "video",
        "youtubeId" => "yK7nC1E8u4g",
        "title" => "CASA Auditing Standards & Checklist Walkthrough",
        "category" => "Audit & Assurance",
        "duration" => "14:22",
        "description" => "Detailed internal training detailing the compliance checklists, field audit standards, and working paper templates required for Q3 client audits."
      ],
      [
        "id" => "audit-d1",
        "type" => "doc",
        "name" => "CASA Audit Audit Working Papers Template",
        "format" => "Word Document",
        "size" => "2.4 MB",
        "date" => "Jan 12, 2026"
      ],
      [
        "id" => "audit-d2",
        "type" => "doc",
        "name" => "Client Onboarding & Intake Checklist",
        "format" => "PDF Document",
        "size" => "850 KB",
        "date" => "Jun 02, 2026"
      ]
    ]
  ],
  [
    "id" => "softwares",
    "name" => "Softwares",
    "description" => "Tutorials and files for QuickBooks Online, Xero, and corporate CRM platforms.",
    "resources" => [
      [
        "id" => "soft-v1",
        "type" => "video",
        "youtubeId" => "9g2967_4kqc",
        "title" => "Intranet CRM Systems & Timesheet Submission Guides",
        "category" => "Systems",
        "duration" => "08:30",
        "description" => "Training guide for our internal CRM, client record updates, and submitting weekly project hours via the staff portal."
      ]
    ]
  ]
];

// Initialize database files on first load
if (!file_exists($librariesFile)) {
    file_put_contents($librariesFile, json_encode($defaultLibraries, JSON_PRETTY_PRINT));
}
if (!file_exists($progressFile)) {
    file_put_contents($progressFile, json_encode([], JSON_PRETTY_PRINT));
}
if (!file_exists($usersFile)) {
    file_put_contents($usersFile, json_encode($defaultUsers, JSON_PRETTY_PRINT));
}

// 1. GET Operation (Load Database / Proxy Download)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Secure download streaming handler
    if (isset($_GET['action']) && $_GET['action'] === 'download') {
        if (!isset($_GET['file'])) {
            http_response_code(400);
            echo "Missing file parameter";
            exit;
        }
        
        $file = basename($_GET['file']);
        $filePath = $uploadsDir . '/' . $file;
        
        if (!file_exists($filePath)) {
            http_response_code(404);
            echo "File not found";
            exit;
        }
        
        // Clean output buffering
        if (ob_get_level()) {
            ob_end_clean();
        }
        
        $mime = mime_content_type($filePath);
        header("Content-Type: " . ($mime ? $mime : "application/octet-stream"));
        
        $downloadName = isset($_GET['name']) ? $_GET['name'] : $file;
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        if ($ext && !preg_match('/\.' . preg_quote($ext, '/') . '$/i', $downloadName)) {
            $downloadName .= '.' . $ext;
        }
        
        header("Content-Disposition: attachment; filename=\"" . rawurlencode($downloadName) . "\"");
        header("Content-Length: " . filesize($filePath));
        header("Cache-Control: private, max-age=0, must-revalidate");
        header("Pragma: public");
        
        readfile($filePath);
        exit;
    }

    $libs = json_decode(file_get_contents($librariesFile), true);
    echo json_encode([
        "libraries" => $libs
    ]);
    exit;
}

// 2. POST Operations (CRUD & Auth & File Uploads)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if it is a multipart/form-data request
    $isMultipart = (strpos(isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '', 'multipart/form-data') !== false);
    
    if ($isMultipart) {
        $input = $_POST;
    } else {
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
    }
    
    if (!$input || !isset($input['action'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid request parameters"]);
        exit;
    }
    
    $action = $input['action'];
    
    // Server-side login verification (against users.json)
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
        
        // Search in users.json database
        $users = json_decode(file_get_contents($usersFile), true);
        $foundUser = null;
        foreach ($users as $u) {
            if (strcasecmp($u['username'], $username) === 0) {
                $foundUser = $u;
                break;
            }
        }
        
        if ($foundUser) {
            if ($foundUser['status'] === 'pending') {
                echo json_encode(["success" => false, "error" => "Your account is pending administrator approval."]);
                exit;
            }
            if ($foundUser['status'] === 'revoked') {
                echo json_encode(["success" => false, "error" => "Your account access has been suspended by the administrator."]);
                exit;
            }
            if ($foundUser['password'] === $accessKey) {
                $progress = json_decode(file_get_contents($progressFile), true);
                $dbUsername = $foundUser['username'];
                $userProgress = isset($progress[$dbUsername]) ? $progress[$dbUsername] : [
                    "completed_videos" => [],
                    "last_active" => date('Y-m-d\TH:i:s\Z')
                ];
                
                echo json_encode([
                    "success" => true, 
                    "role" => "member",
                    "username" => $dbUsername,
                    "progress" => $userProgress
                ]);
                exit;
            }
        }
        
        echo json_encode(["success" => false, "error" => "Invalid Username or Access Key."]);
        exit;
    }
    
    // Self-registration (Sign up request)
    if ($action === 'register') {
        if (!isset($input['username']) || !isset($input['name']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing registration parameters"]);
            exit;
        }
        $username = trim($input['username']);
        $name = trim($input['name']);
        $password = trim($input['password']);
        
        // Reserve admin names
        $isAdminName = (
            strcasecmp($username, 'sagar') === 0 || 
            strcasecmp($username, 'dev') === 0 || 
            strcasecmp($username, 'admin') === 0
        );
        if ($isAdminName) {
            http_response_code(400);
            echo json_encode(["error" => "Username reserved for administrator"]);
            exit;
        }
        
        $users = json_decode(file_get_contents($usersFile), true);
        foreach ($users as $u) {
            if (strcasecmp($u['username'], $username) === 0) {
                http_response_code(400);
                echo json_encode(["error" => "Username is already taken"]);
                exit;
            }
        }
        
        $newUser = [
            "username" => $username,
            "name" => $name,
            "password" => $password,
            "role" => "member",
            "status" => "pending"
        ];
        $users[] = $newUser;
        file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
        
        echo json_encode(["success" => true, "message" => "Sign up request submitted! Please ask an administrator to approve your account."]);
        exit;
    }
    
    // Fetch individual progress
    if ($action === 'get_progress') {
        if (!isset($input['username'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing username"]);
            exit;
        }
        $username = trim($input['username']);
        $progress = json_decode(file_get_contents($progressFile), true);
        
        $userProgress = isset($progress[$username]) ? $progress[$username] : [
            "completed_videos" => [],
            "last_active" => ""
        ];
        echo json_encode(["success" => true, "progress" => $userProgress]);
        exit;
    }
    
    // Save progress updates
    if ($action === 'save_progress') {
        if (!isset($input['username']) || !isset($input['completed_videos'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing username or progress data"]);
            exit;
        }
        $username = trim($input['username']);
        $completed = $input['completed_videos'];
        
        $progress = json_decode(file_get_contents($progressFile), true);
        $progress[$username] = [
            "completed_videos" => $completed,
            "last_active" => date('Y-m-d\TH:i:s\Z')
        ];
        
        file_put_contents($progressFile, json_encode($progress, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "progress" => $progress[$username]]);
        exit;
    }
    
    // ----------------------------------------------------
    // ADMIN ACTIONS (Require admin_key verification)
    // ----------------------------------------------------
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
    
    // Get entire users list tracking log
    if ($action === 'get_users_progress') {
        $progress = json_decode(file_get_contents($progressFile), true);
        echo json_encode(["success" => true, "progress" => $progress]);
        exit;
    }
    
    // Get all registered employees
    if ($action === 'get_users') {
        $users = json_decode(file_get_contents($usersFile), true);
        echo json_encode(["success" => true, "users" => $users]);
        exit;
    }
    
    // Add user directly (Active)
    if ($action === 'add_user') {
        if (!isset($input['username']) || !isset($input['name']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing user parameters"]);
            exit;
        }
        $username = trim($input['username']);
        $name = trim($input['name']);
        $password = trim($input['password']);
        
        $users = json_decode(file_get_contents($usersFile), true);
        foreach ($users as $u) {
            if (strcasecmp($u['username'], $username) === 0) {
                http_response_code(400);
                echo json_encode(["error" => "Username is already taken"]);
                exit;
            }
        }
        
        $newUser = [
            "username" => $username,
            "name" => $name,
            "password" => $password,
            "role" => "member",
            "status" => "active"
        ];
        $users[] = $newUser;
        file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
        
        echo json_encode(["success" => true, "users" => $users]);
        exit;
    }
    
    // Suspend or approve a user
    if ($action === 'update_user_status') {
        if (!isset($input['username']) || !isset($input['status'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing username or status"]);
            exit;
        }
        $username = trim($input['username']);
        $status = trim($input['status']);
        
        $users = json_decode(file_get_contents($usersFile), true);
        $found = false;
        foreach ($users as &$u) {
            if ($u['username'] === $username) {
                $u['status'] = $status;
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            exit;
        }
        
        file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "users" => $users]);
        exit;
    }
    
    // Delete user completely (deletes user profile and progress stats)
    if ($action === 'delete_user') {
        if (!isset($input['username'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing username"]);
            exit;
        }
        $username = trim($input['username']);
        $users = json_decode(file_get_contents($usersFile), true);
        
        $filtered = array_filter($users, function($u) use ($username) {
            return $u['username'] !== $username;
        });
        $filtered = array_values($filtered);
        file_put_contents($usersFile, json_encode($filtered, JSON_PRETTY_PRINT));
        
        // Wipe progress history
        $progress = json_decode(file_get_contents($progressFile), true);
        if (isset($progress[$username])) {
            unset($progress[$username]);
            file_put_contents($progressFile, json_encode($progress, JSON_PRETTY_PRINT));
        }
        
        echo json_encode(["success" => true, "users" => $filtered]);
        exit;
    }
    
    // Save Library (Add or Edit)
    if ($action === 'save_library') {
        if (!isset($input['library'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing library data"]);
            exit;
        }
        $newLib = $input['library'];
        $libs = json_decode(file_get_contents($librariesFile), true);
        
        $found = false;
        foreach ($libs as &$l) {
            if ($l['id'] === $newLib['id']) {
                $l['name'] = $newLib['name'];
                $l['description'] = $newLib['description'];
                $found = true;
                break;
            }
        }
        if (!$found) {
            $newLib['resources'] = [];
            $libs[] = $newLib;
        }
        
        file_put_contents($librariesFile, json_encode($libs, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "libraries" => $libs]);
        exit;
    }
    
    // Delete Library
    if ($action === 'delete_library') {
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing library ID"]);
            exit;
        }
        $id = $input['id'];
        $libs = json_decode(file_get_contents($librariesFile), true);
        
        // Physically delete files of deleted resources first
        foreach ($libs as $l) {
            if ($l['id'] === $id && isset($l['resources'])) {
                foreach ($l['resources'] as $r) {
                    if ($r['type'] === 'doc' && isset($r['fileName'])) {
                        $filePath = $uploadsDir . '/' . basename($r['fileName']);
                        if (file_exists($filePath)) {
                            unlink($filePath);
                        }
                    }
                }
            }
        }
        
        $filtered = array_filter($libs, function($l) use ($id) {
            return $l['id'] !== $id;
        });
        $filtered = array_values($filtered);
        
        file_put_contents($librariesFile, json_encode($filtered, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "libraries" => $filtered]);
        exit;
    }
    
    // Upload Document Action (Multipart Form-Data)
    if ($action === 'upload_doc') {
        if (!isset($input['library_id']) || !isset($input['doc_name'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing library ID or document name"]);
            exit;
        }
        
        $libId = $input['library_id'];
        $docName = trim($input['doc_name']);
        
        if (!isset($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(["error" => "No file uploaded"]);
            exit;
        }
        
        $fileError = $_FILES['file']['error'];
        if ($fileError !== UPLOAD_ERR_OK) {
            http_response_code(500);
            echo json_encode(["error" => "File upload failed with error code: " . $fileError]);
            exit;
        }
        
        $fileSize = $_FILES['file']['size'];
        $maxSize = 15 * 1024 * 1024; // 15 MB Cap
        if ($fileSize > $maxSize) {
            http_response_code(400);
            echo json_encode(["error" => "File size exceeds 15 MB limit"]);
            exit;
        }
        
        $origName = $_FILES['file']['name'];
        $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
        
        // Generate safe unique filename to prevent collisions
        $safeName = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', pathinfo($origName, PATHINFO_FILENAME));
        $savedFileName = $safeName . '_' . time() . '.' . $ext;
        $destPath = $uploadsDir . '/' . $savedFileName;
        
        if (!move_uploaded_file($_FILES['file']['tmp_name'], $destPath)) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save file on server"]);
            exit;
        }
        
        // Determine format based on extension
        $formatType = 'File';
        if ($ext === 'pdf') $formatType = 'PDF Document';
        elseif (in_array($ext, ['xlsx', 'xls'])) $formatType = 'Excel Spreadsheet';
        elseif (in_array($ext, ['docx', 'doc'])) $formatType = 'Word Document';
        elseif ($ext === 'csv') $formatType = 'CSV Spreadsheet';
        elseif (in_array($ext, ['png', 'jpg', 'jpeg', 'svg', 'gif'])) $formatType = 'Image File';
        
        // Calculate file size string
        $sizeStr = '';
        if ($fileSize >= 1024 * 1024) {
            $sizeStr = round($fileSize / (1024 * 1024), 1) . ' MB';
        } elseif ($fileSize >= 1024) {
            $sizeStr = round($fileSize / 1024, 0) . ' KB';
        } else {
            $sizeStr = $fileSize . ' B';
        }
        
        $newDoc = [
            "id" => "doc-" . time(),
            "type" => "doc",
            "name" => $docName,
            "fileName" => $savedFileName,
            "format" => $formatType,
            "size" => $sizeStr,
            "date" => date('M d, Y')
        ];
        
        $libs = json_decode(file_get_contents($librariesFile), true);
        $libFound = false;
        
        foreach ($libs as &$l) {
            if ($l['id'] === $libId) {
                $libFound = true;
                if (!isset($l['resources'])) {
                    $l['resources'] = [];
                }
                $l['resources'][] = $newDoc;
                break;
            }
        }
        
        if (!$libFound) {
            unlink($destPath);
            http_response_code(404);
            echo json_encode(["error" => "Library not found"]);
            exit;
        }
        
        file_put_contents($librariesFile, json_encode($libs, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "libraries" => $libs]);
        exit;
    }
    
    // Save Resource (Video, Doc, or Link)
    if ($action === 'save_resource') {
        if (!isset($input['library_id']) || !isset($input['resource'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing library ID or resource data"]);
            exit;
        }
        $libId = $input['library_id'];
        $newRes = $input['resource'];
        $libs = json_decode(file_get_contents($librariesFile), true);
        
        $libFound = false;
        foreach ($libs as &$l) {
            if ($l['id'] === $libId) {
                $libFound = true;
                if (!isset($l['resources'])) {
                    $l['resources'] = [];
                }
                
                $resFound = false;
                foreach ($l['resources'] as &$r) {
                    if ($r['id'] === $newRes['id']) {
                        $r = $newRes;
                        $resFound = true;
                        break;
                    }
                }
                if (!$resFound) {
                    $l['resources'][] = $newRes;
                }
                break;
            }
        }
        
        if (!$libFound) {
            http_response_code(404);
            echo json_encode(["error" => "Library not found"]);
            exit;
        }
        
        file_put_contents($librariesFile, json_encode($libs, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "libraries" => $libs]);
        exit;
    }
    
    // Delete Resource
    if ($action === 'delete_resource') {
        if (!isset($input['library_id']) || !isset($input['resource_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing library ID or resource ID"]);
            exit;
        }
        $libId = $input['library_id'];
        $resId = $input['resource_id'];
        $libs = json_decode(file_get_contents($librariesFile), true);
        
        $libFound = false;
        foreach ($libs as &$l) {
            if ($l['id'] === $libId) {
                $libFound = true;
                if (isset($l['resources'])) {
                    // Physical clean up if resource is a document
                    foreach ($l['resources'] as $r) {
                        if ($r['id'] === $resId && $r['type'] === 'doc' && isset($r['fileName'])) {
                            $filePath = $uploadsDir . '/' . basename($r['fileName']);
                            if (file_exists($filePath)) {
                                unlink($filePath);
                            }
                        }
                    }
                    
                    $filtered = array_filter($l['resources'], function($r) use ($resId) {
                        return $r['id'] !== $resId;
                    });
                    $l['resources'] = array_values($filtered);
                }
                break;
            }
        }
        
        if (!$libFound) {
            http_response_code(404);
            echo json_encode(["error" => "Library not found"]);
            exit;
        }
        
        file_put_contents($librariesFile, json_encode($libs, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "libraries" => $libs]);
        exit;
    }
    
    http_response_code(400);
    echo json_encode(["error" => "Unknown action"]);
    exit;
}
?>
